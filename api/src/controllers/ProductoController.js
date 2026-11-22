import { mapearProductoADTO } from '../utils/catalogoDTOs.js'
import { validarFiltros, validarId } from '../validators/catalogoValidator.js'

export default class ProductoController {
  #catalogo

  constructor(catalogo) {
    this.#catalogo = catalogo
  }

  async listarProductos(req, res) {
    const filtros = validarFiltros(req.query)
    const productos = await this.#catalogo.listarProductos(filtros)
    res.json(productos.map(mapearProductoADTO))
  }

  async obtenerProducto(req, res) {
    const id = validarId(req.params.productoId, 'productoId')
    const producto = await this.#catalogo.obtenerProducto(id)
    res.json(mapearProductoADTO(producto))
  }
}
