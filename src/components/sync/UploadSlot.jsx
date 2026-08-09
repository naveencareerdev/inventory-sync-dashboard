import StoreTag from '../StoreTag'

export default function UploadSlot({ code, name, sublabel, hasFile, onFile }) {
  const inputId = `upload-${code}`

  return (
    <label
      htmlFor={inputId}
      className={`panel-card flex cursor-pointer flex-col gap-2 rounded-2xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 ${
        hasFile ? 'border-teal/35 bg-teal-soft/75 shadow-teal/10' : 'border-white bg-surface/90 hover:border-denim/30 hover:shadow-lg hover:shadow-indigo-900/10'
      }`}
    >
      <div className="flex items-center justify-between">
        <StoreTag code={code} status={hasFile ? 'loaded' : 'idle'} compact />
        <span className="text-[10px] font-semibold text-ink-soft/50">
          {hasFile ? 'File loaded' : 'No file'}
        </span>
      </div>
      <div className="text-xs font-semibold text-ink-soft/75">{name}</div>
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
