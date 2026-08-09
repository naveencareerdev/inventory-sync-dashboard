const STATUS = {
  idle: { dot: 'bg-line', border: 'border-line' },
  loaded: { dot: 'bg-denim', border: 'border-denim/40' },
  ok: { dot: 'bg-teal', border: 'border-teal/40' },
  warning: { dot: 'bg-amber', border: 'border-amber/50' },
  critical: { dot: 'bg-rust', border: 'border-rust/50' },
}

/**
 * A small manifest-tag badge: monospace code, status dot, optional name.
 * Used for vendors and stores everywhere in the app so a store's status
 * reads the same in the upload grid, the alerts table, and the audit log.
 */
export default function StoreTag({ code, name, status = 'idle', compact = false }) {
  const c = STATUS[status] || STATUS.idle
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[3px] border ${c.border} bg-surface px-2 py-[3px] leading-none`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} aria-hidden="true" />
      <span className="font-mono text-[11px] font-semibold tracking-wide text-ink">{code}</span>
      {!compact && name && <span className="font-sans text-[11px] text-ink-soft/60">{name}</span>}
    </span>
  )
}
