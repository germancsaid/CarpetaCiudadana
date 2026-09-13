import { useCallback, useEffect, useState } from 'react'

export interface EstadoAsync<T> {
  datos: T | null
  cargando: boolean
  error: string | null
  recargar: () => void
}

/**
 * Estandariza loading / error / datos. Toda feature que lee de un repositorio
 * debería usar esto en vez de manejar los tres estados a mano.
 */
export function useAsync<T>(obtener: () => Promise<T>, deps: unknown[] = []): EstadoAsync<T> {
  const [datos, setDatos] = useState<T | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contador, setContador] = useState(0)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ejecutar = useCallback(obtener, deps)

  useEffect(() => {
    let vigente = true
    setCargando(true)
    setError(null)
    ejecutar()
      .then((r) => vigente && setDatos(r))
      .catch((e: unknown) => {
        if (!vigente) return
        setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado')
      })
      .finally(() => vigente && setCargando(false))
    return () => {
      vigente = false
    }
  }, [ejecutar, contador])

  return { datos, cargando, error, recargar: () => setContador((c) => c + 1) }
}
