import { useAsync } from '@/shared/hooks/useAsync'
import { documentosRepo } from '@/services/documentos'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'

export function useDocumentos() {
  return useAsync(() => documentosRepo.listar(CIUDADANO_ACTUAL.id))
}
