import { useState } from 'react'
import { BarChart2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { DescontoAbsorcaoModal } from '../DescontoAbsorcaoModal'
import { useDashboardFilter } from '../../../contexts/DashboardFilterContext'
import { useDashboardConfig } from '../../../contexts/DashboardConfigContext'
import { DESCONTO, mesIdx } from '../../../mocks/dashboardData'
import { fmtK, TrendBadge } from './shared'

export function CardDesconto() {
  const [showAbsorcao, setShowAbsorcao] = useState(false)
  const { cardVis } = useDashboardConfig()
  const vis = (id: string) => cardVis[id] !== false
  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  const desc       = DESCONTO[curIdx]
  const descPrev   = DESCONTO[prevIdx]
  const totalDesc  = desc.aproveitado + desc.disponivel
  const totalDescP = descPrev.aproveitado + descPrev.disponivel
  const absorcaoPct = totalDesc > 0 ? (desc.aproveitado / totalDesc) * 100 : 0
  const dispPct     = 100 - absorcaoPct

  const descontoData = [
    { name: 'Aproveitado', value: absorcaoPct, fill: '#ff6600' },
    { name: 'Disponível',  value: dispPct,     fill: '#2a2a2a' },
  ]

  return (
    <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 overflow-hidden h-full flex flex-col">
      {showAbsorcao && <DescontoAbsorcaoModal onClose={() => setShowAbsorcao(false)} />}
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
          <button onClick={() => setShowAbsorcao(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors">
            <BarChart2 size={12} /><span>Histórico</span>
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative w-full sm:w-52 h-52 sm:shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={descontoData} cx="50%" cy="50%" innerRadius={62} outerRadius={88}
                startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                {descontoData.map((_, i) => <Cell key={i} fill={descontoData[i].fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[#999] text-xs">Aproveitado</p>
            <p className="text-white text-xl font-bold">{absorcaoPct.toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {vis('c_desconto.total') && <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]/50 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
              <span className="text-[#999] text-xs font-semibold tracking-widest uppercase">Total Disponibilizado</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold">{fmtK(totalDesc)}</span>
              <div className="flex items-center gap-1.5">
                <TrendBadge cur={totalDesc} prev={totalDescP} />
                <span className="text-[#666] text-xs">vs {fmtK(totalDescP)}</span>
              </div>
            </div>
          </div>}
          {vis('c_desconto.aproveitado') && <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-orange-500 text-xs font-semibold tracking-widest uppercase">Aproveitado</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold">{fmtK(desc.aproveitado)}</span>
              <div className="flex items-center gap-1.5">
                <TrendBadge cur={desc.aproveitado} prev={descPrev.aproveitado} />
                <span className="text-[#666] text-xs">vs {fmtK(descPrev.aproveitado)}</span>
              </div>
            </div>
            <p className="text-[#555] text-[10px] mt-1">{absorcaoPct.toFixed(1)}% do total</p>
          </div>}
          {vis('c_desconto.disponivel') && <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]/50 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
              <span className="text-[#999] text-xs font-semibold tracking-widest uppercase">Disponível</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-bold">{fmtK(desc.disponivel)}</span>
              <div className="flex items-center gap-1.5">
                <TrendBadge cur={desc.disponivel} prev={descPrev.disponivel} />
                <span className="text-[#666] text-xs">vs {fmtK(descPrev.disponivel)}</span>
              </div>
            </div>
            <p className="text-[#555] text-[10px] mt-1">{dispPct.toFixed(1)}% restante</p>
          </div>}
        </div>
      </div>
    </div>
  )
}
