import { useState } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'
import { esperar } from '@/shared/lib/simular'
import { Button, CheckAnimado } from '@/shared/ui'

type Fase = 'esperando' | 'validando' | 'ok'

/**
 * Antes de poder firmar/escanear un paso que depende de un tercero (el
 * Consorcio de Abogados, la Notaría), se muestra que esa contraparte está
 * revisando la información — con su propio "OK" — y sólo entonces se
 * habilita el paso del lado del ciudadano (ValidacionQr / FirmaDigital).
 */
export function EsperaContraparte({ fuente, onOk }: { fuente: string; onOk: () => void }) {
  const [fase, setFase] = useState<Fase>('esperando')

  async function simular() {
    setFase('validando')
    await esperar(1300)
    setFase('ok')
    await esperar(500)
    onOk()
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border bg-page p-5 text-center sm:flex-row sm:text-left">
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${fase === 'ok' ? 'bg-success-light text-success-text' : 'bg-accent-light text-accent-text'}`}>
        {fase === 'esperando' && <ShieldCheck size={18} />}
        {fase === 'validando' && <Loader2 size={18} className="animate-spin" />}
        {fase === 'ok' && <CheckAnimado size={22} />}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-ink">
          {fase === 'ok' ? `${fuente} validó la información` : `Esperando validación de ${fuente}`}
        </div>
        <div className="text-xs text-ink-muted">
          {fase === 'esperando' && 'Están revisando que toda la documentación esté en regla antes de continuar.'}
          {fase === 'validando' && 'Confirmando datos…'}
          {fase === 'ok' && 'Ya podés continuar con tu parte del trámite.'}
        </div>
      </div>
      {fase === 'esperando' && (
        <Button tamano="sm" variante="secundario" onClick={() => void simular()}>Simular validación de {fuente}</Button>
      )}
    </div>
  )
}
