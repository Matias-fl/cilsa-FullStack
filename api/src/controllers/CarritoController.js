import { mapearCarritoADTO } from '../utils/carritoDTOs.js'
import { leerSesionCarrito, nombreCookieCarrito } from '../utils/sesionCarrito.js'
import { validarAgregarItem, validarCambioCantidad } from '../validators/carritoValidator.js'
import { validarId } from '../validators/catalogoValidator.js'

export default class CarritoController {
  constructor(carrito) {
    this.carrito = carrito
  }

  async obtenerCarrito(req, res) {
    const resultado = await this.carrito.obtener(leerSesionCarrito(req))
    this.responder(req, res, resultado)
  }

  async agregarItem(req, res) {
    const { productoId, cantidad } = validarAgregarItem(req.body)
    const resultado = await this.carrito.agregar(leerSesionCarrito(req), productoId, cantidad)
    this.responder(req, res, resultado)
  }

  async cambiarCantidad(req, res) {
    const productoId = validarId(req.params.productoId, 'productoId')
    const cantidad = validarCambioCantidad(req.body)
    const resultado = await this.carrito.cambiarCantidad(leerSesionCarrito(req), productoId, cantidad)
    this.responder(req, res, resultado)
  }

  async quitarItem(req, res) {
    const productoId = validarId(req.params.productoId, 'productoId')
    const resultado = await this.carrito.quitar(leerSesionCarrito(req), productoId)
    this.responder(req, res, resultado)
  }

  responder(req, res, resultado) {
    if (resultado.sesionNueva) {
      const { id, expiraEn } = resultado.sesionNueva
      res.cookie(nombreCookieCarrito, id, {
        path: '/api',
        httpOnly: true,
        secure: req.secure,
        sameSite: 'lax',
        expires: expiraEn,
      })
    }
    res.set('Cache-Control', 'no-store').json(mapearCarritoADTO(resultado))
  }
}
