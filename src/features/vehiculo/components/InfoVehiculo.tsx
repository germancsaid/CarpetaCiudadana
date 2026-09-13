import { Car } from 'lucide-react'
import { VEHICULO } from '@/mocks/datos'
import { formatNumero, formatUsd, formatBs } from '@/shared/lib/format'
import { Card } from '@/shared/ui'

export function InfoVehiculo() {
  const datos = [
    ['Placa', VEHICULO.placa], ['Color', VEHICULO.color], ['VIN', VEHICULO.vin],
    ['Kilometraje', `${formatNumero(VEHICULO.km)} km`], ['Precio acordado', formatUsd(VEHICULO.precioUsd)], ['Valor fiscal RUAT', formatBs(VEHICULO.valorFiscalBs)],
  ]
  return (
    <Card className="overflow-hidden">
      <div className="flex h-40 items-center justify-center bg-page text-ink-muted"><Car size={56} strokeWidth={1.25} /></div>
      <div className="p-5">
        <div className="text-lg font-semibold text-ink">{VEHICULO.marca} {VEHICULO.modelo} {VEHICULO.anio}</div>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {datos.map(([k, v]) => <div key={k}><dt className="text-xs text-ink-muted">{k}</dt><dd className="font-medium text-ink">{v}</dd></div>)}
        </dl>
      </div>
    </Card>
  )
}
