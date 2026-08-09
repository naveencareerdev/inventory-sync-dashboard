import Papa from 'papaparse'

/**
 * Parse raw CSV text into an array of row objects using the first row as headers.
 */
export function parseCsv(text) {
  const result = Papa.parse(text.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })
  if (result.errors?.length) {
    // PapaParse reports non-fatal row errors; surface only if nothing parsed.
    if (!result.data?.length) {
      throw new Error(result.errors[0].message)
    }
  }
  return result.data
}

/**
 * Map a vendor's raw feed rows to the canonical { sku, name, qty } shape
 * using that vendor's columnMap. This is what lets one engine support
 * vendors who each export CSVs with different column names.
 */
export function parseVendorFeed(text, vendor) {
  const rows = parseCsv(text)
  const { sku, name, qty } = vendor.columnMap
  return rows
    .map((row) => ({
      sku: (row[sku] ?? '').toString().trim(),
      name: (row[name] ?? '').toString().trim(),
      qty: Number(row[qty]) || 0,
    }))
    .filter((r) => r.sku)
}

/**
 * Map a store export's raw rows to the canonical
 * { handle, title, sku, onHand } shape. All stores share one export schema.
 */
export function parseStoreExport(text) {
  const rows = parseCsv(text)
  return rows
    .map((row) => ({
      handle: (row['Handle'] ?? '').toString().trim(),
      title: (row['Title'] ?? '').toString().trim(),
      sku: (row['SKU'] ?? '').toString().trim(),
      onHand: Number(row['On Hand']) || 0,
    }))
    .filter((r) => r.sku)
}

/**
 * Reconcile one store's export against one vendor's feed.
 * Returns a row per store item: matched items get onHandAfter from the
 * vendor's truth; unmatched items (e.g. discontinued SKUs) are flagged.
 */
export function reconcileStore(storeCode, storeRows, vendorFeedBySku) {
  const timestamp = new Date().toISOString()
  return storeRows.map((item) => {
    const match = vendorFeedBySku.get(item.sku)
    const matched = Boolean(match)
    const onHandAfter = matched ? match.qty : item.onHand
    return {
      store: storeCode,
      sku: item.sku,
      handle: item.handle,
      title: item.title || match?.name || '',
      onHandBefore: item.onHand,
      onHandAfter,
      delta: onHandAfter - item.onHand,
      matched,
      syncedAt: timestamp,
    }
  })
}

/** Build a Map of sku -> feed row for fast lookups across one or more vendor feeds. */
export function indexFeedsBySku(feeds) {
  const map = new Map()
  for (const feed of feeds) {
    for (const row of feed) {
      map.set(row.sku, row)
    }
  }
  return map
}

/** Compute headline stats for a batch of reconciled rows. */
export function computeStats(rows, lowStockThreshold = 10) {
  const totalItems = rows.length
  const matched = rows.filter((r) => r.matched)
  const unmatched = rows.filter((r) => !r.matched)
  const lowStock = rows.filter((r) => r.matched && r.onHandAfter <= lowStockThreshold)
  const critical = rows.filter((r) => r.matched && r.onHandAfter <= Math.max(2, Math.floor(lowStockThreshold / 2)))

  const byStore = {}
  for (const row of rows) {
    byStore[row.store] = byStore[row.store] || { store: row.store, units: 0, items: 0 }
    byStore[row.store].units += row.onHandAfter
    byStore[row.store].items += 1
  }

  return {
    totalItems,
    matchedCount: matched.length,
    unmatchedCount: unmatched.length,
    matchRate: totalItems ? Math.round((matched.length / totalItems) * 100) : 0,
    lowStockCount: lowStock.length,
    criticalCount: critical.length,
    byStore: Object.values(byStore),
  }
}
