# Curso Cilsa-FullStack Developer

## Catálogo

Creá una base vacía de PostgreSQL y ejecutá los archivos de `backend/database/migrations` y después los de `backend/database/seeds`, en orden numérico. Si ya cargaste el catálogo de ejemplo, ejecutá la migración `003_crear_categorias.sql` y el seed `004_categorias_catalogo.sql`.

Configurá `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER` y `PGPASSWORD` en `api/.env`. Desde la raíz del proyecto, ejecutá estos comandos con Node.js 24.

```sh
npm ci --prefix backend
npm install --prefix api
npm start --prefix api
```

| Endpoint | Ejemplo |
| --- | --- |
| Listar productos | `GET http://localhost:3000/api/productos?q=teclado&categoriaId=1` |
| Consultar un producto | `GET http://localhost:3000/api/productos/1` |
| Listar categorías | `GET http://localhost:3000/api/categorias` |

Usá el ID devuelto por `/api/categorias` para filtrar por una categoría. El contrato está en [api/openapi.yaml](api/openapi.yaml).

## Registro e inicio de sesión

Si la base ya existe, aplicá `backend/database/migrations/004_agregar_credenciales_usuarios.sql` después de las migraciones anteriores. Los vendedores de ejemplo conservan sus productos y quedan sin credenciales de acceso.

Agregá `JWT_SECRET` a `api/.env`. Generá un valor para esa variable con este comando.

```sh
node --input-type=module -e "import { randomBytes } from 'node:crypto'; console.log(randomBytes(32).toString('hex'))"
```

| Endpoint | Cuerpo JSON | Respuesta |
| --- | --- | --- |
| `POST /api/register` | `name`, `email`, `password` e `image` opcional | `201` |
| `POST /api/login` | `email` y `password` | `200` |

En ambos casos, el perfil viene en el cuerpo y el JWT en el encabezado `Authorization: Bearer <token>`. El token vence después de una hora.
