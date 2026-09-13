import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'
import { saludo } from '@/shared/lib/tiempo'

interface Props { vigentes: number; activos: number; porVencer: number }

export function Hero({ vigentes, activos, porVencer }: Props) {
  const nombre = CIUDADANO_ACTUAL.nombreCompleto.split(' ')[0]
  const pills = [
    { texto: `${vigentes} documentos vigentes`, clases: 'bg-success/20 text-success' },
    { texto: `${activos} trámite${activos === 1 ? '' : 's'} activo${activos === 1 ? '' : 's'}`, clases: 'bg-accent/25 text-blue-300' },
    { texto: `${porVencer} token${porVencer === 1 ? '' : 's'} por vencer`, clases: 'bg-warning/25 text-amber-300' },
  ]
  return (
    <div className="rounded-2xl bg-sidebar p-8 text-white">
      <h2 className="text-[28px] leading-tight font-semibold">{saludo()}, {nombre}</h2>
      <p className="mt-1 text-gray-400">Tu identidad digital está protegida</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {pills.map((p) => <span key={p.texto} className={`rounded-full px-3 py-1 text-xs font-medium ${p.clases}`}>{p.texto}</span>)}
      </div>
    </div>
  )
}
