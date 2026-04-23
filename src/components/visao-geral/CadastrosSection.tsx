import { useState } from 'react'
import { TrendingUp, TrendingDown, RefreshCw, LineChart as LineChartIcon } from 'lucide-react'
import { CadastrosHistoricoModal } from './CadastrosHistoricoModal'
import { useDashboardFilter } from '../../contexts/DashboardFilterContext'
import { CADASTROS, mesIdx } from '../../mocks/dashboardData'

function pctStr(cur: number, prev: number) {
  if (prev === 0) return '+0.0%'
  const p = ((cur - prev) / prev) * 100
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}

const composicaoData = [
  { label: 'Ativos',       value: 120, pct: 42,   color: '#20bf55' },
  { label: 'Novos',        value: 10,  pct: 3.5,  color: '#66cdf6' },
  { label: 'Recuperados',  value: 30,  pct: 10.5, color: '#2499e4' },
  { label: 'A ser perdidos', value: 50, pct: 17.5, color: '#f1d954' },
  { label: 'Perdidos',     value: 80,  pct: 28,   color: '#ff5353' },
]

export function CadastrosSection() {
  const [showHistorico, setShowHistorico] = useState(false)

  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()
  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  const cur  = CADASTROS[curIdx]
  const prev = CADASTROS[prevIdx]
  const saldo = cur.novos - cur.perdidos + cur.recuperados

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
      {showHistorico && <CadastrosHistoricoModal onClose={() => setShowHistorico(false)} />}

      {/* Cadastros Ativos */}
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white text-base">Cadastros Ativos</p>
          <button
            onClick={() => setShowHistorico(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors"
          >
            <LineChartIcon size={12} />
            <span>Histórico</span>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Saldo */}
          <div className="min-w-[100px]">
            <p className={`text-2xl font-semibold ${saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {saldo >= 0 ? '+' : ''}{saldo}
            </p>
            <p className="text-[#999] text-[10px] mt-1">Saldo do mês</p>
            <p className="text-[#999] text-[10px]">(novos – perdidos + recup.)</p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-[rgba(142,142,147,0.3)] self-stretch" />

          {/* Right side */}
          <div className="flex-1">
            <div className="flex gap-5">
              {/* Novos */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mt-0.5">
                  <TrendingUp size={18} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-[#999] text-[10px] mb-0.5">Cadastrados</p>
                  <p className="text-orange-500 text-lg font-bold">{cur.novos}</p>
                  <p className={`text-[11px] font-mono mt-0.5 ${cur.novos >= prev.novos ? 'text-green-400' : 'text-red-400'}`}>
                    {pctStr(cur.novos, prev.novos)}
                  </p>
                </div>
              </div>

              {/* Perdidos */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mt-0.5">
                  <TrendingDown size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="text-[#999] text-[10px] mb-0.5">Perdidos</p>
                  <p className="text-red-400 text-lg font-bold">{cur.perdidos}</p>
                  <p className={`text-[11px] font-mono mt-0.5 ${cur.perdidos >= prev.perdidos ? 'text-green-400' : 'text-red-400'}`}>
                    {pctStr(cur.perdidos, prev.perdidos)}
                  </p>
                </div>
              </div>

              {/* Recuperados */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mt-0.5">
                  <RefreshCw size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-[#999] text-[10px] mb-0.5">Recuperados</p>
                  <p className="text-cyan-400 text-lg font-bold">{cur.recuperados}</p>
                  <p className={`text-[11px] font-mono mt-0.5 ${cur.recuperados >= prev.recuperados ? 'text-green-400' : 'text-red-400'}`}>
                    {pctStr(cur.recuperados, prev.recuperados)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Composição dos Clientes */}
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 p-5">
        <p className="text-white text-sm font-semibold mb-0.5">Composição dos clientes</p>
        <p className="text-[#666] text-xs mb-5">Total: 5235 clientes Ativos</p>

        {/* Bar */}
        <div className="h-9 flex rounded-lg overflow-hidden border border-white/10 mb-4">
          {composicaoData.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-center"
              style={{ width: `${item.pct}%`, backgroundColor: item.color }}
            >
              <span className="text-white text-sm font-bold">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {composicaoData.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[#999] text-[10px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
