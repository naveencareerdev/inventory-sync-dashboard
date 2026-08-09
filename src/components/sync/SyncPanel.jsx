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
      <div className="panel-card relative overflow-hidden rounded-2xl border border-white bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white sm:flex sm:items-center sm:justify-between">
        <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-amber/30 blur-2xl" />
        <div>
          <div className="font-display text-base font-bold">Ready to see it work?</div>
          <p className="mt-1 max-w-2xl text-xs font-medium leading-relaxed text-white/80">
            Load bundled sample data — three vendor feeds and six store exports — to see a full sync run
            instantly, no files needed.
          </p>
        </div>
        <button
          onClick={onLoadSample}
          disabled={loadingSample}
          className="relative shrink-0 rounded-xl bg-white px-3.5 py-2.5 text-xs font-bold text-denim shadow-lg shadow-indigo-950/20 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loadingSample ? 'Loading sample data…' : 'Load sample data'}
        </button>
      </div>

      <section className="mt-6">
        <h2 className="font-display text-base font-bold text-ink">1. Vendor stock feeds</h2>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft/60">
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
        <h2 className="font-display text-base font-bold text-ink">2. Store exports</h2>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft/60">
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
          className="rounded-xl bg-gradient-to-r from-denim to-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-40"
        >
          {isSyncing ? 'Syncing…' : '⚡ Run Sync'}
        </button>
        <button
          onClick={onReset}
          className="rounded-xl border border-white bg-white/70 px-4 py-2.5 text-sm font-semibold text-ink-soft/70 shadow-sm transition-colors hover:border-rust/30 hover:text-rust"
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
