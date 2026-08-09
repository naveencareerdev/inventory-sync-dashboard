export const stores = [
  { code: 'NYC', name: 'New York', sampleFile: 'store-nyc.csv' },
  { code: 'LAX', name: 'Los Angeles', sampleFile: 'store-lax.csv' },
  { code: 'CHI', name: 'Chicago', sampleFile: 'store-chi.csv' },
  { code: 'MIA', name: 'Miami', sampleFile: 'store-mia.csv' },
  { code: 'SEA', name: 'Seattle', sampleFile: 'store-sea.csv' },
  { code: 'DAL', name: 'Dallas', sampleFile: 'store-dal.csv' },
]

export const getStore = (code) => stores.find((s) => s.code === code)
