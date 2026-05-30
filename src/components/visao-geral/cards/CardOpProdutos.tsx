import { useState } from 'react'
import { BarChart2 } from 'lucide-react'
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
    { id: 'c_op_prod.blacklist',     label: 'Blacklist',     cur: prod.blacklist,    prev: prodPrev.blacklist,    color: '#374151' },
  ]

  return (
    <div className="rounded-xl border border-bh-border/50 bg-bh-bg overflow-hidden h-full flex flex-col">
      {showProdutos && <OperacaoProdutosHistoricoModal onClose={() => setShowProdutos(false)} />}
      <div className="border-b border-bh-border px-6 py-5"
>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <span className="text-orange-500 text-base font-bold">%</span>
            </div>
            <div>
              <h3 className="text-bh-text text-lg font-semibold">Operação | Produtos</h3>
              <p className="text-bh-muted text-xs">Acompanhamento dos produtos que não atuamos</p>
            </div>
          </div>
          <button onClick={() => setShowProdutos(true)}
            className="flex items-center gap-1.5 rounded-lg border border-bh-border/40 text-bh-subtle hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors">
            <BarChart2 size={12} /><span>Histórico</span>
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative w-full sm:w-52 h-52 sm:shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={prodData} cx="50%" cy="50%" innerRadius={62} outerRadius={88}
                startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                {prodData.map((_, i) => <Cell key={i} fill={prodData[i].fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-bh-muted text-xs">Não Atuou</p>
            <p className="text-bh-text text-xl font-bold">{(100 - aprovPct).toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {vis('c_op_prod.nao_atuou') && <div className="rounded-lg border border-bh-surface2 bg-black px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
              <div className="flex items-center justify-between flex-1">
                <span className="text-bh-muted text-xs font-semibold tracking-widest uppercase">
                  NÃO ATUOU | {fmtK(prod.naoAtuou)}
                </span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={prod.naoAtuou} prev={prodPrev.naoAtuou} />
                  <span className="text-bh-subtle text-xs">vs {fmtK(prodPrev.naoAtuou)}</span>
                </div>
              </div>
            </div>
          </div>}
          {prodSubItems.map(({ id, label, cur, prev, color }) => vis(id) && (
            <div key={label} className="rounded-lg border border-bh-surface2 bg-black px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: color }} />
                <span className="text-bh-muted text-xs font-semibold tracking-widest uppercase">{label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-xs font-bold">{fmtK(cur)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={cur} prev={prev} />
                  <span className="text-bh-subtle text-xs">vs {fmtK(prev)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
