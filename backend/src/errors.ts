export class ProductoNoEncontradoError extends Error {
  constructor(id: number) {
    super(`No existe el producto con ID ${id}`)
    this.name = 'ProductoNoEncontradoError'
  }
}
