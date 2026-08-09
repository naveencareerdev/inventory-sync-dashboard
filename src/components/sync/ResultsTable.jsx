import { useMemo, useState } from 'react'
import StoreTag from '../StoreTag'

export default function ResultsTable({ rows, onDownloadStore, onDownloadAll }) {
  const [filter, setFilter] = useState('all')

  const storeCodes = useMemo(() => [...new Set(rows.map((r) => r.store))], [rows])
  const visibleRows = filter === 'all' ? rows : rows.filter((r) => r.store === filter)

  if (!rows.length) return null

  return (
    <div className="mt-6 rounded-md border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-[3px] border px-2 py-1 font-mono text-[11px] font-semibold ${
              filter === 'all' ? 'border-ink bg-ink text-canvas' : 'border-line text-ink-soft/60'
            }`}
          >
            ALL
          </button>
          {storeCodes.map((code) => (
            <button key={code} onClick={() => setFilter(code)}>
              <StoreTag code={code} status={filter === code ? 'ok' : 'idle'} compact />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {filter !== 'all' && (
            <button
              onClick={() => onDownloadStore(filter)}
              className="rounded-sm border border-line px-2.5 py-1 text-xs font-medium text-ink hover:border-denim/40"
            >
              Download {filter}.csv
            </button>
          )}
          <button
            onClick={onDownloadAll}
            className="rounded-sm bg-ink px-2.5 py-1 text-xs font-medium text-canvas hover:bg-ink-soft"
          >
            Download all (.zip)
          </button>
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-surface">
            <tr className="text-[11px] uppercase tracking-wider text-ink-soft/50">
              <th className="border-b border-line px-3 py-2 font-medium">Store</th>
              <th className="border-b border-line px-3 py-2 font-medium">SKU</th>
              <th className="border-b border-line px-3 py-2 font-medium">Title</th>
              <th className="border-b border-line px-3 py-2 text-right font-medium">Before</th>
              <th className="border-b border-line px-3 py-2 text-right font-medium">After</th>
              <th className="border-b border-line px-3 py-2 text-right font-medium">Δ</th>
              <th className="border-b border-line px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r, i) => (
              <tr key={`${r.store}-${r.sku}-${i}`} className="border-b border-line/60 last:border-0">
                <td className="px-3 py-1.5 font-mono text-xs text-ink-soft/70">{r.store}</td>
                <td className="px-3 py-1.5 font-mono text-xs text-ink">{r.sku}</td>
                <td className="px-3 py-1.5 text-xs text-ink-soft/80">{r.title || '—'}</td>
                <td className="px-3 py-1.5 text-right font-mono text-xs text-ink-soft/60">{r.onHandBefore}</td>
                <td className="px-3 py-1.5 text-right font-mono text-xs font-semibold text-ink">{r.onHandAfter}</td>
                <td
                  className={`px-3 py-1.5 text-right font-mono text-xs font-medium ${
                    r.delta > 0 ? 'text-teal' : r.delta < 0 ? 'text-rust' : 'text-ink-soft/40'
                  }`}
                >
                  {r.delta > 0 ? `+${r.delta}` : r.delta}
                </td>
                <td className="px-3 py-1.5">
                  <span
                    className={`rounded-[3px] px-1.5 py-0.5 text-[10px] font-semibold ${
                      r.matched ? 'bg-teal-soft text-teal' : 'bg-rust-soft text-rust'
                    }`}
                  >
                    {r.matched ? 'Matched' : 'Unmatched'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
