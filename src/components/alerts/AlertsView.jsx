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
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-line bg-surface p-4">
        <div>
          <h2 className="font-display text-sm font-semibold text-ink">Low-stock threshold</h2>
          <p className="text-xs text-ink-soft/50">Items at or below this many units on hand are flagged.</p>
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
          <span className="w-10 text-right font-mono text-sm font-semibold text-ink">{threshold}</span>
        </div>
      </div>

      {lowStock.length === 0 ? (
        <div className="rounded-md border border-teal/30 bg-teal-soft/40 p-6 text-center">
          <p className="font-display text-sm font-semibold text-teal">All clear</p>
          <p className="mt-1 text-xs text-ink-soft/60">No items are at or below {threshold} units.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-line bg-surface">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-ink-soft/50">
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
