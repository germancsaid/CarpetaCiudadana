import { useAsync } from '@/shared/hooks/useAsync'
import { documentosRepo } from '@/services/documentos'
import { vinculosRepo } from '@/services/vinculos'
import { tramitesRepo } from '@/services/tramites'
import { ciudadanosRepo, CIUDADANO_ACTUAL } from '@/services/ciudadanos'
import { Skeleton, SkeletonCard } from '@/shared/ui'
import { Hero } from './components/Hero'
import { Stats } from './components/Stats'
import { QuestResumen } from './components/QuestResumen'
import { Actividad } from './components/Actividad'

const DIAS_AHORRADOS_PROMEDIO = 12

export function InicioPage() {
  const { datos, cargando } = useAsync(async () => {
    const id = CIUDADANO_ACTUAL.id
    const [documentos, vinculos, tramites, actividades] = await Promise.all([
      documentosRepo.listar(id), vinculosRepo.listar(id), tramitesRepo.listar(id), ciudadanosRepo.actividades(id, 5),
    ])
    return { documentos, vinculos, tramites, actividades }
  })

  if (cargando || !datos) {
    return <div className="space-y-6"><Skeleton className="h-40 rounded-2xl" /><div className="grid grid-cols-2 gap-4"><SkeletonCard /><SkeletonCard /></div></div>
  }

  const { documentos, vinculos, tramites, actividades } = datos
  const activos = tramites.filter((t) => t.estado === 'en_progreso')

  return (
    <div className="space-y-6">
      <Hero vigentes={documentos.filter((d) => d.estado === 'vigente').length} activos={activos.length}
            porVencer={vinculos.filter((v) => v.estado === 'por_vencer').length} />
      <Stats documentos={documentos.length} completados={tramites.filter((t) => t.estado === 'completado').length}
             tokensActivos={vinculos.filter((v) => v.estado === 'activo' || v.estado === 'por_vencer').length} diasAhorrados={DIAS_AHORRADOS_PROMEDIO} />
      {activos[0] && <QuestResumen tramite={activos[0]} />}
      <Actividad lista={actividades} />
    </div>
  )
}
