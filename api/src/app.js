import express from 'express'
import {
  AuthService,
  crearPool,
  CategoriaRepository,
  ProductoRepository,
  CatalogoService,
  TokenService,
  UsuarioRepository,
} from '../../backend/dist/index.js'
import AuthController from './controllers/AuthController.js'
import CategoriaController from './controllers/CategoriaController.js'
import ProductoController from './controllers/ProductoController.js'
import TokenController from './controllers/tokenController.js'
import { manejarError } from './middlewares/manejarError.js'
import authRouter from './routers/authRouter.js'
import categoriaRouter from './routers/categoriaRouter.js'
import productoRouter from './routers/productoRouter.js'

export default function crearApp(catalogo, auth, tokens) {
  const app = express()
  const productoController = new ProductoController(catalogo)
  const categoriaController = new CategoriaController(catalogo)
  const tokenController = new TokenController(tokens)
  const authController = new AuthController(auth, tokenController)

  app.use('/api/productos', productoRouter(productoController))
  app.use('/api/categorias', categoriaRouter(categoriaController))
  app.use('/api', authRouter(authController))
  app.use(manejarError)

  return app
}

if (import.meta.main) {
  const tokens = new TokenService(process.env.JWT_SECRET)
  const pool = crearPool()
  const catalogo = new CatalogoService(
    new ProductoRepository(pool),
    new CategoriaRepository(pool)
  )
  const auth = new AuthService(new UsuarioRepository(pool))
  const puerto = process.env.PORT || 3000
  const servidor = crearApp(catalogo, auth, tokens).listen(puerto, () => {
    console.log(`API disponible en http://localhost:${servidor.address().port}/api`)
  })
}
