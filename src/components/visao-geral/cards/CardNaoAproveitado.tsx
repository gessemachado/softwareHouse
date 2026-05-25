import { useState } from 'react'
import { BarChart2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { OperacaoHistoricoModal } from '../OperacaoHistoricoModal'
import { useDashboardFilter } from '../../../contexts/DashboardFilterContext'
import { useDashboardConfig } from '../../../contexts/DashboardConfigContext'
import { OPERACAO, mesIdx } from '../../../mocks/dashboardData'
import { TrendBadge } from './shared'

export function CardNaoAproveitado() {
  const [showOperacao, setShowOperacao] = useState(false)
  const { cardVis } = useDashboardConfig()
  const vis = (id: string) => cardVis[id] !== false
  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  const op     = OPERACAO[curIdx]
  const opPrev = OPERACAO[prevIdx]
  const naoAprov     = op.mesmaTrib + op.somenteItem + op.naoAceitou
  const naoAprovPrev = opPrev.mesmaTrib + opPrev.somenteItem + opPrev.naoAceitou
  const absorcaoOp   = op.pedido > 0 ? (op.intermediacao / op.pedido) * 100 : 0

  const operacaoData = [
    { name: 'Aproveitado',     value: absorcaoOp,       fill: '#ff6600' },
    { name: 'Não Aproveitado', value: 100 - absorcaoOp, fill: '#01baef' },
  ]

  return (
    <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-black overflow-hidden h-full flex flex-col">
      {showOperacao && <OperacaoHistoricoModal onClose={() => setShowOperacao(false)} />}
      <div className="border-b border-[#292929] px-6 py-5"
>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <span className="text-orange-500 text-base font-bold">%</span>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Não Aproveitado</h3>
              <p className="text-[#999] text-xs">Acompanhamento da operação | Pedido / Intermediação</p>
            </div>
          </div>
          <button onClick={() => setShowOperacao(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors">
            <BarChart2 size={12} /><span>Histórico</span>
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative w-full sm:w-52 h-52 sm:shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={operacaoData} cx="50%" cy="50%" innerRadius={62} outerRadius={88}
                startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                {operacaoData.map((_, i) => <Cell key={i} fill={operacaoData[i].fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[#999] text-xs">Não Aprov.</p>
            <p className="text-cyan-400 text-xl font-bold">{(100 - absorcaoOp).toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {vis('c_nao_aprov.total') && <div className="rounded-lg border border-[#1a1a1a] bg-black px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
              <div className="flex items-center justify-between flex-1">
                <span className="text-[#999] text-xs font-semibold tracking-widest uppercase">NÃO APROV. | {naoAprov}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={naoAprov} prev={naoAprovPrev} />
                  <span className="text-[#666] text-xs">vs {naoAprovPrev}</span>
                </div>
              </div>
            </div>
          </div>}
          {vis('c_nao_aprov.mesma_trib') && <div className="rounded-lg border border-[#1a1a1a] bg-black px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-sm shrink-0 bg-[#fca5a5]" />
              <span className="text-[#999] text-xs font-semibold tracking-widest uppercase">Mesma Tributação</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-bold">{op.mesmaTrib}</span>
              <div className="flex items-center gap-1.5">
                <TrendBadge cur={op.mesmaTrib} prev={opPrev.mesmaTrib} />
                <span className="text-[#666] text-xs">vs {opPrev.mesmaTrib}</span>
              </div>
            </div>
          </div>}
          {vis('c_nao_aprov.somente_item') && <div className="rounded-lg border border-[#1a1a1a] bg-black px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-sm shrink-0 bg-[#b45309]" />
              <span className="text-[#999] text-xs font-semibold tracking-widest uppercase">Somente um Item</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-bold">{op.somenteItem}</span>
              <div className="flex items-center gap-1.5">
                <TrendBadge cur={op.somenteItem} prev={opPrev.somenteItem} />
                <span className="text-[#666] text-xs">vs {opPrev.somenteItem}</span>
              </div>
            </div>
          </div>}
          {vis('c_nao_aprov.nao_aceitou') && <div className="rounded-lg border border-[#1a1a1a] bg-black px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-sm shrink-0 bg-[#7f1d1d]" />
              <span className="text-[#999] text-xs font-semibold tracking-widest uppercase">Cliente não aceitou</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-bold">{op.naoAceitou}</span>
              <div className="flex items-center gap-1.5">
                <TrendBadge cur={op.naoAceitou} prev={opPrev.naoAceitou} />
                <span className="text-[#666] text-xs">vs {opPrev.naoAceitou}</span>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  )
}
