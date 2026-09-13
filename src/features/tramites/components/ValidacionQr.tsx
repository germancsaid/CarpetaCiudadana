import { useState } from 'react'
import { ScanLine } from 'lucide-react'
import { formatBs } from '@/shared/lib/format'
import { esperar } from '@/shared/lib/simular'
import { Button, CheckAnimado, QrCode, Spinner } from '@/shared/ui'

type Fase = 'qr' | 'validando' | 'ok'

/**
 * Confirmación estilo Apple Pay/Wallet: se muestra un QR, "escanear" dispara
 * una validación breve y termina en un check animado grande antes de marcar
 * el paso como completado. Simulado — sin pasarela ni lectura real.
 */
export function ValidacionQr({ valor, montoBs, etiqueta = 'Escaneá para validar', onValidado }: {
  valor: string
  montoBs?: number
  etiqueta?: string
  onValidado: () => Promise<void> | void
}) {
  const [fase, setFase] = useState<Fase>('qr')

  async function simularEscaneo() {
    setFase('validando')
    await esperar(1100)
    setFase('ok')
    await esperar(700)
    await onValidado()
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-page p-5 text-center sm:flex-row sm:text-left">
      {fase === 'ok' ? (
        <div className="flex flex-1 flex-col items-center gap-2 py-2 sm:flex-row sm:gap-4">
          <CheckAnimado size={56} className="text-success" />
          <div>
            <div className="font-semibold text-success-text">Validado</div>
            <div className="text-sm text-ink-muted">{montoBs != null ? `Pago de ${formatBs(montoBs)} confirmado` : 'Confirmación recibida'}</div>
          </div>
        </div>
      ) : fase === 'validando' ? (
        <div className="flex flex-1 flex-col items-center gap-2 py-2 sm:flex-row sm:gap-4">
          <Spinner className="size-8 text-accent" />
          <div className="text-sm font-medium text-ink">Validando…</div>
        </div>
      ) : (
        <>
          <QrCode valor={valor} tamano={112} etiqueta="Escaneá con tu app" />
          <div className="flex-1">
            <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-ink sm:justify-start">
              <ScanLine size={15} className="text-accent" /> {etiqueta}
            </div>
            {montoBs != null && <div className="mt-0.5 text-lg font-semibold text-ink">{formatBs(montoBs)}</div>}
            <div className="mt-1 text-xs text-ink-muted">Simulado para la demo — sin pasarela real.</div>
            <Button tamano="sm" className="mt-3" onClick={() => void simularEscaneo()}>Simular escaneo desde el celular</Button>
          </div>
        </>
      )}
    </div>
  )
}
