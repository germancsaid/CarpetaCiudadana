import { useState } from 'react'
import { ClipboardList, Plus } from 'lucide-react'
import { Button, EmptyState, SkeletonCard } from '@/shared/ui'
import { useTramites } from './hooks/useTramites'
import { QuestActivo } from './components/QuestActivo'
import { TramitesCompletados } from './components/TramitesCompletados'
import { CatalogoTramites } from './components/CatalogoTramites'

type Tab = 'progreso' | 'completados' | 'disponibles'

export function TramitesPage() {
  const { enProgreso, completados, cargando, error, recargar } = useTramites()
  const [tab, setTab] = useState<Tab>('progreso')

  const tabs: { id: Tab; etiqueta: string }[] = [
    { id: 'progreso', etiqueta: `En progreso (${enProgreso.length})` },
    { id: 'completados', etiqueta: `Completados (${completados.length})` },
    { id: 'disponibles', etiqueta: 'Disponibles' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-control bg-card p-1 shadow-sm">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
                    className={`min-h-9 rounded-control px-3 text-sm font-medium transition ${tab === t.id ? 'bg-accent text-white' : 'text-ink-secondary hover:bg-page'}`}>
              {t.etiqueta}
            </button>
          ))}
        </div>
        <Button iconoIzq={<Plus size={16} />} onClick={() => setTab('disponibles')}>Nuevo trámite</Button>
      </div>

      {error && <div className="rounded-card bg-danger-light p-4 text-sm text-danger-text">{error}</div>}

      {tab === 'progreso' && (
        cargando ? <SkeletonCard /> :
        enProgreso.length === 0 ? (
          <EmptyState icono={ClipboardList} titulo="No tenés trámites activos" descripcion="Explorá los disponibles y arrancá uno en un click."
                      accion={<Button onClick={() => setTab('disponibles')}>Ver disponibles</Button>} />
        ) : enProgreso.map((t) => <QuestActivo key={t.id} tramite={t} onCambio={recargar} />)
      )}

      {tab === 'completados' && (
        cargando ? <SkeletonCard /> :
        completados.length === 0 ? (
          <EmptyState icono={ClipboardList} titulo="Todavía no completaste trámites" descripcion="Los trámites terminados quedan acá como historial." />
        ) : <TramitesCompletados lista={completados} />
      )}

      {tab === 'disponibles' && <CatalogoTramites onCreado={() => { recargar(); setTab('progreso') }} />}
    </div>
  )
}
