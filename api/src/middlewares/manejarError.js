import {
  CredencialesInvalidasError,
  EmailEnUsoError,
  ItemCarritoNoEncontradoError,
  ProductoNoEncontradoError,
  StockInsuficienteError,
} from '../../../backend/dist/index.js'
import { DatosInvalidosError } from '../validators/datosInvalidosError.js'

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

  if (error instanceof ItemCarritoNoEncontradoError) {
    return res.status(404).json({ codigo: 'ITEM_NO_ENCONTRADO', mensaje: error.message })
  }

  if (error instanceof StockInsuficienteError) {
    return res.status(409).json({ codigo: 'STOCK_INSUFICIENTE', mensaje: error.message })
  }

  if (error instanceof CredencialesInvalidasError) {
    return res.status(401).set('WWW-Authenticate', 'Bearer realm="cilsa"').json({
      codigo: 'CREDENCIALES_INVALIDAS',
      mensaje: error.message,
    })
  }

  if (error instanceof EmailEnUsoError) {
    return res.status(409).json({ codigo: 'EMAIL_EN_USO', mensaje: error.message })
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ codigo: 'DATOS_INVALIDOS', mensaje: 'El cuerpo debe ser JSON válido.' })
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ codigo: 'CUERPO_DEMASIADO_GRANDE', mensaje: 'El cuerpo supera los 32 KB.' })
  }

  if (error.type === 'encoding.unsupported' || error.type === 'charset.unsupported') {
    return res.status(415).json({ codigo: 'DATOS_INVALIDOS', mensaje: 'La codificación del cuerpo es inválida.' })
  }

  console.error(error)
  return res.status(500).json({
    codigo: 'ERROR_INTERNO',
    mensaje: 'No se pudo completar la operación.',
  })
}
