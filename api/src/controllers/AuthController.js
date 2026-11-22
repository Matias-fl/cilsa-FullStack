import { validarLogin, validarRegistro } from '../validators/authValidator.js'

export default class AuthController {
  constructor(auth, tokenController) {
    this.auth = auth
    this.tokenController = tokenController
  }

  async registrar(req, res) {
    const usuario = await this.auth.registrar(validarRegistro(req.body))
    this.responderConSesion(res, usuario, 201)
  }

  async iniciarSesion(req, res) {
    const usuario = await this.auth.iniciarSesion(validarLogin(req.body))
    this.responderConSesion(res, usuario, 200)
  }

  responderConSesion(res, { id, nombre, email, imagenUrl }, estado) {
    this.tokenController.enviarToken(res, id)
    res.status(estado).json({ id, name: nombre, email, image: imagenUrl })
  }
}
