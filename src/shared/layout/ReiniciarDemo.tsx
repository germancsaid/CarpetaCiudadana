import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { reiniciarDemo, MODO_DEMO } from '@/services/demo'
import { ROUTES } from '@/app/routes'
import { Button, Modal } from '@/shared/ui'

/**
 * Botón discreto al pie del sidebar. Antes de cada ensayo o presentación:
 * un click y la demo vuelve al estado inicial con fechas frescas.
 */
export function ReiniciarDemo() {
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navegar = useNavigate()

  async function confirmar() {
    setCargando(true)
    setError(null)
    try {
      await reiniciarDemo()
      setAbierto(false)
      navegar(ROUTES.inicio)
      window.location.reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo reiniciar')
      setCargando(false)
    }
  }

  return (
    <>
      <button onClick={() => setAbierto(true)} title={`Modo: ${MODO_DEMO}`}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-muted transition hover:text-ink">
        <RotateCcw size={12} /> Reiniciar demo
      </button>
      <Modal abierto={abierto} onCerrar={() => !cargando && setAbierto(false)} titulo="¿Reiniciar la demo?"
             descripcion="Vuelve al estado inicial: 7 documentos, 4 vínculos, traspaso en el paso 4, sin liquidaciones."
             pie={
               <>
                 <Button variante="secundario" onClick={() => setAbierto(false)} disabled={cargando}>Cancelar</Button>
                 <Button variante="peligro" onClick={confirmar} cargando={cargando}>Sí, reiniciar</Button>
               </>
             }>
        <p className="text-sm text-ink-secondary">
          Las fechas se recalculan desde ahora ("hace 2 horas", "vence en 8 días"). Modo actual: <strong>{MODO_DEMO}</strong>.
        </p>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </Modal>
    </>
  )
}
