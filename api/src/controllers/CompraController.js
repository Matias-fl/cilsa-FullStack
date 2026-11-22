import { mapearCompraADTO } from '../utils/compraDTOs.js'
import { leerSesionCarrito } from '../utils/sesionCarrito.js'

export default class CompraController {
  constructor(compras) {
    this.compras = compras
  }

  async listarHistorial(req, res) {
    const compras = await this.compras.listar(leerSesionCarrito(req))
    res.set('Cache-Control', 'no-store').json(compras.map(mapearCompraADTO))
  }

  async confirmarCompra(req, res) {
    const compra = await this.compras.confirmar(leerSesionCarrito(req))
    res.set('Cache-Control', 'no-store').status(201).json({
      ...mapearCompraADTO(compra),
      mensaje: 'Compra confirmada correctamente.',
    })
  }
}
