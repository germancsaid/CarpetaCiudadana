import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, Search, X, AlertTriangle, ChevronRight, FileText, Link2 } from 'lucide-react'
import { ROUTES } from '@/app/routes'
import { textoVencimiento } from '@/shared/lib/vencimientos'
import { documentosRepo } from '@/services/documentos'
import { vinculosRepo } from '@/services/vinculos'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'
import { NAV } from './nav'

interface Notificacion {
  id: string
  texto: string
  accion?: { etiqueta: string; to: string }
}

/** Notificaciones derivadas de los vencimientos reales de documentos y vínculos. */
async function calcularNotificaciones(): Promise<Notificacion[]> {
  const [docs, vinculos] = await Promise.all([
    documentosRepo.listar(CIUDADANO_ACTUAL.id),
    vinculosRepo.listar(CIUDADANO_ACTUAL.id),
  ])
  const lista: Notificacion[] = []
  for (const v of vinculos) {
    if (v.estado === 'por_vencer')
      lista.push({ id: `v-${v.id}`, texto: `${nombreCorto(v.tipoDocumento)} ${textoVencimiento(v.venceEn).toLowerCase()}`, accion: { etiqueta: 'Renovar', to: ROUTES.vinculos } })
  }
  for (const d of docs) {
    if (d.estado === 'por_vencer')
      lista.push({ id: `d-${d.id}`, texto: `${d.nombre} ${textoVencimiento(d.venceEn).toLowerCase()}`, accion: { etiqueta: 'Ver', to: ROUTES.vault } })
    else if (d.estado === 'vencido')
      lista.push({ id: `d-${d.id}`, texto: `${d.nombre} está vencido`, accion: { etiqueta: 'Renovar', to: ROUTES.vault } })
  }
  return lista
}

/** "Certificado de Libre Gravamen — Placa 2345-SCC" → "Cert. de Libre Gravamen" */
function nombreCorto(tipo: string): string {
  return tipo.split(' — ')[0].replace('Certificado', 'Cert.')
}

interface Resultado {
  id: string
  nombre: string
  tipo: 'documento' | 'vinculo'
  to: string
}

export function TopBar() {
  const { pathname } = useLocation()
  const item = NAV.find((n) => n.to === pathname)
  const titulo = item?.titulo ?? 'CarpetaCiudadana'

  return (
    <header className="vidrio sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-8">
      <div>
        <div className="flex items-center gap-1 text-xs text-ink-muted">
          <span>CarpetaCiudadana</span>
          <ChevronRight size={12} />
          <span>{item?.label ?? ''}</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-ink">{titulo}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Buscador />
        <Notificaciones />
      </div>
    </header>
  )
}

function Buscador() {
  const [texto, setTexto] = useState('')
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const q = texto.trim().toLowerCase()
    if (q.length < 2) {
      setResultados([])
      return
    }
    let vigente = true
    Promise.all([
      documentosRepo.listar(CIUDADANO_ACTUAL.id),
      vinculosRepo.listar(CIUDADANO_ACTUAL.id),
    ]).then(([docs, vinculos]) => {
      if (!vigente) return
      const r: Resultado[] = [
        ...docs
          .filter((d) => d.nombre.toLowerCase().includes(q))
          .map((d) => ({ id: d.id, nombre: d.nombre, tipo: 'documento' as const, to: ROUTES.vault })),
        ...vinculos
          .filter((v) => v.tipoDocumento.toLowerCase().includes(q) || v.tokenId.toLowerCase().includes(q))
          .map((v) => ({ id: v.id, nombre: v.tipoDocumento, tipo: 'vinculo' as const, to: ROUTES.vinculos })),
      ]
      setResultados(r.slice(0, 6))
    })
    return () => {
      vigente = false
    }
  }, [texto])

  useEffect(() => {
    const cerrar = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener('mousedown', cerrar)
    return () => document.removeEventListener('mousedown', cerrar)
  }, [])

  return (
    <div ref={contenedor} className="relative">
      <div className="flex min-h-10 items-center gap-2 rounded-control border border-border bg-page px-3">
        <Search size={16} className="text-ink-muted" />
        <input
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value)
            setAbierto(true)
          }}
          onFocus={() => setAbierto(true)}
          placeholder="Buscar documentos o tokens"
          className="w-40 bg-transparent text-sm outline-none placeholder:text-ink-muted md:w-56"
        />
      </div>
      {abierto && texto.trim().length >= 2 && (
        <div className="absolute right-0 z-50 mt-1 w-80 overflow-hidden rounded-card border border-border bg-card shadow-lg">
          {resultados.length === 0 ? (
            <div className="p-3 text-sm text-ink-muted">Sin resultados para "{texto}"</div>
          ) : (
            resultados.map((r) => (
              <Link
                key={r.id}
                to={r.to}
                onClick={() => {
                  setAbierto(false)
                  setTexto('')
                }}
                className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-page"
              >
                {r.tipo === 'documento' ? (
                  <FileText size={16} className="shrink-0 text-accent" />
                ) : (
                  <Link2 size={16} className="shrink-0 text-success" />
                )}
                <span className="truncate">{r.nombre}</span>
                <span className="ml-auto shrink-0 text-xs text-ink-muted">
                  {r.tipo === 'documento' ? 'Documento' : 'Vínculo'}
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function Notificaciones() {
  const [lista, setLista] = useState<Notificacion[]>([])
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let vigente = true
    calcularNotificaciones().then((n) => vigente && setLista(n)).catch(() => {})
    return () => {
      vigente = false
    }
  }, [])

  useEffect(() => {
    const cerrar = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener('mousedown', cerrar)
    return () => document.removeEventListener('mousedown', cerrar)
  }, [])

  return (
    <div ref={contenedor} className="relative">
      <button
        onClick={() => setAbierto((a) => !a)}
        aria-label="Notificaciones"
        className="relative flex size-10 items-center justify-center rounded-control text-ink-secondary transition hover:bg-page"
      >
        <Bell size={20} />
        {lista.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            {lista.length}
          </span>
        )}
      </button>
      {abierto && (
        <div className="absolute right-0 z-50 mt-1 w-80 overflow-hidden rounded-card border border-border bg-card shadow-lg">
          <div className="border-b border-border px-4 py-2.5 text-sm font-semibold">Notificaciones</div>
          {lista.length === 0 ? (
            <div className="p-4 text-sm text-ink-muted">No tenés notificaciones pendientes.</div>
          ) : (
            lista.map((n) => (
              <div key={n.id} className="flex items-start gap-3 border-b border-border px-4 py-3 last:border-0">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
                <div className="flex-1 text-sm">
                  <div className="text-ink">{n.texto}</div>
                  {n.accion && (
                    <Link
                      to={n.accion.to}
                      onClick={() => setAbierto(false)}
                      className="mt-1 inline-block text-xs font-medium text-accent-text hover:underline"
                    >
                      {n.accion.etiqueta} →
                    </Link>
                  )}
                </div>
                <button
                  onClick={() => setLista((l) => l.filter((x) => x.id !== n.id))}
                  aria-label="Descartar"
                  className="text-ink-muted hover:text-ink"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
