import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

/**
 * QR visual para la demo (simulado — no hay pasarela de pago real detrás).
 * Codifica el texto recibido (folio, monto, entidad) para que se vea
 * escaneable y auténtico en la presentación.
 */
export function QrCode({ valor, tamano = 176 }: { valor: string; tamano?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    setListo(false)
    QRCode.toCanvas(ref.current, valor, {
      width: tamano,
      margin: 1,
      color: { dark: '#1d1d1f', light: '#ffffff' },
    })
      .then(() => setListo(true))
      .catch(() => setListo(false))
  }, [valor, tamano])

  return (
    <div className="inline-flex flex-col items-center gap-2 rounded-card border border-border bg-white p-3 shadow-card">
      <canvas ref={ref} width={tamano} height={tamano} className={listo ? '' : 'opacity-0'} />
      <span className="text-[10px] font-medium tracking-wide text-ink-muted uppercase">Pago QR · Bolivia</span>
    </div>
  )
}
