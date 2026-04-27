import { useState } from 'react'
import { BarChart2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { OperacaoGaugeHistoricoModal } from '../OperacaoGaugeHistoricoModal'
import { useDashboardFilter } from '../../../contexts/DashboardFilterContext'
import { useDashboardConfig } from '../../../contexts/DashboardConfigContext'
import { METRICAS, OPERACAO, mesIdx } from '../../../mocks/dashboardData'
import { fmtK, TrendBadge } from './shared'

export function CardGaugeOperacao() {
  const [showGaugeHistorico, setShowGaugeHistorico] = useState(false)
  const { cardVis } = useDashboardConfig()
  const vis = (id: string) => cardVis[id] !== false
  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  const op     = OPERACAO[curIdx]
  const pedidosVal      = METRICAS['Total de Vendas'][curIdx]
  const pedidosValPrev  = METRICAS['Total de Vendas'][prevIdx]
  const intermedVal     = METRICAS['Total de Intermediações'][curIdx]
  const intermedValPrev = METRICAS['Total de Intermediações'][prevIdx]
  const convPct     = pedidosVal > 0 ? (intermedVal / pedidosVal) * 100 : 0
  const convPctPrev = pedidosValPrev > 0 ? (intermedValPrev / pedidosValPrev) * 100 : 0

  const gaugeData = [
    { value: convPct,       fill: '#22c55e' },
    { value: 100 - convPct, fill: '#1a2a1a' },
  ]

  return (
    <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 overflow-hidden h-full flex flex-col">
      {showGaugeHistorico && <OperacaoGaugeHistoricoModal onClose={() => setShowGaugeHistorico(false)} />}
      <div className="border-b border-[#292929] px-6 py-5"
        style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <span className="text-green-400 text-base font-bold">%</span>
            </div>
            <div>
              <h3 className="text-white text-lg">Operação | Pedidos / Intermediações</h3>
              <p className="text-[#999] text-xs">Acompanhamento da taxa de conversão</p>
            </div>
          </div>
          <button onClick={() => setShowGaugeHistorico(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors shrink-0 ml-3">
            <BarChart2 size={12} /><span>Histórico</span>
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative w-full sm:w-52 h-52 sm:shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={gaugeData} cx="50%" cy="50%"
                innerRadius={62} outerRadius={88}
                startAngle={90} endAngle={-270}
                dataKey="value" strokeWidth={0}>
                {gaugeData.map((_, i) => <Cell key={i} fill={gaugeData[i].fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[#999] text-xs">Conversão</p>
            <p className="text-white text-xl font-bold">{convPct.toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {vis('c_gauge.pedidos') && <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]/50 px-3 py-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6b7280]" />
              <span className="text-[#999] text-[10px] font-semibold tracking-widest uppercase">
                Pedidos | {op.pedido}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-bold">{fmtK(pedidosVal)}</span>
              <div className="flex items-center gap-1.5">
                <TrendBadge cur={pedidosVal} prev={pedidosValPrev} />
                <span className="text-[#666] text-[10px]">vs {fmtK(pedidosValPrev)}</span>
              </div>
            </div>
          </div>}
          {vis('c_gauge.intermediacoes') && <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-green-400 text-[10px] font-semibold tracking-widest uppercase">
                Interm. | {op.intermediacao}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-bold">{fmtK(intermedVal)}</span>
              <div className="flex items-center gap-1.5">
                <TrendBadge cur={intermedVal} prev={intermedValPrev} />
                <span className="text-[#666] text-[10px]">vs {fmtK(intermedValPrev)}</span>
              </div>
            </div>
            <p className="text-[#555] text-[9px] mt-0.5">{convPct.toFixed(1)}% do total</p>
          </div>}
          {vis('c_gauge.conversao') && <div className="rounded-lg border border-green-500/10 bg-green-500/5 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[#999] text-[10px] font-semibold tracking-widest uppercase">Conversão</span>
              <div className="flex items-center gap-1.5">
                <span className="text-green-400 text-xs font-bold font-mono">{convPct.toFixed(2)}%</span>
                <TrendBadge cur={convPct} prev={convPctPrev} />
              </div>
            </div>
            <p className="text-[#555] text-[9px] mt-0.5">vs {convPctPrev.toFixed(2)}% anterior</p>
          </div>}
          {vis('c_gauge.nao_conversao') && <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-red-400 text-[10px] font-semibold tracking-widest uppercase">Não Converteu</span>
              <div className="flex items-center gap-1.5">
                <span className="text-red-400 text-xs font-bold font-mono">{(100 - convPct).toFixed(2)}%</span>
                <TrendBadge cur={100 - convPct} prev={100 - convPctPrev} />
              </div>
            </div>
            <p className="text-[#555] text-[9px] mt-0.5">vs {(100 - convPctPrev).toFixed(2)}% anterior</p>
          </div>}
        </div>
      </div>
    </div>
  )
}
