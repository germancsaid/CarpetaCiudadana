import { FileStack, Coins, CircleCheck, Hourglass } from 'lucide-react'
import type { HechoImponible } from '@/shared/types/domain'
import { formatBs } from '@/shared/lib/format'
import { Card } from '@/shared/ui'

export function Kpis({ hechos }: { hechos: HechoImponible[] }) {
  const inicioMes = new Date()
  inicioMes.setDate(1)
  inicioMes.setHours(0, 0, 0, 0)
  const delMes = hechos.filter((h) => new Date(h.generadoEn) >= inicioMes)
  const liquidado = delMes.reduce((s, h) => s + h.totalBs, 0)
  const cobrado = delMes.filter((h) => h.estado === 'pagado').reduce((s, h) => s + h.totalBs, 0)
  const pendientes = delMes.filter((h) => h.estado === 'liquidado' || h.estado === 'pendiente').length

  const items = [
    { etiqueta: 'Hechos imponibles del mes', valor: String(delMes.length), icono: FileStack, color: 'bg-accent-light text-accent-text' },
    { etiqueta: 'Liquidado en el mes', valor: formatBs(liquidado), icono: Coins, color: 'bg-warning-light text-warning-text' },
    { etiqueta: 'Cobrado en el mes', valor: formatBs(cobrado), icono: CircleCheck, color: 'bg-success-light text-success-text' },
    { etiqueta: 'Pendientes de pago', valor: String(pendientes), icono: Hourglass, color: 'bg-gray-100 text-gray-600' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ etiqueta, valor, icono: Icono, color }) => (
        <Card key={etiqueta} className="p-5">
          <div className={`mb-3 flex size-9 items-center justify-center rounded-control ${color}`}><Icono size={18} /></div>
          <div className="text-2xl font-semibold text-ink">{valor}</div>
          <div className="text-sm text-ink-muted">{etiqueta}</div>
        </Card>
      ))}
    </div>
  )
}
