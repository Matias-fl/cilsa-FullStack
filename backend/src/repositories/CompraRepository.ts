import type { Pool, PoolClient } from 'pg'
import { enTransaccion } from '../database/enTransaccion.js'
import type { Compra, DetalleCompra } from '../model.js'
import { CarritoTransaccion } from './CarritoRepository.js'

export class CompraTransaccion {
  constructor(private readonly cliente: PoolClient) {}

  async guardar(carritoId: string, totalCentavos: bigint, detalles: DetalleCompra[]): Promise<Compra> {
    const resultado = await this.cliente.query<Pick<Compra, 'id' | 'fecha'>>(
      `INSERT INTO public.compras (carrito_id, total_centavos, fecha)
       VALUES ($1, $2, clock_timestamp())
       RETURNING id, fecha`,
      [carritoId, totalCentavos.toString()]
    )
    const { id, fecha } = resultado.rows[0]

    await this.cliente.query(
      `INSERT INTO public.detalles_compra (compra_id, producto_id, cantidad, precio_unitario_centavos)
       SELECT $1, detalle.producto_id, detalle.cantidad, detalle.precio
       FROM unnest($2::integer[], $3::integer[], $4::integer[])
            AS detalle(producto_id, cantidad, precio)`,
      [
        id,
        detalles.map(detalle => detalle.productoId),
        detalles.map(detalle => detalle.cantidad),
        detalles.map(detalle => detalle.precioUnitarioCentavos),
      ]
    )
    return { id, fecha, totalCentavos, detalles }
  }

  async descontarStock(detalles: DetalleCompra[]): Promise<void> {
    await this.cliente.query(
      `UPDATE public.productos AS producto
       SET stock = producto.stock - detalle.cantidad
       FROM unnest($1::integer[], $2::integer[]) AS detalle(producto_id, cantidad)
       WHERE producto.id = detalle.producto_id`,
      [detalles.map(detalle => detalle.productoId), detalles.map(detalle => detalle.cantidad)]
    )
  }
}

export class CompraRepository {
  constructor(private readonly pool: Pool) {}

  async listarPorCarrito(carritoId: string): Promise<Compra[]> {
    const resultado = await this.pool.query<Omit<Compra, 'totalCentavos'> & { totalCentavos: string }>(
      `SELECT compra.id, compra.fecha, compra.total_centavos::text AS "totalCentavos",
              json_agg(json_build_object(
                'productoId', detalle.producto_id,
                'cantidad', detalle.cantidad,
                'precioUnitarioCentavos', detalle.precio_unitario_centavos
              ) ORDER BY detalle.producto_id) AS detalles
       FROM public.compras AS compra
       JOIN public.carritos AS carrito ON carrito.id = compra.carrito_id
       JOIN public.detalles_compra AS detalle ON detalle.compra_id = compra.id
       WHERE carrito.id = $1 AND carrito.expira_en > CURRENT_TIMESTAMP
       GROUP BY compra.id
       ORDER BY compra.fecha DESC, compra.id DESC`,
      [carritoId]
    )
    return resultado.rows.map(compra => ({ ...compra, totalCentavos: BigInt(compra.totalCentavos) }))
  }

  enTransaccion<T>(operacion: (carrito: CarritoTransaccion, compras: CompraTransaccion) => Promise<T>): Promise<T> {
    return enTransaccion(this.pool, cliente =>
      operacion(new CarritoTransaccion(cliente), new CompraTransaccion(cliente))
    )
  }
}
