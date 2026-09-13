import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react'

type Tipo = 'exito' | 'info' | 'alerta' | 'error'

interface Toast {
  id: number
  tipo: Tipo
  texto: string
}

interface ContextoToast {
  mostrar: (texto: string, tipo?: Tipo) => void
}

const Ctx = createContext<ContextoToast | null>(null)

const ICONO: Record<Tipo, { I: typeof Info; clase: string }> = {
  exito: { I: CheckCircle2, clase: 'text-success' },
  info: { I: Info, clase: 'text-accent' },
  alerta: { I: AlertTriangle, clase: 'text-warning' },
  error: { I: XCircle, clase: 'text-danger' },
}

/**
 * Confirmación breve arriba y centrada, se retira sola a los 3 s (como macOS al copiar).
 * Uso: const { mostrar } = useToast(); mostrar('Enlace copiado', 'exito')
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [lista, setLista] = useState<Toast[]>([])
  const contador = useRef(0)

  const mostrar = useCallback((texto: string, tipo: Tipo = 'info') => {
    const id = ++contador.current
    setLista((l) => [...l, { id, tipo, texto }])
  }, [])

  return (
    <Ctx.Provider value={{ mostrar }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {lista.map((t) => (
          <ToastItem key={t.id} toast={t} onCerrar={() => setLista((l) => l.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </Ctx.Provider>
  )
}

function ToastItem({ toast, onCerrar }: { toast: Toast; onCerrar: () => void }) {
  useEffect(() => {
    const t = setTimeout(onCerrar, 3000)
    return () => clearTimeout(t)
  }, [onCerrar])
  const { I, clase } = ICONO[toast.tipo]
  return (
    <div className="vidrio flex items-center gap-2.5 rounded-full py-2.5 pr-5 pl-4 text-sm font-medium text-ink shadow-card-hover animate-aparecer">
      <I size={18} className={clase} />
      {toast.texto}
    </div>
  )
}

export function useToast(): ContextoToast {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}
