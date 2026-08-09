import { useMemo, useState } from 'react'
import Header from './components/Header'
import NavTabs from './components/NavTabs'
import SyncPanel from './components/sync/SyncPanel'
import DashboardView from './components/dashboard/DashboardView'
import AlertsView from './components/alerts/AlertsView'
import AuditView from './components/audit/AuditView'
import { vendors, getVendor } from './data/vendors'
import { stores } from './data/stores'
import { parseVendorFeed, parseStoreExport, reconcileStore, indexFeedsBySku, computeStats } from './lib/csvEngine'
import { loadSampleVendorFeeds, loadSampleStoreExports } from './lib/sampleData'
import { getAuditLog, addAuditEntry, clearAuditLog } from './lib/auditLog'
import { downloadStoreCsv, downloadAllAsZip } from './lib/exportCsv'

export default function App() {
  const [activeTab, setActiveTab] = useState('sync')
  const [vendorFeedText, setVendorFeedText] = useState({})
  const [storeExportText, setStoreExportText] = useState({})
  const [results, setResults] = useState([])
  const [stats, setStats] = useState(null)
  const [lastSyncAt, setLastSyncAt] = useState(null)
  const [threshold, setThreshold] = useState(10)
  const [isSyncing, setIsSyncing] = useState(false)
  const [loadingSample, setLoadingSample] = useState(false)
  const [auditLog, setAuditLog] = useState(() => getAuditLog())

  const canSync = Object.keys(vendorFeedText).length > 0 && Object.keys(storeExportText).length > 0

  const alertCount = useMemo(
    () => results.filter((r) => r.matched && r.onHandAfter <= threshold).length,
    [results, threshold],
  )

  async function handleVendorFile(vendorId, file) {
    const text = await file.text()
    setVendorFeedText((prev) => ({ ...prev, [vendorId]: text }))
  }

  async function handleStoreFile(storeCode, file) {
    const text = await file.text()
    setStoreExportText((prev) => ({ ...prev, [storeCode]: text }))
  }

  async function handleLoadSample() {
    setLoadingSample(true)
    try {
      const [feeds, exports] = await Promise.all([loadSampleVendorFeeds(), loadSampleStoreExports()])
      setVendorFeedText(feeds)
      setStoreExportText(exports)
    } catch (err) {
      alert(`Couldn't load sample data: ${err.message}`)
    } finally {
      setLoadingSample(false)
    }
  }

  function handleReset() {
    setVendorFeedText({})
    setStoreExportText({})
    setResults([])
    setStats(null)
  }

  function handleRunSync() {
    setIsSyncing(true)
    try {
      const feeds = Object.entries(vendorFeedText).map(([id, text]) => parseVendorFeed(text, getVendor(id)))
      const feedIndex = indexFeedsBySku(feeds)

      const allResults = []
      for (const [code, text] of Object.entries(storeExportText)) {
        const storeRows = parseStoreExport(text)
        allResults.push(...reconcileStore(code, storeRows, feedIndex))
      }

      const newStats = computeStats(allResults, threshold)
      setResults(allResults)
      setStats(newStats)
      setLastSyncAt(new Date().toISOString())

      const updatedLog = addAuditEntry({
        timestamp: new Date().toISOString(),
        vendors: Object.keys(vendorFeedText).map((id) => getVendor(id)?.name || id),
        stores: Object.keys(storeExportText),
        totalItems: newStats.totalItems,
        matchRate: newStats.matchRate,
        lowStockCount: newStats.lowStockCount,
      })
      setAuditLog(updatedLog)
    } catch (err) {
      alert(`Sync failed: ${err.message}`)
    } finally {
      setIsSyncing(false)
    }
  }

  function handleDownloadStore(storeCode) {
    downloadStoreCsv(storeCode, results.filter((r) => r.store === storeCode))
  }

  function handleDownloadAll() {
    const byStore = {}
    for (const r of results) {
      byStore[r.store] = byStore[r.store] || []
      byStore[r.store].push(r)
    }
    downloadAllAsZip(byStore)
  }

  function handleClearAuditLog() {
    setAuditLog(clearAuditLog())
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Header lastSyncAt={lastSyncAt} />
      <NavTabs active={activeTab} onChange={setActiveTab} alertCount={alertCount} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {activeTab === 'sync' && (
          <SyncPanel
            vendors={vendors}
            stores={stores}
            vendorFeedText={vendorFeedText}
            storeExportText={storeExportText}
            onVendorFile={handleVendorFile}
            onStoreFile={handleStoreFile}
            onLoadSample={handleLoadSample}
            onRunSync={handleRunSync}
            onReset={handleReset}
            isSyncing={isSyncing}
            loadingSample={loadingSample}
            canSync={canSync}
            results={results}
            onDownloadStore={handleDownloadStore}
            onDownloadAll={handleDownloadAll}
          />
        )}

        {activeTab === 'dashboard' && <DashboardView stats={stats} auditLog={auditLog} threshold={threshold} />}

        {activeTab === 'alerts' && (
          <AlertsView rows={results} threshold={threshold} onThresholdChange={setThreshold} />
        )}

        {activeTab === 'audit' && <AuditView log={auditLog} onClear={handleClearAuditLog} />}
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-xs text-ink-soft/40">
          StockManifest — demo data only, all vendor and store names are fictional.
        </p>
      </footer>
    </div>
  )
}
