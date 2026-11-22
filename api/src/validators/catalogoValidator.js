export class DatosInvalidosError extends Error {}

export function validarId(valor, campo) {
  const id = typeof valor === 'string' && /^\d+$/.test(valor) ? Number(valor) : NaN
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    throw new DatosInvalidosError(`${campo} debe ser un entero positivo de 32 bits.`)
  }

  return id
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
