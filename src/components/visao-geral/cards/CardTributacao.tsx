import { useState } from 'react'
import { BarChart2, Receipt } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, LabelList } from 'recharts'
import { TributacaoHistoricoModal } from '../TributacaoHistoricoModal'
import { useDashboardFilter } from '../../../contexts/DashboardFilterContext'
import { useDashboardConfig } from '../../../contexts/DashboardConfigContext'
import { TRIBUTACAO, mesIdx } from '../../../mocks/dashboardData'
import { fmtK, TrendBadge } from './shared'

export function CardTributacao() {
  const [showTribHistorico, setShowTribHistorico] = useState(false)
  const { cardVis } = useDashboardConfig()
  const vis = (id: string) => cardVis[id] !== false
  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  const trib      = TRIBUTACAO[curIdx]
  const tribPrev  = TRIBUTACAO[prevIdx]
  const tribTotal = trib.tributado + trib.isento
  const tribPct   = tribTotal > 0 ? (trib.tributado / tribTotal) * 100 : 0

  const barData = [
    { name: 'Tributado', value: trib.tributado, pct: tribPct,         fill: '#f97316' },
    { name: 'Isento/ST', value: trib.isento,    pct: 100 - tribPct,   fill: '#22c55e' },
  ]

  return (
    <div className="rounded-xl border border-bh-border/50 bg-bh-bg overflow-hidden h-full flex flex-col">
      {showTribHistorico && <TributacaoHistoricoModal onClose={() => setShowTribHistorico(false)} />}

      <div className="border-b border-bh-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <Receipt size={16} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-bh-text text-sm font-semibold leading-tight">Tributação de Produtos</h3>
              <p className="text-bh-muted text-[11px] mt-0.5">Volume de vendas por regime tributário</p>
            </div>
          </div>
          <button onClick={() => setShowTribHistorico(true)}
            className="flex items-center gap-1.5 rounded-lg border border-bh-border/40 text-bh-subtle hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors shrink-0 ml-3">
            <BarChart2 size={12} /><span>Histórico</span>
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col sm:flex-row gap-4 flex-1">
        {/* Bar chart */}
        <div className="w-full sm:w-44 h-44 sm:shrink-0 self-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 24, right: 8, bottom: 8, left: 8 }}
              barCategoryGap="30%">
              <XAxis dataKey="name" tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }}
                axisLine={false} tickLine={false} />
              <YAxis hide />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                <LabelList
                  content={({ x, y, width, index }) => {
                    const item = barData[index as number]
                    if (!item) return null
                    const cx = (x as number) + (width as number) / 2
                    return (
                      <text x={cx} y={(y as number) - 6} textAnchor="middle"
                        fill={item.fill} fontSize={11} fontWeight={700}>
                        {item.pct.toFixed(1)}%
                      </text>
                    )
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subitens */}
        <div className="flex-1 flex flex-col gap-2 justify-center">
          {vis('c_tributacao.tributado') && (
            <div className="rounded-lg border border-orange-500/25 bg-orange-500/8 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                <span className="text-orange-400 text-[10px] font-semibold tracking-widest uppercase flex-1">Tributado</span>
                <span className="text-bh-subtle text-[10px]">{tribPct.toFixed(1)}% do total</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtK(trib.tributado)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={trib.tributado} prev={tribPrev.tributado} />
                  <span className="text-bh-subtle text-[10px]">vs {fmtK(tribPrev.tributado)}</span>
                </div>
              </div>
            </div>
          )}
          {vis('c_tributacao.isento') && (
            <div className="rounded-lg border border-green-500/25 bg-green-500/8 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-green-400 text-[10px] font-semibold tracking-widest uppercase flex-1">Isento/ST</span>
                <span className="text-bh-subtle text-[10px]">{(100 - tribPct).toFixed(1)}% do total</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtK(trib.isento)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={trib.isento} prev={tribPrev.isento} />
                  <span className="text-bh-subtle text-[10px]">vs {fmtK(tribPrev.isento)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
