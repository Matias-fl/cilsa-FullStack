import { validarEnteroPositivo } from './catalogoValidator.js'
import { DatosInvalidosError } from './datosInvalidosError.js'

function validarCampos(body, campos) {
  if (!body || Array.isArray(body) || typeof body !== 'object' ||
      Object.keys(body).some(campo => !campos.includes(campo))) {
    throw new DatosInvalidosError(`El cuerpo debe contener los campos ${campos.join(' y ')}.`)
  }
}

export function validarAgregarItem(body) {
  validarCampos(body, ['productoId', 'cantidad'])
  return {
    productoId: validarEnteroPositivo(body.productoId, 'productoId'),
    cantidad: validarEnteroPositivo(body.cantidad, 'cantidad'),
  }
}

export function validarCambioCantidad(body) {
  validarCampos(body, ['cantidad'])
  return validarEnteroPositivo(body.cantidad, 'cantidad')
}
