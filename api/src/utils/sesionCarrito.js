import cookie from 'cookie'

export const nombreCookieCarrito = 'cilsa_carrito'
const formatoSesion = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function leerSesionCarrito(req) {
  const id = cookie.parse(req.get('Cookie') ?? '')[nombreCookieCarrito]
  return typeof id === 'string' && formatoSesion.test(id) ? id : undefined
}
