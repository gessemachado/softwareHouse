import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { MetricaChartModal } from './MetricaChartModal'

const metricasCards = [
  { label: 'Qtd de Pedidos', value: '262', change: '+7.4%', vs: 'vs 244 Ant.', positive: true },
  { label: 'Total de Vendas', value: 'R$ 172k', change: '+5.3%', vs: 'vs R$ 163k Ant.', positive: true },
  { label: 'Clientes que Compraram', value: '35', change: '+6.1%', vs: 'vs 33 Ant.', positive: true },
  { label: 'Ticket Médio', value: 'R$ 148,50', change: '+5.7%', vs: 'vs R$ 140,50 Ant.', positive: true },
]

const descontoData = [
  { name: 'Aproveitado', value: 62.4, fill: '#ff6600' },
  { name: 'Disponível', value: 37.6, fill: '#2a2a2a' },
]

export function MetricasSection() {
  const [activeChart, setActiveChart] = useState<string | null>(null)

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
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 overflow-hidden">
        {/* Card header */}
        <div className="border-b border-[#292929] px-6 py-5"
          style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <span className="text-orange-500 text-base font-bold">%</span>
            </div>
            <div>
              <h3 className="text-white text-lg">Desconto Disponibilizado</h3>
              <p className="text-[#999] text-xs">Acompanhamento do desconto disponibilizado</p>
            </div>
          </div>
        </div>

        <div className="p-5 flex gap-6">
          {/* Donut chart */}
          <div className="relative w-52 h-52 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={descontoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
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
              <p className="text-white text-2xl font-bold">62.4%</p>
              <p className="text-orange-500 text-sm">R$ 5.300</p>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Disponível */}
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]/50 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                <span className="text-[#999] text-[9px] font-semibold tracking-widest uppercase">Disponível</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white text-xs font-bold">R$ 3.200</span>
                <div className="flex items-center gap-1 bg-red-400/10 rounded px-1.5 py-0.5">
                  <TrendingDown size={10} className="text-red-400" />
                  <span className="text-red-400 text-xs">-2.1%</span>
                </div>
                <span className="text-white text-xs">vs 3.194 Ant.</span>
              </div>
              <p className="text-[#999] text-[8px] mt-1">37.6% restante</p>
            </div>

            {/* Aproveitado */}
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-orange-500 text-[9px] font-semibold tracking-widest uppercase">Aproveitado</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white text-xs font-bold">R$5.300</span>
                <div className="flex items-center gap-1 bg-green-400/10 rounded px-1.5 py-0.5">
                  <TrendingUp size={10} className="text-green-400" />
                  <span className="text-green-400 text-xs">+5.1%</span>
                </div>
                <span className="text-white text-xs">vs 5.042 Ant.</span>
              </div>
              <p className="text-[#999] text-[8px] mt-1">62.4% do total</p>
            </div>

            {/* Total disponibilizado */}
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]/50 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                <span className="text-[#999] text-[9px] font-semibold tracking-widest uppercase">Total Disponibilizado</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white text-xs font-bold">R$ 8.500</span>
                <div className="flex items-center gap-1 bg-red-400/10 rounded px-1.5 py-0.5">
                  <TrendingDown size={10} className="text-red-400" />
                  <span className="text-red-400 text-xs">-2.1%</span>
                </div>
                <span className="text-white text-xs">vs 3.194 Ant.</span>
              </div>
              <p className="text-[#999] text-[8px] mt-1">37.6% restante</p>
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
