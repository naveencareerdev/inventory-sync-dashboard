const TONE = {
  ink: 'text-ink',
  teal: 'text-teal',
  amber: 'text-amber',
  rust: 'text-rust',
  denim: 'text-denim',
}

export default function StatCard({ label, value, sublabel, tone = 'ink' }) {
  return (
    <div className="panel-card animate-dash-in rounded-2xl border border-white bg-surface/90 p-4 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft/50">{label}</div>
      <div className={`mt-2 font-display text-[30px] font-bold leading-none ${TONE[tone]}`}>{value}</div>
      {sublabel && <div className="mt-2 text-xs font-medium text-ink-soft/65">{sublabel}</div>}
    </div>
  )
}
