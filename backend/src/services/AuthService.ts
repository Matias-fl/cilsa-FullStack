import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { CredencialesInvalidasError, EmailEnUsoError } from '../errors.js'
import type { Usuario } from '../model.js'
import type { UsuarioRepository } from '../repositories/UsuarioRepository.js'

type Registro = Pick<Usuario, 'nombre' | 'email' | 'imagenUrl'> & { password: string }
type Credenciales = Pick<Registro, 'email' | 'password'>

const tamanoClave = 32
const saltDePrueba = randomBytes(16)
const claveDePrueba = Buffer.alloc(tamanoClave)

function derivarClave(password: string, salt: Buffer): Promise<Buffer> {
  const opciones = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }
  return new Promise((resolve, reject) => {
    scrypt(password, salt, tamanoClave, opciones, (error, clave) => {
      if (error) reject(error)
      else resolve(clave)
    })
  })
}

export class AuthService {
  constructor(private readonly usuarios: UsuarioRepository) {}

  async registrar({ nombre, email, imagenUrl, password }: Registro): Promise<Usuario> {
    const salt = randomBytes(16)
    const clave = await derivarClave(password, salt)
    const passwordHash = `${salt.toString('hex')}:${clave.toString('hex')}`
    const usuario = await this.usuarios.crear({
      nombre, email, imagenUrl, passwordHash,
    })
    if (!usuario) throw new EmailEnUsoError()
    return usuario
  }

  async iniciarSesion({ email, password }: Credenciales): Promise<Usuario> {
    const usuario = await this.usuarios.buscarPorEmail(email)
    const [salt, clave] = usuario?.passwordHash?.split(':') ?? []
    // Las cuentas sin credenciales también ejecutan la derivación de clave.
    const candidata = await derivarClave(password, salt ? Buffer.from(salt, 'hex') : saltDePrueba)
    const guardada = clave ? Buffer.from(clave, 'hex') : claveDePrueba
    const coincide = guardada.length === tamanoClave && timingSafeEqual(candidata, guardada)
    if (!usuario || !salt || !clave || !coincide) {
      throw new CredencialesInvalidasError()
    }
    const { id, nombre, email: emailGuardado, imagenUrl } = usuario
    return { id, nombre, email: emailGuardado, imagenUrl }
  }
}
