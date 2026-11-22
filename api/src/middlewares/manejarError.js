import { ProductoNoEncontradoError } from '../../../backend/dist/index.js'
import { DatosInvalidosError } from '../validators/catalogoValidator.js'

export function manejarError(error, _req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  if (error instanceof DatosInvalidosError || (error instanceof URIError && error.status === 400)) {
    return res.status(400).json({
      codigo: 'DATOS_INVALIDOS',
      mensaje: error instanceof DatosInvalidosError ? error.message : 'El ID del producto es inválido.',
    })
  }

  if (error instanceof ProductoNoEncontradoError) {
    return res.status(404).json({ codigo: 'PRODUCTO_NO_ENCONTRADO', mensaje: error.message })
  }

  console.error(error)
  return res.status(500).json({
    codigo: 'ERROR_INTERNO',
    mensaje: 'No se pudo completar la operación.',
  })
}
