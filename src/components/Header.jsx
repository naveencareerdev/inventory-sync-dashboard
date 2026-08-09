function CrateMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <rect x="2" y="6" width="28" height="22" rx="2" className="fill-ink" />
      <path d="M2 13 L16 6 L30 13" fill="none" stroke="#E8A33D" strokeWidth="2" strokeLinejoin="round" />
      <line x1="16" y1="6" x2="16" y2="28" stroke="#EEF1F4" strokeWidth="1.5" opacity="0.35" />
      <line x1="2" y1="13" x2="30" y2="13" stroke="#EEF1F4" strokeWidth="1.5" opacity="0.35" />
    </svg>
  )
}

export default function Header({ lastSyncAt }) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <CrateMark />
          <div>
            <h1 className="font-display text-lg font-semibold leading-tight text-ink sm:text-xl">
              StockManifest
            </h1>
            <p className="text-xs text-ink-soft/60">Multi-store inventory synchronization</p>
          </div>
        </div>

        <div className="hidden shrink-0 -rotate-1 rounded-sm border border-dashed border-line px-3 py-1.5 sm:block">
          <div className="text-[9px] font-semibold uppercase tracking-widest text-ink-soft/40">
            Last Sync
          </div>
          <div className="font-mono text-xs font-medium text-ink">
            {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'Not yet run'}
          </div>
        </div>
      </div>
    </header>
  )
}
