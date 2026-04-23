import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

const MONTHS_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const MONTHS_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export type CompareMode  = 0 | 1 | 2  // 0=Mês anterior, 1=Mesmo mês ano anterior, 2=Customizado
export type PeriodType   = 'diario' | 'semanal' | 'mensal'

interface DashboardFilter {
  // Período análise
  selectedMonth: number
  selectedYear: number
  setSelectedMonth: (m: number) => void
  setSelectedYear: (y: number) => void

  // Tipo de período
  periodType: PeriodType
  setPeriodType: (t: PeriodType) => void

  // Intervalo de dias — análise (modo diário)
  dayRangeStart: number | null
  dayRangeEnd:   number | null
  setDayRangeStart: (d: number | null) => void
  setDayRangeEnd:   (d: number | null) => void

  // Intervalo de dias — comparação customizada (modo diário)
  compareDayRangeStart: number | null
  compareDayRangeEnd:   number | null
  setCompareDayRangeStart: (d: number | null) => void
  setCompareDayRangeEnd:   (d: number | null) => void

  // Semana — análise (modo semanal)
  selectedWeek: number | null
  setSelectedWeek: (w: number | null) => void

  // Semana — comparação customizada (modo semanal)
  customWeek: number | null
  setCustomWeek: (w: number | null) => void

  // Computed: semana de comparação resolvida
  compareWeek: number | null

  // Período comparação
  compareMode: CompareMode
  setCompareMode: (m: CompareMode) => void
  customMonth: number
  setCustomMonth: (m: number) => void
  customYear: number
  setCustomYear: (y: number) => void

  // Computed: mês de comparação resolvido
  compareMonth: number
  compareYear: number
  compareLabel: string  // ex: "Março 2026"
}

const DashboardFilterContext = createContext<DashboardFilter | null>(null)

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  const [selectedMonth, setSelectedMonth] = useState(3)   // Abril
  const [selectedYear, setSelectedYear]   = useState(2026)
  const [periodType, setPeriodType]                   = useState<PeriodType>('mensal')
  const [dayRangeStart, setDayRangeStart]             = useState<number | null>(null)
  const [dayRangeEnd,   setDayRangeEnd]               = useState<number | null>(null)
  const [compareDayRangeStart, setCompareDayRangeStart] = useState<number | null>(null)
  const [compareDayRangeEnd,   setCompareDayRangeEnd]   = useState<number | null>(null)
  const [selectedWeek, setSelectedWeek]               = useState<number | null>(null)
  const [customWeek, setCustomWeek]                   = useState<number | null>(null)
  const [compareMode, setCompareModeRaw]              = useState<CompareMode>(0)

  // Limpa intervalos ao trocar mês/ano ou tipo
  useEffect(() => {
    setDayRangeStart(null); setDayRangeEnd(null)
    setSelectedWeek(null)
  }, [selectedMonth, selectedYear, periodType])

  // Limpa comparação customizada ao trocar modo ou tipo
  useEffect(() => {
    setCompareDayRangeStart(null); setCompareDayRangeEnd(null)
    setCustomWeek(null)
  }, [compareMode, periodType])

  const [customMonth, setCustomMonth]     = useState(2)   // Março
  const [customYear, setCustomYear]       = useState(2026)

  const setCompareMode = (m: CompareMode) => setCompareModeRaw(m)

  // Resolve o mês/ano de comparação baseado no modo
  let compareMonth: number
  let compareYear: number
  if (compareMode === 0) {
    compareMonth = selectedMonth === 0 ? 11 : selectedMonth - 1
    compareYear  = selectedMonth === 0 ? selectedYear - 1 : selectedYear
  } else if (compareMode === 1) {
    compareMonth = selectedMonth
    compareYear  = selectedYear - 1
  } else {
    compareMonth = customMonth
    compareYear  = customYear
  }

  // Semana de comparação: mesma semana no mês/ano de comparação
  const compareWeek: number | null = compareMode === 2 ? customWeek : selectedWeek

  const compareLabel = `${MONTHS_FULL[compareMonth]} ${compareYear}`

  return (
    <DashboardFilterContext.Provider value={{
      selectedMonth, selectedYear, setSelectedMonth, setSelectedYear,
      periodType, setPeriodType,
      dayRangeStart, dayRangeEnd, setDayRangeStart, setDayRangeEnd,
      compareDayRangeStart, compareDayRangeEnd, setCompareDayRangeStart, setCompareDayRangeEnd,
      selectedWeek, setSelectedWeek,
      customWeek, setCustomWeek,
      compareWeek,
      compareMode, setCompareMode,
      customMonth, setCustomMonth,
      customYear, setCustomYear,
      compareMonth, compareYear, compareLabel,
    }}>
      {children}
    </DashboardFilterContext.Provider>
  )
}

export function useDashboardFilter() {
  const ctx = useContext(DashboardFilterContext)
  if (!ctx) throw new Error('useDashboardFilter must be used inside DashboardFilterProvider')
  return ctx
}

export { MONTHS_FULL, MONTHS_SHORT }
