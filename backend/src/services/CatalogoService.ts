import { ProductoNoEncontradoError } from '../errors.js'
import type { Producto } from '../model.js'
import type { ProductoRepository } from '../repositories/ProductoRepository.js'

export class CatalogoService {
  constructor(private readonly productos: ProductoRepository) {}

  listarProductos(): Promise<Producto[]> {
    return this.productos.listar()
  }

  async obtenerProducto(id: number): Promise<Producto> {
    const producto = await this.productos.buscarPorId(id)
    if (producto === undefined) {
      throw new ProductoNoEncontradoError(id)
    }
    return producto
  }
}
