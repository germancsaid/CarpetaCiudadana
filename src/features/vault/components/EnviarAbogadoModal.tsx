import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Send, CheckCheck, Sparkles, ShieldCheck } from 'lucide-react'
import type { Documento, Emisor } from '@/shared/types/domain'
import { ROUTES } from '@/app/routes'
import { vinculosRepo } from '@/services/vinculos'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'
import { esperar, generarTokenId } from '@/shared/lib/simular'
import { Modal, Spinner } from '@/shared/ui'

type Fase = 'elegir' | 'enviado' | 'visto' | 'generando' | 'listo'

const PASO_A_TEXTO: Record<Fase, string> = {
  elegir: '',
  enviado: 'Enviado',
  visto: 'Visto por el abogado…',
  generando: 'Generando el vínculo…',
  listo: 'Token generado',
}

/**
 * Sheet estilo AirDrop: elegís un abogado/notaría certificado y el documento
 * "viaja" hasta convertirse en un vínculo tokenizado real en /tokens.
 * Ver docs/BRIEF_DISENO_APPLE_DEMO.md §3.4.
 */
export function EnviarAbogadoModal({
  doc,
  emisores,
  onCerrar,
}: {
  doc: Documento | null
  emisores: Emisor[]
  onCerrar: () => void
}) {
  const [busqueda, setBusqueda] = useState('')
  const [elegido, setElegido] = useState<Emisor | null>(null)
  const [fase, setFase] = useState<Fase>('elegir')

  useEffect(() => {
    if (!doc) {
      setBusqueda('')
      setElegido(null)
      setFase('elegir')
    }
  }, [doc])

  const filtrados = emisores.filter((e) => e.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  async function elegir(e: Emisor) {
    if (!doc) return
    setElegido(e)
    setFase('enviado')
    await esperar(700)
    setFase('visto')
    await esperar(1300)
    setFase('generando')
    await vinculosRepo.crear({
      tokenId: generarTokenId(),
      ciudadanoId: CIUDADANO_ACTUAL.id,
      emisorId: e.id,
      tipoDocumento: doc.tipo,
      estado: 'activo',
      venceEn: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      ultimaVerificacionEn: null,
      firma: `demo.${crypto.randomUUID().slice(0, 12)}.firmado`,
    })
    await esperar(500)
    setFase('listo')
  }

  return (
    <Modal
      abierto={doc !== null}
      onCerrar={fase === 'elegir' || fase === 'listo' ? onCerrar : () => {}}
      titulo="Enviar a un abogado"
      descripcion={doc ? `${doc.nombre} · se genera un vínculo tokenizado firmado` : undefined}
    >
      {fase === 'elegir' && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted" />
            <input
              autoFocus
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar abogado o notaría…"
              className="min-h-11 w-full rounded-control border border-border bg-page pr-3 pl-9 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {filtrados.map((e) => (
              <button
                key={e.id}
                onClick={() => elegir(e)}
                className="flex w-full items-center gap-3 rounded-control border border-border p-3 text-left transition hover:border-accent hover:bg-accent-light"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent-text">
                  <ShieldCheck size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink">{e.nombre}</div>
                  <div className="text-xs text-ink-muted">Certificado por {e.certificadoPor} · {e.tokensEmitidos} tokens emitidos</div>
                </div>
              </button>
            ))}
            {filtrados.length === 0 && <p className="py-6 text-center text-sm text-ink-muted">Sin resultados.</p>}
          </div>
        </div>
      )}

      {fase !== 'elegir' && elegido && (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="relative flex size-16 items-center justify-center rounded-full bg-accent-light text-accent-text">
            {fase === 'listo' ? <CheckCheck size={26} className="text-success" /> : fase === 'generando' ? <Sparkles size={24} /> : <Send size={22} />}
          </div>
          <div>
            <p className="font-medium text-ink">{elegido.nombre}</p>
            <p className="mt-1 flex items-center justify-center gap-2 text-sm text-ink-muted">
              {fase !== 'listo' && <Spinner className="text-accent" />}
              {PASO_A_TEXTO[fase]}
            </p>
          </div>

          {fase === 'listo' && (
            <Link
              to={ROUTES.vinculos}
              onClick={onCerrar}
              className="mt-1 text-sm font-medium text-accent-text hover:underline"
            >
              Ver el vínculo en Vínculos Tokenizados →
            </Link>
          )}
        </div>
      )}
    </Modal>
  )
}
