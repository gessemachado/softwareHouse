import { useState } from 'react'
import { TrendingUp, TrendingDown, RefreshCw, LineChart as LineChartIcon, Users } from 'lucide-react'
import { CadastrosHistoricoModal } from './CadastrosHistoricoModal'
import { ComposicaoClientesModal } from './ComposicaoClientesModal'
import { useDashboardFilter } from '../../contexts/DashboardFilterContext'
import { CADASTROS, mesIdx } from '../../mocks/dashboardData'

function pctStr(cur: number, prev: number) {
  if (prev === 0) return '+0.0%'
  const p = ((cur - prev) / prev) * 100
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}

const composicaoData = [
  { label: 'Comprando hoje', desc: 'Clientes comprando hoje',              value: 120, pct: 42,   color: '#20bf55' },
  { label: '7 dias',         desc: '7 dias da última compra',              value: 10,  pct: 3.5,  color: '#66cdf6' },
  { label: '15 dias',        desc: '15 dias da última compra',             value: 30,  pct: 10.5, color: '#2499e4' },
  { label: '15–30 dias',     desc: 'Entre 15 e 30 dias da última compra',  value: 50,  pct: 17.5, color: '#f1d954' },
  { label: '> 30 dias',      desc: 'Mais de 30 dias da última compra',     value: 80,  pct: 28,   color: '#ff5353' },
]

export function CadastrosSection() {
  const [showHistorico, setShowHistorico]     = useState(false)
  const [showComposicao, setShowComposicao]   = useState(false)

  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  const cur  = CADASTROS[curIdx]
  const prev = CADASTROS[prevIdx]
  const saldo = cur.novos - cur.perdidos + cur.recuperados

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
      {showHistorico  && <CadastrosHistoricoModal   onClose={() => setShowHistorico(false)}  />}
      {showComposicao && <ComposicaoClientesModal   onClose={() => setShowComposicao(false)} />}

      {/* Cadastros Ativos */}
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#292929] px-5 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Cadastros Ativos</p>
              <p className="text-[#555] text-[10px]">Movimentação do mês</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistorico(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors"
          >
            <LineChartIcon size={12} />
            <span>Histórico</span>
          </button>
        </div>

        {/* Saldo hero */}
        <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between">
          <div>
            <p className="text-[#555] text-[9px] font-semibold tracking-widest uppercase mb-1">Saldo do mês</p>
            <p className={`text-3xl font-bold ${saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {saldo >= 0 ? '+' : ''}{saldo}
            </p>
            <p className="text-[#333] text-[9px] font-mono mt-1">novos – perdidos + recuperados</p>
          </div>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${saldo >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            {saldo >= 0
              ? <TrendingUp size={24} className="text-green-400" />
              : <TrendingDown size={24} className="text-red-400" />}
          </div>
        </div>

        {/* 3 métricas */}
        <div className="grid grid-cols-3">
          {/* Cadastrados */}
          <div className="px-4 py-4 border-r border-white/[0.04]">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center mb-2">
              <TrendingUp size={13} className="text-orange-500" />
            </div>
            <p className="text-[#555] text-xs font-semibold tracking-widest uppercase mb-1">Cadastrados</p>
            <p className="text-orange-500 text-xl font-bold">{cur.novos}</p>
            <p className={`text-xs font-mono mt-1 ${cur.novos >= prev.novos ? 'text-green-400' : 'text-red-400'}`}>
              {pctStr(cur.novos, prev.novos)}
            </p>
          </div>

          {/* Perdidos */}
          <div className="px-4 py-4 border-r border-white/[0.04]">
            <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center mb-2">
              <TrendingDown size={13} className="text-red-400" />
            </div>
            <p className="text-[#555] text-xs font-semibold tracking-widest uppercase mb-1">Perdidos</p>
            <p className="text-red-400 text-xl font-bold">{cur.perdidos}</p>
            <p className={`text-xs font-mono mt-1 ${cur.perdidos >= prev.perdidos ? 'text-green-400' : 'text-red-400'}`}>
              {pctStr(cur.perdidos, prev.perdidos)}
            </p>
          </div>

          {/* Recuperados */}
          <div className="px-4 py-4">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-2">
              <RefreshCw size={13} className="text-cyan-400" />
            </div>
            <p className="text-[#555] text-xs font-semibold tracking-widest uppercase mb-1">Recuperados</p>
            <p className="text-cyan-400 text-xl font-bold">{cur.recuperados}</p>
            <p className={`text-xs font-mono mt-1 ${cur.recuperados >= prev.recuperados ? 'text-green-400' : 'text-red-400'}`}>
              {pctStr(cur.recuperados, prev.recuperados)}
            </p>
          </div>
        </div>
      </div>

      {/* Composição dos Clientes */}
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 p-5">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-white text-sm font-semibold">Composição dos clientes</p>
          <button
            onClick={() => setShowComposicao(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors"
          >
            <Users size={12} />
            <span>Origem</span>
          </button>
        </div>
        <p className="text-[#666] text-xs mb-5">Total: 5235 clientes Ativos</p>

        {/* Legend */}
        <div className="space-y-2">
          {composicaoData.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-white text-xs font-semibold">{item.label}</span>
                  <span className="text-[#444] text-[9px] truncate">{item.desc}</span>
                </div>
                <div className="mt-0.5 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color, opacity: 0.6 }} />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-white text-xs font-bold">{item.value}</span>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ color: item.color, background: `${item.color}20` }}>{item.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
