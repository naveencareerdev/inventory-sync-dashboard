import { vendors } from '../data/vendors'
import { stores } from '../data/stores'

const base = import.meta.env.BASE_URL

async function fetchText(path) {
  const res = await fetch(`${base}sample-data/${path}`)
  if (!res.ok) throw new Error(`Failed to load sample file: ${path}`)
  return res.text()
}

/** Fetch every bundled vendor feed CSV as raw text, keyed by vendor id. */
export async function loadSampleVendorFeeds() {
  const entries = await Promise.all(
    vendors.map(async (v) => [v.id, await fetchText(v.sampleFile)]),
  )
  return Object.fromEntries(entries)
}

/** Fetch every bundled store export CSV as raw text, keyed by store code. */
export async function loadSampleStoreExports() {
  const entries = await Promise.all(
    stores.map(async (s) => [s.code, await fetchText(s.sampleFile)]),
  )
  return Object.fromEntries(entries)
}
