import type { Pool, PoolClient } from 'pg'

export async function enTransaccion<T>(pool: Pool, operacion: (cliente: PoolClient) => Promise<T>): Promise<T> {
  const cliente = await pool.connect()
  let descartarCliente = false
  try {
    await cliente.query('BEGIN ISOLATION LEVEL READ COMMITTED')
    const resultado = await operacion(cliente)
    await cliente.query('COMMIT')
    return resultado
  } catch (error) {
    await cliente.query('ROLLBACK').catch(() => { descartarCliente = true })
    throw error
  } finally {
    cliente.release(descartarCliente)
  }
}
