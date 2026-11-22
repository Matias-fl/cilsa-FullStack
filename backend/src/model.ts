export type Usuario = {
  id: number
  nombre: string
  email: string
  imagenUrl: string | null
}

export type Categoria = {
  id: number
  nombre: string
}

export type Producto = {
  id: number
  codigo: string
  vendedorId: Usuario['id']
  nombre: string
  descripcion: string
  categoriaId: Categoria['id'] | null
  imagenUrl: string | null
  precioCentavos: number
  stock: number
}

export type ItemCarrito = {
  productoId: Producto['id']
  cantidad: number
}

export type Compra = {
  id: number
  fecha: Date
  totalCentavos: bigint
  detalles: DetalleCompra[]
}

export type DetalleCompra = ItemCarrito & {
  precioUnitarioCentavos: number
}
