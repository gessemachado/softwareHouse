import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Calendar } from 'lucide-react'
import { useDashboardFilter, MONTHS_FULL as MONTHS, MONTHS_SHORT, type CompareMode } from '../../contexts/DashboardFilterContext'

const COMPARE_OPTIONS = ['Mês anterior', 'Mesmo mês ano anterior', 'Customizado']
const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// ── Day Range Picker ──────────────────────────────────────────────────────────
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
      style={{ background: '#000' }}
    >
      {/* Date display */}
      <div className="mb-3 px-1 py-1.5 rounded-lg border border-white/5 bg-black/30">
        <p className="text-center text-orange-400 text-xs font-mono font-semibold tracking-wider">
          {rangeText}
        </p>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={onPrevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#999] hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-white font-semibold text-sm">{MONTHS[month]}  {year}</span>
        <button onClick={onNextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#999] hover:text-white transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-0.5">
        {WEEK_DAYS.map(d => (
          <span key={d} className="text-center text-[#555] text-[10px] font-semibold py-1">{d}</span>
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
                      ? 'text-white/90'
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
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        <button onClick={() => { onDayClick(-1) }}
          className="text-[#555] text-xs hover:text-red-400 transition-colors">
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

// ── Main Component ────────────────────────────────────────────────────────────
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
      : `${pad(dayRangeStart)} – ${pad(dayRangeEnd)} ${MONTHS_SHORT[selectedMonth]}`

  const [showCompareDropdown, setShowCompareDropdown] = useState(false)

  const shortLabel = `${MONTHS_SHORT[compareMonth]} / ${compareYear}`

  return (
    <div className="rounded-lg border border-orange-500/20 bg-black p-4 sm:p-6 mb-5">
      {/* Title row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.2) 0%, rgba(255,102,0,0.1) 100%)' }}>
          <Eye size={20} className="text-orange-500" />
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold leading-tight">Visão Geral</h1>
          <p className="text-[#999] text-sm mt-0.5">Acompanhe o desempenho de todas as software house ativas</p>
        </div>
      </div>

      {/* Filter cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* 1 — Período Análise (sempre diário) */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-orange-500/30">1</span>
            <span className="text-[#999] text-[9px] font-semibold tracking-widest uppercase">Período Análise</span>
          </div>
          <div className="relative">
            <button
              onClick={() => { setShowDayPicker(v => !v); setShowCompareDropdown(false) }}
              className="w-full rounded-lg border border-orange-500/30 px-4 py-2.5 text-left transition-colors hover:border-orange-500/50"
              style={{ background: 'linear-gradient(164deg, rgba(41,41,41,0.8) 0%, rgba(26,26,26,0.9) 100%)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#999] text-[8px] font-semibold tracking-widest uppercase mb-1">DIA / MÊS / ANO</p>
                  <p className={`text-sm font-bold ${!dayRangeStart ? 'text-[#555]' : 'text-white'}`}>{rangeButtonLabel}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-orange-500" />
                  <ChevronDown size={13} className={`text-[#999] transition-transform ${showDayPicker ? 'rotate-180' : ''}`} />
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

        {/* 2 — Período de Comparação */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-orange-500/30">2</span>
            <span className="text-[#999] text-[9px] font-semibold tracking-widest uppercase">Período de Comparação</span>
          </div>

          <div className="relative">
            <div
              className="rounded-lg border border-orange-500/30 px-4 py-2.5"
              style={{ background: 'linear-gradient(164deg, rgba(41,41,41,0.8) 0%, rgba(26,26,26,0.9) 100%)' }}
            >
              {/* Mode selector trigger */}
              <button
                onClick={() => { setShowCompareDropdown(v => !v); setShowDayPicker(false) }}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <p className="text-[#999] text-[8px] font-semibold tracking-widest uppercase mb-1">COMPARAR COM</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-bold">{COMPARE_OPTIONS[compareMode]}</p>
                    {compareMode !== 2 && <span className="text-[#666] text-xs">{shortLabel}</span>}
                  </div>
                </div>
                <ChevronDown size={14} className={`text-[#999] transition-transform ${showCompareDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Range auto-calculado */}
              {compareMode !== 2 && dayRangeStart && (
                <p className="text-[#666] text-xs font-mono mt-1.5">
                  {pad(dayRangeStart)}{dayRangeEnd ? ` – ${pad(dayRangeEnd)}` : ''} {MONTHS_SHORT[compareMonth]} / {compareYear}
                </p>
              )}

              {/* Customizado */}
              {compareMode === 2 && (
                <div className="mt-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => { setShowCompareDayPicker(v => !v); setShowCompareDropdown(false) }}
                    className="w-full flex items-center justify-between rounded-md border border-orange-500/20 px-3 py-1.5 hover:border-orange-500/40 transition-colors"
                    style={{ background: 'rgba(255,102,0,0.05)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-orange-500" />
                      <span className={`text-xs font-semibold ${compareDayRangeStart ? 'text-white' : 'text-[#555]'}`}>
                        {!compareDayRangeStart
                          ? 'Selecione o período'
                          : !compareDayRangeEnd
                            ? `${pad(compareDayRangeStart)} ${MONTHS_SHORT[customMonth]} ${customYear}`
                            : `${pad(compareDayRangeStart)} – ${pad(compareDayRangeEnd)} ${MONTHS_SHORT[customMonth]}`}
                      </span>
                    </div>
                    <ChevronDown size={12} className={`text-[#999] transition-transform ${showCompareDayPicker ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}

            </div>

            {/* Dropdown options */}
            {showCompareDropdown && (
              <div className="absolute z-20 top-full mt-1 w-full rounded-xl border border-orange-500/30 overflow-hidden shadow-xl"
                style={{ background: '#000' }}>
                {COMPARE_OPTIONS.map((opt, i) => (
                  <button key={opt}
                    onClick={() => {
                      setCompareMode(i as CompareMode)
                      setShowCompareDropdown(false)
                      if (i !== 2) { setShowDayPicker(false); setShowCompareDayPicker(false) }
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-white/5 last:border-0 ${
                      i === compareMode ? 'text-orange-500 bg-orange-500/10' : 'text-white hover:bg-white/5'
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
