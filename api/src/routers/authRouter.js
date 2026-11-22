import express, { Router } from 'express'

export default function authRouter(authController) {
  const router = Router()
  const leerJson = express.json({ limit: '32kb' })

  router.post('/register', leerJson, authController.registrar.bind(authController))
  router.post('/login', leerJson, authController.iniciarSesion.bind(authController))

  return router
}
