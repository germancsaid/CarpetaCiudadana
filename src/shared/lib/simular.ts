/**
 * Simulaciones de la demo. Toda acción que "verifica", "escanea" o "analiza"
 * DEBE pasar por acá: el SPEC exige estado de carga visible, nunca resultado instantáneo.
 */

export function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const DEMORA = {
  verificacion: 2000,
  ocr: 1500,
  analisis: 2000,
  subida: 1500,
} as const

/** Campos OCR plausibles para un documento subido en la demo. */
export function ocrSimulado(): Record<string, string> {
  const opciones: Record<string, string>[] = [
    { Documento: 'Factura de servicios', Emisor: 'CRE Ltda.', Periodo: '08/2026', Monto: 'Bs. 342' },
    { Documento: 'Certificado catastral', Padron: 'SCZ-00891234', Zona: 'Equipetrol', Superficie: '320 m²' },
    { Documento: 'Poder notarial', Notaria: 'N°14 Santa Cruz', Otorgante: 'Carlos Mendoza Vargas', Vigencia: '1 año' },
    { Documento: 'Comprobante RUAT', Placa: '2345-SCC', Gestion: '2026', Estado: 'Al día' },
  ]
  return opciones[Math.floor(Math.random() * opciones.length)]
}

/** ID de token con el formato del proyecto: TOK-YYYY-NNNNN */
export function generarTokenId(): string {
  const n = String(Math.floor(Math.random() * 99999)).padStart(5, '0')
  return `TOK-${new Date().getFullYear()}-${n}`
}
