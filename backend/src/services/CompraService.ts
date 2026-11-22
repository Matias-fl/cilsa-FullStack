import { CarritoVacioError, StockInsuficienteError } from '../errors.js'
import type { Compra } from '../model.js'
import type { CompraRepository } from '../repositories/CompraRepository.js'

export class CompraService {
  constructor(private readonly repositorio: CompraRepository) {}

  async listar(sesionId?: string): Promise<Compra[]> {
    return sesionId ? this.repositorio.listarPorCarrito(sesionId) : []
  }

  async confirmar(sesionId?: string): Promise<Compra> {
    if (!sesionId) throw new CarritoVacioError()

    return this.repositorio.enTransaccion(async (carrito, compras) => {
      if (!await carrito.bloquearSesionVigente(sesionId)) throw new CarritoVacioError()
      const items = await carrito.listarItems(sesionId, true)
      if (!items.length) throw new CarritoVacioError()
      if (items.some(({ producto, cantidad }) => cantidad > producto.stock)) {
        throw new StockInsuficienteError('El stock disponible ya no alcanza para confirmar la compra.')
      }

      const detalles = items.map(({ producto, cantidad }) => ({
        productoId: producto.id,
        cantidad,
        precioUnitarioCentavos: producto.precioCentavos,
      }))
      const total = detalles.reduce(
        (suma, detalle) => suma + BigInt(detalle.precioUnitarioCentavos) * BigInt(detalle.cantidad),
        0n
      )

      const compra = await compras.guardar(sesionId, total, detalles)
      await compras.descontarStock(detalles)
      await carrito.vaciar(sesionId)
      return compra
    })
  }
}
