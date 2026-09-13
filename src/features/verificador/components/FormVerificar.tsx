import { useState, type FormEvent } from 'react'
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react'
import type { Vinculo, Emisor, Ciudadano } from '@/shared/types/domain'
import { vinculosRepo } from '@/services/vinculos'
import { verificacionesRepo } from '@/services/verificaciones'
import { ciudadanosRepo } from '@/services/ciudadanos'
import { esperar, DEMORA } from '@/shared/lib/simular'
import { formatFecha, formatFechaHora, formatCi } from '@/shared/lib/format'
import { haceCuanto } from '@/shared/lib/tiempo'
import { Button, Campo, Card, Input, Select } from '@/shared/ui'

const TIPOS = ['Traspaso vehicular', 'Licencia func.', 'Contrato', 'Poder notarial', 'Otro']
const FUNCIONARIO = 'L. Ribera'
const INSTITUCION = 'Alcaldía Santa Cruz'

type Resultado =
  | { ok: true; vinculo: Vinculo; emisor?: Emisor; ciudadano: Ciudadano | null; en: string }
  | { ok: false; motivo: string; recomendacion: string }

interface Props { emisores: Emisor[]; onRegistrado: () => void }

export function FormVerificar({ emisores, onRegistrado }: Props) {
  const [token, setToken] = useState('')
  const [ci, setCi] = useState('')
  const [tipo, setTipo] = useState(TIPOS[0])
  const [errores, setErrores] = useState<{ token?: string; ci?: string }>({})
  const [verificando, setVerificando] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [registrado, setRegistrado] = useState(false)

  async function verificar(e: FormEvent) {
    e.preventDefault()
    const errs: typeof errores = {}
    if (!/^TOK-\d{4}-\d{5}$/i.test(token.trim())) errs.token = 'Formato esperado: TOK-2026-XXXXX'
    if (!/^\d{1,2}\.\d{3}\.\d{3}$/.test(ci.trim())) errs.ci = 'Formato esperado: X.XXX.XXX'
    setErrores(errs)
    if (Object.keys(errs).length) return

    setVerificando(true); setResultado(null); setRegistrado(false)
    try {
      await esperar(DEMORA.verificacion)
      const v = await vinculosRepo.buscarPorToken(token)
      if (!v) return setResultado({ ok: false, motivo: 'No existe ningún token con ese ID.', recomendacion: 'Verificá el ID con el ciudadano o el emisor.' })
      const ciudadano = await ciudadanosRepo.obtener(v.ciudadanoId)
      if (ciudadano && ciudadano.ci !== ci.trim())
        return setResultado({ ok: false, motivo: `El token no pertenece al CI ${ci}.`, recomendacion: 'Confirmá la identidad del ciudadano.' })
      if (v.estado === 'vencido' || v.estado === 'revocado')
        return setResultado({ ok: false, motivo: `Token ${v.estado} el ${formatFecha(v.venceEn)}.`, recomendacion: 'Solicitar renovación al emisor.' })
      setResultado({ ok: true, vinculo: v, emisor: emisores.find((x) => x.id === v.emisorId), ciudadano, en: new Date().toISOString() })
    } finally { setVerificando(false) }
  }

  async function registrar() {
    if (!resultado) return
    await verificacionesRepo.registrar({
      vinculoId: resultado.ok ? resultado.vinculo.id : (null as unknown as string),
      tokenId: token.trim().toUpperCase(), ciudadanoCi: ci.trim(), tipo,
      resultado: resultado.ok ? 'valido' : resultado.motivo.includes('vencido') ? 'vencido' : 'invalido',
      motivo: resultado.ok ? undefined : resultado.motivo, funcionario: FUNCIONARIO, institucion: INSTITUCION,
    })
    if (resultado.ok) await vinculosRepo.marcarVerificado(resultado.vinculo.id)
    setRegistrado(true); onRegistrado()
  }

  return (
    <Card className="mx-auto max-w-2xl p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-control bg-accent-light text-accent-text"><ShieldCheck size={20} /></div>
        <div>
          <h2 className="font-semibold text-ink">Verificar documento ciudadano</h2>
          <p className="text-sm text-ink-muted">Consulta en tiempo real contra el registro de emisores certificados.</p>
        </div>
      </div>

      <form onSubmit={verificar} noValidate className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Token ID" requerido error={errores.token}>
          <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="TOK-2026-XXXXX" error={!!errores.token} className="font-mono" />
        </Campo>
        <Campo etiqueta="CI del ciudadano" requerido error={errores.ci}>
          <Input value={ci} onChange={(e) => setCi(e.target.value)} placeholder="X.XXX.XXX" error={!!errores.ci} />
        </Campo>
        <div className="sm:col-span-2">
          <Campo etiqueta="Tipo de verificación">
            <Select value={tipo} onChange={(e) => setTipo(e.target.value)} opciones={TIPOS.map((t) => ({ valor: t, etiqueta: t }))} />
          </Campo>
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="w-full" cargando={verificando}>{verificando ? 'Consultando registro…' : 'Verificar ahora'}</Button>
        </div>
      </form>

      {resultado && (
        <div className={`mt-5 rounded-card border p-5 ${resultado.ok ? 'border-success/30 bg-success-light' : 'border-danger/30 bg-danger-light'}`}>
          {resultado.ok ? (
            <>
              <div className="flex items-center gap-2 text-lg font-semibold text-success-text"><CheckCircle2 size={22} /> Documento VÁLIDO</div>
              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <Dato k="Token" v={resultado.vinculo.tokenId} mono />
                <Dato k="Ciudadano" v={resultado.ciudadano ? `${resultado.ciudadano.nombreCompleto} — CI ${formatCi(resultado.ciudadano.ci, resultado.ciudadano.ciDepartamento)}` : '—'} />
                <Dato k="Emisor" v={resultado.emisor?.nombre ?? '—'} />
                <Dato k="Certificado por" v={resultado.emisor?.certificadoPor ?? '—'} />
                <Dato k="Tipo" v={resultado.vinculo.tipoDocumento} />
                <Dato k="Válido hasta" v={formatFecha(resultado.vinculo.venceEn)} />
                <Dato k="Última verificación" v={haceCuanto(resultado.vinculo.ultimaVerificacionEn)} />
                <Dato k="Verificado" v={formatFechaHora(resultado.en)} />
              </dl>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-lg font-semibold text-danger-text"><XCircle size={22} /> Token INVÁLIDO o vencido</div>
              <dl className="mt-4 space-y-2 text-sm">
                <Dato k="Motivo" v={resultado.motivo} />
                <Dato k="Recomendación" v={resultado.recomendacion} />
              </dl>
            </>
          )}
          <div className="mt-4">
            {registrado ? <span className="text-sm font-medium text-ink-secondary">✓ Verificación registrada en el historial</span>
                        : <Button variante="secundario" tamano="sm" onClick={registrar}>Registrar verificación</Button>}
          </div>
        </div>
      )}
    </Card>
  )
}

function Dato({ k, v, mono = false }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-ink-muted">{k}</dt>
      <dd className={`font-medium text-ink ${mono ? 'font-mono' : ''}`}>{v}</dd>
    </div>
  )
}
