import { Router } from 'express'

export default function productoRouter(productoController) {
  const router = Router()

  router.get('/', productoController.listarProductos.bind(productoController))
  router.get('/:productoId', productoController.obtenerProducto.bind(productoController))

  return router
}
