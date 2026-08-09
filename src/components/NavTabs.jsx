const TABS = [
  { id: 'sync', label: 'Sync' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'audit', label: 'Audit Log' },
]

export default function NavTabs({ active, onChange, alertCount = 0 }) {
  return (
    <nav className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors ${
                isActive ? 'text-ink' : 'text-ink-soft/50 hover:text-ink-soft'
              }`}
            >
              {tab.label}
              {tab.id === 'alerts' && alertCount > 0 && (
                <span className="rounded-full bg-amber px-1.5 py-0.5 text-[10px] font-semibold leading-none text-ink">
                  {alertCount}
                </span>
              )}
              {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-ink" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
