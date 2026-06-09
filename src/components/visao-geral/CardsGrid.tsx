import { type ReactElement } from 'react'
import { useDashboardConfig } from '../../contexts/DashboardConfigContext'
import { CardNaoAproveitado } from './cards/CardNaoAproveitado'
import { CardOpProdutos }     from './cards/CardOpProdutos'
import { CardTributacao }     from './cards/CardTributacao'

// Estes 3 cards não participam do carrossel de análise
const CARD_MAP: Record<string, ReactElement> = {
  c_nao_aprov:  <CardNaoAproveitado />,
  c_op_prod:    <CardOpProdutos />,
  c_tributacao: <CardTributacao />,
}

const REMAINING_IDS = new Set(Object.keys(CARD_MAP))

export function CardsGrid() {
  const { cardOrder, cardVis } = useDashboardConfig()

  const visibleCards = cardOrder.filter(
    id => REMAINING_IDS.has(id) && cardVis[id] !== false,
  )

  if (visibleCards.length === 0) return null

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full" style={{ background: '#008080' }} />
        <span className="text-bh-text text-xs font-bold tracking-widest uppercase">Indicadores Complementares</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" style={{ gridAutoRows: '1fr' }}>
        {visibleCards.map(id => (
          <div key={id} className="h-full">{CARD_MAP[id]}</div>
        ))}
      </div>
    </div>
  )
}
