import { useState } from 'react'
import { Landmark, QrCode as QrIcon } from 'lucide-react'
import { formatBs } from '@/shared/lib/format'
import { esperar } from '@/shared/lib/simular'
import { Button, CheckAnimado, Modal, QrCode } from '@/shared/ui'
import { EscaneoTelefono } from './EscaneoTelefono'

type Fase = 'cerrado' | 'qr' | 'validando' | 'recibido'

/** QR de pago del arancel, flotante y grande — botón que abre un modal con el QR y termina en "Pago recibido". */
export function PagoQrFlotante({ valor, montoBs, onPagoRecibido }: {
  valor: string
  montoBs: number
  onPagoRecibido: () => Promise<void> | void
}) {
  const [fase, setFase] = useState<Fase>('cerrado')

  async function simularEscaneo() {
    setFase('validando')
    await esperar(1600)
    setFase('recibido')
    await esperar(900)
    await onPagoRecibido()
    setFase('cerrado')
  }

  return (
    <>
      <Button iconoIzq={<QrIcon size={16} />} onClick={() => setFase('qr')}>Pagar con QR — {formatBs(montoBs)}</Button>

      <Modal abierto={fase !== 'cerrado'} onCerrar={() => fase === 'qr' && setFase('cerrado')}
             titulo="Pago del arancel de traspaso" descripcion="Simulado para la demo — sin pasarela real." tamano="md">
        <div className="flex flex-col items-center gap-5 py-4 text-center">
          {fase === 'qr' && (
            <>
              <QrCode valor={valor} tamano={220} etiqueta="Escaneá con tu banca móvil" />
              <div>
                <div className="text-3xl font-semibold text-ink">{formatBs(montoBs)}</div>
                <div className="mt-1 text-sm text-ink-muted">Alcaldía Santa Cruz de la Sierra · Sistema de Pagos Unificado</div>
              </div>
              <Button tamano="lg" onClick={() => void simularEscaneo()}>Simular escaneo desde el celular</Button>
            </>
          )}
          {fase === 'validando' && (
            <>
              <EscaneoTelefono />
              <div className="text-sm font-medium text-ink">Confirmando el pago con el banco…</div>
            </>
          )}
          {fase === 'recibido' && (
            <>
              <CheckAnimado size={72} className="text-success" />
              <div>
                <div className="text-lg font-semibold text-success-text">Pago recibido</div>
                <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-ink-muted">
                  <Landmark size={14} /> Notificado a la Alcaldía en tiempo real
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  )
}
