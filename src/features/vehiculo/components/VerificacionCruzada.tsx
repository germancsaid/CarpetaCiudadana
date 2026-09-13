import { useEffect, useState } from 'react'
import { ShieldCheck, Fingerprint, Car, Loader2 } from 'lucide-react'
import { esperar } from '@/shared/lib/simular'
import { VEHICULO } from '@/mocks/datos'
import { Card } from '@/shared/ui'

type Estado = 'esperando' | 'consultando' | 'ok'

interface Entidad {
  id: string
  icono: typeof ShieldCheck
  institucion: string
  consulta: string
  resultado: string
  demoraMs: number
}

const ENTIDADES: Entidad[] = [
  {
    id: 'diprove',
    icono: Car,
    institucion: 'DIPROVE — Policía Boliviana',
    consulta: `Antecedentes de robo/hurto placa ${VEHICULO.placa}`,
    resultado: 'Sin reporte — vehículo habilitado para transferencia',
    demoraMs: 1400,
  },
  {
    id: 'segip',
    icono: Fingerprint,
    institucion: 'SEGIP',
    consulta: 'Identidad y vigencia del Carnet de Identidad de ambas partes',
    resultado: 'CI vigentes — identidad de comprador y vendedor confirmada',
    demoraMs: 1100,
  },
  {
    id: 'ruat',
    icono: ShieldCheck,
    institucion: 'RUAT / GAMSC',
    consulta: 'Impuestos y multas de tránsito pendientes',
    resultado: 'Al día — sin deudas que bloqueen el traspaso',
    demoraMs: 1700,
  },
]

/**
 * Simula, en vivo, la consulta cruzada a los sistemas de otras entidades
 * (DIPROVE, SEGIP, RUAT/GAMSC) que hoy en Bolivia se hacen a mano y en
 * ventanilla. Es el argumento de venta central: CarpetaCiudadana no
 * reemplaza a estas instituciones, las conecta.
 */
export function VerificacionCruzada() {
  const [estados, setEstados] = useState<Record<string, Estado>>(() =>
    Object.fromEntries(ENTIDADES.map((e) => [e.id, 'esperando'])) as Record<string, Estado>)

  useEffect(() => {
    let cancelado = false
    async function correr() {
      for (const e of ENTIDADES) {
        if (cancelado) return
        setEstados((s) => ({ ...s, [e.id]: 'consultando' }))
        await esperar(e.demoraMs)
        if (cancelado) return
        setEstados((s) => ({ ...s, [e.id]: 'ok' }))
      }
    }
    void correr()
    return () => {
      cancelado = true
    }
  }, [])

  return (
    <Card className="p-5">
      <h3 className="font-semibold text-ink">Verificación cruzada entre entidades</h3>
      <p className="mt-1 text-sm text-ink-muted">
        CarpetaCiudadana consulta en tiempo real a las instituciones que hoy exigen trámite presencial.
      </p>
      <ul className="mt-4 divide-y divide-border">
        {ENTIDADES.map((e) => {
          const estado = estados[e.id]
          const Icono = e.icono
          return (
            <li key={e.id} className="flex items-start gap-3 py-3">
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-full transition ${
                  estado === 'ok' ? 'bg-success-light text-success-text' : estado === 'consultando' ? 'bg-accent-light text-accent-text' : 'bg-card-2 text-ink-muted'
                }`}
              >
                {estado === 'consultando' ? <Loader2 size={16} className="animate-spin" /> : <Icono size={16} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-sm font-medium text-ink">{e.institucion}</span>
                  <span
                    className={`text-xs font-medium ${
                      estado === 'ok' ? 'text-success-text' : estado === 'consultando' ? 'text-accent-text' : 'text-ink-muted'
                    }`}
                  >
                    {estado === 'ok' ? 'Verificado' : estado === 'consultando' ? 'Consultando…' : 'En cola'}
                  </span>
                </div>
                <div className="text-xs text-ink-muted">{e.consulta}</div>
                {estado === 'ok' && <div className="mt-0.5 text-xs text-success-text">{e.resultado}</div>}
              </div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
