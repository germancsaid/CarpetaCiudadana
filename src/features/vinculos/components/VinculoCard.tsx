import { useState } from 'react'
import { ShieldCheck, Share2, Info, CheckCircle2, XCircle, AlertTriangle, Check } from 'lucide-react'
import type { Vinculo, Emisor } from '@/shared/types/domain'
import { vinculosRepo } from '@/services/vinculos'
import { verificacionesRepo } from '@/services/verificaciones'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'
import { formatFecha, formatFechaHora } from '@/shared/lib/format'
import { haceCuanto } from '@/shared/lib/tiempo'
import { textoVencimiento } from '@/shared/lib/vencimientos'
import { esperar, DEMORA } from '@/shared/lib/simular'
import { Badge, Button, Card } from '@/shared/ui'

interface Props {
  vinculo: Vinculo
  emisor?: Emisor
  onVerificado: () => void
}

type Resultado = { ok: true; en: string } | { ok: false; motivo: string }

export function VinculoCard({ vinculo: v, emisor, onVerificado }: Props) {
  const [verificando, setVerificando] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [compartido, setCompartido] = useState(false)
  const [detalles, setDetalles] = useState(false)

  async function verificar() {
    setVerificando(true)
    setResultado(null)
    try {
      await esperar(DEMORA.verificacion)
      const valido = v.estado === 'activo' || v.estado === 'por_vencer'
      await verificacionesRepo.registrar({
        vinculoId: v.id, tokenId: v.tokenId, ciudadanoCi: CIUDADANO_ACTUAL.ci, tipo: v.tipoDocumento,
        resultado: valido ? 'valido' : 'vencido', motivo: valido ? undefined : `Token vencido el ${formatFecha(v.venceEn)}`,
        funcionario: 'Autoverificación', institucion: 'CarpetaCiudadana',
      })
      if (valido) {
        await vinculosRepo.marcarVerificado(v.id)
        setResultado({ ok: true, en: formatFechaHora(new Date().toISOString()) })
        onVerificado()
      } else {
        setResultado({ ok: false, motivo: `Vencido el ${formatFecha(v.venceEn)}` })
      }
    } finally {
      setVerificando(false)
    }
  }

  function compartir() {
    setCompartido(true)
    setTimeout(() => setCompartido(false), 2000)
  }

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-success-light text-success-text">
          <ShieldCheck size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-ink">{v.tipoDocumento}</div>
          <div className="text-sm text-ink-secondary">{emisor?.nombre ?? 'Emisor desconocido'}</div>
          {emisor && <div className="text-xs text-success-text">Certificado por {emisor.certificadoPor}</div>}
        </div>
        <Badge estado={v.estado} />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-secondary">
        <span className="font-mono text-ink">{v.tokenId}</span>
        <span>Creado {formatFecha(v.creadoEn)}</span>
        <span>Vence {formatFecha(v.venceEn)}</span>
        <span>Última verificación: {haceCuanto(v.ultimaVerificacionEn)}</span>
      </div>

      {v.estado === 'por_vencer' && (
        <div className="mt-3 flex items-center gap-2 rounded-control bg-warning-light px-3 py-2 text-sm text-warning-text">
          <AlertTriangle size={15} /> {textoVencimiento(v.venceEn)} — solicitá renovación al emisor
        </div>
      )}

      {resultado && (
        <div className={`mt-3 flex items-center gap-2 rounded-control px-3 py-2 text-sm ${resultado.ok ? 'bg-success-light text-success-text' : 'bg-danger-light text-danger-text'}`}>
          {resultado.ok ? <><CheckCircle2 size={16} /> Verificado — documento válido al {resultado.en}</>
                        : <><XCircle size={16} /> Token inválido — {resultado.motivo}</>}
        </div>
      )}

      {detalles && (
        <dl className="mt-3 grid grid-cols-2 gap-2 rounded-control bg-page p-3 text-xs">
          <div><dt className="text-ink-muted">Firma</dt><dd className="font-mono text-ink">{v.firma}</dd></div>
          <div><dt className="text-ink-muted">Tokens emitidos por el emisor</dt><dd className="text-ink">{emisor?.tokensEmitidos ?? '—'}</dd></div>
          <div className="col-span-2"><dt className="text-ink-muted">Documento en la fuente</dt><dd className="text-ink">El emisor guarda el original. Este vínculo sólo apunta a él, no lo copia.</dd></div>
        </dl>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button tamano="sm" onClick={verificar} cargando={verificando}>{verificando ? 'Verificando…' : 'Verificar'}</Button>
        <Button tamano="sm" variante="secundario" iconoIzq={compartido ? <Check size={14} /> : <Share2 size={14} />} onClick={compartir}>
          {compartido ? 'Enlace copiado' : 'Compartir'}
        </Button>
        <Button tamano="sm" variante="fantasma" iconoIzq={<Info size={14} />} onClick={() => setDetalles((d) => !d)}>
          {detalles ? 'Ocultar detalles' : 'Ver detalles'}
        </Button>
      </div>
    </Card>
  )
}
