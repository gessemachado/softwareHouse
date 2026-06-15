import { useState } from 'react'
import { BarChart2, Package } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { OperacaoProdutosHistoricoModal } from '../OperacaoProdutosHistoricoModal'
import { useDashboardFilter } from '../../../contexts/DashboardFilterContext'
import { useDashboardConfig } from '../../../contexts/DashboardConfigContext'
import { OPERACAO_PRODUTOS, mesIdx } from '../../../mocks/dashboardData'
import { fmtK, TrendBadge } from './shared'

export function CardOpProdutos() {
  const [showProdutos, setShowProdutos] = useState(false)
  const { cardVis } = useDashboardConfig()
  const vis = (id: string) => cardVis[id] !== false
  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  const prod     = OPERACAO_PRODUTOS[curIdx]
  const prodPrev = OPERACAO_PRODUTOS[prevIdx]
  const totalProd = prod.aproveitado + prod.naoAtuou
  const aprovPct  = totalProd > 0 ? (prod.aproveitado / totalProd) * 100 : 0

  const prodData = [
    { name: 'Aproveitado', value: aprovPct,       fill: '#ff6600' },
    { name: 'Não Atuou',   value: 100 - aprovPct, fill: '#2a2a2a' },
  ]

  const prodSubItems = [
    { id: 'c_op_prod.m_negativa',    label: 'M. Negativa',   cur: prod.mNegativa,    prev: prodPrev.mNegativa,    color: '#ef4444' },
    { id: 'c_op_prod.custo_zero',    label: 'Custo Zero',    cur: prod.custoZero,    prev: prodPrev.custoZero,    color: '#f59e0b' },
    { id: 'c_op_prod.exclusao_loja', label: 'Exclusão Loja', cur: prod.exclusaoLoja, prev: prodPrev.exclusaoLoja, color: '#8b5cf6' },
    { id: 'c_op_prod.blacklist',     label: 'Blacklist',     cur: prod.blacklist,    prev: prodPrev.blacklist,    color: '#6b7280' },
  ]

  return (
    <div className="rounded-xl border border-bh-border/50 bg-bh-bg overflow-hidden h-full flex flex-col">
      {showProdutos && <OperacaoProdutosHistoricoModal onClose={() => setShowProdutos(false)} />}

      <div className="border-b border-bh-border px-5 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <Package size={16} className="text-orange-500" />
            </div>
            <div>
              <h3 className="text-bh-text text-sm font-semibold leading-tight">Operação | Produtos</h3>
              <p className="text-bh-muted text-[11px] mt-0.5">Acompanhamento dos produtos que não atuamos</p>
            </div>
          </div>
          <button onClick={() => setShowProdutos(true)}
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
              <Pie data={prodData} cx="50%" cy="50%" innerRadius={54} outerRadius={76}
                startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                {prodData.map((_, i) => <Cell key={i} fill={prodData[i].fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-bh-muted text-[10px] uppercase tracking-wider font-medium">Não Atuou</p>
            <p className="text-bh-text text-2xl font-bold leading-tight">{(100 - aprovPct).toFixed(1)}%</p>
          </div>
        </div>

        {/* Subitens */}
        <div className="flex-1 flex flex-col gap-2 justify-center">
          {vis('c_op_prod.nao_atuou') && (
            <div className="rounded-lg border border-bh-surface2/80 bg-bh-surface2/20 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-bh-subtle shrink-0" />
                <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase flex-1">Não Atuou</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtK(prod.naoAtuou)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={prod.naoAtuou} prev={prodPrev.naoAtuou} invert />
                  <span className="text-bh-subtle text-[10px]">vs {fmtK(prodPrev.naoAtuou)}</span>
                </div>
              </div>
            </div>
          )}
          {prodSubItems.map(({ id, label, cur, prev, color }) => vis(id) && (
            <div key={id} className="rounded-lg border border-bh-surface2/60 bg-bh-surface2/10 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ background: color }} />
                <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase flex-1">{label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtK(cur)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={cur} prev={prev} invert />
                  <span className="text-bh-subtle text-[10px]">vs {fmtK(prev)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
