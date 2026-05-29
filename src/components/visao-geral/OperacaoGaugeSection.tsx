import { useState } from 'react'
import { TrendingDown, TrendingUp, BarChart2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useDashboardFilter } from '../../contexts/DashboardFilterContext'
import { useDashboardConfig } from '../../contexts/DashboardConfigContext'
import { METRICAS, OPERACAO, TRIBUTACAO, AVALIACAO, mesIdx } from '../../mocks/dashboardData'
import { OperacaoGaugeHistoricoModal } from './OperacaoGaugeHistoricoModal'
import { TributacaoHistoricoModal } from './TributacaoHistoricoModal'
import { DebitosHistoricoModal } from './DebitosHistoricoModal'

function fmtK(v: number) { return `R$ ${Math.round(v / 1000)}k` }
function fmtM(v: number) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`
  return `R$ ${Math.round(v / 1000)}k`
}
function pctStr(cur: number, prev: number) {
  if (prev === 0) return '+0.0%'
  const p = ((cur - prev) / prev) * 100
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}

function TrendBadge({ cur, prev }: { cur: number; prev: number }) {
  const up = cur >= prev
  return (
    <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${up ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
      {up ? <TrendingUp size={10} className="text-green-400" /> : <TrendingDown size={10} className="text-red-400" />}
      <span className={`text-xs ${up ? 'text-green-400' : 'text-red-400'}`}>{pctStr(cur, prev)}</span>
    </div>
  )
}

export function OperacaoGaugeSection() {
  const [showGaugeHistorico,  setShowGaugeHistorico]  = useState(false)
  const [showTribHistorico,   setShowTribHistorico]   = useState(false)
  const [showDebitHistorico,  setShowDebitHistorico]  = useState(false)

  const { cardVis } = useDashboardConfig()
  const vis = (id: string) => cardVis[id] !== false

  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  // — Operação —
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

  // — Tributação —
  const trib     = TRIBUTACAO[curIdx]
  const tribPrev = TRIBUTACAO[prevIdx]

  const tribTotal    = trib.tributado + trib.isento
  const tribTotalPrev = tribPrev.tributado + tribPrev.isento
  const tribPct      = tribTotal > 0 ? (trib.tributado / tribTotal) * 100 : 0

  const tribDonutData = [
    { value: tribPct,       fill: '#f97316' },
    { value: 100 - tribPct, fill: '#22c55e' },
  ]

  // — Débitos —
  const av     = AVALIACAO[curIdx]
  const avPrev = AVALIACAO[prevIdx]

  const debitoA      = av.debito.a
  const debitoD      = av.debito.d
  const debitoAPrev  = avPrev.debito.a
  const debitoDPrev  = avPrev.debito.d
  const economia     = debitoA - debitoD
  const economiaPrev = debitoAPrev - debitoDPrev
  const reducaoPct   = debitoA > 0 ? (economia / debitoA) * 100 : 0
  const reducaoPctPrev = debitoAPrev > 0 ? (economiaPrev / debitoAPrev) * 100 : 0

  const debitoDonutData = [
    { value: 100 - reducaoPct, fill: '#ef4444' },
    { value: reducaoPct,       fill: '#22c55e' },
  ]

  return (
    <div className="grid grid-cols-3 gap-5 mb-5">
      {showGaugeHistorico && <OperacaoGaugeHistoricoModal onClose={() => setShowGaugeHistorico(false)} />}
      {showTribHistorico  && <TributacaoHistoricoModal    onClose={() => setShowTribHistorico(false)} />}
      {showDebitHistorico && <DebitosHistoricoModal       onClose={() => setShowDebitHistorico(false)} />}

      {/* -- Card 1: Gauge Operação ------------------------------------------- */}
      {vis('c_gauge') && <div className="rounded-xl border border-bh-border/50 bg-bh-bg overflow-hidden">
        {/* Header */}
        <div className="border-b border-bh-border px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <span className="text-green-400 text-base font-bold">%</span>
              </div>
              <div>
                <h3 className="text-bh-text text-lg">Operação | Pedidos / Intermediações</h3>
                <p className="text-bh-muted text-xs">Acompanhamento da taxa de conversão</p>
              </div>
            </div>
            <button onClick={() => setShowGaugeHistorico(true)}
              className="flex items-center gap-1.5 rounded-lg border border-bh-border/40 text-bh-subtle hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors shrink-0 ml-3">
              <BarChart2 size={12} />
              <span>Histórico</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col sm:flex-row gap-4">
          {/* Donut */}
          <div className="relative w-full sm:w-52 h-52 sm:shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gaugeData} cx="50%" cy="50%"
                  innerRadius={62} outerRadius={88}
                  startAngle={90} endAngle={-270}
                  dataKey="value" strokeWidth={0}>
                  {gaugeData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-bh-muted text-xs">Conversão</p>
              <p className="text-bh-text text-xl font-bold">{convPct.toFixed(1)}%</p>
            </div>
          </div>

          {/* Metric rows */}
          <div className="flex-1 flex flex-col gap-2">
            {vis('c_gauge.pedidos') && <div className="rounded-lg border border-bh-surface2 bg-bh-surface px-3 py-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b7280]" />
                <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase">
                  Pedidos | {op.pedido}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-xs font-bold">{fmtK(pedidosVal)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={pedidosVal} prev={pedidosValPrev} />
                  <span className="text-bh-subtle text-[10px]">vs {fmtK(pedidosValPrev)}</span>
                </div>
              </div>
            </div>}

            {/* Intermediações */}
            {vis('c_gauge.intermediacoes') && <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-green-400 text-[10px] font-semibold tracking-widest uppercase">
                  Interm. | {op.intermediacao}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-xs font-bold">{fmtK(intermedVal)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={intermedVal} prev={intermedValPrev} />
                  <span className="text-bh-subtle text-[10px]">vs {fmtK(intermedValPrev)}</span>
                </div>
              </div>
              <p className="text-bh-subtle text-[9px] mt-0.5">{convPct.toFixed(1)}% do total</p>
            </div>}

            {/* Conversão */}
            {vis('c_gauge.conversao') && <div className="rounded-lg border border-green-500/10 bg-green-500/5 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase">Conversão</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-400 text-xs font-bold font-mono">{convPct.toFixed(2)}%</span>
                  <TrendBadge cur={convPct} prev={convPctPrev} />
                </div>
              </div>
              <p className="text-bh-subtle text-[9px] mt-0.5">vs {convPctPrev.toFixed(2)}% anterior</p>
            </div>}
          </div>
        </div>
      </div>}

      {/* -- Card 2: Tributação de Produtos ---------------------------------- */}
      {vis('c_tributacao') && <div className="rounded-xl border border-bh-border/50 bg-bh-bg overflow-hidden">
        {/* Header */}
        <div className="border-b border-bh-border px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                <span className="text-orange-400 text-base font-bold">T</span>
              </div>
              <div>
                <h3 className="text-bh-text text-lg">Tributação de Produtos</h3>
                <p className="text-bh-muted text-xs">Volume de vendas por regime tributário</p>
              </div>
            </div>
            <button onClick={() => setShowTribHistorico(true)}
              className="flex items-center gap-1.5 rounded-lg border border-bh-border/40 text-bh-subtle hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors shrink-0 ml-3">
              <BarChart2 size={12} />
              <span>Histórico</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col sm:flex-row gap-4">
          {/* Donut */}
          <div className="relative w-full sm:w-52 h-52 sm:shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tribDonutData} cx="50%" cy="50%"
                  innerRadius={62} outerRadius={88}
                  startAngle={90} endAngle={-270}
                  dataKey="value" strokeWidth={0}>
                  {tribDonutData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-bh-muted text-xs">Tributado</p>
              <p className="text-bh-text text-xl font-bold">{tribPct.toFixed(1)}%</p>
              <p className="text-orange-500 text-sm">{fmtK(trib.tributado)}</p>
            </div>
          </div>

          {/* Metric rows */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Tributado */}
            {vis('c_tributacao.tributado') && <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-orange-500 text-xs font-semibold tracking-widest uppercase">Tributado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtK(trib.tributado)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={trib.tributado} prev={tribPrev.tributado} />
                  <span className="text-bh-subtle text-xs">vs {fmtK(tribPrev.tributado)}</span>
                </div>
              </div>
              <p className="text-bh-subtle text-[10px] mt-1">{tribPct.toFixed(1)}% do total</p>
            </div>}

            {/* Isento */}
            {vis('c_tributacao.isento') && <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">Isento</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtK(trib.isento)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={trib.isento} prev={tribPrev.isento} />
                  <span className="text-bh-subtle text-xs">vs {fmtK(tribPrev.isento)}</span>
                </div>
              </div>
              <p className="text-bh-subtle text-[10px] mt-1">{(100 - tribPct).toFixed(1)}% do total</p>
            </div>}

            {/* Total */}
            {vis('c_tributacao.total') && <div className="rounded-lg border border-bh-surface2 bg-bh-surface px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                <span className="text-bh-muted text-xs font-semibold tracking-widest uppercase">Total Vendas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtK(tribTotal)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={tribTotal} prev={tribTotalPrev} />
                  <span className="text-bh-subtle text-xs">vs {fmtK(tribTotalPrev)}</span>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>}

      {/* -- Card 3: Total de Débitos ---------------------------------------- */}
      {vis('c_debitos') && <div className="rounded-xl border border-bh-border/50 bg-bh-bg overflow-hidden">
        {/* Header */}
        <div className="border-b border-bh-border px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <span className="text-red-400 text-base font-bold">D</span>
              </div>
              <div>
                <h3 className="text-bh-text text-lg">Total de Débitos</h3>
                <p className="text-bh-muted text-xs">Antes e depois BuyHelp</p>
              </div>
            </div>
            <button onClick={() => setShowDebitHistorico(true)}
              className="flex items-center gap-1.5 rounded-lg border border-bh-border/40 text-bh-subtle hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors shrink-0 ml-3">
              <BarChart2 size={12} />
              <span>Histórico</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col sm:flex-row gap-4">
          {/* Donut */}
          <div className="relative w-full sm:w-52 h-52 sm:shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={debitoDonutData} cx="50%" cy="50%"
                  innerRadius={62} outerRadius={88}
                  startAngle={90} endAngle={-270}
                  dataKey="value" strokeWidth={0}>
                  {debitoDonutData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-bh-muted text-xs">Redução</p>
              <p className="text-bh-text text-xl font-bold">{reducaoPct.toFixed(1)}%</p>
              <p className="text-green-400 text-sm">{fmtM(economia)}</p>
            </div>
          </div>

          {/* Metric rows */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Antes */}
            {vis('c_debitos.antes') && <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-red-400 text-xs font-semibold tracking-widest uppercase">Antes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtM(debitoA)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={debitoA} prev={debitoAPrev} />
                  <span className="text-bh-subtle text-xs">vs {fmtM(debitoAPrev)}</span>
                </div>
              </div>
              <p className="text-bh-subtle text-[10px] mt-1">Sem BuyHelp</p>
            </div>}

            {/* Depois */}
            {vis('c_debitos.depois') && <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">Depois</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtM(debitoD)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={debitoD} prev={debitoDPrev} />
                  <span className="text-bh-subtle text-xs">vs {fmtM(debitoDPrev)}</span>
                </div>
              </div>
              <p className="text-bh-subtle text-[10px] mt-1">Com BuyHelp</p>
            </div>}

            {/* Economia */}
            {vis('c_debitos.economia') && <div className="rounded-lg border border-bh-surface2 bg-bh-surface px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-bh-muted text-xs font-semibold tracking-widest uppercase">Economia</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-400 text-sm font-bold">{fmtM(economia)}</span>
                  <TrendBadge cur={reducaoPct} prev={reducaoPctPrev} />
                </div>
              </div>
              <p className="text-bh-subtle text-[10px] mt-1">vs {fmtM(economiaPrev)} anterior · {reducaoPct.toFixed(1)}% redução</p>
            </div>}
          </div>
        </div>
      </div>}

    </div>
  )
}
