import express, { Router } from 'express'

export default function carritoRouter(carritoController) {
  const router = Router()
  const leerJson = express.json({ limit: '32kb' })

  router.get('/', carritoController.obtenerCarrito.bind(carritoController))
  router.post('/items', leerJson, carritoController.agregarItem.bind(carritoController))
  router.patch('/items/:productoId', leerJson, carritoController.cambiarCantidad.bind(carritoController))
  router.delete('/items/:productoId', carritoController.quitarItem.bind(carritoController))

  return router
}
