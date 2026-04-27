import { useState } from 'react'
import { BarChart2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { DebitosHistoricoModal } from '../DebitosHistoricoModal'
import { useDashboardFilter } from '../../../contexts/DashboardFilterContext'
import { useDashboardConfig } from '../../../contexts/DashboardConfigContext'
import { AVALIACAO, mesIdx } from '../../../mocks/dashboardData'
import { fmtM, TrendBadge } from './shared'

export function CardDebitos() {
  const [showDebitHistorico, setShowDebitHistorico] = useState(false)
  const { cardVis } = useDashboardConfig()
  const vis = (id: string) => cardVis[id] !== false
  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  const av     = AVALIACAO[curIdx]
  const avPrev = AVALIACAO[prevIdx]
  const debitoA      = av.debito.a
  const debitoD      = av.debito.d
  const debitoAPrev  = avPrev.debito.a
  const debitoDPrev  = avPrev.debito.d
  const economia      = debitoA - debitoD
  const economiaPrev  = debitoAPrev - debitoDPrev
  const reducaoPct    = debitoA > 0 ? (economia / debitoA) * 100 : 0
  const reducaoPctPrev = debitoAPrev > 0 ? (economiaPrev / debitoAPrev) * 100 : 0

  const debitoDonutData = [
    { value: 100 - reducaoPct, fill: '#ef4444' },
    { value: reducaoPct,       fill: '#22c55e' },
  ]

  return (
    <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 overflow-hidden h-full flex flex-col">
      {showDebitHistorico && <DebitosHistoricoModal onClose={() => setShowDebitHistorico(false)} />}
      <div className="border-b border-[#292929] px-6 py-5"
        style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <span className="text-red-400 text-base font-bold">D</span>
            </div>
            <div>
              <h3 className="text-white text-lg">Total de Débitos</h3>
              <p className="text-[#999] text-xs">Antes e depois BuyHelp</p>
            </div>
          </div>
          <button onClick={() => setShowDebitHistorico(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors shrink-0 ml-3">
            <BarChart2 size={12} /><span>Histórico</span>
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative w-full sm:w-52 h-52 sm:shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={debitoDonutData} cx="50%" cy="50%"
                innerRadius={62} outerRadius={88}
                startAngle={90} endAngle={-270}
                dataKey="value" strokeWidth={0}>
                {debitoDonutData.map((_, i) => <Cell key={i} fill={debitoDonutData[i].fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[#999] text-xs">Redução</p>
            <p className="text-white text-xl font-bold">{reducaoPct.toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {vis('c_debitos.antes') && <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-400 text-xs font-semibold tracking-widest uppercase">Antes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold">{fmtM(debitoA)}</span>
              <div className="flex items-center gap-1.5">
                <TrendBadge cur={debitoA} prev={debitoAPrev} />
                <span className="text-[#666] text-xs">vs {fmtM(debitoAPrev)}</span>
              </div>
            </div>
            <p className="text-[#555] text-[10px] mt-1">Sem BuyHelp</p>
          </div>}
          {vis('c_debitos.depois') && <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">Depois</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold">{fmtM(debitoD)}</span>
              <div className="flex items-center gap-1.5">
                <TrendBadge cur={debitoD} prev={debitoDPrev} />
                <span className="text-[#666] text-xs">vs {fmtM(debitoDPrev)}</span>
              </div>
            </div>
            <p className="text-[#555] text-[10px] mt-1">Com BuyHelp</p>
          </div>}
          {vis('c_debitos.economia') && <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]/50 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[#999] text-xs font-semibold tracking-widest uppercase">Economia</span>
              <div className="flex items-center gap-1.5">
                <span className="text-green-400 text-sm font-bold">{fmtM(economia)}</span>
                <TrendBadge cur={reducaoPct} prev={reducaoPctPrev} />
              </div>
            </div>
            <p className="text-[#555] text-[10px] mt-1">vs {fmtM(economiaPrev)} anterior · {reducaoPct.toFixed(1)}% redução</p>
          </div>}
        </div>
      </div>
    </div>
  )
}
