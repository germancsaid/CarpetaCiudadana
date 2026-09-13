import { useState } from 'react'
import type { HechoImponible } from '@/shared/types/domain'
import { confirmarPagoDesdeMunicipio } from '@/services/traspaso'
import { TIPO_CAMBIO_BS } from '@/shared/lib/tributos'
import { formatBs, formatUsd, formatFechaHora } from '@/shared/lib/format'
import { esperar, DEMORA } from '@/shared/lib/simular'
import { Button, Modal } from '@/shared/ui'

interface Props {
  hecho: HechoImponible | null
  onCerrar: () => void
  onCambio: () => void
}

export function DetalleHecho({ hecho, onCerrar, onCambio }: Props) {
  const [cargando, setCargando] = useState(false)
  if (!hecho) return null

  async function marcarPagado() {
    if (!hecho) return
    setCargando(true)
    try {
      await esperar(DEMORA.verificacion)
      await confirmarPagoDesdeMunicipio(hecho)
      onCambio()
      onCerrar()
    } finally {
      setCargando(false)
    }
  }

  const declaradoBs = hecho.valorDeclaradoUsd * TIPO_CAMBIO_BS
  const usaDeclarado = declaradoBs >= hecho.valorBaseBs
  const pct = `${(hecho.alicuota * 100).toLocaleString('es-BO')} %`

  const Fila = ({ k, v, fuerte = false, nota }: { k: string; v: string; fuerte?: boolean; nota?: string }) => (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <div>
        <div className={`text-sm ${fuerte ? 'font-semibold text-ink' : 'text-ink-secondary'}`}>{k}</div>
        {nota && <div className="text-xs text-ink-muted">{nota}</div>}
      </div>
      <div className={`text-right whitespace-nowrap ${fuerte ? 'text-lg font-semibold text-ink' : 'text-sm text-ink'}`}>{v}</div>
    </div>
  )

  return (
    <Modal abierto onCerrar={onCerrar} titulo="Liquidación de transferencia" descripcion={hecho.descripcionBien}
           pie={
             <>
               <Button variante="secundario" onClick={onCerrar}>Cerrar</Button>
               {hecho.estado !== 'pagado' && (
                 <Button onClick={marcarPagado} cargando={cargando}>Marcar como pagado</Button>
               )}
             </>
           }>
      <div className="divide-y divide-border">
        <Fila k="Valor declarado por las partes" v={`${formatUsd(hecho.valorDeclaradoUsd)} ≈ ${formatBs(declaradoBs)}`} nota={`Tipo de cambio ${TIPO_CAMBIO_BS}`} />
        <Fila k="Valor fiscal (RUAT / catastro)" v={formatBs(hecho.valorBaseBs)} />
        <Fila k="Base imponible" v={formatBs(hecho.baseImponibleBs)} nota={`El mayor de los dos — ${usaDeclarado ? 'se usa el declarado' : 'se usa el fiscal: evita subdeclaración'}`} />
        <Fila k={`Impuesto a la transferencia (${pct})`} v={formatBs(hecho.impuestoBs)} />
        <Fila k="Arancel municipal de trámite" v={formatBs(hecho.arancelBs)} />
        <Fila k="Total a recaudar" v={formatBs(hecho.totalBs)} fuerte />
      </div>
      <div className="mt-4 rounded-card bg-page p-3 text-xs text-ink-muted">
        Generado {formatFechaHora(hecho.generadoEn)} · {hecho.municipio}
        {hecho.pagadoEn && <> · Pagado {formatFechaHora(hecho.pagadoEn)}</>}
      </div>
    </Modal>
  )
}
