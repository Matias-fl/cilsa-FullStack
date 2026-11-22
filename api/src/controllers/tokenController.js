export default class TokenController {
  constructor(tokens) {
    this.tokens = tokens
  }

  enviarToken(res, usuarioId) {
    res.set('Authorization', `Bearer ${this.tokens.generarToken(usuarioId)}`)
    res.set('Cache-Control', 'no-store')
  }
}
