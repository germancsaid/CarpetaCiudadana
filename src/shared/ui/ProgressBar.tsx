import { useEffect, useState } from 'react'

interface ProgressBarProps {
  /** 0 a 100 */
  valor: number
  className?: string
}

/** Barra simple. Anima desde 0 al montar (requisito del SPEC). */
export function ProgressBar({ valor, className = '' }: ProgressBarProps) {
  const ancho = useAnimarDesdeCero(valor)
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-border ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-success to-accent transition-[width] duration-700 ease-out"
        style={{ width: `${ancho}%` }}
      />
    </div>
  )
}

export interface Segmento {
  estado: 'completado' | 'en_progreso' | 'bloqueado' | 'pendiente'
}

const COLOR_SEGMENTO: Record<Segmento['estado'], string> = {
  completado: 'bg-success',
  en_progreso: 'bg-accent',
  bloqueado: 'bg-border',
  pendiente: 'bg-border',
}

/** Barra por pasos: un tramo por paso, coloreado según su estado. */
export function ProgressSegments({ segmentos }: { segmentos: Segmento[] }) {
  return (
    <div className="flex gap-1">
      {segmentos.map((s, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full transition-colors duration-500 ${COLOR_SEGMENTO[s.estado]}`}
        />
      ))}
    </div>
  )
}

function useAnimarDesdeCero(valor: number) {
  const [ancho, setAncho] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setAncho(valor))
    return () => cancelAnimationFrame(id)
  }, [valor])
  return ancho
}
