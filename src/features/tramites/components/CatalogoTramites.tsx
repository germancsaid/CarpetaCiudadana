import { useState } from 'react'
import { Clock, Sparkles } from 'lucide-react'
import { CATALOGO_TRAMITES } from '@/mocks/datos'
import { documentosRepo } from '@/services/documentos'
import { tramitesRepo } from '@/services/tramites'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'
import { esperar, DEMORA } from '@/shared/lib/simular'
import { formatBs } from '@/shared/lib/format'
import { Button, Card, Icono, Modal, Spinner } from '@/shared/ui'
import { armarQuest } from '../catalogo'

type Item = (typeof CATALOGO_TRAMITES)[number]

export function CatalogoTramites({ onCreado }: { onCreado: () => void }) {
  const [elegido, setElegido] = useState<Item | null>(null)
  const [fase, setFase] = useState<'pregunta' | 'analizando' | 'listo'>('pregunta')
  const [resumen, setResumen] = useState<{ cubiertos: number; total: number } | null>(null)

  function cerrar() {
    setElegido(null)
    setFase('pregunta')
    setResumen(null)
  }

  async function analizar() {
    if (!elegido) return
    setFase('analizando')
    const [vault] = await Promise.all([documentosRepo.listar(CIUDADANO_ACTUAL.id), esperar(DEMORA.analisis)])
    const quest = armarQuest(elegido, vault, CIUDADANO_ACTUAL.id)
    await tramitesRepo.crear(quest)
    setResumen({ cubiertos: quest.pasos.filter((p) => p.estado === 'completado').length, total: quest.pasos.length })
    setFase('listo')
    onCreado()
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATALOGO_TRAMITES.map((item) => (
          <Card key={item.tipo} className="flex flex-col p-5">
            <div className="flex size-10 items-center justify-center rounded-control bg-accent-light text-accent-text">
              <Icono nombre={item.icono} />
            </div>
            <h3 className="mt-3 font-semibold text-ink">{item.nombre}</h3>
            <div className="text-sm text-ink-muted">{item.emisor}</div>
            <div className="mt-3 flex items-center gap-4 text-sm text-ink-secondary">
              <span className="inline-flex items-center gap-1"><Clock size={14} />~{item.dias} días</span>
              <span className="font-medium">{item.costoBs === 0 ? 'Gratis' : formatBs(item.costoBs)}</span>
            </div>
            <Button variante="secundario" className="mt-4" onClick={() => setElegido(item)}>Iniciar trámite</Button>
          </Card>
        ))}
      </div>

      <Modal abierto={elegido !== null} onCerrar={cerrar} titulo={elegido?.nombre ?? ''}
             descripcion={elegido ? `${elegido.emisor} · ~${elegido.dias} días · ${elegido.costoBs === 0 ? 'Gratis' : formatBs(elegido.costoBs)}` : undefined}
             pie={fase === 'pregunta' ? (
               <>
                 <Button variante="secundario" onClick={cerrar}>Cancelar</Button>
                 <Button iconoIzq={<Sparkles size={16} />} onClick={analizar}>Sí, analizar mi carpeta</Button>
               </>
             ) : fase === 'listo' ? <Button onClick={() => { cerrar(); onCreado() }}>Ver mi trámite</Button> : undefined}>
        {fase === 'pregunta' && (
          <p className="text-sm text-ink-secondary">
            ¿Querés que analicemos tu carpeta y armemos el trámite automáticamente? Los requisitos que ya
            tengas como documento vigente se marcan completados sin que hagas nada.
          </p>
        )}
        {fase === 'analizando' && (
          <div className="flex flex-col items-center gap-3 py-6 text-sm text-ink-secondary">
            <Spinner className="size-8 text-accent" />
            Revisando tus 7 documentos y vínculos…
          </div>
        )}
        {fase === 'listo' && resumen && (
          <div className="rounded-card bg-success-light p-4 text-sm text-success-text">
            Trámite creado. <strong>{resumen.cubiertos} de {resumen.total} requisitos</strong> ya estaban cubiertos por tu carpeta.
          </div>
        )}
      </Modal>
    </>
  )
}
