import type { Pool } from 'pg'
import type { Producto } from '../model.js'

const columnas = `
  id, codigo, vendedor_id AS "vendedorId", nombre, descripcion,
  imagen_url AS "imagenUrl",
  precio_centavos AS "precioCentavos", stock
`

export class ProductoRepository {
  constructor(private readonly pool: Pool) {}

  async listar(): Promise<Producto[]> {
    const resultado = await this.pool.query<Producto>(
      `SELECT ${columnas} FROM public.productos ORDER BY id`
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
