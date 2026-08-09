import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import StatCard from '../StatCard'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend)

const COLORS = {
  ink: '#14181F',
  amber: '#E8A33D',
  teal: '#2F8F6F',
  rust: '#C4432E',
  denim: '#3A5A8C',
  line: '#D9DEE5',
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'IBM Plex Mono', size: 11 } } },
    y: { grid: { color: COLORS.line }, ticks: { font: { size: 11 } } },
  },
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } },
  cutout: '65%',
}

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    y: { grid: { color: COLORS.line }, ticks: { font: { size: 11 }, precision: 0 } },
  },
}

export default function DashboardView({ stats, auditLog, threshold }) {
  const hasData = Boolean(stats) && stats.totalItems > 0

  const byStoreData = useMemo(() => {
    if (!stats) return null
    const sorted = [...stats.byStore].sort((a, b) => a.store.localeCompare(b.store))
    return {
      labels: sorted.map((s) => s.store),
      datasets: [
        {
          label: 'Units on hand',
          data: sorted.map((s) => s.units),
          backgroundColor: COLORS.denim,
          borderRadius: 3,
          maxBarThickness: 36,
        },
      ],
    }
  }, [stats])

  const matchData = useMemo(() => {
    if (!stats) return null
    return {
      labels: ['Matched', 'Unmatched'],
      datasets: [
        {
          data: [stats.matchedCount, stats.unmatchedCount],
          backgroundColor: [COLORS.teal, COLORS.rust],
          borderWidth: 0,
        },
      ],
    }
  }, [stats])

  const historyData = useMemo(() => {
    const entries = [...auditLog].reverse().slice(-12)
    return {
      labels: entries.map((e) =>
        new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ),
      datasets: [
        {
          label: 'Items processed',
          data: entries.map((e) => e.totalItems),
          borderColor: COLORS.ink,
          backgroundColor: COLORS.ink,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    }
  }, [auditLog])

  if (!hasData) {
    return (
      <div className="animate-dash-in rounded-md border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-display text-sm font-semibold text-ink">No sync data yet</p>
        <p className="mt-1 text-xs text-ink-soft/60">Run a sync from the Sync tab to populate the dashboard.</p>
      </div>
    )
  }

  return (
    <div className="animate-dash-in space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Items synced" value={stats.totalItems} tone="ink" />
        <StatCard label="Match rate" value={`${stats.matchRate}%`} tone="teal" />
        <StatCard label="Low stock" value={stats.lowStockCount} tone="amber" sublabel={`≤ ${threshold} units`} />
        <StatCard label="Critical" value={stats.criticalCount} tone="rust" sublabel="needs reorder now" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-md border border-line bg-surface p-4 lg:col-span-2">
          <h3 className="font-display text-sm font-semibold text-ink">Inventory by store</h3>
          <div className="mt-3 h-64">
            <Bar data={byStoreData} options={barOptions} />
          </div>
        </div>
        <div className="rounded-md border border-line bg-surface p-4">
          <h3 className="font-display text-sm font-semibold text-ink">Match status</h3>
          <div className="mt-3 flex h-64 items-center justify-center">
            <Doughnut data={matchData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-line bg-surface p-4">
        <h3 className="font-display text-sm font-semibold text-ink">Sync history</h3>
        <p className="text-xs text-ink-soft/50">
          Items processed per run, most recent {historyData.labels.length || 0} syncs.
        </p>
        <div className="mt-3 h-56">
          <Line data={historyData} options={lineOptions} />
        </div>
      </div>
    </div>
  )
}
