import type { Pool } from 'pg'
import type { Producto } from '../model.js'

const columnas = `
  id, codigo, vendedor_id AS "vendedorId", nombre, descripcion,
  categoria_id AS "categoriaId",
  imagen_url AS "imagenUrl",
  precio_centavos AS "precioCentavos", stock
`

export type FiltrosCatalogo = {
  q?: string
  categoriaId?: number
}

export class ProductoRepository {
  constructor(private readonly pool: Pool) {}

  async listar({ q, categoriaId }: FiltrosCatalogo = {}): Promise<Producto[]> {
    const resultado = await this.pool.query<Producto>(
      `SELECT ${columnas}
       FROM public.productos
       WHERE ($1::text IS NULL OR strpos(lower(nombre), lower($1)) > 0)
         AND ($2::integer IS NULL OR categoria_id = $2)
       ORDER BY id`,
      [q ?? null, categoriaId ?? null]
    )
    return resultado.rows
  }

  async buscarPorId(id: number): Promise<Producto | undefined> {
    const resultado = await this.pool.query<Producto>(
      `SELECT ${columnas} FROM public.productos WHERE id = $1`,
      [id]
    )
    return resultado.rows[0]
  }
}
