export function mapearCompraADTO({ id, fecha, totalCentavos, detalles }) {
  return { id, fecha, totalCentavos: JSON.rawJSON(totalCentavos.toString()), detalles }
}
