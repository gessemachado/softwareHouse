import { useState } from 'react'
import { BarChart2, TrendingUp, TrendingDown, History } from 'lucide-react'
import { DREHistoricoModal } from './DREHistoricoModal'

const rows = [
  {
    label: 'Vendas +', badge: 'orange', indent: 0, bold: true,
    antes: 81329965.53, antesDir: 'up', antesP: null,
    depois: 79969333.70, depoisDir: 'down', depoisP: null,
    variacao: '1.67 %', variacaoCor: null,
    desconto: 1360633.83, descontoBadge: 'orange',
  },
  {
    label: 'Base (ICMS - IBS)', badge: null, indent: 1, bold: false,
    antes: 33740642.99, antesDir: 'up', antesP: null,
    depois: 31723373.20, depoisDir: 'down', depoisP: null,
    variacao: null, variacaoCor: null,
    desconto: 8011269.79, descontoBadge: null,
  },
  {
    label: 'Base (PIS/COFINS - CBS)', badge: null, indent: 1, bold: false,
    antes: 29705738.34, antesDir: 'up', antesP: null,
    depois: 23266335.29, depoisDir: 'down', depoisP: null,
    variacao: null, variacaoCor: null,
    desconto: 6439403.05, descontoBadge: null,
  },
  {
    label: 'CMV', badge: null, indent: 0, bold: true,
    antes: 56148131.82, antesDir: 'down', antesP: '69.04 %',
    depois: 56148131.82, depoisDir: 'up', depoisP: '70.21 %',
    variacao: '0.00 %', variacaoCor: null,
    desconto: null, descontoBadge: null,
  },
  {
    label: 'Margem Bruta', badge: null, indent: 0, bold: true,
    antes: 25186183.13, antesDir: 'up', antesP: null,
    depois: 22805501.30, depoisDir: 'down', depoisP: null,
    variacao: null, variacaoCor: null,
    desconto: null, descontoBadge: null,
  },
  {
    label: 'Débito', badge: null, indent: 0, bold: true,
    antes: 6713729.69, antesDir: 'up', antesP: '10.71 %',
    depois: 4905407.44, depoisDir: 'up', depoisP: '8.64 %',
    variacao: '20.73 %', variacaoCor: 'green',
    desconto: 1808322.26, descontoBadge: 'teal',
  },
  {
    label: 'Desconto extra Finalizadora', badge: null, indent: 0, bold: false,
    antes: 15660.58, antesDir: null, antesP: null,
    depois: 15660.58, depoisDir: null, depoisP: null,
    variacao: null, variacaoCor: null,
    desconto: null, descontoBadge: null,
  },
  {
    label: 'Margem Líquida', badge: null, indent: 0, bold: true,
    antes: 16452463.44, antesDir: 'up', antesP: '20.23 %',
    depois: 16452463.44, depoisDir: 'up', depoisP: '20.23 %',
    variacao: '0.00 %', variacaoCor: null,
    desconto: null, descontoBadge: null,
  },
  {
    label: 'Taxa BuyHelp (i)', badge: 'teal', indent: 0, bold: false,
    antes: null, antesDir: null, antesP: null,
    depois: 447690.78, depoisDir: null, depoisP: null,
    variacao: '0.56%', variacaoCor: null,
    desconto: 1355116.28, descontoBadge: 'teal',
  },
  {
    label: 'Margem Líquida Final', badge: null, indent: 0, bold: true,
    antes: 16452463.44, antesDir: null, antesP: '20.23 %',
    depois: 16452463.44, depoisDir: null, depoisP: '20.23 %',
    variacao: '0.00 %', variacaoCor: null,
    desconto: null, descontoBadge: null,
  },
]

function fmt(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function ValueCell({ value, dir }: { value: number | null; dir: string | null }) {
  if (value === null) return <span className="text-[#555]">-</span>
  return (
    <span className="flex items-center gap-1 justify-end">
      {dir === 'up'   && <TrendingUp   size={11} className="text-emerald-400 shrink-0" />}
      {dir === 'down' && <TrendingDown size={11} className="text-red-400 shrink-0" />}
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
            <p className="text-[#666] text-xs mt-0.5">Análise comparativa de indicadores financeiros • Antes vs Depois da Intermediação</p>
          </div>
        </div>
        <button
          onClick={() => setShowHistorico(true)}
          title="Histórico 12 Meses"
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 transition-colors"
        >
          <History size={16} />
        </button>
      </div>

      {showHistorico && <DREHistoricoModal onClose={() => setShowHistorico(false)} />}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th className="text-left px-5 py-3 text-[#555] text-[10px] font-semibold tracking-widest uppercase">Avaliação Resultado</th>
              <th className="text-right px-4 py-3 text-[#555] text-[10px] font-semibold tracking-widest uppercase">Antes</th>
              <th className="text-right px-4 py-3 text-[#555] text-[10px] font-semibold tracking-widest uppercase">%</th>
              <th className="text-right px-4 py-3 text-[#555] text-[10px] font-semibold tracking-widest uppercase">Depois</th>
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
                <td className="px-4 py-3 text-right text-white"><ValueCell value={row.antes} dir={row.antesDir} /></td>
                <td className="px-4 py-3 text-right text-[#666] text-xs">{row.antesP ?? '-'}</td>
                <td className="px-4 py-3 text-right text-white"><ValueCell value={row.depois} dir={row.depoisDir} /></td>
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
