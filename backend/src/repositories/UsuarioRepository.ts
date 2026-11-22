import type { Pool } from 'pg'
import type { Usuario } from '../model.js'

type UsuarioConCredenciales = Usuario & { passwordHash: string | null }
type NuevoUsuario = Pick<Usuario, 'nombre' | 'email' | 'imagenUrl'> & { passwordHash: string }

const columnas = 'id, nombre, email, imagen_url AS "imagenUrl"'

export class UsuarioRepository {
  constructor(private readonly pool: Pool) {}

  async crear({ nombre, email, imagenUrl, passwordHash }: NuevoUsuario): Promise<Usuario | undefined> {
    const resultado = await this.pool.query<Usuario>(
      `INSERT INTO public.usuarios (nombre, email, imagen_url, password_hash)
       VALUES ($1, lower($2), $3, $4)
       ON CONFLICT ((lower(email))) DO NOTHING
       RETURNING ${columnas}`,
      [nombre, email, imagenUrl, passwordHash]
    )
    return resultado.rows[0]
  }

  async buscarPorEmail(email: string): Promise<UsuarioConCredenciales | undefined> {
    const resultado = await this.pool.query<UsuarioConCredenciales>(
      `SELECT ${columnas}, password_hash AS "passwordHash"
       FROM public.usuarios
       WHERE lower(email) = lower($1)`,
      [email]
    )
    return resultado.rows[0]
  }
}
