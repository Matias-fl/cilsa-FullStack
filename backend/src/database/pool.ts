import { Pool } from 'pg'

export function crearPool(): Pool {
  return new Pool({ connectionTimeoutMillis: 5000 })
}
