import type { Pool, PoolClient } from 'pg'
import type { ItemCarrito, Producto } from '../model.js'
import { columnasProducto } from './ProductoRepository.js'

type ItemConProducto = { producto: Producto, cantidad: number }

export class CarritoTransaccion {
  constructor(private readonly cliente: PoolClient) {}

  async bloquearSesionVigente(id: string): Promise<boolean> {
    const resultado = await this.cliente.query(
      `SELECT id FROM public.carritos
       WHERE id = $1 AND expira_en > CURRENT_TIMESTAMP
       FOR UPDATE`,
      [id]
    )
    return resultado.rows.length > 0
  }

  async crearSesion(id: string, expiraEn: Date): Promise<void> {
    await this.cliente.query(
      'INSERT INTO public.carritos (id, expira_en) VALUES ($1, $2)',
      [id, expiraEn]
    )
  }

  async buscarCantidad(carritoId: string, productoId: number): Promise<number | undefined> {
    const resultado = await this.cliente.query<Pick<ItemCarrito, 'cantidad'>>(
      'SELECT cantidad FROM public.items_carrito WHERE carrito_id = $1 AND producto_id = $2',
      [carritoId, productoId]
    )
    return resultado.rows[0]?.cantidad
  }

  async consultarStock(productoId: number): Promise<number | undefined> {
    const resultado = await this.cliente.query<Pick<Producto, 'stock'>>(
      'SELECT stock FROM public.productos WHERE id = $1 FOR SHARE',
      [productoId]
    )
    return resultado.rows[0]?.stock
  }

  async guardarCantidad(carritoId: string, productoId: number, cantidad: number): Promise<void> {
    await this.cliente.query(
      `INSERT INTO public.items_carrito (carrito_id, producto_id, cantidad)
       VALUES ($1, $2, $3)
       ON CONFLICT (carrito_id, producto_id) DO UPDATE SET cantidad = EXCLUDED.cantidad`,
      [carritoId, productoId, cantidad]
    )
  }

  async eliminarItem(carritoId: string, productoId: number): Promise<boolean> {
    const resultado = await this.cliente.query(
      'DELETE FROM public.items_carrito WHERE carrito_id = $1 AND producto_id = $2',
      [carritoId, productoId]
    )
    return resultado.rowCount === 1
  }

  async listarItems(carritoId: string): Promise<ItemConProducto[]> {
    const resultado = await this.cliente.query<Producto & Pick<ItemCarrito, 'cantidad'>>(
      `SELECT ${columnasProducto}, item.cantidad
       FROM public.items_carrito AS item
       JOIN public.productos AS producto ON producto.id = item.producto_id
       WHERE item.carrito_id = $1
       ORDER BY producto.id`,
      [carritoId]
    )
    return resultado.rows.map(({ cantidad, ...producto }) => ({ producto, cantidad }))
  }
}

export class CarritoRepository {
  constructor(private readonly pool: Pool) {}

  async enTransaccion<T>(operacion: (carrito: CarritoTransaccion) => Promise<T>): Promise<T> {
    const cliente = await this.pool.connect()
    let descartarCliente = false
    try {
      await cliente.query('BEGIN ISOLATION LEVEL READ COMMITTED')
      const resultado = await operacion(new CarritoTransaccion(cliente))
      await cliente.query('COMMIT')
      return resultado
    } catch (error) {
      await cliente.query('ROLLBACK').catch(() => { descartarCliente = true })
      throw error
    } finally {
      cliente.release(descartarCliente)
    }
  }
}
