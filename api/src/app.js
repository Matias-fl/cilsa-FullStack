import express from 'express'
import {
  crearPool,
  CategoriaRepository,
  ProductoRepository,
  CatalogoService,
} from '../../backend/dist/index.js'
import CategoriaController from './controllers/CategoriaController.js'
import ProductoController from './controllers/ProductoController.js'
import { manejarError } from './middlewares/manejarError.js'
import categoriaRouter from './routers/categoriaRouter.js'
import productoRouter from './routers/productoRouter.js'

export default function crearApp(catalogo) {
  const app = express()
  const productoController = new ProductoController(catalogo)
  const categoriaController = new CategoriaController(catalogo)

  app.use('/api/productos', productoRouter(productoController))
  app.use('/api/categorias', categoriaRouter(categoriaController))
  app.use(manejarError)

  return app
}

if (import.meta.main) {
  const pool = crearPool()
  const catalogo = new CatalogoService(
    new ProductoRepository(pool),
    new CategoriaRepository(pool)
  )
  const puerto = process.env.PORT || 3000
  const servidor = crearApp(catalogo).listen(puerto, () => {
    console.log(`API disponible en http://localhost:${servidor.address().port}/api`)
  })
}
