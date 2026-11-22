import { randomUUID } from 'node:crypto'
import { ItemCarritoNoEncontradoError, ProductoNoEncontradoError, StockInsuficienteError } from '../errors.js'
import type { CarritoRepository, CarritoTransaccion } from '../repositories/CarritoRepository.js'

type ActualizarCarrito = (carrito: CarritoTransaccion, id: string) => Promise<void>
const duracionSesionMs = 30 * 24 * 60 * 60 * 1000

export class CarritoService {
  constructor(private readonly repositorio: CarritoRepository) {}

  obtener(sesionId?: string) {
    return this.conCarrito(sesionId, true)
  }

  agregar(sesionId: string | undefined, productoId: number, cantidad: number) {
    return this.conCarrito(sesionId, true, async (carrito, id) => {
      const stock = await carrito.consultarStock(productoId)
      if (stock === undefined) throw new ProductoNoEncontradoError(productoId)

      const anterior = await carrito.buscarCantidad(id, productoId) ?? 0
      const nuevaCantidad = anterior + cantidad
      if (nuevaCantidad > stock) throw new StockInsuficienteError()

      await carrito.guardarCantidad(id, productoId, nuevaCantidad)
    })
  }

  cambiarCantidad(sesionId: string | undefined, productoId: number, cantidad: number) {
    return this.conCarrito(sesionId, false, async (carrito, id) => {
      const stock = await carrito.consultarStock(productoId)
      const anterior = await carrito.buscarCantidad(id, productoId)
      if (stock === undefined || anterior === undefined) throw new ItemCarritoNoEncontradoError()
      if (cantidad > stock) throw new StockInsuficienteError()

      await carrito.guardarCantidad(id, productoId, cantidad)
    })
  }

  quitar(sesionId: string | undefined, productoId: number) {
    return this.conCarrito(sesionId, false, async (carrito, id) => {
      if (!await carrito.eliminarItem(id, productoId)) throw new ItemCarritoNoEncontradoError()
    })
  }

  private conCarrito(sesionId: string | undefined, crearSiFalta: boolean, actualizar?: ActualizarCarrito) {
    return this.repositorio.enTransaccion(async carrito => {
      let id = sesionId
      let sesionNueva
      if (!id || !await carrito.bloquearSesionVigente(id)) {
        if (!crearSiFalta) throw new ItemCarritoNoEncontradoError()

        id = randomUUID()
        const expiraEn = new Date(Date.now() + duracionSesionMs)
        await carrito.crearSesion(id, expiraEn)
        sesionNueva = { id, expiraEn }
      }

      if (actualizar) await actualizar(carrito, id)
      const items = (await carrito.listarItems(id)).map(({ producto, cantidad }) => ({
        producto,
        cantidad,
        subtotalCentavos: BigInt(producto.precioCentavos) * BigInt(cantidad),
      }))
      const totalCentavos = items.reduce((total, item) => total + item.subtotalCentavos, 0n)
      return { sesionNueva, items, totalCentavos }
    })
  }
}
