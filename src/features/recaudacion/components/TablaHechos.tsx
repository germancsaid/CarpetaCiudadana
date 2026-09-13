import { Car, Building2 } from 'lucide-react'
import type { HechoImponible } from '@/shared/types/domain'
import { formatBs, formatFechaHora } from '@/shared/lib/format'
import { Button, Card, CardHeader } from '@/shared/ui'

interface Props {
  hechos: HechoImponible[]
  onVerDetalle: (h: HechoImponible) => void
  /** Para resaltar la fila que acaba de llegar por realtime */
  reciente?: string | null
}

const ESTADO: Record<HechoImponible['estado'], { texto: string; clases: string }> = {
  pendiente: { texto: 'Pendiente', clases: 'bg-gray-100 text-gray-600' },
  liquidado: { texto: 'Liquidado — esperando pago', clases: 'bg-warning-light text-warning-text' },
  pagado: { texto: 'Pagado', clases: 'bg-success-light text-success-text' },
  anulado: { texto: 'Anulado', clases: 'bg-danger-light text-danger-text' },
}

export function TablaHechos({ hechos, onVerDetalle, reciente }: Props) {
  return (
    <Card>
      <CardHeader titulo="Transferencias de bienes" descripcion="Cada fila llega en tiempo real cuando las partes firman ante notaría." />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-page text-left text-xs text-ink-muted uppercase">
            <tr>
              <th className="px-5 py-3 font-medium">Fecha</th>
              <th className="px-5 py-3 font-medium">Bien</th>
              <th className="px-5 py-3 font-medium text-right">Base imponible</th>
              <th className="px-5 py-3 font-medium text-right">Impuesto</th>
              <th className="px-5 py-3 font-medium text-right">Arancel</th>
              <th className="px-5 py-3 font-medium text-right">Total</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {hechos.map((h) => (
              <tr key={h.id} className={`border-t border-border transition-colors ${h.id === reciente ? 'bg-success-light' : ''}`}>
                <td className="px-5 py-3 whitespace-nowrap text-ink-secondary">{formatFechaHora(h.generadoEn)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    {h.tipoBien === 'vehiculo' ? <Car size={16} className="shrink-0 text-ink-muted" /> : <Building2 size={16} className="shrink-0 text-ink-muted" />}
                    <span className="font-medium text-ink">{h.descripcionBien}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right whitespace-nowrap">{formatBs(h.baseImponibleBs)}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">{formatBs(h.impuestoBs)}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">{formatBs(h.arancelBs)}</td>
                <td className="px-5 py-3 text-right font-semibold whitespace-nowrap text-ink">{formatBs(h.totalBs)}</td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ESTADO[h.estado].clases}`}>{ESTADO[h.estado].texto}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Button tamano="sm" variante="secundario" onClick={() => onVerDetalle(h)}>Ver detalle</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
