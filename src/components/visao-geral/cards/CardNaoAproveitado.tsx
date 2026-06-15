import { useState } from 'react'
import { BarChart2, XCircle } from 'lucide-react'
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

  const subItems = [
    { id: 'c_nao_aprov.mesma_trib',  label: 'Mesma Tributação',   cur: op.mesmaTrib,  prev: opPrev.mesmaTrib,  color: '#fca5a5' },
    { id: 'c_nao_aprov.somente_item', label: 'Somente um Item',   cur: op.somenteItem, prev: opPrev.somenteItem, color: '#fb923c' },
    { id: 'c_nao_aprov.nao_aceitou', label: 'Cliente não aceitou', cur: op.naoAceitou, prev: opPrev.naoAceitou, color: '#f87171' },
  ]

  return (
    <div className="rounded-xl border border-bh-border/50 bg-bh-bg overflow-hidden h-full flex flex-col">
      {showOperacao && <OperacaoHistoricoModal onClose={() => setShowOperacao(false)} />}

      <div className="border-b border-bh-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
              <XCircle size={16} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-bh-text text-sm font-semibold leading-tight">Não Aproveitado</h3>
              <p className="text-bh-muted text-[11px] mt-0.5">Acompanhamento da operação | Pedido / Intermediação</p>
            </div>
          </div>
          <button onClick={() => setShowOperacao(true)}
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
              <Pie data={operacaoData} cx="50%" cy="50%" innerRadius={54} outerRadius={76}
                startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                {operacaoData.map((_, i) => <Cell key={i} fill={operacaoData[i].fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-bh-muted text-[10px] uppercase tracking-wider font-medium">Não Aprov.</p>
            <p className="text-cyan-400 text-2xl font-bold leading-tight">{(100 - absorcaoOp).toFixed(1)}%</p>
          </div>
        </div>

        {/* Subitens */}
        <div className="flex-1 flex flex-col gap-2 justify-center">
          {vis('c_nao_aprov.total') && (
            <div className="rounded-lg border border-bh-surface2/80 bg-bh-surface2/20 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase flex-1">
                  Não Aprov. <span className="text-bh-subtle font-normal">| {naoAprov}</span>
                </span>
                <TrendBadge cur={naoAprov} prev={naoAprovPrev} invert />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{naoAprov} pedidos</span>
                <span className="text-bh-subtle text-[10px]">vs {naoAprovPrev} anterior</span>
              </div>
            </div>
          )}
          {subItems.map(({ id, label, cur, prev, color }) => vis(id) && (
            <div key={id} className="rounded-lg border border-bh-surface2/60 bg-bh-surface2/10 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ background: color }} />
                <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase flex-1">{label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{cur}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={cur} prev={prev} invert />
                  <span className="text-bh-subtle text-[10px]">vs {prev}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
