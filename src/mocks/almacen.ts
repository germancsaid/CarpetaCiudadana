/**
 * Persistencia de los mocks en localStorage. Así el modo offline sobrevive a un F5
 * (importante en el pitch). "Reiniciar demo" llama a limpiar().
 */
const PREFIJO = 'carpeta-ciudadana:mock:'

export function cargar<T>(clave: string, inicial: T[]): T[] {
  try {
    const crudo = localStorage.getItem(PREFIJO + clave)
    if (crudo) return JSON.parse(crudo) as T[]
  } catch {
    /* sin storage: seguimos en memoria */
  }
  return structuredClone(inicial)
}

export function guardar<T>(clave: string, datos: T[]): void {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(datos))
  } catch {
    /* sin storage: seguimos en memoria */
  }
}

export function limpiar(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIJO))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* nada que limpiar */
  }
}
