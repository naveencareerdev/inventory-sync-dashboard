import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const HEADERS = ['Store', 'SKU', 'Handle', 'Title', 'On Hand (Before)', 'On Hand (After)', 'Delta', 'Status']

function rowsToCsv(rows) {
  const lines = [HEADERS.join(',')]
  for (const r of rows) {
    lines.push(
      [
        r.store,
        r.sku,
        r.handle,
        `"${(r.title || '').replace(/"/g, '""')}"`,
        r.onHandBefore,
        r.onHandAfter,
        r.delta,
        r.matched ? 'Matched' : 'Unmatched',
      ].join(','),
    )
  }
  return lines.join('\n')
}

export function downloadStoreCsv(storeCode, rows) {
  const blob = new Blob([rowsToCsv(rows)], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, `sync_${storeCode}_${new Date().toISOString().slice(0, 10)}.csv`)
}

export async function downloadAllAsZip(rowsByStore) {
  const zip = new JSZip()
  for (const [storeCode, rows] of Object.entries(rowsByStore)) {
    zip.file(`sync_${storeCode}.csv`, rowsToCsv(rows))
  }
  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `sync_all_stores_${new Date().toISOString().slice(0, 10)}.zip`)
}
