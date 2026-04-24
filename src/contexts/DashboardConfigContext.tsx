import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface SectionConfig {
  id: string
  label: string
  visible: boolean
  group: string
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'desconto',         label: 'Desconto Disponibilizado',   group: 'intermediacoes_group', visible: true },
  { id: 'operacao',         label: 'Operação',                   group: 'intermediacoes_group', visible: true },
  { id: 'produtos',         label: 'Operação | Produtos',        group: 'intermediacoes_group', visible: true },
  { id: 'vendas',           label: 'Análise — Últimos 13 Meses', group: 'vendas',               visible: true },
  { id: 'ativos',           label: 'Cadastros Ativos',           group: 'cadastros_group',      visible: true },
  { id: 'composicao',       label: 'Composição dos Clientes',    group: 'cadastros_group',      visible: true },
  { id: 'metricas_vendas',  label: 'Métricas de Vendas',         group: 'metricas_group',       visible: true },
  { id: 'intermediacoes_m', label: 'Intermediações',             group: 'metricas_group',       visible: true },
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
        const defaultIds = DEFAULT_SECTIONS.map(s => s.id)
        const parsedIds  = parsed.map(s => s.id)
        const allPresent = defaultIds.every(id => parsedIds.includes(id)) && parsedIds.every(id => defaultIds.includes(id))
        if (allPresent) {
          return parsed.map(s => {
            const def = DEFAULT_SECTIONS.find(d => d.id === s.id)
            return def ? { ...def, ...s } : s
          })
        }
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
