import { useAsync } from '@/shared/hooks/useAsync'
import { useSuscripcion } from '@/shared/hooks/useSuscripcion'
import { hechosImponiblesRepo } from '@/services/hechosImponibles'
import { MUNICIPIO } from '@/services/ciudadanos'

/** Hechos imponibles del municipio, recargados en vivo cuando aparece o cambia uno. */
export function useHechosImponibles() {
  const estado = useAsync(() => hechosImponiblesRepo.listar(MUNICIPIO))
  useSuscripcion(hechosImponiblesRepo.suscribir, estado.recargar)
  return estado
}
