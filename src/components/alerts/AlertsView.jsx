import StoreTag from '../StoreTag'

export default function AlertsView({ rows, threshold, onThresholdChange }) {
  const criticalLine = Math.max(2, Math.floor(threshold / 2))
  const lowStock = rows
    .filter((r) => r.matched && r.onHandAfter <= threshold)
    .sort((a, b) => a.onHandAfter - b.onHandAfter)

  if (!rows.length) {
    return (
      <div className="animate-dash-in rounded-md border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-display text-sm font-semibold text-ink">No sync data yet</p>
        <p className="mt-1 text-xs text-ink-soft/60">Run a sync from the Sync tab to see low-stock alerts.</p>
      </div>
    )
  }

  return (
    <div className="animate-dash-in space-y-4">
      <div className="panel-card flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white bg-surface/90 p-5">
        <div>
          <h2 className="font-display text-base font-bold text-ink">Low-stock threshold</h2>
          <p className="mt-0.5 text-xs text-ink-soft/55">Items at or below this many units on hand are flagged.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={2}
            max={30}
            value={threshold}
            onChange={(e) => onThresholdChange(Number(e.target.value))}
            className="w-40 accent-denim"
          />
          <span className="w-10 rounded-lg bg-denim-soft py-1 text-center font-mono text-sm font-semibold text-denim">{threshold}</span>
        </div>
      </div>

      {lowStock.length === 0 ? (
        <div className="panel-card rounded-2xl border border-teal/25 bg-teal-soft/70 p-6 text-center">
          <p className="font-display text-sm font-semibold text-teal">All clear</p>
          <p className="mt-1 text-xs text-ink-soft/60">No items are at or below {threshold} units.</p>
        </div>
      ) : (
        <div className="panel-card overflow-hidden rounded-2xl border border-white bg-surface/90">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-indigo-50/55 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft/55">
                <th className="border-b border-line px-3 py-2 font-medium">Severity</th>
                <th className="border-b border-line px-3 py-2 font-medium">Store</th>
                <th className="border-b border-line px-3 py-2 font-medium">SKU</th>
                <th className="border-b border-line px-3 py-2 font-medium">Title</th>
                <th className="border-b border-line px-3 py-2 text-right font-medium">On hand</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((r, i) => {
                const isCritical = r.onHandAfter <= criticalLine
                return (
                  <tr key={`${r.store}-${r.sku}-${i}`} className="border-b border-line/60 last:border-0">
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-[3px] px-1.5 py-0.5 text-[10px] font-semibold ${
                          isCritical ? 'bg-rust-soft text-rust' : 'bg-amber-soft text-amber'
                        }`}
                      >
                        {isCritical ? 'Critical' : 'Warning'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <StoreTag code={r.store} status={isCritical ? 'critical' : 'warning'} compact />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-ink">{r.sku}</td>
                    <td className="px-3 py-2 text-xs text-ink-soft/80">{r.title || '—'}</td>
                    <td className="px-3 py-2 text-right font-mono text-sm font-semibold text-ink">
                      {r.onHandAfter}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
