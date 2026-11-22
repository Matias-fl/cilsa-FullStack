export type Usuario = {
  id: number
  nombre: string
  email: string
}

export type Producto = {
  id: number
  codigo: string
  vendedorId: Usuario['id']
  nombre: string
  descripcion: string
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
  totalCentavos: number
  detalles: DetalleCompra[]
}

export type DetalleCompra = ItemCarrito & {
  precioUnitarioCentavos: number
}
