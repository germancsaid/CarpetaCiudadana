/**
 * Check que dibuja su trazo (stroke-dashoffset) en vez de aparecer de golpe.
 * Para micro-confirmaciones: documento verificado, paso completado.
 */
export function CheckAnimado({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none" className={className} aria-hidden>
      <circle cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="2.5" strokeDasharray="160" strokeDashoffset="160"
              style={{ animation: 'trazo 500ms var(--ease-suave) forwards' }} />
      <path d="M15 27l7 7 15-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="40" strokeDashoffset="40" style={{ animation: 'trazo 350ms var(--ease-suave) 350ms forwards' }} />
      <style>{`@keyframes trazo { to { stroke-dashoffset: 0 } }`}</style>
    </svg>
  )
}
