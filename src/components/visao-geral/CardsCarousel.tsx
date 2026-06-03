import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDashboardFilter } from '../../contexts/DashboardFilterContext'
import { useDashboardConfig } from '../../contexts/DashboardConfigContext'
import { DESCONTO, METRICAS, AVALIACAO, mesIdx } from '../../mocks/dashboardData'
import { CardDesconto }      from './cards/CardDesconto'
import { CardGaugeOperacao } from './cards/CardGaugeOperacao'
import { CardDebitos }       from './cards/CardDebitos'

const PAGE_SIZE = 3

type Slide = { id: string; configId: string; label: string; delta: number; node: React.ReactElement }

export function CardsCarousel() {
  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const { cardVis, carouselOrder } = useDashboardConfig()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  // ?? Desconto " delta na taxa de absorção ????????????????????????????????
  const desc     = DESCONTO[curIdx]
  const descPrev = DESCONTO[prevIdx]
  const totalDesc     = desc.aproveitado + desc.disponivel
  const totalDescPrev = descPrev.aproveitado + descPrev.disponivel
  const absorcaoPct     = totalDesc     > 0 ? (desc.aproveitado     / totalDesc)     * 100 : 0
  const absorcaoPctPrev = totalDescPrev > 0 ? (descPrev.aproveitado / totalDescPrev) * 100 : 0

  // ?? Operação " delta na conversão ???????????????????????????????????????
  const pedidosVal      = METRICAS['Total de Vendas'][curIdx]
  const pedidosValPrev  = METRICAS['Total de Vendas'][prevIdx]
  const intermedVal     = METRICAS['Total de Intermediações'][curIdx]
  const intermedValPrev = METRICAS['Total de Intermediações'][prevIdx]
  const convPct     = pedidosVal     > 0 ? (intermedVal     / pedidosVal)     * 100 : 0
  const convPctPrev = pedidosValPrev > 0 ? (intermedValPrev / pedidosValPrev) * 100 : 0

  // ?? Débitos " delta na redução ??????????????????????????????????????????
  const av     = AVALIACAO[curIdx]
  const avPrev = AVALIACAO[prevIdx]
  const economia      = av.debito.a - av.debito.d
  const economiaPrev  = avPrev.debito.a - avPrev.debito.d
  const reducaoPct     = av.debito.a     > 0 ? (economia     / av.debito.a)     * 100 : 0
  const reducaoPctPrev = avPrev.debito.a > 0 ? (economiaPrev / avPrev.debito.a) * 100 : 0

  const allSlides: Slide[] = [
    { id: 'desconto', configId: 'c_desconto', label: 'Aproveitado',                  delta: absorcaoPct - absorcaoPctPrev, node: <CardDesconto /> },
    { id: 'operacao', configId: 'c_gauge',    label: 'Conversão',                   delta: convPct     - convPctPrev,     node: <CardGaugeOperacao /> },
    { id: 'debitos',  configId: 'c_debitos',  label: 'Economia',                     delta: reducaoPct  - reducaoPctPrev,  node: <CardDebitos /> },
  ]

  const slides = allSlides
    .filter(s => cardVis[s.configId] !== false)
    .sort((a, b) => carouselOrder === 'desc' ? b.delta - a.delta : a.delta - b.delta)

  // Agrupa em páginas de PAGE_SIZE cards
  const pages: Slide[][] = []
  for (let i = 0; i < slides.length; i += PAGE_SIZE) {
    pages.push(slides.slice(i, i + PAGE_SIZE))
  }

  const [page, setPage]   = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setPage(p => (p + 1) % pages.length), [pages.length])
  const prev = useCallback(() => setPage(p => (p - 1 + pages.length) % pages.length), [pages.length])

  useEffect(() => { setPage(0) }, [curIdx, prevIdx])

  useEffect(() => {
    if (paused || pages.length < 2) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [paused, pages.length, next])

  if (slides.length === 0) return null

  const fmtDelta = (d: number) => `${d >= 0 ? '+' : ''}${d.toFixed(1)} pp`

  return (
    <section className="mb-5">
      {/* Carrossel — desliza páginas de PAGE_SIZE cards */}
      {/* Usa margin-left em vez de transform para não quebrar position:fixed dos modais */}
      <div
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex"
          style={{
            marginLeft: `-${page * 100}%`,
            transition: 'margin-left 700ms ease-in-out',
          }}
        >
          {pages.map((group, pi) => (
            <div
              key={pi}
              className="w-full shrink-0 grid grid-cols-1 lg:grid-cols-3 gap-5"
              style={{ gridAutoRows: '1fr' }}
            >
              {group.map(s => (
                <div key={s.id} className="h-full">{s.node}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
