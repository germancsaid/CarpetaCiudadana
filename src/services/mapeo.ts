/**
 * Mapeo entre snake_case (Postgres) y camelCase (TypeScript).
 * Vive solo en la capa de servicios: ni las features ni la UI ven snake_case.
 */

type Fila = Record<string, unknown>

export function aCamel<T>(fila: Fila): T {
  const salida: Fila = {}
  for (const [clave, valor] of Object.entries(fila)) {
    salida[clave.replace(/_([a-z])/g, (_, l: string) => l.toUpperCase())] = valor
  }
  return salida as T
}

export function aSnake(objeto: Fila): Fila {
  const salida: Fila = {}
  for (const [clave, valor] of Object.entries(objeto)) {
    if (valor === undefined) continue
    salida[clave.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`)] = valor
  }
  return salida
}

export const mapearFilas = <T>(filas: Fila[]): T[] => filas.map((f) => aCamel<T>(f))
