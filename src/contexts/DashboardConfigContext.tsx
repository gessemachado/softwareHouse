import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface SectionConfig {
  id: string
  label: string
  visible: boolean
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'cards',    label: 'Cards de Análise',    visible: true },
  { id: 'vendas',   label: 'Análise de Vendas',   visible: true },
  { id: 'cadastros', label: 'Cadastros',           visible: true },
  { id: 'metricas', label: 'Métricas de Vendas',  visible: true },
]

export const DEFAULT_CARD_ORDER = [
  'c_desconto', 'c_nao_aprov', 'c_op_prod',
  'c_gauge', 'c_tributacao', 'c_debitos',
]

export const CARD_LABELS: Record<string, string> = {
  c_desconto:   'Desconto Disponibilizado',
  c_nao_aprov:  'Não Aproveitado',
  c_op_prod:    'Operação | Produtos',
  c_gauge:      'Operação | Pedidos / Intermediações',
  c_tributacao: 'Tributação de Produtos',
  c_debitos:    'Total de Débitos',
}

// Visibility for individual cards and inner cards
export const DEFAULT_CARD_VIS: Record<string, boolean> = {
  // main cards
  c_desconto: true, c_nao_aprov: true, c_op_prod: true,
  c_gauge: true, c_tributacao: true, c_debitos: true,
  // inner — desconto
  'c_desconto.disponivel': true, 'c_desconto.aproveitado': true, 'c_desconto.total': true,
  // inner — nao_aprov
  'c_nao_aprov.total': true, 'c_nao_aprov.mesma_trib': true,
  'c_nao_aprov.somente_item': true, 'c_nao_aprov.nao_aceitou': true,
  // inner — op_prod
  'c_op_prod.nao_atuou': true, 'c_op_prod.m_negativa': true, 'c_op_prod.custo_zero': true,
  'c_op_prod.exclusao_loja': true, 'c_op_prod.blacklist': true,
  // inner — gauge
  'c_gauge.pedidos': true, 'c_gauge.intermediacoes': true, 'c_gauge.conversao': true, 'c_gauge.nao_conversao': true,
  // inner — tributacao
  'c_tributacao.tributado': true, 'c_tributacao.isento': true,
  // inner — debitos
  'c_debitos.antes': true, 'c_debitos.depois': true, 'c_debitos.economia': true,
}

const SECTIONS_KEY   = 'buyhelp-sh-dashboard-config'
const CARD_VIS_KEY   = 'buyhelp-sh-card-vis'
const CARD_ORDER_KEY = 'buyhelp-sh-card-order'

interface DashboardConfigCtx {
  sections: SectionConfig[]
  setSections: (s: SectionConfig[]) => void
  resetSections: () => void
  cardVis: Record<string, boolean>
  setCardVis: (id: string, visible: boolean) => void
  applyCardVis: (draft: Record<string, boolean>) => void
  resetCardVis: () => void
  cardOrder: string[]
  setCardOrder: (order: string[]) => void
  resetCardOrder: () => void
}

const Ctx = createContext<DashboardConfigCtx>({
  sections: DEFAULT_SECTIONS,
  setSections: () => {},
  resetSections: () => {},
  cardVis: DEFAULT_CARD_VIS,
  setCardVis: () => {},
  applyCardVis: () => {},
  resetCardVis: () => {},
  cardOrder: DEFAULT_CARD_ORDER,
  setCardOrder: () => {},
  resetCardOrder: () => {},
})

export function DashboardConfigProvider({ children }: { children: ReactNode }) {
  const [sections, setSectionsState] = useState<SectionConfig[]>(() => {
    try {
      const saved = localStorage.getItem(SECTIONS_KEY)
      if (saved) {
        const parsed: SectionConfig[] = JSON.parse(saved)
        const ids = DEFAULT_SECTIONS.map(s => s.id)
        if (parsed.map(s => s.id).filter(id => ids.includes(id)).length === ids.length)
          return parsed.filter(s => ids.includes(s.id))
      }
    } catch {}
    return DEFAULT_SECTIONS
  })

  const [cardVis, setCardVisState] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(CARD_VIS_KEY)
      if (saved) return { ...DEFAULT_CARD_VIS, ...JSON.parse(saved) }
    } catch {}
    return { ...DEFAULT_CARD_VIS }
  })

  const [cardOrder, setCardOrderState] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CARD_ORDER_KEY)
      if (saved) {
        const parsed: string[] = JSON.parse(saved)
        if (
          parsed.length === DEFAULT_CARD_ORDER.length &&
          DEFAULT_CARD_ORDER.every(id => parsed.includes(id))
        ) return parsed
      }
    } catch {}
    return [...DEFAULT_CARD_ORDER]
  })

  function setSections(s: SectionConfig[]) {
    setSectionsState(s)
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(s))
  }

  function resetSections() {
    setSectionsState(DEFAULT_SECTIONS)
    localStorage.removeItem(SECTIONS_KEY)
  }

  function setCardVis(id: string, visible: boolean) {
    setCardVisState(prev => {
      const next = { ...prev, [id]: visible }
      localStorage.setItem(CARD_VIS_KEY, JSON.stringify(next))
      return next
    })
  }

  function applyCardVis(draft: Record<string, boolean>) {
    setCardVisState(draft)
    localStorage.setItem(CARD_VIS_KEY, JSON.stringify(draft))
  }

  function resetCardVis() {
    setCardVisState({ ...DEFAULT_CARD_VIS })
    localStorage.removeItem(CARD_VIS_KEY)
  }

  function setCardOrder(order: string[]) {
    setCardOrderState(order)
    localStorage.setItem(CARD_ORDER_KEY, JSON.stringify(order))
  }

  function resetCardOrder() {
    setCardOrderState([...DEFAULT_CARD_ORDER])
    localStorage.removeItem(CARD_ORDER_KEY)
  }

  useEffect(() => {
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections))
  }, [sections])

  return (
    <Ctx.Provider value={{
      sections, setSections, resetSections,
      cardVis, setCardVis, applyCardVis, resetCardVis,
      cardOrder, setCardOrder, resetCardOrder,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useDashboardConfig() {
  return useContext(Ctx)
}
