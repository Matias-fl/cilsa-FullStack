import { DatosInvalidosError } from './datosInvalidosError.js'

export function validarLogin(body) {
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (email.length > 254 || !/^[^\s@\p{Cc}]+@[^\s@\p{Cc}]+\.[^\s@\p{Cc}]+$/u.test(email)) {
    throw new DatosInvalidosError('Ingresá un correo electrónico válido.')
  }

  const password = body.password
  if (typeof password !== 'string' || !password.length || [...password].length > 128) {
    throw new DatosInvalidosError('La contraseña debe tener entre 1 y 128 caracteres.')
  }

  return { email, password }
}

export function validarRegistro(body) {
  const credenciales = validarLogin(body)
  const nombre = typeof body.name === 'string' ? body.name.trim() : ''
  if (!nombre || nombre.includes('\0') || [...nombre].length > 100) {
    throw new DatosInvalidosError('El nombre debe tener entre 1 y 100 caracteres.')
  }
  if ([...credenciales.password].length < 8) {
    throw new DatosInvalidosError('La contraseña debe tener al menos 8 caracteres.')
  }

  return { ...credenciales, nombre, imagenUrl: validarImagen(body.image) }
}

function validarImagen(imagen) {
  if (imagen === undefined || imagen === null) return null

  const url = typeof imagen === 'string' && imagen.length <= 2048 ? URL.parse(imagen) : null
  if (!url || !['http:', 'https:'].includes(url.protocol)) {
    throw new DatosInvalidosError('La imagen debe ser una URL HTTP o HTTPS válida.')
  }
  return url.href
}
