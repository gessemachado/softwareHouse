import { type ReactElement } from 'react'
import { useDashboardConfig } from '../../contexts/DashboardConfigContext'
import { CardDesconto }       from './cards/CardDesconto'
import { CardNaoAproveitado } from './cards/CardNaoAproveitado'
import { CardOpProdutos }     from './cards/CardOpProdutos'
import { CardGaugeOperacao }  from './cards/CardGaugeOperacao'
import { CardTributacao }     from './cards/CardTributacao'
import { CardDebitos }        from './cards/CardDebitos'

const CARD_MAP: Record<string, ReactElement> = {
  c_desconto:   <CardDesconto />,
  c_nao_aprov:  <CardNaoAproveitado />,
  c_op_prod:    <CardOpProdutos />,
  c_gauge:      <CardGaugeOperacao />,
  c_tributacao: <CardTributacao />,
  c_debitos:    <CardDebitos />,
}

export function CardsGrid() {
  const { cardOrder, cardVis } = useDashboardConfig()

  const visibleCards = cardOrder.filter(id => cardVis[id] !== false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5"
      style={{ gridAutoRows: '1fr' }}>
      {visibleCards.map(id => (
        <div key={id} className="h-full">{CARD_MAP[id]}</div>
      ))}
    </div>
  )
}
