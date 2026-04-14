import { useState, useRef, useEffect } from 'react'
import { Download, ChevronDown, ChevronLeft, ChevronRight, Eye, Calendar } from 'lucide-react'
import { useDashboardFilter, MONTHS_FULL as MONTHS, MONTHS_SHORT, type CompareMode } from '../../contexts/DashboardFilterContext'

const COMPARE_OPTIONS = ['Mês anterior', 'Mesmo mês ano anterior', 'Customizado']

// ── Month Calendar Popup ─────────────────────────────────────────────────────
function MonthPicker({
  month, year, onChange, onClose
}: {
  month: number
  year: number
  onChange: (month: number, year: number) => void
  onClose: () => void
}) {
  const [navYear, setNavYear] = useState(year)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute z-20 top-full mt-2 left-0 rounded-xl shadow-2xl border border-orange-500/30 p-4 w-64"
      style={{ background: '#141414' }}
    >
      {/* Year nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setNavYear(y => y - 1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#999] hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-white font-bold text-base">{navYear}</span>
        <button
          onClick={() => setNavYear(y => y + 1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#999] hover:text-white transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-3 gap-1">
        {MONTHS_SHORT.map((m, i) => {
          const isSelected = i === month && navYear === year
          return (
            <button
              key={m}
              onClick={() => { onChange(i, navYear); onClose() }}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-orange-500 text-white'
                  : 'text-[#ccc] hover:bg-orange-500/10 hover:text-orange-400'
              }`}
            >
              {m}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function DashboardHeader() {
  const {
    selectedMonth, selectedYear, setSelectedMonth, setSelectedYear,
    compareMode, setCompareMode,
    customMonth, setCustomMonth, customYear, setCustomYear,
    compareLabel,
  } = useDashboardFilter()

  const [showAnalysePicker, setShowAnalysePicker] = useState(false)
  const [showCompareDropdown, setShowCompareDropdown] = useState(false)
  const [showCustomPicker, setShowCustomPicker] = useState(false)

  const shortLabel = (() => {
    const idx = MONTHS.indexOf(compareLabel.split(' ')[0])
    const yr = compareLabel.split(' ')[1]
    return `${MONTHS_SHORT[idx] ?? ''} / ${yr}`
  })()

  return (
    <div className="rounded-lg border border-orange-500/20 bg-[#0d0d0d]/80 p-6 mb-5">
      {/* Title row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.2) 0%, rgba(255,102,0,0.1) 100%)' }}>
            <Eye size={20} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold leading-tight">Visão Geral</h1>
            <p className="text-[#999] text-sm mt-0.5">Acompanhe o desempenho de todas as software house ativas</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg text-sm font-medium transition-colors">
          <Download size={14} />
          Exportar
        </button>
      </div>

      {/* Filter cards */}
      <div className="grid grid-cols-2 gap-4">

        {/* 1 — Período Análise */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-orange-500/30">1</span>
            <span className="text-[#999] text-[9px] font-semibold tracking-widest uppercase">Período Análise</span>
          </div>
          <div className="relative">
            <button
              onClick={() => { setShowAnalysePicker(v => !v); setShowCompareDropdown(false); setShowCustomPicker(false) }}
              className="w-full rounded-lg border border-orange-500/30 px-4 py-2.5 text-left transition-colors hover:border-orange-500/50"
              style={{ background: 'linear-gradient(164deg, rgba(41,41,41,0.8) 0%, rgba(26,26,26,0.9) 100%)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#999] text-[8px] font-semibold tracking-widest uppercase mb-1">MÊS / ANO</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-bold">{MONTHS[selectedMonth]}</p>
                    <span className="text-orange-500 text-sm font-semibold">{selectedYear}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-orange-500" />
                  <ChevronDown size={13} className={`text-[#999] transition-transform ${showAnalysePicker ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>

            {showAnalysePicker && (
              <MonthPicker
                month={selectedMonth}
                year={selectedYear}
                onChange={(m, y) => { setSelectedMonth(m); setSelectedYear(y) }}
                onClose={() => setShowAnalysePicker(false)}
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
              {/* Mode selector */}
              <button
                onClick={() => { setShowCompareDropdown(v => !v); setShowAnalysePicker(false) }}
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

              {/* Customizado calendar picker (inline below) */}
              {compareMode === 2 && (
                <div className="mt-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => { setShowCustomPicker(v => !v); setShowAnalysePicker(false); setShowCompareDropdown(false) }}
                    className="w-full flex items-center justify-between rounded-md border border-orange-500/20 px-3 py-1.5 hover:border-orange-500/40 transition-colors"
                    style={{ background: 'rgba(255,102,0,0.05)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-orange-500" />
                      <span className="text-white text-xs font-semibold">
                        {MONTHS[customMonth]} / {customYear}
                      </span>
                    </div>
                    <ChevronDown size={12} className={`text-[#999] transition-transform ${showCustomPicker ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown options */}
            {showCompareDropdown && (
              <div className="absolute z-20 top-full mt-1 w-full rounded-xl border border-orange-500/30 overflow-hidden shadow-xl"
                style={{ background: '#141414' }}>
                {COMPARE_OPTIONS.map((opt, i) => (
                  <button key={opt}
                    onClick={() => { setCompareMode(i as CompareMode); setShowCompareDropdown(false); if (i !== 2) setShowCustomPicker(false) }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-white/5 last:border-0 ${
                      i === compareMode ? 'text-orange-500 bg-orange-500/10' : 'text-white hover:bg-white/5'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Custom month picker popup */}
            {compareMode === 2 && showCustomPicker && (
              <MonthPicker
                month={customMonth}
                year={customYear}
                onChange={(m, y) => { setCustomMonth(m); setCustomYear(y) }}
                onClose={() => setShowCustomPicker(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
