import { useState } from 'react'
import { BarChart2, Activity } from 'lucide-react'
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
    <div className="rounded-xl border border-bh-border/50 bg-bh-bg overflow-hidden h-full flex flex-col">
      {showGaugeHistorico && <OperacaoGaugeHistoricoModal onClose={() => setShowGaugeHistorico(false)} />}

      <div className="border-b border-bh-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
              <Activity size={16} className="text-green-400" />
            </div>
            <div>
              <h3 className="text-bh-text text-sm font-semibold leading-tight">Operação | Pedidos / Intermediações</h3>
              <p className="text-bh-muted text-[11px] mt-0.5">Acompanhamento da taxa de conversão</p>
            </div>
          </div>
          <button onClick={() => setShowGaugeHistorico(true)}
            className="flex items-center gap-1.5 rounded-lg border border-bh-border/40 text-bh-subtle hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors shrink-0 ml-3">
            <BarChart2 size={12} /><span>Histórico</span>
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col sm:flex-row gap-4 flex-1">
        {/* Donut */}
        <div className="relative w-full sm:w-44 h-44 sm:shrink-0 self-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={gaugeData} cx="50%" cy="50%"
                innerRadius={54} outerRadius={76}
                startAngle={90} endAngle={-270}
                dataKey="value" strokeWidth={0}>
                {gaugeData.map((_, i) => <Cell key={i} fill={gaugeData[i].fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-bh-muted text-[10px] uppercase tracking-wider font-medium">Conversão</p>
            <p className="text-green-400 text-2xl font-bold leading-tight">{convPct.toFixed(1)}%</p>
          </div>
        </div>

        {/* Subitens */}
        <div className="flex-1 flex flex-col gap-2 justify-center">
          {vis('c_gauge.pedidos') && (
            <div className="rounded-lg border border-bh-surface2/80 bg-bh-surface2/20 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-bh-subtle shrink-0" />
                <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase flex-1">
                  Pedidos <span className="text-bh-subtle font-normal">| {op.pedido}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtK(pedidosVal)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={pedidosVal} prev={pedidosValPrev} />
                  <span className="text-bh-subtle text-[10px]">vs {fmtK(pedidosValPrev)}</span>
                </div>
              </div>
            </div>
          )}
          {vis('c_gauge.intermediacoes') && (
            <div className="rounded-lg border border-green-500/25 bg-green-500/8 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-green-400 text-[10px] font-semibold tracking-widest uppercase flex-1">
                  Interm. <span className="text-green-400/60 font-normal">| {op.intermediacao}</span>
                </span>
                <span className="text-bh-subtle text-[10px]">{convPct.toFixed(1)}% do total</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtK(intermedVal)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={intermedVal} prev={intermedValPrev} />
                  <span className="text-bh-subtle text-[10px]">vs {fmtK(intermedValPrev)}</span>
                </div>
              </div>
            </div>
          )}
          {vis('c_gauge.conversao') && (
            <div className="rounded-lg border border-green-500/15 bg-green-500/5 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase">Taxa de Conversão</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-400 text-sm font-bold font-mono">{convPct.toFixed(2)}%</span>
                  <TrendBadge cur={convPct} prev={convPctPrev} />
                </div>
              </div>
              <p className="text-bh-subtle text-[10px] mt-1">vs {convPctPrev.toFixed(2)}% período anterior</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
