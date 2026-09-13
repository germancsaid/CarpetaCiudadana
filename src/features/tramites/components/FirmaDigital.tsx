import { useRef, useState, type PointerEvent } from 'react'
import { Eraser, PenLine } from 'lucide-react'
import { esperar, DEMORA } from '@/shared/lib/simular'
import { Button, CheckAnimado } from '@/shared/ui'
import { EscaneoTelefono } from './EscaneoTelefono'

type Fase = 'firmando' | 'validando' | 'ok'

/**
 * Recuadro de firma tipo "firmá acá" — se dibuja con el mouse/dedo sobre un
 * canvas, o se usa una firma de ejemplo con un click para el demo. Al
 * confirmar corre la misma animación de validación (celular escaneando)
 * antes del check final.
 */
export function FirmaDigital({ onConfirmada }: { onConfirmada: () => Promise<void> | void }) {
  const [fase, setFase] = useState<Fase>('firmando')
  const [tieneTrazo, setTieneTrazo] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dibujando = useRef(false)

  function contexto() {
    const c = canvasRef.current
    if (!c) return null
    const ctx = c.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--c-accent').trim() || '#0071e3'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
    return ctx
  }

  function posicion(e: PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function alBajar(e: PointerEvent<HTMLCanvasElement>) {
    dibujando.current = true
    const ctx = contexto()
    const { x, y } = posicion(e)
    ctx?.beginPath()
    ctx?.moveTo(x, y)
  }
  function alMover(e: PointerEvent<HTMLCanvasElement>) {
    if (!dibujando.current) return
    const ctx = contexto()
    const { x, y } = posicion(e)
    ctx?.lineTo(x, y)
    ctx?.stroke()
    setTieneTrazo(true)
  }
  function alSoltar() { dibujando.current = false }

  function limpiar() {
    const c = canvasRef.current
    const ctx = c?.getContext('2d')
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height)
    setTieneTrazo(false)
  }

  function firmaDeEjemplo() {
    const c = canvasRef.current
    const ctx = contexto()
    if (!c || !ctx) return
    ctx.beginPath()
    ctx.moveTo(20, 55)
    ctx.bezierCurveTo(45, 15, 70, 85, 95, 45)
    ctx.bezierCurveTo(115, 15, 130, 60, 160, 40)
    ctx.stroke()
    setTieneTrazo(true)
  }

  async function confirmar() {
    setFase('validando')
    await esperar(DEMORA.verificacion)
    setFase('ok')
    await esperar(700)
    await onConfirmada()
  }

  if (fase === 'validando') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-page p-5 sm:flex-row sm:gap-5">
        <EscaneoTelefono />
        <div className="text-sm font-medium text-ink">Validando la firma ante Notaría…</div>
      </div>
    )
  }
  if (fase === 'ok') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-page p-5 text-center sm:flex-row sm:gap-4 sm:text-left">
        <CheckAnimado size={48} className="text-success" />
        <div>
          <div className="font-semibold text-success-text">Firmado digitalmente</div>
          <div className="text-sm text-ink-muted">Se generó el contrato con sello notarial digital.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-card border border-border bg-page p-4">
      <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink">
        <PenLine size={15} className="text-accent" /> Firmá en el recuadro
      </div>
      <canvas
        ref={canvasRef}
        width={340}
        height={110}
        onPointerDown={alBajar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerLeave={alSoltar}
        className="w-full touch-none rounded-control border border-dashed border-border bg-card"
        style={{ height: 110 }}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button tamano="sm" onClick={() => void confirmar()} disabled={!tieneTrazo}>Confirmar firma</Button>
        <Button tamano="sm" variante="secundario" onClick={firmaDeEjemplo}>Usar firma de ejemplo</Button>
        {tieneTrazo && (
          <Button tamano="sm" variante="fantasma" iconoIzq={<Eraser size={14} />} onClick={limpiar}>Limpiar</Button>
        )}
      </div>
    </div>
  )
}
