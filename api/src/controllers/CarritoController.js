import cookie from 'cookie'
import { mapearCarritoADTO } from '../utils/carritoDTOs.js'
import { validarAgregarItem, validarCambioCantidad } from '../validators/carritoValidator.js'
import { validarId } from '../validators/catalogoValidator.js'

const nombreCookie = 'cilsa_carrito'
const formatoSesion = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default class CarritoController {
  constructor(carrito) {
    this.carrito = carrito
  }

  async obtenerCarrito(req, res) {
    const resultado = await this.carrito.obtener(this.leerSesion(req))
    this.responder(req, res, resultado)
  }

  async agregarItem(req, res) {
    const { productoId, cantidad } = validarAgregarItem(req.body)
    const resultado = await this.carrito.agregar(this.leerSesion(req), productoId, cantidad)
    this.responder(req, res, resultado)
  }

  async cambiarCantidad(req, res) {
    const productoId = validarId(req.params.productoId, 'productoId')
    const cantidad = validarCambioCantidad(req.body)
    const resultado = await this.carrito.cambiarCantidad(this.leerSesion(req), productoId, cantidad)
    this.responder(req, res, resultado)
  }

  async quitarItem(req, res) {
    const productoId = validarId(req.params.productoId, 'productoId')
    const resultado = await this.carrito.quitar(this.leerSesion(req), productoId)
    this.responder(req, res, resultado)
  }

  leerSesion(req) {
    const id = cookie.parse(req.get('Cookie') ?? '')[nombreCookie]
    return typeof id === 'string' && formatoSesion.test(id) ? id : undefined
  }

  responder(req, res, resultado) {
    if (resultado.sesionNueva) {
      const { id, expiraEn } = resultado.sesionNueva
      res.cookie(nombreCookie, id, {
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
