import { useEffect } from 'react'

/**
 * Conecta una suscripción realtime de un repositorio con un recargar().
 * Uso: useSuscripcion(verificacionesRepo.suscribir, recargar)
 */
export function useSuscripcion(
  suscribir: (alCambiar: () => void) => () => void,
  alCambiar: () => void,
) {
  useEffect(() => {
    const desuscribir = suscribir(alCambiar)
    return desuscribir
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
