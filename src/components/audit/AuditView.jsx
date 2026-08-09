export default function AuditView({ log, onClear }) {
  if (!log.length) {
    return (
      <div className="animate-dash-in rounded-md border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-display text-sm font-semibold text-ink">No sync history yet</p>
        <p className="mt-1 text-xs text-ink-soft/60">
          Every sync run gets logged here, persisted in your browser.
        </p>
      </div>
    )
  }

  return (
    <div className="animate-dash-in space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-ink-soft/55">
          {log.length} sync run{log.length === 1 ? '' : 's'} recorded — stored locally in this browser.
        </p>
        <button
          onClick={onClear}
          className="rounded-lg border border-line bg-white/75 px-2.5 py-1.5 text-xs font-semibold text-ink-soft/60 shadow-sm transition-colors hover:border-rust/40 hover:text-rust"
        >
          Clear log
        </button>
      </div>
      <div className="panel-card overflow-hidden rounded-2xl border border-white bg-surface/90">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-indigo-50/55 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft/55">
              <th className="border-b border-line px-3 py-2 font-medium">Time</th>
              <th className="border-b border-line px-3 py-2 font-medium">Vendors</th>
              <th className="border-b border-line px-3 py-2 font-medium">Stores</th>
              <th className="border-b border-line px-3 py-2 text-right font-medium">Items</th>
              <th className="border-b border-line px-3 py-2 text-right font-medium">Matched</th>
              <th className="border-b border-line px-3 py-2 text-right font-medium">Low stock</th>
            </tr>
          </thead>
          <tbody>
            {log.map((entry) => (
              <tr key={entry.id} className="border-b border-line/60 last:border-0">
                <td className="px-3 py-2 font-mono text-xs text-ink-soft/70">
                  {new Date(entry.timestamp).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-xs text-ink-soft/80">{entry.vendors.join(', ') || '—'}</td>
                <td className="px-3 py-2 text-xs text-ink-soft/80">{entry.stores.join(', ') || '—'}</td>
                <td className="px-3 py-2 text-right font-mono text-xs text-ink">{entry.totalItems}</td>
                <td className="px-3 py-2 text-right font-mono text-xs text-teal">{entry.matchRate}%</td>
                <td className="px-3 py-2 text-right font-mono text-xs text-amber">{entry.lowStockCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
