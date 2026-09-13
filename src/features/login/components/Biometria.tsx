import { Fingerprint } from 'lucide-react'
import { CheckAnimado } from '@/shared/ui'

type Fase = 'reposo' | 'escaneando' | 'ok'

/** Huella estilizada con animación de escaneo. 100 % simulado. */
export function Biometria({ fase }: { fase: Fase }) {
  return (
    <div className="relative flex size-28 items-center justify-center">
      {fase === 'ok' ? (
        <CheckAnimado size={96} className="text-success" />
      ) : (
        <>
          <div className={`absolute inset-0 rounded-full border-2 border-white/25 ${fase === 'escaneando' ? 'animate-[anillo_1.2s_ease-out_infinite]' : ''}`} />
          <div className={`absolute inset-3 rounded-full ${fase === 'escaneando' ? 'bg-white/10' : 'bg-white/5'} transition`} />
          <Fingerprint size={56} strokeWidth={1.25} className={`relative text-white ${fase === 'escaneando' ? 'opacity-100' : 'opacity-80'}`} />
          {fase === 'escaneando' && (
            <div className="absolute inset-x-6 h-0.5 rounded-full bg-accent shadow-[0_0_14px_var(--c-accent)] animate-escaneo" />
          )}
        </>
      )}
      <style>{`@keyframes anillo { 0% { transform: scale(1); opacity: .8 } 100% { transform: scale(1.5); opacity: 0 } }`}</style>
    </div>
  )
}
