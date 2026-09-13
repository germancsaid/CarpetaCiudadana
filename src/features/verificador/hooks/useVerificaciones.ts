import { useAsync } from '@/shared/hooks/useAsync'
import { useSuscripcion } from '@/shared/hooks/useSuscripcion'
import { verificacionesRepo } from '@/services/verificaciones'
import { vinculosRepo } from '@/services/vinculos'

/** Últimas verificaciones + emisores. Se recarga en vivo cuando entra una nueva. */
export function useVerificaciones() {
  const estado = useAsync(async () => {
    const [verificaciones, emisores] = await Promise.all([verificacionesRepo.listar(10), vinculosRepo.listarEmisores()])
    return { verificaciones, emisores }
  })
  useSuscripcion(verificacionesRepo.suscribir, estado.recargar)
  return estado
}
