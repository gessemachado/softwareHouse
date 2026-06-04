import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Calendar, RefreshCw } from 'lucide-react'
import { useDashboardFilter, MONTHS_FULL as MONTHS, MONTHS_SHORT, type CompareMode } from '../../contexts/DashboardFilterContext'

// Meses disponíveis no mock (Abr/2025 → Abr/2026)
const MOCK_MONTHS = [
  { label: 'Abr 2025', month: 3,  year: 2025 },
  { label: 'Mai 2025', month: 4,  year: 2025 },
  { label: 'Jun 2025', month: 5,  year: 2025 },
  { label: 'Jul 2025', month: 6,  year: 2025 },
  { label: 'Ago 2025', month: 7,  year: 2025 },
  { label: 'Set 2025', month: 8,  year: 2025 },
  { label: 'Out 2025', month: 9,  year: 2025 },
  { label: 'Nov 2025', month: 10, year: 2025 },
  { label: 'Dez 2025', month: 11, year: 2025 },
  { label: 'Jan 2026', month: 0,  year: 2026 },
  { label: 'Fev 2026', month: 1,  year: 2026 },
  { label: 'Mar 2026', month: 2,  year: 2026 },
  { label: 'Abr 2026', month: 3,  year: 2026 },
]

const COMPARE_OPTIONS = ['Mês anterior', 'Mesmo mês ano anterior', 'Customizado']
const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// ?? Day Range Picker ??????????????????????????????????????????????????????????
function DayPickerCalendar({
  month, year, rangeStart, rangeEnd,
  onDayClick, onClose, onPrevMonth, onNextMonth,
}: {
  month: number; year: number
  rangeStart: number | null; rangeEnd: number | null
  onDayClick: (d: number) => void
  onClose: () => void
  onPrevMonth: () => void
  onNextMonth: () => void
}) {
  const [hoverDay, setHoverDay] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth  = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  // Resolve intervalo efectivo (range completo ou preview com hover)
  const isPreviewing = rangeStart !== null && rangeEnd === null
  const effEnd = rangeEnd ?? (isPreviewing ? hoverDay : null)
  const lo = rangeStart !== null && effEnd !== null ? Math.min(rangeStart, effEnd) : rangeStart
  const hi = rangeStart !== null && effEnd !== null ? Math.max(rangeStart, effEnd) : rangeStart

  function cellInfo(day: number) {
    const isLo       = day === lo
    const isHi       = day === hi && lo !== hi
    const isBetween  = lo !== null && hi !== null && day > lo && day < hi
    const highlighted = isLo || isHi || isBetween
    const hasLeft    = (isHi || isBetween) && lo !== hi
    const hasRight   = (isLo || isBetween) && lo !== hi
    return { isLo, isHi, isBetween, highlighted, hasLeft, hasRight }
  }

  const pad = (n: number) => String(n).padStart(2, '0')
  const mm  = pad(month + 1)
  const yyyy = String(year)
  const rangeText = !rangeStart
    ? 'DD/MM/YYYY'
    : !rangeEnd
      ? `${pad(rangeStart)}/${mm}/${yyyy}`
      : `${pad(rangeStart)}/${mm}/${yyyy}  →  ${pad(rangeEnd)}/${mm}/${yyyy}`

  return (
    <div
      ref={ref}
      className="absolute z-30 top-full mt-2 left-0 rounded-xl shadow-2xl border border-orange-500/30 p-4 w-72"
      style={{ background: '#000000' }}
    >
      {/* Date display */}
      <div className="mb-3 px-1 py-1.5 rounded-lg border border-bh-border/30 bg-bh-surface2/50">
        <p className="text-center text-orange-400 text-xs font-mono font-semibold tracking-wider">
          {rangeText}
        </p>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={onPrevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bh-surface2 text-bh-muted hover:text-bh-text transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-bh-text font-semibold text-sm">{MONTHS[month]}  {year}</span>
        <button onClick={onNextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bh-surface2 text-bh-muted hover:text-bh-text transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-0.5">
        {WEEK_DAYS.map(d => (
          <span key={d} className="text-center text-bh-subtle text-[10px] font-semibold py-1">{d}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <span key={`e-${i}`} className="h-9" />
          const { isLo, isHi, isBetween, highlighted, hasLeft, hasRight } = cellInfo(day)
          const isCircleFull = isLo || isHi
          return (
            <div key={day} className="relative h-9 flex items-center justify-center"
              onMouseEnter={() => setHoverDay(day)}
              onMouseLeave={() => setHoverDay(null)}>

              {/* Left half strip */}
              {hasLeft && (
                <div className={`absolute top-1 bottom-1 left-0 right-1/2 ${isPreviewing ? 'bg-orange-500/10' : 'bg-orange-500/20'}`} />
              )}
              {/* Right half strip */}
              {hasRight && (
                <div className={`absolute top-1 bottom-1 left-1/2 right-0 ${isPreviewing ? 'bg-orange-500/10' : 'bg-orange-500/20'}`} />
              )}
              {/* Middle full strip */}
              {isBetween && (
                <div className={`absolute top-1 bottom-1 left-0 right-0 ${isPreviewing ? 'bg-orange-500/10' : 'bg-orange-500/20'}`} />
              )}

              {/* Circle button */}
              <button
                onClick={() => onDayClick(day)}
                className={`relative z-10 w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                  isCircleFull
                    ? isPreviewing
                      ? 'bg-orange-500/70 text-white'
                      : 'bg-orange-500 text-white shadow shadow-orange-500/40'
                    : highlighted
                      ? 'text-bh-text/90'
                      : 'text-[#aaa] hover:bg-orange-500/10 hover:text-orange-400'
                }`}
              >
                {day}
              </button>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-bh-border/30">
        <button onClick={() => { onDayClick(-1) }}
          className="text-bh-subtle text-xs hover:text-red-400 transition-colors">
          Limpar
        </button>
        <button onClick={onClose}
          className="text-orange-500 text-xs font-semibold hover:text-orange-400 transition-colors">
          Confirmar
        </button>
      </div>
    </div>
  )
}

// ?? Main Component ????????????????????????????????????????????????????????????
export function DashboardHeader() {
  const {
    selectedMonth, selectedYear, setSelectedMonth, setSelectedYear,
    dayRangeStart, dayRangeEnd, setDayRangeStart, setDayRangeEnd,
    compareDayRangeStart, compareDayRangeEnd,
    setCompareDayRangeStart, setCompareDayRangeEnd,
    compareMode, setCompareMode,
    customMonth, setCustomMonth, customYear, setCustomYear,
    compareMonth, compareYear,
  } = useDashboardFilter()

  const [showDayPicker, setShowDayPicker]               = useState(false)
  const [showCompareDayPicker, setShowCompareDayPicker] = useState(false)

  const pad = (n: number) => String(n).padStart(2, '0')

  function handleDayClick(d: number) {
    if (d === -1) { setDayRangeStart(null); setDayRangeEnd(null); return }
    if (!dayRangeStart || (dayRangeStart && dayRangeEnd)) {
      setDayRangeStart(d); setDayRangeEnd(null)
    } else {
      if (d >= dayRangeStart) setDayRangeEnd(d)
      else { setDayRangeEnd(dayRangeStart); setDayRangeStart(d) }
    }
  }

  function handleCompareDayClick(d: number) {
    if (d === -1) { setCompareDayRangeStart(null); setCompareDayRangeEnd(null); return }
    if (!compareDayRangeStart || (compareDayRangeStart && compareDayRangeEnd)) {
      setCompareDayRangeStart(d); setCompareDayRangeEnd(null)
    } else {
      if (d >= compareDayRangeStart) setCompareDayRangeEnd(d)
      else { setCompareDayRangeEnd(compareDayRangeStart); setCompareDayRangeStart(d) }
    }
  }

  function prevMonth() {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1) }
    else setSelectedMonth(selectedMonth - 1)
  }
  function nextMonth() {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1) }
    else setSelectedMonth(selectedMonth + 1)
  }

  function prevCustomMonth() {
    if (customMonth === 0) { setCustomMonth(11); setCustomYear(customYear - 1) }
    else setCustomMonth(customMonth - 1)
  }
  function nextCustomMonth() {
    if (customMonth === 11) { setCustomMonth(0); setCustomYear(customYear + 1) }
    else setCustomMonth(customMonth + 1)
  }

  const rangeButtonLabel = !dayRangeStart
    ? 'Selecione o período'
    : !dayRangeEnd
      ? `${pad(dayRangeStart)} ${MONTHS_SHORT[selectedMonth]} ${selectedYear}`
      : `${pad(dayRangeStart)} " ${pad(dayRangeEnd)} ${MONTHS_SHORT[selectedMonth]}`

  const [showCompareDropdown, setShowCompareDropdown] = useState(false)
  const [pendingMonth, setPendingMonth] = useState(`${selectedYear}-${selectedMonth}`)
  const [loading, setLoading]           = useState(false)

  const shortLabel = `${MONTHS_SHORT[compareMonth]} / ${compareYear}`

  function handleAtualizar() {
    const [y, m] = pendingMonth.split('-').map(Number)
    setLoading(true)
    setTimeout(() => {
      setSelectedYear(y)
      setSelectedMonth(m)
      setLoading(false)
    }, 400)
  }

  return (
    <div className="rounded-lg border border-orange-500/20 bg-bh-bg p-4 sm:p-6 mb-5">
      {/* Title row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.2) 0%, rgba(255,102,0,0.1) 100%)' }}>
            <Eye size={20} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-bh-text text-2xl font-bold leading-tight">Visão Geral</h1>
            <p className="text-bh-muted text-sm mt-0.5">Acompanhe o desempenho de todas as software house ativas</p>
          </div>
        </div>

        {/* Seletor de mês + Atualizar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative flex items-center">
            <Calendar size={13} className="absolute left-3 pointer-events-none text-orange-500" />
            <select
              value={pendingMonth}
              onChange={e => setPendingMonth(e.target.value)}
              className="appearance-none pl-8 pr-7 py-1.5 rounded-lg text-sm font-medium cursor-pointer focus:outline-none transition-colors"
              style={{ background: 'rgb(var(--bh-surface2))', border: '1px solid rgb(var(--bh-border))', color: 'rgb(var(--bh-text))' }}
            >
              {MOCK_MONTHS.map(m => (
                <option key={`${m.year}-${m.month}`} value={`${m.year}-${m.month}`}>{m.label}</option>
              ))}
            </select>
            <svg className="absolute right-2.5 pointer-events-none" width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="rgb(var(--bh-subtle))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <button
            onClick={handleAtualizar}
            disabled={loading}
            className="btn-primary flex items-center gap-2 px-4 py-1.5 text-sm disabled:opacity-60"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {/* Filter cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* 1 " Período Análise (sempre diário) */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-orange-500/30">1</span>
            <span className="text-bh-muted text-[9px] font-semibold tracking-widest uppercase">Período Análise</span>
          </div>
          <div className="relative">
            <button
              onClick={() => { setShowDayPicker(v => !v); setShowCompareDropdown(false) }}
              className="w-full rounded-lg border border-orange-500/30 px-4 py-2.5 text-left transition-colors hover:border-orange-500/50"
              style={{ background: 'rgb(var(--bh-surface2))' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-bh-muted text-[8px] font-semibold tracking-widest uppercase mb-1">DIA / MS / ANO</p>
                  <p className={`text-sm font-bold ${!dayRangeStart ? 'text-bh-subtle' : 'text-bh-text'}`}>{rangeButtonLabel}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-orange-500" />
                  <ChevronDown size={13} className={`text-bh-muted transition-transform ${showDayPicker ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>
            {showDayPicker && (
              <DayPickerCalendar
                month={selectedMonth} year={selectedYear}
                rangeStart={dayRangeStart} rangeEnd={dayRangeEnd}
                onDayClick={handleDayClick}
                onClose={() => setShowDayPicker(false)}
                onPrevMonth={prevMonth} onNextMonth={nextMonth}
              />
            )}
          </div>
        </div>

        {/* 2 " Período de Comparação */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-orange-500/30">2</span>
            <span className="text-bh-muted text-[9px] font-semibold tracking-widest uppercase">Período de Comparação</span>
          </div>

          <div className="relative">
            <div
              className="rounded-lg border border-orange-500/30 px-4 py-2.5"
              style={{ background: 'rgb(var(--bh-surface2))' }}
            >
              {/* Mode selector trigger */}
              <button
                onClick={() => { setShowCompareDropdown(v => !v); setShowDayPicker(false) }}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <p className="text-bh-muted text-[8px] font-semibold tracking-widest uppercase mb-1">COMPARAR COM</p>
                  <div className="flex items-center gap-2">
                    <p className="text-bh-text text-sm font-bold">{COMPARE_OPTIONS[compareMode]}</p>
                    {compareMode !== 2 && <span className="text-bh-subtle text-xs">{shortLabel}</span>}
                  </div>
                </div>
                <ChevronDown size={14} className={`text-bh-muted transition-transform ${showCompareDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Range auto-calculado */}
              {compareMode !== 2 && dayRangeStart && (
                <p className="text-bh-subtle text-xs font-mono mt-1.5">
                  {pad(dayRangeStart)}{dayRangeEnd ? ` " ${pad(dayRangeEnd)}` : ''} {MONTHS_SHORT[compareMonth]} / {compareYear}
                </p>
              )}

              {/* Customizado */}
              {compareMode === 2 && (
                <div className="mt-2 pt-2 border-t border-bh-border/30">
                  <button
                    onClick={() => { setShowCompareDayPicker(v => !v); setShowCompareDropdown(false) }}
                    className="w-full flex items-center justify-between rounded-md border border-orange-500/20 px-3 py-1.5 hover:border-orange-500/40 transition-colors"
                    style={{ background: 'rgba(255,102,0,0.05)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-orange-500" />
                      <span className={`text-xs font-semibold ${compareDayRangeStart ? 'text-bh-text' : 'text-bh-subtle'}`}>
                        {!compareDayRangeStart
                          ? 'Selecione o período'
                          : !compareDayRangeEnd
                            ? `${pad(compareDayRangeStart)} ${MONTHS_SHORT[customMonth]} ${customYear}`
                            : `${pad(compareDayRangeStart)} " ${pad(compareDayRangeEnd)} ${MONTHS_SHORT[customMonth]}`}
                      </span>
                    </div>
                    <ChevronDown size={12} className={`text-bh-muted transition-transform ${showCompareDayPicker ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}

            </div>

            {/* Dropdown options */}
            {showCompareDropdown && (
              <div className="absolute z-20 top-full mt-1 w-full rounded-xl border border-orange-500/30 overflow-hidden shadow-xl"
                style={{ background: '#000000' }}>
                {COMPARE_OPTIONS.map((opt, i) => (
                  <button key={opt}
                    onClick={() => {
                      setCompareMode(i as CompareMode)
                      setShowCompareDropdown(false)
                      if (i !== 2) { setShowDayPicker(false); setShowCompareDayPicker(false) }
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-bh-border/30 last:border-0 ${
                      i === compareMode ? 'text-orange-500 bg-orange-500/10' : 'text-bh-text hover:bg-bh-surface2'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Customizado picker */}
            {compareMode === 2 && showCompareDayPicker && (
              <DayPickerCalendar
                month={customMonth} year={customYear}
                rangeStart={compareDayRangeStart} rangeEnd={compareDayRangeEnd}
                onDayClick={handleCompareDayClick}
                onClose={() => setShowCompareDayPicker(false)}
                onPrevMonth={prevCustomMonth} onNextMonth={nextCustomMonth}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
