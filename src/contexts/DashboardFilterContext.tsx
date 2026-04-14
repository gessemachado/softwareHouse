import { createContext, useContext, useState, type ReactNode } from 'react'

const MONTHS_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const MONTHS_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export type CompareMode = 0 | 1 | 2  // 0=Mês anterior, 1=Mesmo mês ano anterior, 2=Customizado

interface DashboardFilter {
  // Período análise
  selectedMonth: number
  selectedYear: number
  setSelectedMonth: (m: number) => void
  setSelectedYear: (y: number) => void

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
  const [compareMode, setCompareModeRaw]  = useState<CompareMode>(0)
  const [customMonth, setCustomMonth]     = useState(2)   // Março
  const [customYear, setCustomYear]       = useState(2026)

  const setCompareMode = (m: CompareMode) => setCompareModeRaw(m)

  // Resolve o mês/ano de comparação baseado no modo
  let compareMonth: number
  let compareYear: number
  if (compareMode === 0) {
    // Mês anterior ao período análise
    compareMonth = selectedMonth === 0 ? 11 : selectedMonth - 1
    compareYear  = selectedMonth === 0 ? selectedYear - 1 : selectedYear
  } else if (compareMode === 1) {
    // Mesmo mês, ano anterior
    compareMonth = selectedMonth
    compareYear  = selectedYear - 1
  } else {
    // Customizado
    compareMonth = customMonth
    compareYear  = customYear
  }

  const compareLabel = `${MONTHS_FULL[compareMonth]} ${compareYear}`

  return (
    <DashboardFilterContext.Provider value={{
      selectedMonth, selectedYear, setSelectedMonth, setSelectedYear,
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
