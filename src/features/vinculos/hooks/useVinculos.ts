import { useAsync } from '@/shared/hooks/useAsync'
import { vinculosRepo } from '@/services/vinculos'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'

export function useVinculos() {
  return useAsync(async () => {
    const [vinculos, emisores] = await Promise.all([
      vinculosRepo.listar(CIUDADANO_ACTUAL.id),
      vinculosRepo.listarEmisores(),
    ])
    const porId = new Map(emisores.map((e) => [e.id, e]))
    return { vinculos, emisores, emisorDe: (id: string) => porId.get(id) }
  })
}
