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
