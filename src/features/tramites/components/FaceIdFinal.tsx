import { useState } from 'react'
import { ScanFace, Send } from 'lucide-react'
import { esperar } from '@/shared/lib/simular'
import { Button, Card, CheckAnimado } from '@/shared/ui'

type Fase = 'reposo' | 'escaneando' | 'enviado'

/**
 * Último paso antes de mandar todo: reconocimiento facial simulado como
 * cierre del trámite — mismo lenguaje visual que el Face/Touch ID del
 * login (ver features/login/components/Biometria.tsx).
 */
export function FaceIdFinal({ destino = 'la Alcaldía y el Consorcio de Abogados', onEnviado }: { destino?: string; onEnviado: () => Promise<void> | void }) {
  const [fase, setFase] = useState<Fase>('reposo')

  async function confirmar() {
    setFase('escaneando')
    await esperar(1400)
    setFase('enviado')
    await esperar(900)
    await onEnviado()
  }

  return (
    <Card className="flex flex-col items-center gap-3 border-accent/30 p-6 text-center">
      {fase === 'enviado' ? (
        <>
          <CheckAnimado size={56} className="text-success" />
          <div>
            <div className="font-semibold text-success-text">Trámite enviado</div>
            <div className="mt-0.5 text-sm text-ink-muted">Notificado a {destino}.</div>
          </div>
        </>
      ) : (
        <>
          <div className={`flex size-16 items-center justify-center rounded-full bg-accent-light text-accent-text transition ${fase === 'escaneando' ? 'animate-latir' : ''}`}>
            <ScanFace size={32} strokeWidth={1.25} />
          </div>
          <div>
            <div className="font-semibold text-ink">Confirmá con Face ID para enviar</div>
            <div className="mt-0.5 text-sm text-ink-muted">Todos los pasos están completos. Un último reconocimiento facial valida que sos vos antes de mandar el trámite.</div>
          </div>
          <Button iconoIzq={<Send size={16} />} cargando={fase === 'escaneando'} pulso onClick={() => void confirmar()}>
            {fase === 'escaneando' ? 'Reconociendo rostro…' : 'Confirmar y enviar trámite'}
          </Button>
        </>
      )}
    </Card>
  )
}
