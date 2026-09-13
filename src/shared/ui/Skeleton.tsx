/** Placeholder de carga. Usar mientras `loading` es true, nunca dejar la vista en blanco. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-control bg-border/60 ${className}`} />
}

/** Skeleton con forma de tarjeta, para grids de documentos/tokens. */
export function SkeletonCard() {
  return (
    <div className="rounded-card border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-4 h-16 w-full" />
    </div>
  )
}
