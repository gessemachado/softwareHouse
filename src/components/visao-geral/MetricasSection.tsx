import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { MetricaChartModal } from './MetricaChartModal'
import { DescontoAbsorcaoModal } from './DescontoAbsorcaoModal'
import { useDashboardFilter } from '../../contexts/DashboardFilterContext'
import { getPeriodData } from '../../mocks/periodoData'
import { DESCONTO, mesIdx } from '../../mocks/dashboardData'

function fmtK(v: number) { return `R$ ${Math.round(v / 1000)}k` }
function pctStr(cur: number, prev: number) {
  if (prev === 0) return '+0.0%'
  const p = ((cur - prev) / prev) * 100
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}

export function MetricasSection() {
  const [activeChart, setActiveChart] = useState<string | null>(null)
  const [showAbsorcao, setShowAbsorcao] = useState(false)
  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const { metricas: metricasCards } = getPeriodData(selectedMonth, selectedYear, compareMonth, compareYear)

  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)
  const desc     = DESCONTO[curIdx]
  const descPrev = DESCONTO[prevIdx]
  const total        = desc.aproveitado + desc.disponivel
  const totalPrev    = descPrev.aproveitado + descPrev.disponivel
  const absorcaoPct  = total > 0 ? (desc.aproveitado / total) * 100 : 0
  const dispPct      = 100 - absorcaoPct

  const descontoData = [
    { name: 'Aproveitado', value: absorcaoPct,  fill: '#ff6600' },
    { name: 'Disponível',  value: dispPct,      fill: '#2a2a2a' },
  ]

  return (
    <>
    <div className="grid grid-cols-2 gap-5 mb-5">
      {/* Métricas de Vendas */}
      <div className="rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden">
        {/* Card header */}
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

        {/* Metrics grid */}
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

      {/* Desconto Disponibilizado */}
      {showAbsorcao && <DescontoAbsorcaoModal onClose={() => setShowAbsorcao(false)} />}
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 overflow-hidden">
        {/* Card header */}
        <div className="border-b border-[#292929] px-6 py-5"
          style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <span className="text-orange-500 text-base font-bold">%</span>
              </div>
              <div>
                <h3 className="text-white text-lg">Desconto Disponibilizado</h3>
                <p className="text-[#999] text-xs">Acompanhamento do desconto disponibilizado</p>
              </div>
            </div>
            <button
              onClick={() => setShowAbsorcao(true)}
              title="Performance de Absorção"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 transition-colors"
            >
              <BarChart2 size={15} />
            </button>
          </div>
        </div>

        <div className="p-5 flex gap-4">
          {/* Donut chart */}
          <div className="relative w-64 h-64 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={descontoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={112}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {descontoData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[#999] text-xs">Aproveitado</p>
              <p className="text-white text-2xl font-bold">{absorcaoPct.toFixed(1)}%</p>
              <p className="text-orange-500 text-sm">{fmtK(desc.aproveitado)}</p>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Disponível */}
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]/50 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                <span className="text-[#999] text-xs font-semibold tracking-widest uppercase">Disponível</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-bold">{fmtK(desc.disponivel)}</span>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${desc.disponivel <= descPrev.disponivel ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
                    {desc.disponivel <= descPrev.disponivel
                      ? <TrendingDown size={10} className="text-green-400" />
                      : <TrendingUp size={10} className="text-red-400" />}
                    <span className={`text-xs ${desc.disponivel <= descPrev.disponivel ? 'text-green-400' : 'text-red-400'}`}>
                      {pctStr(desc.disponivel, descPrev.disponivel)}
                    </span>
                  </div>
                  <span className="text-[#666] text-xs">vs {fmtK(descPrev.disponivel)}</span>
                </div>
              </div>
              <p className="text-[#555] text-[10px] mt-1">{dispPct.toFixed(1)}% restante</p>
            </div>

            {/* Aproveitado */}
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-orange-500 text-xs font-semibold tracking-widest uppercase">Aproveitado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-bold">{fmtK(desc.aproveitado)}</span>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${desc.aproveitado >= descPrev.aproveitado ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
                    {desc.aproveitado >= descPrev.aproveitado
                      ? <TrendingUp size={10} className="text-green-400" />
                      : <TrendingDown size={10} className="text-red-400" />}
                    <span className={`text-xs ${desc.aproveitado >= descPrev.aproveitado ? 'text-green-400' : 'text-red-400'}`}>
                      {pctStr(desc.aproveitado, descPrev.aproveitado)}
                    </span>
                  </div>
                  <span className="text-[#666] text-xs">vs {fmtK(descPrev.aproveitado)}</span>
                </div>
              </div>
              <p className="text-[#555] text-[10px] mt-1">{absorcaoPct.toFixed(1)}% do total</p>
            </div>

            {/* Total disponibilizado */}
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]/50 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                <span className="text-[#999] text-xs font-semibold tracking-widest uppercase">Total Disponibilizado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-bold">{fmtK(total)}</span>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${total >= totalPrev ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
                    {total >= totalPrev
                      ? <TrendingUp size={10} className="text-green-400" />
                      : <TrendingDown size={10} className="text-red-400" />}
                    <span className={`text-xs ${total >= totalPrev ? 'text-green-400' : 'text-red-400'}`}>
                      {pctStr(total, totalPrev)}
                    </span>
                  </div>
                  <span className="text-[#666] text-xs">vs {fmtK(totalPrev)}</span>
                </div>
              </div>
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
