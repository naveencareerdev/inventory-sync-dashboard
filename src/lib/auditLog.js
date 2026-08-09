const STORAGE_KEY = 'stockmanifest.auditLog.v1'
const MAX_ENTRIES = 100

export function getAuditLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addAuditEntry(entry) {
  const log = getAuditLog()
  const next = [{ id: crypto.randomUUID(), ...entry }, ...log].slice(0, MAX_ENTRIES)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage full or unavailable — fail silently, dashboard still works this session
  }
  return next
}

export function clearAuditLog() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* noop */
  }
  return []
}
