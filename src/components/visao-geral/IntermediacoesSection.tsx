import { useState } from 'react'
import { TrendingDown, TrendingUp, BarChart2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { DescontoAbsorcaoModal } from './DescontoAbsorcaoModal'
import { OperacaoHistoricoModal } from './OperacaoHistoricoModal'
import { OperacaoProdutosHistoricoModal } from './OperacaoProdutosHistoricoModal'
import { useDashboardFilter } from '../../contexts/DashboardFilterContext'
import { useDashboardConfig } from '../../contexts/DashboardConfigContext'
import { DESCONTO, OPERACAO, OPERACAO_PRODUTOS, mesIdx } from '../../mocks/dashboardData'

function fmtK(v: number) { return `R$ ${Math.round(v / 1000)}k` }
function pctStr(cur: number, prev: number) {
  if (prev === 0) return '+0.0%'
  const p = ((cur - prev) / prev) * 100
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}

function TrendBadge({ cur, prev }: { cur: number; prev: number; positiveIsUp?: boolean }) {
  const up = cur >= prev
  return (
    <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${up ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
      {up
        ? <TrendingUp size={10} className="text-green-400" />
        : <TrendingDown size={10} className="text-red-400" />}
      <span className={`text-xs ${up ? 'text-green-400' : 'text-red-400'}`}>{pctStr(cur, prev)}</span>
    </div>
  )
}

export function IntermediacoesSection() {
  const [showAbsorcao, setShowAbsorcao] = useState(false)
  const [showOperacao, setShowOperacao] = useState(false)
  const [showProdutos, setShowProdutos] = useState(false)

  const { cardVis } = useDashboardConfig()
  const vis = (id: string) => cardVis[id] !== false

  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  // -- Desconto ----------------------------------------------------------------
  const desc        = DESCONTO[curIdx]
  const descPrev    = DESCONTO[prevIdx]
  const totalDesc   = desc.aproveitado + desc.disponivel
  const totalDescP  = descPrev.aproveitado + descPrev.disponivel
  const absorcaoPct = totalDesc > 0 ? (desc.aproveitado / totalDesc) * 100 : 0
  const dispPct     = 100 - absorcaoPct

  const descontoData = [
    { name: 'Aproveitado', value: absorcaoPct, fill: '#ff6600' },
    { name: 'Disponível',  value: dispPct,     fill: '#2a2a2a' },
  ]

  // -- Operação ----------------------------------------------------------------
  const op      = OPERACAO[curIdx]
  const opPrev  = OPERACAO[prevIdx]
  const naoAprov     = op.mesmaTrib + op.somenteItem + op.naoAceitou
  const naoAprovPrev = opPrev.mesmaTrib + opPrev.somenteItem + opPrev.naoAceitou
  const absorcaoOp     = op.pedido > 0 ? (op.intermediacao / op.pedido) * 100 : 0

  const operacaoData = [
    { name: 'Aproveitado',     value: absorcaoOp,       fill: '#ff6600' },
    { name: 'Não Aproveitado', value: 100 - absorcaoOp, fill: '#01baef' },
  ]

  // -- Operação | Produtos ------------------------------------------------------
  const prod        = OPERACAO_PRODUTOS[curIdx]
  const prodPrev    = OPERACAO_PRODUTOS[prevIdx]
  const totalProd   = prod.aproveitado + prod.naoAtuou
  const aprovPct    = totalProd > 0 ? (prod.aproveitado / totalProd) * 100 : 0

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
      {showAbsorcao && <DescontoAbsorcaoModal onClose={() => setShowAbsorcao(false)} />}
      {showOperacao && <OperacaoHistoricoModal onClose={() => setShowOperacao(false)} />}
      {showProdutos && <OperacaoProdutosHistoricoModal onClose={() => setShowProdutos(false)} />}

      {/* -- Desconto Disponibilizado -------------------------------------------- */}
      {vis('c_desconto') && <div className="rounded-xl border border-bh-border/50 bg-bh-bg overflow-hidden">
        <div className="border-b border-bh-border px-6 py-5"
          >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <span className="text-orange-500 text-base font-bold">%</span>
              </div>
              <div>
                <h3 className="text-bh-text text-lg">Desconto Disponibilizado</h3>
                <p className="text-bh-muted text-xs">Acompanhamento do desconto disponibilizado</p>
              </div>
            </div>
            <button onClick={() => setShowAbsorcao(true)}
              className="flex items-center gap-1.5 rounded-lg border border-bh-border/40 text-bh-subtle hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors">
              <BarChart2 size={12} />
              <span>Histórico</span>
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-52 h-52 sm:shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={descontoData} cx="50%" cy="50%" innerRadius={62} outerRadius={88}
                  startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                  {descontoData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-bh-muted text-xs">Aproveitado</p>
              <p className="text-bh-text text-xl font-bold">{absorcaoPct.toFixed(1)}%</p>
              <p className="text-orange-500 text-sm">{fmtK(desc.aproveitado)}</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {vis('c_desconto.disponivel') && <div className="rounded-lg border border-bh-surface2 bg-black px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                <span className="text-bh-muted text-xs font-semibold tracking-widest uppercase">Disponível</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtK(desc.disponivel)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={desc.disponivel} prev={descPrev.disponivel} positiveIsUp={false} />
                  <span className="text-bh-subtle text-xs">vs {fmtK(descPrev.disponivel)}</span>
                </div>
              </div>
              <p className="text-bh-subtle text-[10px] mt-1">{dispPct.toFixed(1)}% restante</p>
            </div>}

            {vis('c_desconto.aproveitado') && <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-orange-500 text-xs font-semibold tracking-widest uppercase">Aproveitado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtK(desc.aproveitado)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={desc.aproveitado} prev={descPrev.aproveitado} />
                  <span className="text-bh-subtle text-xs">vs {fmtK(descPrev.aproveitado)}</span>
                </div>
              </div>
              <p className="text-bh-subtle text-[10px] mt-1">{absorcaoPct.toFixed(1)}% do total</p>
            </div>}

            {vis('c_desconto.total') && <div className="rounded-lg border border-bh-surface2 bg-black px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                <span className="text-bh-muted text-xs font-semibold tracking-widest uppercase">Total Disponibilizado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-sm font-bold">{fmtK(totalDesc)}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={totalDesc} prev={totalDescP} />
                  <span className="text-bh-subtle text-xs">vs {fmtK(totalDescP)}</span>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>}

      {/* -- Não Aproveitado ---------------------------------------------------- */}
      {vis('c_nao_aprov') && <div className="rounded-xl border border-bh-border/50 bg-bh-bg overflow-hidden">
        <div className="border-b border-bh-border px-6 py-5"
          >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <span className="text-orange-500 text-base font-bold">%</span>
              </div>
              <div>
                <h3 className="text-bh-text text-lg font-semibold">Não Aproveitado</h3>
                <p className="text-bh-muted text-xs">Acompanhamento da operação | Pedido / Intermediação</p>
              </div>
            </div>
            <button onClick={() => setShowOperacao(true)}
              className="flex items-center gap-1.5 rounded-lg border border-bh-border/40 text-bh-subtle hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors">
              <BarChart2 size={12} />
              <span>Histórico</span>
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-52 h-52 sm:shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={operacaoData} cx="50%" cy="50%" innerRadius={62} outerRadius={88}
                  startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                  {operacaoData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-bh-muted text-xs">Não Aprov.</p>
              <p className="text-cyan-400 text-xl font-bold">{(100 - absorcaoOp).toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {vis('c_nao_aprov.total') && <div className="rounded-lg border border-bh-surface2 bg-black px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                <div className="flex items-center justify-between flex-1">
                  <span className="text-bh-muted text-xs font-semibold tracking-widest uppercase">NÃO APROV. | {naoAprov}</span>
                  <div className="flex items-center gap-1.5">
                    <TrendBadge cur={naoAprov} prev={naoAprovPrev} positiveIsUp={false} />
                    <span className="text-bh-subtle text-xs">vs {naoAprovPrev}</span>
                  </div>
                </div>
              </div>
            </div>}

            {vis('c_nao_aprov.mesma_trib') && <div className="rounded-lg border border-bh-surface2 bg-black px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-sm shrink-0 bg-[#fca5a5]" />
                <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase">Mesma Tributação</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-xs font-bold">{op.mesmaTrib}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={op.mesmaTrib} prev={opPrev.mesmaTrib} positiveIsUp={false} />
                  <span className="text-bh-subtle text-[10px]">vs {opPrev.mesmaTrib}</span>
                </div>
              </div>
            </div>}

            {vis('c_nao_aprov.somente_item') && <div className="rounded-lg border border-bh-surface2 bg-black px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-sm shrink-0 bg-[#b45309]" />
                <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase">Somente um Item</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-xs font-bold">{op.somenteItem}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={op.somenteItem} prev={opPrev.somenteItem} positiveIsUp={false} />
                  <span className="text-bh-subtle text-[10px]">vs {opPrev.somenteItem}</span>
                </div>
              </div>
            </div>}

            {vis('c_nao_aprov.nao_aceitou') && <div className="rounded-lg border border-bh-surface2 bg-black px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-sm shrink-0 bg-[#7f1d1d]" />
                <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase">Cliente não aceitou</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-bh-text text-xs font-bold">{op.naoAceitou}</span>
                <div className="flex items-center gap-1.5">
                  <TrendBadge cur={op.naoAceitou} prev={opPrev.naoAceitou} positiveIsUp={false} />
                  <span className="text-bh-subtle text-[10px]">vs {opPrev.naoAceitou}</span>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>}

      {/* -- Operação | Produtos -------------------------------------------------- */}
      {vis('c_op_prod') && <div className="rounded-xl border border-bh-border/50 bg-bh-bg overflow-hidden">
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
              <BarChart2 size={12} />
              <span>Histórico</span>
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-52 h-52 sm:shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={prodData} cx="50%" cy="50%" innerRadius={62} outerRadius={88}
                  startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                  {prodData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-bh-muted text-xs">Aproveitado</p>
              <p className="text-bh-text text-xl font-bold">{aprovPct.toFixed(1)}%</p>
              <p className="text-orange-500 text-sm">{fmtK(prod.aproveitado)}</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {vis('c_op_prod.nao_atuou') && <div className="rounded-lg border border-bh-surface2 bg-black px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                <div className="flex items-center justify-between flex-1">
                  <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase">
                    NÃO ATUOU | {fmtK(prod.naoAtuou)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <TrendBadge cur={prod.naoAtuou} prev={prodPrev.naoAtuou} positiveIsUp={false} />
                    <span className="text-bh-subtle text-xs">vs {fmtK(prodPrev.naoAtuou)}</span>
                  </div>
                </div>
              </div>
            </div>}

            {prodSubItems.map(({ id, label, cur, prev, color }) => vis(id) && (
              <div key={label} className="rounded-lg border border-bh-surface2 bg-black px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: color }} />
                  <span className="text-bh-muted text-[10px] font-semibold tracking-widest uppercase">{label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-bh-text text-xs font-bold">{fmtK(cur)}</span>
                  <div className="flex items-center gap-1.5">
                    <TrendBadge cur={cur} prev={prev} positiveIsUp={false} />
                    <span className="text-bh-subtle text-[10px]">vs {fmtK(prev)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  )
}
