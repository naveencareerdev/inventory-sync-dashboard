const TABS = [
  { id: 'sync', label: 'Sync' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'audit', label: 'Audit Log' },
]

export default function NavTabs({ active, onChange, alertCount = 0 }) {
  return (
    <nav className="nav-glass border-b border-white/70">
      <div className="mx-auto flex max-w-7xl gap-1 px-4 py-2 sm:px-6">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                isActive ? 'bg-ink text-white shadow-lg shadow-indigo-900/15' : 'text-ink-soft/60 hover:bg-white/80 hover:text-ink'
              }`}
            >
              {tab.label}
              {tab.id === 'alerts' && alertCount > 0 && (
                <span className="rounded-full bg-amber px-1.5 py-0.5 text-[10px] font-bold leading-none text-ink">
                  {alertCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
