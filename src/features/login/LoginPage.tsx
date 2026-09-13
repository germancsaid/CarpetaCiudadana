import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/app/routes'
import { haySesion, iniciarSesion } from '@/services/sesion'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'
import { esperar } from '@/shared/lib/simular'
import { Button, Campo, Input } from '@/shared/ui'
import { Biometria } from './components/Biometria'

type Modo = 'biometria' | 'credenciales'
type Fase = 'reposo' | 'escaneando' | 'ok'

const DEMORA_ESCANEO = 1200

export function LoginPage() {
  const navegar = useNavigate()
  const [modo, setModo] = useState<Modo>('biometria')
  const [fase, setFase] = useState<Fase>('reposo')
  const [saliendo, setSaliendo] = useState(false)
  const [ci, setCi] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    if (haySesion()) navegar(ROUTES.inicio, { replace: true })
  }, [navegar])

  async function entrar() {
    setFase('ok')
    iniciarSesion()
    await esperar(650)
    setSaliendo(true)
    await esperar(350)
    navegar(ROUTES.inicio, { replace: true })
  }

  async function ingresarConHuella() {
    if (fase !== 'reposo') return
    setFase('escaneando')
    await esperar(DEMORA_ESCANEO)
    await entrar()
  }

  async function ingresarConCredenciales(e: FormEvent) {
    e.preventDefault()
    if (!ci.trim() || !clave.trim()) return setError('Completá tu CI y tu contraseña.')
    setError(undefined)
    await entrar()
  }

  return (
    <div className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-sidebar p-6 text-white transition-opacity duration-300 ${saliendo ? 'opacity-0' : 'opacity-100'}`}>
      {/* Fondo: gradiente teal → navy con dos halos suaves */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_color-mix(in_srgb,var(--c-accent)_38%,transparent),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgb(26_60_120_/_0.55),_transparent_60%)]" />

      <div className="relative w-full max-w-sm animate-aparecer">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-[40px] leading-none font-bold tracking-[-0.02em]">CarpetaCiudadana</h1>
          <p className="mt-2 text-white/60">Bolivia Digital · Santa Cruz</p>
        </div>

        {modo === 'biometria' ? (
          <div className="flex flex-col items-center gap-8">
            <button onClick={ingresarConHuella} aria-label="Ingresar con huella" disabled={fase !== 'reposo'}
                    className="presionable rounded-full focus-visible:outline-white">
              <Biometria fase={fase} />
            </button>
            <div className="min-h-6 text-center text-sm text-white/70" aria-live="polite">
              {fase === 'reposo' && 'Tocá la huella para ingresar'}
              {fase === 'escaneando' && 'Verificando identidad…'}
              {fase === 'ok' && `Bienvenido, ${CIUDADANO_ACTUAL.nombreCompleto.split(' ')[0]}`}
            </div>
            <Button tamano="lg" className="w-full !bg-white !text-sidebar" onClick={ingresarConHuella} disabled={fase !== 'reposo'}>
              Ingresar con mi Carpeta Ciudadana
            </Button>
            <button onClick={() => setModo('credenciales')} className="text-sm text-white/55 underline-offset-4 hover:text-white hover:underline">
              Ingresar con CI y contraseña
            </button>
          </div>
        ) : (
          <form onSubmit={ingresarConCredenciales} noValidate className="rounded-sheet bg-white/8 p-6 backdrop-blur-lg">
            <div className="space-y-4 [&_span]:!text-white/70 [&_input]:!bg-white/10 [&_input]:!text-white [&_input]:placeholder:!text-white/40">
              <Campo etiqueta="Carnet de Identidad" requerido>
                <Input value={ci} onChange={(e) => setCi(e.target.value)} placeholder="8.234.567" autoComplete="username" />
              </Campo>
              <Campo etiqueta="Contraseña" requerido error={error}>
                <Input type="password" value={clave} onChange={(e) => setClave(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
              </Campo>
            </div>
            <Button type="submit" tamano="lg" className="mt-6 w-full !bg-white !text-sidebar" cargando={fase !== 'reposo'} pulso>
              Ingresar
            </Button>
            <button type="button" onClick={() => setModo('biometria')} className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white">
              <ArrowLeft size={14} /> Volver a la huella
            </button>
          </form>
        )}

        <p className="mt-10 text-center text-xs text-white/35">Demo — la identidad se simula, no hay biometría real.</p>
      </div>
    </div>
  )
}
