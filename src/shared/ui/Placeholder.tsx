/** Página vacía temporal. Reemplazar por la feature real en src/features/<nombre>. */
export function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-card border border-border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-ink-muted">
        Esta vista todavía no está implementada. Ver <code>docs/SPEC.md</code>.
      </p>
    </div>
  )
}
