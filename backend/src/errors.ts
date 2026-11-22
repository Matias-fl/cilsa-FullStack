export class ProductoNoEncontradoError extends Error {
  constructor(id: number) {
    super(`No existe el producto con ID ${id}`)
    this.name = 'ProductoNoEncontradoError'
  }
}

export class EmailEnUsoError extends Error {
  constructor() {
    super('Ya existe una cuenta con ese correo electrónico.')
  }
}

export class CredencialesInvalidasError extends Error {
  constructor() {
    super('El correo electrónico o la contraseña son incorrectos.')
  }
}

export class ItemCarritoNoEncontradoError extends Error {
  constructor() {
    super('El producto no está en el carrito.')
  }
}

export class StockInsuficienteError extends Error {
  constructor(mensaje = 'La cantidad solicitada supera el stock disponible.') {
    super(mensaje)
  }
}

export class CarritoVacioError extends Error {
  constructor() {
    super('El carrito no tiene productos.')
  }
}
