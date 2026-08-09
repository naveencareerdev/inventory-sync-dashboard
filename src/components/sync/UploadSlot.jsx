import StoreTag from '../StoreTag'

export default function UploadSlot({ code, name, sublabel, hasFile, onFile }) {
  const inputId = `upload-${code}`

  return (
    <label
      htmlFor={inputId}
      className={`flex cursor-pointer flex-col gap-2 rounded-md border p-3 transition-colors ${
        hasFile ? 'border-teal/40 bg-teal-soft/40' : 'border-line bg-surface hover:border-denim/40'
      }`}
    >
      <div className="flex items-center justify-between">
        <StoreTag code={code} status={hasFile ? 'loaded' : 'idle'} compact />
        <span className="text-[10px] font-medium text-ink-soft/50">
          {hasFile ? 'File loaded' : 'No file'}
        </span>
      </div>
      <div className="text-xs text-ink-soft/70">{name}</div>
      {sublabel && <div className="text-[10px] text-ink-soft/40">{sublabel}</div>}
      <input
        id={inputId}
        type="file"
        accept=".csv"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
    </label>
  )
}
