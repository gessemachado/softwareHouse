import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'
import { MetricaChartModal } from './MetricaChartModal'
import { useDashboardFilter } from '../../contexts/DashboardFilterContext'
import { getPeriodData } from '../../mocks/periodoData'
import { METRICAS, mesIdx } from '../../mocks/dashboardData'

function pctStr(cur: number, prev: number) {
  if (prev === 0) return '+0.0%'
  const p = ((cur - prev) / prev) * 100
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}
function fmtK(v: number) { return `R$ ${Math.round(v / 1000)}k` }

export function MetricasSection() {
  const [activeChart, setActiveChart] = useState<string | null>(null)
  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const { metricas: metricasCards } = getPeriodData(selectedMonth, selectedYear, compareMonth, compareYear)

  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  const qtdInter    = METRICAS['Qtd de Intermediações'][curIdx]
  const qtdInterP   = METRICAS['Qtd de Intermediações'][prevIdx]
  const totalInter  = METRICAS['Total de Intermediações'][curIdx]
  const totalInterP = METRICAS['Total de Intermediações'][prevIdx]
  const descUsado   = METRICAS['Desconto Usado'][curIdx]
  const descUsadoP  = METRICAS['Desconto Usado'][prevIdx]

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
      {/* Métricas de Vendas */}
      <div className="rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden">
        <div className="border-b border-[#292929] px-6 py-5"
          style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <TrendingUp size={18} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-white text-lg">Métricas de Vendas</h3>
              <p className="text-[#999] text-xs">Principais indicadores de performance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-5">
          {metricasCards.map((card) => (
            <div key={card.label} className="relative rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/50 p-4">
              <button
                onClick={() => setActiveChart(card.label)}
                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-md text-[#444] hover:text-orange-500 hover:bg-orange-500/10 transition-colors"
                title="Ver gráfico"
              >
                <BarChart2 size={14} />
              </button>
              <p className="text-[#999] text-sm mb-3">{card.label}</p>
              <p className="text-white text-2xl font-light mb-3">{card.value}</p>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 rounded px-2 py-1 ${card.positive ? 'bg-green-400/10' : 'bg-red-500/10'}`}>
                  {card.positive
                    ? <TrendingUp size={12} className="text-green-400" />
                    : <TrendingDown size={12} className="text-red-400" />
                  }
                  <span className={`text-sm ${card.positive ? 'text-green-400' : 'text-red-400'}`}>{card.change}</span>
                </div>
                <span className="text-[#666] text-xs">{card.vs}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Intermediações */}
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 overflow-hidden">
        <div className="border-b border-[#292929] px-6 py-5"
          style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 10h16M6 5l-4 5 4 5M14 5l4 5-4 5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Intermediações</h3>
              <p className="text-[#999] text-xs">Operações de intermediação</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-5">
          {/* Qtd de Intermediações */}
          <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M2 10h16M6 5l-4 5 4 5M14 5l4 5-4 5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[#999] text-xs">Qtd de Intermediações</span>
              </div>
              <button onClick={() => setActiveChart('Qtd de Intermediações')}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-[#555] hover:text-purple-400 hover:border-purple-500/40 hover:bg-purple-500/5 transition-colors">
                <BarChart2 size={13} />
              </button>
            </div>
            <p className="text-white text-2xl font-light mb-3">{qtdInter}</p>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 rounded px-2 py-1 ${qtdInter >= qtdInterP ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {qtdInter >= qtdInterP
                  ? <TrendingUp size={12} className="text-green-400" />
                  : <TrendingDown size={12} className="text-red-400" />}
                <span className={`text-sm ${qtdInter >= qtdInterP ? 'text-green-400' : 'text-red-400'}`}>
                  {pctStr(qtdInter, qtdInterP)}
                </span>
              </div>
              <span className="text-[#666] text-xs">vs {qtdInterP} Ant.</span>
            </div>
          </div>

          {/* Total de Intermediações */}
          <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M2 10h16M6 5l-4 5 4 5M14 5l4 5-4 5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[#999] text-xs">Total de Intermediações</span>
              </div>
              <button onClick={() => setActiveChart('Total de Intermediações')}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-[#555] hover:text-purple-400 hover:border-purple-500/40 hover:bg-purple-500/5 transition-colors">
                <BarChart2 size={13} />
              </button>
            </div>
            <p className="text-white text-2xl font-light mb-3">{fmtK(totalInter)}</p>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 rounded px-2 py-1 ${totalInter >= totalInterP ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {totalInter >= totalInterP
                  ? <TrendingUp size={12} className="text-green-400" />
                  : <TrendingDown size={12} className="text-red-400" />}
                <span className={`text-sm ${totalInter >= totalInterP ? 'text-green-400' : 'text-red-400'}`}>
                  {pctStr(totalInter, totalInterP)}
                </span>
              </div>
              <span className="text-[#666] text-xs">vs {fmtK(totalInterP)} Ant.</span>
            </div>
          </div>

          {/* Desconto Usado */}
          <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <span className="text-red-400 text-sm font-bold">%</span>
                </div>
                <span className="text-[#999] text-xs">Desconto Usado</span>
              </div>
              <button onClick={() => setActiveChart('Desconto Usado')}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-[#555] hover:text-purple-400 hover:border-purple-500/40 hover:bg-purple-500/5 transition-colors">
                <BarChart2 size={13} />
              </button>
            </div>
            <p className="text-white text-2xl font-light mb-3">{fmtK(descUsado)}</p>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 rounded px-2 py-1 ${descUsado >= descUsadoP ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {descUsado >= descUsadoP
                  ? <TrendingUp size={12} className="text-green-400" />
                  : <TrendingDown size={12} className="text-red-400" />}
                <span className={`text-sm ${descUsado >= descUsadoP ? 'text-green-400' : 'text-red-400'}`}>
                  {pctStr(descUsado, descUsadoP)}
                </span>
              </div>
              <span className="text-[#666] text-xs">vs {fmtK(descUsadoP)} Ant.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {activeChart && (
      <MetricaChartModal
        metricLabel={activeChart}
        onClose={() => setActiveChart(null)}
      />
    )}
    </>
  )
}
