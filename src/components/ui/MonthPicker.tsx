import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X, CalendarDays } from 'lucide-react'

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function toKey(month: number, year: number) {
  return `${String(month + 1).padStart(2, '0')}/${year}`
}

function parseKey(key: string): { month: number; year: number } | null {
  const [m, y] = key.split('/')
  const month = parseInt(m, 10) - 1
  const year = parseInt(y, 10)
  if (isNaN(month) || isNaN(year)) return null
  return { month, year }
}

interface MonthPickerProps {
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}

export function MonthPicker({ value, onChange, placeholder = 'Selecionar período...' }: MonthPickerProps) {
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState(today.getFullYear())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function toggle(key: string) {
    if (value.includes(key)) onChange(value.filter(v => v !== key))
    else onChange([...value, key].sort())
  }

  function remove(key: string, e: React.MouseEvent) {
    e.stopPropagation()
    onChange(value.filter(v => v !== key))
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange([])
  }

  const label = value.length === 0
    ? null
    : value.length === 1
      ? value[0]
      : `${value.length} meses`

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="input-bh w-full flex items-center gap-2 text-left min-h-[38px] pr-8"
        style={{ cursor: 'pointer' }}
      >
        <CalendarDays size={14} className="text-bh-muted flex-shrink-0" />
        {value.length === 0 ? (
          <span className="text-bh-muted text-sm">{placeholder}</span>
        ) : value.length <= 3 ? (
          <div className="flex flex-wrap gap-1">
            {value.map(v => (
              <span
                key={v}
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                style={{ background: 'rgba(255,102,0,0.15)', color: '#ff6600' }}
              >
                {v}
                <span
                  role="button"
                  onClick={e => remove(v, e)}
                  className="opacity-60 hover:opacity-100 cursor-pointer"
                >
                  <X size={10} />
                </span>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-bh-text text-sm">{label}</span>
        )}
        {value.length > 0 && (
          <span
            role="button"
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-bh-muted hover:text-bh-text cursor-pointer"
          >
            <X size={13} />
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1 rounded-xl shadow-2xl p-4 min-w-[260px]"
          style={{ background: 'rgb(var(--bh-bg))', border: '1px solid rgb(var(--bh-border))' }}
        >
          {/* Year nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setYear(y => y - 1)}
              className="w-7 h-7 rounded flex items-center justify-center text-bh-muted hover:text-bh-text hover:bg-bh-surface2 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-bh-text text-sm font-semibold">{year}</span>
            <button
              type="button"
              onClick={() => setYear(y => y + 1)}
              className="w-7 h-7 rounded flex items-center justify-center text-bh-muted hover:text-bh-text hover:bg-bh-surface2 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {MONTHS.map((name, idx) => {
              const key = toKey(idx, year)
              const selected = value.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  className="py-1.5 rounded text-xs font-medium transition-colors"
                  style={selected
                    ? { background: '#ff6600', color: '#fff' }
                    : { background: 'rgb(var(--bh-surface2))', color: 'rgb(var(--bh-muted))' }
                  }
                  onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.color = 'rgb(var(--bh-text))' }}
                  onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.color = 'rgb(var(--bh-muted))' }}
                >
                  {name}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          {value.length > 0 && (
            <div className="mt-3 pt-3 border-t border-bh-border flex items-center justify-between">
              <span className="text-bh-muted text-xs">{value.length} selecionado{value.length !== 1 ? 's' : ''}</span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-bh-muted hover:text-bh-text transition-colors"
              >
                Limpar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// re-export helper so callers can use it if needed
export { parseKey, toKey }
