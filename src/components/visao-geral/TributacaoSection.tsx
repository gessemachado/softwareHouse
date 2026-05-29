import { TrendingDown, TrendingUp, HelpCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useDashboardFilter } from '../../contexts/DashboardFilterContext'
import { TRIBUTACAO, mesIdx } from '../../mocks/dashboardData'

function fmtK(v: number) { return `R$ ${Math.round(v / 1000)}k` }
function fmt(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}
function pctStr(cur: number, prev: number) {
  if (prev === 0) return '+0.0%'
  const p = ((cur - prev) / prev) * 100
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}

function TrendBadge({ cur, prev }: { cur: number; prev: number }) {
  const up = cur >= prev
  return (
    <div className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 ${up ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
      {up ? <TrendingUp size={10} className="text-green-400" /> : <TrendingDown size={10} className="text-red-400" />}
      <span className={`text-[10px] font-semibold ${up ? 'text-green-400' : 'text-red-400'}`}>{pctStr(cur, prev)}</span>
    </div>
  )
}

export function TributacaoSection() {
  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  const trib     = TRIBUTACAO[curIdx]
  const tribPrev = TRIBUTACAO[prevIdx]

  const chartData = [
    { name: 'Tributado', atual: trib.tributado, anterior: tribPrev.tributado, color: '#f97316' },
    { name: 'Isento',    atual: trib.isento,    anterior: tribPrev.isento,    color: '#22c55e' },
  ]

  return (
    <div className="grid grid-cols-3 gap-5 mb-5">
      <div className="rounded-xl border border-bh-border/50 bg-bh-bg overflow-hidden flex flex-col">

        {/* Header */}
        <div className="border-b border-bh-border px-6 py-5 bg-bh-surface2">
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
            <div className="relative group cursor-help shrink-0 ml-3">
              <HelpCircle size={14} className="text-bh-subtle hover:text-bh-muted transition-colors" />
              <div className="absolute bottom-full right-0 mb-2 w-60 bg-bh-surface2 border border-bh-border text-bh-muted text-[10px] rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 leading-relaxed shadow-xl">
                Volume de vendas dividido entre produtos tributados (com incidência de impostos) e isentos (sem incidência). Barras escuras = período anterior.
                <div className="absolute top-full right-3 border-4 border-transparent border-t-bh-surface2" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 px-2">
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={chartData} barGap={3} barCategoryGap="35%">
              <XAxis dataKey="name" tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: '#374151', fontWeight: 600 }}
                itemStyle={{ color: '#374151' }}
                formatter={(v, name) => [fmtK(Number(v)), name === 'atual' ? 'Atual' : 'Anterior']}
              />
              <Bar dataKey="atual" name="atual" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
              <Bar dataKey="anterior" name="anterior" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.22} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer KPIs */}
        <div className="grid grid-cols-2 border-t border-bh-border">
          <div className="px-4 py-3 border-r border-bh-border">
            <p className="text-bh-subtle text-[9px] font-semibold tracking-widest uppercase mb-1">Tributados</p>
            <p className="text-orange-400 text-sm font-bold">{fmt(trib.tributado)}</p>
            <p className="text-bh-subtle text-[10px] mb-1">vs {fmtK(tribPrev.tributado)} Ant.</p>
            <TrendBadge cur={trib.tributado} prev={tribPrev.tributado} />
          </div>
          <div className="px-4 py-3">
            <p className="text-bh-subtle text-[9px] font-semibold tracking-widest uppercase mb-1">Isentos</p>
            <p className="text-green-400 text-sm font-bold">{fmt(trib.isento)}</p>
            <p className="text-bh-subtle text-[10px] mb-1">vs {fmtK(tribPrev.isento)} Ant.</p>
            <TrendBadge cur={trib.isento} prev={tribPrev.isento} />
          </div>
        </div>

      </div>
    </div>
  )
}
