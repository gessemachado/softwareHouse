import { useState } from 'react'
import { TrendingDown, TrendingUp, BarChart2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { MetricaChartModal } from './MetricaChartModal'
import { OperacaoHistoricoModal } from './OperacaoHistoricoModal'
import { useDashboardFilter } from '../../contexts/DashboardFilterContext'
import { METRICAS, OPERACAO, mesIdx } from '../../mocks/dashboardData'

function fmtK(v: number) {
  return `R$ ${Math.round(v / 1000)}k`
}
function pctStr(cur: number, prev: number) {
  if (prev === 0) return '+0.0%'
  const p = ((cur - prev) / prev) * 100
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}

export function IntermediacoesSection() {
  const [activeChart, setActiveChart] = useState<string | null>(null)
  const [showOperacao, setShowOperacao] = useState(false)

  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  // Intermediações metrics
  const qtdInter    = METRICAS['Qtd de Intermediações'][curIdx]
  const qtdInterP   = METRICAS['Qtd de Intermediações'][prevIdx]
  const totalInter  = METRICAS['Total de Intermediações'][curIdx]
  const totalInterP = METRICAS['Total de Intermediações'][prevIdx]
  const descUsado   = METRICAS['Desconto Usado'][curIdx]
  const descUsadoP  = METRICAS['Desconto Usado'][prevIdx]

  // Operação metrics
  const op      = OPERACAO[curIdx]
  const opPrev  = OPERACAO[prevIdx]
  const naoAprov     = op.mesmaTrib + op.somenteItem + op.naoAceitou
  const naoAprovPrev = opPrev.mesmaTrib + opPrev.somenteItem + opPrev.naoAceitou
  const absorcao     = op.pedido > 0 ? (op.intermediacao / op.pedido) * 100 : 0
  const absorcaoPrev = opPrev.pedido > 0 ? (opPrev.intermediacao / opPrev.pedido) * 100 : 0

  const operacaoData = [
    { name: 'Aproveitado',    value: absorcao,          fill: '#ff6600' },
    { name: 'Não Aproveitado', value: 100 - absorcao,   fill: '#01baef' },
  ]

  return (
    <div className="grid grid-cols-2 gap-5 mb-5">
      {activeChart && <MetricaChartModal metricLabel={activeChart} onClose={() => setActiveChart(null)} />}

      {/* Intermediações */}
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 overflow-hidden">
        {/* Header */}
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

        {/* Metrics grid */}
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

      {/* Operação */}
      {showOperacao && <OperacaoHistoricoModal onClose={() => setShowOperacao(false)} />}
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#292929] px-6 py-5"
          style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <span className="text-orange-500 text-base font-bold">%</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Operação</h3>
                <p className="text-[#999] text-xs">Acompanhamento da operação | Pedido / Intermediação</p>
              </div>
            </div>
            <button
              onClick={() => setShowOperacao(true)}
              title="Evolução 13 Meses"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 transition-colors"
            >
              <BarChart2 size={15} />
            </button>
          </div>
        </div>

        <div className="p-5 flex gap-4">
          {/* Donut */}
          <div className="relative w-64 h-64 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={operacaoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={112}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {operacaoData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <div className="text-center">
                <p className="text-[#999] text-xs">Aproveitado</p>
                <p className="text-orange-500 text-2xl font-bold">{absorcao.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-[#999] text-xs">Não Aproveitado</p>
                <p className="text-cyan-400 text-base font-bold">{(100 - absorcao).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 flex flex-col gap-2">
            {/* PEDIDO */}
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]/50 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#6b7280]" />
                <span className="text-[#999] text-xs font-semibold tracking-widest uppercase">PEDIDO | {op.pedido}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${op.pedido >= opPrev.pedido ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
                    {op.pedido >= opPrev.pedido
                      ? <TrendingUp size={10} className="text-green-400" />
                      : <TrendingDown size={10} className="text-red-400" />}
                    <span className={`text-xs ${op.pedido >= opPrev.pedido ? 'text-green-400' : 'text-red-400'}`}>
                      {pctStr(op.pedido, opPrev.pedido)}
                    </span>
                  </div>
                  <span className="text-[#666] text-xs">vs {opPrev.pedido}</span>
                </div>
              </div>
            </div>

            {/* INTERMEDIAÇÃO */}
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-orange-500 text-xs font-semibold tracking-widest uppercase">INTERM. | {op.intermediacao}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${op.intermediacao >= opPrev.intermediacao ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
                    {op.intermediacao >= opPrev.intermediacao
                      ? <TrendingUp size={10} className="text-green-400" />
                      : <TrendingDown size={10} className="text-red-400" />}
                    <span className={`text-xs ${op.intermediacao >= opPrev.intermediacao ? 'text-green-400' : 'text-red-400'}`}>
                      {pctStr(op.intermediacao, opPrev.intermediacao)}
                    </span>
                  </div>
                  <span className="text-[#666] text-xs">vs {opPrev.intermediacao}</span>
                </div>
                <span className="text-[#555] text-[10px]">{absorcao.toFixed(1)}% do total</span>
              </div>
            </div>

            {/* NÃO APROVEITADO */}
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]/50 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                <div className="flex items-center justify-between flex-1">
                  <span className="text-[#999] text-xs font-semibold tracking-widest uppercase">NÃO APROV. | {naoAprov}</span>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${naoAprov <= naoAprovPrev ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
                      {naoAprov <= naoAprovPrev
                        ? <TrendingDown size={10} className="text-green-400" />
                        : <TrendingUp size={10} className="text-red-400" />}
                      <span className={`text-xs ${naoAprov <= naoAprovPrev ? 'text-green-400' : 'text-red-400'}`}>
                        {pctStr(naoAprov, naoAprovPrev)}
                      </span>
                    </div>
                    <span className="text-[#666] text-xs">vs {naoAprovPrev}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1 pl-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-[#777]">
                    <span className="w-1.5 h-1.5 rounded-sm shrink-0 bg-[#fca5a5]" />Mesma Tributação
                  </span>
                  <span className="text-white text-xs font-bold">{op.mesmaTrib}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-[#777]">
                    <span className="w-1.5 h-1.5 rounded-sm shrink-0 bg-[#b45309]" />Somente um Item
                  </span>
                  <span className="text-white text-xs font-bold">{op.somenteItem}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-[#777]">
                    <span className="w-1.5 h-1.5 rounded-sm shrink-0 bg-[#7f1d1d]" />Cliente não aceitou
                  </span>
                  <span className="text-white text-xs font-bold">{op.naoAceitou}</span>
                </div>
              </div>
            </div>

            {/* Taxa de Conversão */}
            <div className="rounded-lg border border-orange-500/10 bg-orange-500/5 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[#999] text-xs font-semibold tracking-widest uppercase">Conversão</span>
                <div className="flex items-center gap-2">
                  <span className="text-orange-400 text-sm font-bold font-mono">{absorcao.toFixed(1)}%</span>
                  <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${absorcao >= absorcaoPrev ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
                    {absorcao >= absorcaoPrev
                      ? <TrendingUp size={10} className="text-green-400" />
                      : <TrendingDown size={10} className="text-red-400" />}
                    <span className={`text-xs ${absorcao >= absorcaoPrev ? 'text-green-400' : 'text-red-400'}`}>
                      {pctStr(absorcao, absorcaoPrev)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
