import { createHmac } from 'node:crypto'

const duracionSegundos = 60 * 60
const encabezado = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')

export class TokenService {
  private readonly secreto: string

  constructor(secreto: string | undefined) {
    if (!secreto || Buffer.byteLength(secreto) < 32) {
      throw new Error('Configurá JWT_SECRET con un valor de al menos 32 bytes.')
    }
    this.secreto = secreto
  }

  generarToken(usuarioId: number): string {
    const iat = Math.floor(Date.now() / 1000)
    const contenido = Buffer.from(JSON.stringify({
      sub: String(usuarioId),
      iss: 'cilsa-api',
      iat,
      exp: iat + duracionSegundos,
    })).toString('base64url')
    const mensaje = `${encabezado}.${contenido}`
    const firma = createHmac('sha256', this.secreto).update(mensaje).digest('base64url')
    return `${mensaje}.${firma}`
  }
}
