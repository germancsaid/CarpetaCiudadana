import { useAsync } from '@/shared/hooks/useAsync'
import { useSuscripcion } from '@/shared/hooks/useSuscripcion'
import { tramitesRepo } from '@/services/tramites'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'

/** Trámites del ciudadano, con recarga automática ante cambios realtime. */
export function useTramites() {
  const estado = useAsync(() => tramitesRepo.listar(CIUDADANO_ACTUAL.id))
  useSuscripcion(tramitesRepo.suscribir, estado.recargar)
  const lista = estado.datos ?? []
  return {
    ...estado,
    enProgreso: lista.filter((t) => t.estado === 'en_progreso'),
    completados: lista.filter((t) => t.estado === 'completado'),
  }
}
