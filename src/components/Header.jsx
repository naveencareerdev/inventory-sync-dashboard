function CrateMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <defs>
        <linearGradient id="crate-gradient" x1="2" x2="30" y1="6" y2="28">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="2" y="6" width="28" height="22" rx="7" fill="url(#crate-gradient)" />
      <path d="M2 13 L16 6 L30 13" fill="none" stroke="#fef3c7" strokeWidth="2" strokeLinejoin="round" />
      <line x1="16" y1="6" x2="16" y2="28" stroke="#fff" strokeWidth="1.5" opacity="0.38" />
      <line x1="2" y1="13" x2="30" y2="13" stroke="#fff" strokeWidth="1.5" opacity="0.38" />
    </svg>
  )
}

export default function Header({ lastSyncAt }) {
  return (
    <header className="glass-header border-b border-white/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="floating-orb"><CrateMark /></div>
          <div>
            <h1 className="font-display text-xl font-bold leading-tight tracking-tight text-ink sm:text-2xl">
              StockManifest
            </h1>
            <p className="text-xs font-medium text-ink-soft/70">Multi-store inventory synchronization</p>
          </div>
        </div>

        <div className="hidden shrink-0 rounded-2xl border border-white/80 bg-white/75 px-3.5 py-2 shadow-sm sm:block">
          <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-soft/45">
            Last Sync
          </div>
          <div className="font-mono text-[11px] font-medium text-ink">
            {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'Not yet run'}
          </div>
        </div>
      </div>
    </header>
  )
}
