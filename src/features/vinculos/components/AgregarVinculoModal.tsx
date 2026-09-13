import { useState, type FormEvent } from 'react'
import type { Emisor } from '@/shared/types/domain'
import { vinculosRepo } from '@/services/vinculos'
import { CIUDADANO_ACTUAL } from '@/services/ciudadanos'
import { esperar, DEMORA, generarTokenId } from '@/shared/lib/simular'
import { estadoVinculoPorVencimiento } from '@/shared/lib/vencimientos'
import { Button, Campo, Input, Modal, Select } from '@/shared/ui'

interface Props {
  abierto: boolean
  emisores: Emisor[]
  onCerrar: () => void
  onAgregado: () => void
}

const TIPOS = ['Contrato', 'Poder notarial', 'Escritura', 'Cert. libre gravamen', 'Due diligence', 'Otro']
const CERTIFICANTES = ['Alcaldía Santa Cruz', 'Gobernación Santa Cruz', 'Ministerio de Justicia', 'Colegio de Abogados']

interface Campos { emisor: string; tipo: string; token: string; vence: string; certificante: string }
type Errores = Partial<Record<keyof Campos, string>>

const VACIO: Campos = { emisor: '', tipo: '', token: '', vence: '', certificante: '' }

function validar(c: Campos): Errores {
  const e: Errores = {}
  if (c.emisor.trim().length < 3) e.emisor = 'Ingresá el nombre del emisor.'
  if (!c.tipo) e.tipo = 'Elegí un tipo de documento.'
  if (!/^(TOK-\d{4}-\d{5}|https?:\/\/\S+)$/i.test(c.token.trim())) e.token = 'Formato inválido. Usá TOK-2026-XXXXX o una URL.'
  if (!c.vence) e.vence = 'Indicá la fecha de vencimiento.'
  else if (new Date(c.vence) < new Date()) e.vence = 'La fecha ya pasó.'
  if (!c.certificante) e.certificante = 'Elegí la organización certificante.'
  return e
}

export function AgregarVinculoModal({ abierto, emisores, onCerrar, onAgregado }: Props) {
  const [campos, setCampos] = useState<Campos>(VACIO)
  const [errores, setErrores] = useState<Errores>({})
  const [verificando, setVerificando] = useState(false)

  const set = (k: keyof Campos) => (e: { target: { value: string } }) => setCampos((c) => ({ ...c, [k]: e.target.value }))

  function cerrar() { setCampos(VACIO); setErrores({}); onCerrar() }

  async function enviar(e: FormEvent) {
    e.preventDefault()
    const errs = validar(campos)
    setErrores(errs)
    if (Object.keys(errs).length) return
    setVerificando(true)
    try {
      await esperar(DEMORA.verificacion)
      const emisorExistente = emisores.find((x) => x.nombre.toLowerCase() === campos.emisor.trim().toLowerCase())
      const tokenId = campos.token.startsWith('http') ? generarTokenId() : campos.token.trim().toUpperCase()
      const venceEn = new Date(campos.vence).toISOString()
      await vinculosRepo.crear({
        tokenId, ciudadanoId: CIUDADANO_ACTUAL.id,
        emisorId: emisorExistente?.id ?? emisores[0].id,
        tipoDocumento: `${campos.tipo} — ${campos.emisor.trim()}`,
        estado: estadoVinculoPorVencimiento(venceEn), venceEn,
        ultimaVerificacionEn: new Date().toISOString(), firma: `demo.sig.${tokenId.slice(-5)}`,
      })
      onAgregado(); cerrar()
    } finally { setVerificando(false) }
  }

  return (
    <Modal abierto={abierto} onCerrar={cerrar} titulo="Agregar vínculo" descripcion="Pegá el token que te dio tu abogado o notaría."
           pie={
             <>
               <Button variante="secundario" onClick={cerrar} disabled={verificando}>Cancelar</Button>
               <Button type="submit" form="form-vinculo" cargando={verificando}>{verificando ? 'Verificando…' : 'Verificar y agregar'}</Button>
             </>
           }>
      <form id="form-vinculo" onSubmit={enviar} className="space-y-4" noValidate>
        <Campo etiqueta="Nombre del emisor" requerido error={errores.emisor}>
          <Input value={campos.emisor} onChange={set('emisor')} error={!!errores.emisor} list="emisores" placeholder="Notaría, estudio jurídico…" />
          <datalist id="emisores">{emisores.map((e) => <option key={e.id} value={e.nombre} />)}</datalist>
        </Campo>
        <Campo etiqueta="Tipo de documento" requerido error={errores.tipo}>
          <Select value={campos.tipo} onChange={set('tipo')} error={!!errores.tipo} placeholder="Elegí un tipo"
                  opciones={TIPOS.map((t) => ({ valor: t, etiqueta: t }))} />
        </Campo>
        <Campo etiqueta="Token ID o URL del vínculo" requerido error={errores.token}>
          <Input value={campos.token} onChange={set('token')} error={!!errores.token} placeholder="TOK-2026-XXXXX o https://…" />
        </Campo>
        <Campo etiqueta="Fecha de vencimiento" requerido error={errores.vence}>
          <Input type="date" value={campos.vence} onChange={set('vence')} error={!!errores.vence} />
        </Campo>
        <Campo etiqueta="Organización certificante" requerido error={errores.certificante}>
          <Select value={campos.certificante} onChange={set('certificante')} error={!!errores.certificante} placeholder="Elegí una"
                  opciones={CERTIFICANTES.map((c) => ({ valor: c, etiqueta: c }))} />
        </Campo>
      </form>
    </Modal>
  )
}
