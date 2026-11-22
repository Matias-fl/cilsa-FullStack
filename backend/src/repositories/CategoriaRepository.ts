import type { Pool } from 'pg'
import type { Categoria } from '../model.js'

export class CategoriaRepository {
  constructor(private readonly pool: Pool) {}

  async listar(): Promise<Categoria[]> {
    const resultado = await this.pool.query<Categoria>(
      'SELECT id, nombre FROM public.categorias ORDER BY nombre'
    )
    return resultado.rows
  }
}
