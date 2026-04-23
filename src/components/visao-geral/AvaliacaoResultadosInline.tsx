import { useState } from 'react'
import { BarChart2, TrendingUp, TrendingDown, History } from 'lucide-react'
import { DREHistoricoModal } from './DREHistoricoModal'
import { useDashboardFilter, MONTHS_SHORT } from '../../contexts/DashboardFilterContext'
import { getPeriodData } from '../../mocks/periodoData'

function fmt(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function ValueCell({ value, dir, varPct }: { value: number | null; dir: string | null; varPct?: string | null }) {
  if (value === null) return <span className="text-[#555]">-</span>
  const pctColor = dir === 'up' ? 'text-emerald-400' : dir === 'down' ? 'text-red-400' : 'text-[#666]'
  return (
    <span className="flex items-center gap-1.5 justify-end">
      {(dir || varPct) && (
        <span className={`flex items-center gap-0.5 text-[10px] font-mono font-semibold shrink-0 ${pctColor}`}>
          <span className="text-[#444]">(</span>
          {dir === 'up'   && <TrendingUp   size={10} className="text-emerald-400 shrink-0" />}
          {dir === 'down' && <TrendingDown size={10} className="text-red-400 shrink-0" />}
          {varPct && <span>{varPct}</span>}
          <span className="text-[#444]">)</span>
        </span>
      )}
      <span>{fmt(value)}</span>
    </span>
  )
}

function DescontoCell({ value, badge }: { value: number | null; badge: string | null }) {
  if (value === null) return <span className="text-[#555]">-</span>
  const cls = badge === 'orange'
    ? 'border border-orange-500 text-orange-400'
    : badge === 'teal'
      ? 'bg-teal-500/20 text-teal-300'
      : ''
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>
      {fmt(value)}
    </span>
  )
}

export function AvaliacaoResultadosInline() {
  const [showHistorico, setShowHistorico] = useState(false)
  const { selectedMonth, selectedYear, compareMonth, compareYear } = useDashboardFilter()

  const compareLabel = `${MONTHS_SHORT[compareMonth]}/${compareYear}`

  const { avaliacao: rows } = getPeriodData(selectedMonth, selectedYear, compareMonth, compareYear)

  return (
    <div className="mt-5 pt-5 border-t border-white/5">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.25) 0%, rgba(255,102,0,0.1) 100%)' }}>
            <BarChart2 size={18} className="text-orange-500" />
          </div>
          <div>
            <h3 className="text-white text-lg font-bold">Avaliação de Resultados</h3>
            <p className="text-[#666] text-xs mt-0.5">
              Análise comparativa de indicadores financeiros • Antes vs Depois da Intermediação
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistorico(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-2.5 py-1.5 text-[10px] font-semibold transition-colors"
          >
            <History size={12} />
            <span>Histórico</span>
          </button>
        </div>
      </div>

      {showHistorico && <DREHistoricoModal onClose={() => setShowHistorico(false)} />}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th className="text-left px-5 py-3 text-[#555] text-[10px] font-semibold tracking-widest uppercase">Avaliação Resultado</th>
              <th className="text-right px-4 py-3 text-[#555] text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap">
                Antes
                <span className="block text-[9px] font-normal text-[#3a3a3a] normal-case tracking-normal mt-0.5">vs {compareLabel}</span>
              </th>
              <th className="text-right px-4 py-3 text-[#555] text-[10px] font-semibold tracking-widest uppercase">%</th>
              <th className="text-right px-4 py-3 text-[#555] text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap">
                Depois
                <span className="block text-[9px] font-normal text-[#3a3a3a] normal-case tracking-normal mt-0.5">vs {compareLabel}</span>
              </th>
              <th className="text-right px-4 py-3 text-[#555] text-[10px] font-semibold tracking-widest uppercase">%</th>
              <th className="text-right px-4 py-3 text-[#555] text-[10px] font-semibold tracking-widest uppercase">Variação</th>
              <th className="text-right px-5 py-3 text-[#555] text-[10px] font-semibold tracking-widest uppercase">Desconto</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={`border-b border-white/[0.04] last:border-0 ${row.bold ? 'bg-white/[0.02]' : ''} hover:bg-white/[0.03] transition-colors`}>
                <td className="px-5 py-3">
                  <span style={{ paddingLeft: row.indent * 16 }}>
                    {row.badge === 'orange' && (
                      <span className="inline-flex items-center bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded">
                        {row.label}
                      </span>
                    )}
                    {row.badge === 'teal' && (
                      <span className="inline-flex items-center bg-teal-500 text-white text-xs font-bold px-2.5 py-0.5 rounded">
                        {row.label}
                      </span>
                    )}
                    {!row.badge && (
                      <span className={row.bold ? 'text-white font-semibold' : 'text-[#aaa]'}>
                        {row.label}
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-white">
                  <ValueCell value={row.antes} dir={row.antesDir} varPct={row.antesVarPct} />
                </td>
                <td className="px-4 py-3 text-right text-[#666] text-xs">{row.antesP ?? '-'}</td>
                <td className="px-4 py-3 text-right text-white">
                  <ValueCell value={row.depois} dir={row.depoisDir} varPct={row.depoisVarPct} />
                </td>
                <td className="px-4 py-3 text-right text-[#666] text-xs">{row.depoisP ?? '-'}</td>
                <td className={`px-4 py-3 text-right font-semibold text-xs ${row.variacaoCor === 'green' ? 'text-emerald-400' : 'text-[#aaa]'}`}>
                  {row.variacao ?? '-'}
                </td>
                <td className="px-5 py-3 text-right">
                  <DescontoCell value={row.desconto} badge={row.descontoBadge} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
