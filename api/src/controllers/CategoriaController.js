import { mapearCategoriaADTO } from '../utils/catalogoDTOs.js'

export default class CategoriaController {
  #catalogo

  constructor(catalogo) {
    this.#catalogo = catalogo
  }

  async listarCategorias(_req, res) {
    const categorias = await this.#catalogo.listarCategorias()
    res.json(categorias.map(mapearCategoriaADTO))
  }
}
