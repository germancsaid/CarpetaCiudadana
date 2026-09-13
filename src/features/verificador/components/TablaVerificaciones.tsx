import { Download } from 'lucide-react'
import type { Verificacion } from '@/shared/types/domain'
import { formatFechaHora } from '@/shared/lib/format'
import { Button, Card, CardHeader } from '@/shared/ui'

const RESULTADO: Record<Verificacion['resultado'], { texto: string; clases: string }> = {
  valido: { texto: 'Válido', clases: 'bg-success-light text-success-text' },
  invalido: { texto: 'Inválido', clases: 'bg-danger-light text-danger-text' },
  vencido: { texto: 'Vencido', clases: 'bg-warning-light text-warning-text' },
}

export function TablaVerificaciones({ lista }: { lista: Verificacion[] }) {
  function exportar() {
    const cab = ['Fecha/hora', 'Token ID', 'Ciudadano CI', 'Tipo', 'Resultado', 'Funcionario']
    const filas = lista.map((v) => [formatFechaHora(v.verificadoEn), v.tokenId, v.ciudadanoCi, v.tipo, RESULTADO[v.resultado].texto, v.funcionario])
    const csv = [cab, ...filas].map((f) => f.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n')
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `verificaciones-${new Date().toISOString().slice(0, 10)}.csv` })
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader titulo="Verificaciones recientes" descripcion="Se actualiza en tiempo real."
                  accion={<Button tamano="sm" variante="secundario" iconoIzq={<Download size={14} />} onClick={exportar}>Exportar CSV</Button>} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-page text-left text-xs text-ink-muted uppercase">
            <tr>
              {['Fecha/hora', 'Token ID', 'Ciudadano', 'Tipo', 'Resultado', 'Funcionario'].map((h) => <th key={h} className="px-5 py-3 font-medium whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {lista.map((v) => (
              <tr key={v.id} className="border-t border-border">
                <td className="px-5 py-3 whitespace-nowrap text-ink-secondary">{formatFechaHora(v.verificadoEn)}</td>
                <td className="px-5 py-3 font-mono whitespace-nowrap text-ink">{v.tokenId}</td>
                <td className="px-5 py-3 whitespace-nowrap">{v.ciudadanoCi}</td>
                <td className="px-5 py-3">{v.tipo}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${RESULTADO[v.resultado].clases}`}>{RESULTADO[v.resultado].texto}</span></td>
                <td className="px-5 py-3 whitespace-nowrap">{v.funcionario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
