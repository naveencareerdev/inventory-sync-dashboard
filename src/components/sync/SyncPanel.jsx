import UploadSlot from './UploadSlot'
import ResultsTable from './ResultsTable'

export default function SyncPanel({
  vendors,
  stores,
  vendorFeedText,
  storeExportText,
  onVendorFile,
  onStoreFile,
  onLoadSample,
  onRunSync,
  onReset,
  isSyncing,
  loadingSample,
  canSync,
  results,
  onDownloadStore,
  onDownloadAll,
}) {
  return (
    <div className="animate-dash-in">
      <div className="flex flex-col gap-3 rounded-md border border-dashed border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-sm font-semibold text-ink">New here?</div>
          <p className="mt-0.5 text-xs text-ink-soft/60">
            Load bundled sample data — three vendor feeds and six store exports — to see a full sync run
            instantly, no files needed.
          </p>
        </div>
        <button
          onClick={onLoadSample}
          disabled={loadingSample}
          className="shrink-0 rounded-sm border border-denim/40 bg-denim-soft px-3 py-2 text-xs font-semibold text-denim disabled:opacity-50"
        >
          {loadingSample ? 'Loading sample data…' : 'Load sample data'}
        </button>
      </div>

      <section className="mt-6">
        <h2 className="font-display text-sm font-semibold text-ink">1. Vendor stock feeds</h2>
        <p className="mt-0.5 text-xs text-ink-soft/50">
          Each vendor ships CSVs in their own format — the sync engine maps every vendor's columns to a
          common schema before matching.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {vendors.map((v) => (
            <UploadSlot
              key={v.id}
              code={v.id.slice(0, 3).toUpperCase()}
              name={v.name}
              sublabel={v.category}
              hasFile={Boolean(vendorFeedText[v.id])}
              onFile={(file) => onVendorFile(v.id, file)}
            />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-sm font-semibold text-ink">2. Store exports</h2>
        <p className="mt-0.5 text-xs text-ink-soft/50">
          Current on-hand counts per storefront, as exported from the storefront platform.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {stores.map((s) => (
            <UploadSlot
              key={s.code}
              code={s.code}
              name={s.name}
              hasFile={Boolean(storeExportText[s.code])}
              onFile={(file) => onStoreFile(s.code, file)}
            />
          ))}
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={onRunSync}
          disabled={!canSync || isSyncing}
          className="rounded-sm bg-ink px-4 py-2.5 text-sm font-semibold text-canvas transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {isSyncing ? 'Syncing…' : '⚡ Run Sync'}
        </button>
        <button
          onClick={onReset}
          className="rounded-sm border border-line px-4 py-2.5 text-sm font-medium text-ink-soft/70 hover:border-rust/40 hover:text-rust"
        >
          Clear files
        </button>
        {!canSync && (
          <span className="text-xs text-ink-soft/50">Load at least one vendor feed and one store export.</span>
        )}
      </div>

      <ResultsTable rows={results} onDownloadStore={onDownloadStore} onDownloadAll={onDownloadAll} />
    </div>
  )
}
