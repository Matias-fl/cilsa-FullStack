import { ProductoNoEncontradoError } from '../errors.js'
import type { Categoria, Producto } from '../model.js'
import type { CategoriaRepository } from '../repositories/CategoriaRepository.js'
import type { FiltrosCatalogo, ProductoRepository } from '../repositories/ProductoRepository.js'

export class CatalogoService {
  constructor(
    private readonly productos: ProductoRepository,
    private readonly categorias: CategoriaRepository
  ) {}

  listarProductos(filtros?: FiltrosCatalogo): Promise<Producto[]> {
    return this.productos.listar(filtros)
  }

  listarCategorias(): Promise<Categoria[]> {
    return this.categorias.listar()
  }

  async obtenerProducto(id: number): Promise<Producto> {
    const producto = await this.productos.buscarPorId(id)
    if (producto === undefined) {
      throw new ProductoNoEncontradoError(id)
    }
    return producto
  }
}
