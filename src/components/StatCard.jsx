const TONE = {
  ink: 'text-ink',
  teal: 'text-teal',
  amber: 'text-amber',
  rust: 'text-rust',
  denim: 'text-denim',
}

export default function StatCard({ label, value, sublabel, tone = 'ink' }) {
  return (
    <div className="rounded-md border border-line bg-surface p-4 animate-dash-in">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft/50">{label}</div>
      <div className={`mt-1.5 font-display text-[28px] font-semibold leading-none ${TONE[tone]}`}>{value}</div>
      {sublabel && <div className="mt-1.5 text-xs text-ink-soft/60">{sublabel}</div>}
    </div>
  )
}
