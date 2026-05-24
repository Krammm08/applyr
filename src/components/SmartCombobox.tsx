import { useEffect, useMemo, useState } from 'react'

type Option = { id: string; name: string }

type Props = {
  fetchUrl: string
  valueName: string
  valueId?: string | null
  placeholder?: string
  onChange: (payload: { name: string; id: string | null }) => void
}

export default function SmartCombobox({ fetchUrl, valueName, valueId, placeholder, onChange }: Props) {
  const [options, setOptions] = useState<Option[]>([])
  const [input, setInput] = useState(valueName || '')
  const [isOpen, setIsOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  useEffect(() => {
    const cacheKey = `smart-combobox:cache:${fetchUrl}`
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(cacheKey)
        if (raw) {
          const parsed = JSON.parse(raw) as Option[]
          if (Array.isArray(parsed) && parsed.length) {
            setOptions(parsed)
          }
        }
      } catch {
        // ignore localStorage errors
      }
    }

    let cancelled = false
    void (async () => {
      try {
        const base = 'https://eliazar.heliohost.us';
        const finalUrl = fetchUrl.startsWith('http') ? fetchUrl : `${base.replace(/\/$/, '')}${fetchUrl.startsWith('/') ? '' : '/'}${fetchUrl}`
        const res = await fetch(finalUrl)
        if (!res.ok) return
        const data = (await res.json()) as { success?: boolean; data?: any } | Option[]
        const list = Array.isArray(data) ? data : data.data ?? []
        const mapped = list.map((item: any) => ({ id: String(item.id || item.companyId || item.schoolId), name: String(item.name || item.companyName || item.schoolName) }))
        if (!cancelled) {
          setOptions(mapped)
          if (typeof window !== 'undefined') {
            try { window.localStorage.setItem(cacheKey, JSON.stringify(mapped)) } catch {}
          }
        }
      } catch {
        // ignore
      }
    })()

    return () => { cancelled = true }
  }, [fetchUrl])

  useEffect(() => setInput(valueName || ''), [valueName])

  const filtered = useMemo(() => {
    const q = (input || '').trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.name.toLowerCase().includes(q))
  }, [input, options])

  const selectOption = (opt: Option) => {
    setInput(opt.name)
    setIsOpen(false)
    onChange({ name: opt.name, id: opt.id })
  }

  const onBlur = () => {
    // small delay to allow click
    setTimeout(() => {
      setIsOpen(false)
      const exact = options.find((o) => o.name.toLowerCase() === (input || '').trim().toLowerCase())
      if (exact) {
        onChange({ name: exact.name, id: exact.id })
      } else {
        onChange({ name: (input || '').trim(), id: null })
      }
    }, 150)
  }

  return (
    <div className="smart-combobox" style={{ position: 'relative' }}>
      <input
        placeholder={placeholder}
        value={input}
        onFocus={() => { setIsOpen(true); setHighlight(0) }}
        onChange={(e) => { setInput(e.target.value); setIsOpen(true) }}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (!isOpen) return
          if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(h + 1, filtered.length - 1)) }
          if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)) }
          if (e.key === 'Enter') { e.preventDefault(); if (filtered[highlight]) selectOption(filtered[highlight]) }
        }}
      />
      {isOpen && filtered.length > 0 ? (
        <ul className="combobox-list" style={{ position: 'absolute', zIndex: 40, left: 0, right: 0, maxHeight: 220, overflow: 'auto', background: 'white', border: '1px solid #ddd', margin: 0, padding: 0, listStyle: 'none' }}>
          {filtered.map((opt, i) => (
            <li key={opt.id} onMouseDown={() => selectOption(opt)} style={{ padding: '8px 10px', background: i === highlight ? '#eef' : 'white', cursor: 'pointer' }}>
              {opt.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
