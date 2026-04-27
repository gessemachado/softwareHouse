import { useState } from 'react'
import { BarChart2 } from 'lucide-react'
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
    { name: 'Tributado', value: trib.tributado, pct: tribPct,             fill: '#f97316' },
    { name: 'Isento/ST',    value: trib.isento,    pct: 100 - tribPct,       fill: '#22c55e' },
  ]

  return (
    <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 overflow-hidden h-full flex flex-col">
      {showTribHistorico && <TributacaoHistoricoModal onClose={() => setShowTribHistorico(false)} />}
      <div className="border-b border-[#292929] px-6 py-5"
        style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <span className="text-orange-400 text-base font-bold">T</span>
            </div>
            <div>
              <h3 className="text-white text-lg">Tributação de Produtos</h3>
              <p className="text-[#999] text-xs">Volume de vendas por regime tributário</p>
            </div>
          </div>
          <button onClick={() => setShowTribHistorico(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors shrink-0 ml-3">
            <BarChart2 size={12} /><span>Histórico</span>
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col sm:flex-row gap-4 flex-1">
        {/* Bar chart */}
        <div className="w-full sm:w-52 h-52 sm:shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 24, right: 8, bottom: 8, left: 8 }}
              barCategoryGap="30%">
              <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 10 }}
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

        <div className="flex-1 flex flex-col gap-2">
          {vis('c_tributacao.tributado') && <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-orange-500 text-xs font-semibold tracking-widest uppercase">Tributado</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold">{fmtK(trib.tributado)}</span>
              <div className="flex items-center gap-1.5">
                <TrendBadge cur={trib.tributado} prev={tribPrev.tributado} />
                <span className="text-[#666] text-xs">vs {fmtK(tribPrev.tributado)}</span>
              </div>
            </div>
            <p className="text-[#555] text-[10px] mt-1">{tribPct.toFixed(1)}% do total</p>
          </div>}
          {vis('c_tributacao.isento') && <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">Isento/ST</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold">{fmtK(trib.isento)}</span>
              <div className="flex items-center gap-1.5">
                <TrendBadge cur={trib.isento} prev={tribPrev.isento} />
                <span className="text-[#666] text-xs">vs {fmtK(tribPrev.isento)}</span>
              </div>
            </div>
            <p className="text-[#555] text-[10px] mt-1">{(100 - tribPct).toFixed(1)}% do total</p>
          </div>}
        </div>
      </div>
    </div>
  )
}
