// Each vendor ships their stock feed in a slightly different CSV shape.
// columnMap tells the sync engine how to translate a vendor's raw headers
// into the app's canonical { sku, name, qty } fields.
export const vendors = [
  {
    id: 'aurora',
    name: 'Aurora Trail Co.',
    category: 'Footwear',
    sampleFile: 'vendor-aurora.csv',
    columnMap: { sku: 'SKU', name: 'Product Name', qty: 'Qty Available' },
  },
  {
    id: 'meridian',
    name: 'Meridian Outfitters',
    category: 'Apparel',
    sampleFile: 'vendor-meridian.csv',
    columnMap: { sku: 'Item Code', name: 'Description', qty: 'Stock Count' },
  },
  {
    id: 'cascade',
    name: 'Cascade Supply Co.',
    category: 'Accessories',
    sampleFile: 'vendor-cascade.csv',
    columnMap: { sku: 'sku', name: 'title', qty: 'available_qty' },
  },
]

export const getVendor = (id) => vendors.find((v) => v.id === id)
