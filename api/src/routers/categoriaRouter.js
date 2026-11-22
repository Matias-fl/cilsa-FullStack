import { Router } from 'express'

export default function categoriaRouter(categoriaController) {
  const router = Router()

  router.get('/', categoriaController.listarCategorias.bind(categoriaController))

  return router
}
