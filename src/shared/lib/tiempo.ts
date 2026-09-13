/** "hace 2 horas" · "ayer" · "hace 3 días" · "hace 1 semana". Para feeds y timestamps. */
export function haceCuanto(iso: string | null | undefined): string {
  if (!iso) return '—'
  const seg = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  const min = Math.floor(seg / 60)
  const h = Math.floor(min / 60)
  const d = Math.floor(h / 24)
  if (min < 1) return 'recién'
  if (min < 60) return `hace ${min} min`
  if (h < 24) return `hace ${h} ${h === 1 ? 'hora' : 'horas'}`
  if (d === 1) return 'ayer'
  if (d < 7) return `hace ${d} días`
  const sem = Math.floor(d / 7)
  if (sem < 5) return `hace ${sem} ${sem === 1 ? 'semana' : 'semanas'}`
  const meses = Math.floor(d / 30)
  return `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`
}

export function saludo(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}
