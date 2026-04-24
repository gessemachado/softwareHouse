import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface SectionConfig {
  id: string
  label: string
  visible: boolean
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'intermediacoes', label: 'Intermediações',    visible: true },
  { id: 'vendas',         label: 'Análise de Vendas', visible: true },
  { id: 'cadastros',      label: 'Cadastros',         visible: true },
  { id: 'metricas',       label: 'Métricas de Vendas', visible: true },
]

const STORAGE_KEY = 'buyhelp-sh-dashboard-config'

interface DashboardConfigCtx {
  sections: SectionConfig[]
  setSections: (s: SectionConfig[]) => void
  resetSections: () => void
}

const Ctx = createContext<DashboardConfigCtx>({
  sections: DEFAULT_SECTIONS,
  setSections: () => {},
  resetSections: () => {},
})

export function DashboardConfigProvider({ children }: { children: ReactNode }) {
  const [sections, setSectionsState] = useState<SectionConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: SectionConfig[] = JSON.parse(saved)
        const ids = DEFAULT_SECTIONS.map(s => s.id)
        const validIds = parsed.map(s => s.id).filter(id => ids.includes(id))
        if (validIds.length === ids.length) return parsed
      }
    } catch {}
    return DEFAULT_SECTIONS
  })

  function setSections(s: SectionConfig[]) {
    setSectionsState(s)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  }

  function resetSections() {
    setSectionsState(DEFAULT_SECTIONS)
    localStorage.removeItem(STORAGE_KEY)
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections))
  }, [sections])

  return <Ctx.Provider value={{ sections, setSections, resetSections }}>{children}</Ctx.Provider>
}

export function useDashboardConfig() {
  return useContext(Ctx)
}
