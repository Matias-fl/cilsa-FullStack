import { Router } from 'express'

export default function compraRouter(compraController) {
  const router = Router()

  router.get('/', compraController.listarHistorial.bind(compraController))
  router.post('/', compraController.confirmarCompra.bind(compraController))

  return router
}
