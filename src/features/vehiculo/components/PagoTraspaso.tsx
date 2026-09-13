import type { PasoTramite } from '@/shared/types/domain'
import { formatBs } from '@/shared/lib/format'
import { Card, QrCode } from '@/shared/ui'

/** QR de pago del arancel de traspaso — visual, simulado para la demo (sin pasarela real). */
export function PagoTraspaso({ paso }: { paso: PasoTramite | undefined }) {
  if (!paso || paso.montoBs == null) return null
  const habilitado = paso.estado === 'en_progreso'

  return (
    <Card className={`flex flex-col items-center gap-4 p-5 text-center sm:flex-row sm:text-left ${!habilitado ? 'opacity-60' : ''}`}>
      <div className="flex-1">
        <h3 className="font-semibold text-ink">{paso.nombre}</h3>
        <p className="mt-1 text-sm text-ink-secondary">{paso.nota}</p>
        <p className="mt-2 text-lg font-semibold text-ink">{formatBs(paso.montoBs)}</p>
        {!habilitado && <p className="mt-1 text-xs text-ink-muted">Se habilita cuando el paso anterior queda completo.</p>}
      </div>
      <QrCode
        valor={`CARPETACIUDADANA|TRASPASO|PASO:${paso.id}|CONCEPTO:${paso.nombre}|TOTAL_BS:${paso.montoBs}`}
        tamano={128}
      />
    </Card>
  )
}
