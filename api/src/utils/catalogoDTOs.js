export function mapearProductoADTO(producto) {
  return {
    id: producto.id,
    codigo: producto.codigo,
    vendedorId: producto.vendedorId,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    categoriaId: producto.categoriaId,
    imagenUrl: producto.imagenUrl,
    precioCentavos: producto.precioCentavos,
    stock: producto.stock,
  }
}

export function mapearCategoriaADTO(categoria) {
  return {
    id: categoria.id,
    nombre: categoria.nombre,
  }
}
