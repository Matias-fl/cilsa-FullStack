import { DatosInvalidosError } from './datosInvalidosError.js'

export function validarId(valor, campo) {
  const id = typeof valor === 'string' && /^\d+$/.test(valor) ? Number(valor) : NaN
  return validarEnteroPositivo(id, campo)
}

export function validarEnteroPositivo(valor, campo) {
  if (!Number.isInteger(valor) || valor < 1 || valor > 2147483647) {
    throw new DatosInvalidosError(`${campo} debe ser un entero positivo de 32 bits.`)
  }

  return valor
}

export function validarFiltros({ q, categoriaId }) {
  const busqueda = typeof q === 'string' ? q.trim() : undefined
  if (q !== undefined && (!busqueda || busqueda.includes('\0'))) {
    throw new DatosInvalidosError('q debe contener un texto de búsqueda válido.')
  }

  return {
    q: busqueda,
    categoriaId: categoriaId === undefined ? undefined : validarId(categoriaId, 'categoriaId'),
  }
}
