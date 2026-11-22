import { mapearProductoADTO } from './catalogoDTOs.js'

export function mapearCarritoADTO({ items, totalCentavos }) {
  return {
    items: items.map(({ producto, cantidad, subtotalCentavos }) => ({
      producto: mapearProductoADTO(producto),
      cantidad,
      subtotalCentavos: JSON.rawJSON(subtotalCentavos.toString()),
    })),
    totalCentavos: JSON.rawJSON(totalCentavos.toString()),
  }
}
