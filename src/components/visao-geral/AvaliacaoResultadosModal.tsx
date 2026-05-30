import { X, BarChart2, TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
  onClose: () => void
}

const rows = [
  {
    label: 'Vendas +', badge: 'orange', indent: 0, bold: true,
    antes: 81329965.53, antesDir: 'up',
    antesP: null,
    depois: 79969333.70, depoisDir: 'down',
    depoisP: null,
    variacao: '1.67 %', variacaoCor: null,
    desconto: 1360633.83, descontoBadge: 'orange',
  },
  {
    label: 'Base (ICMS - IBS)', badge: null, indent: 1, bold: false,
    antes: 33740642.99, antesDir: 'up',
    antesP: null,
    depois: 31723373.20, depoisDir: 'down',
    depoisP: null,
    variacao: null, variacaoCor: null,
    desconto: 8011269.79, descontoBadge: null,
  },
  {
    label: 'Base (PIS/COFINS - CBS)', badge: null, indent: 1, bold: false,
    antes: 29705738.34, antesDir: 'up',
    antesP: null,
    depois: 23266335.29, depoisDir: 'down',
    depoisP: null,
    variacao: null, variacaoCor: null,
    desconto: 6439403.05, descontoBadge: null,
  },
  {
    label: 'CMV', badge: null, indent: 0, bold: true,
    antes: 56148131.82, antesDir: 'down',
    antesP: '69.04 %',
    depois: 56148131.82, depoisDir: 'up',
    depoisP: '70.21 %',
    variacao: '0.00 %', variacaoCor: null,
    desconto: null, descontoBadge: null,
  },
  {
    label: 'Margem Bruta', badge: null, indent: 0, bold: true,
    antes: 25186183.13, antesDir: 'up',
    antesP: null,
    depois: 22805501.30, depoisDir: 'down',
    depoisP: null,
    variacao: null, variacaoCor: null,
    desconto: null, descontoBadge: null,
  },
  {
    label: 'Débito', badge: null, indent: 0, bold: true,
    antes: 6713729.69, antesDir: 'up',
    antesP: '10.71 %',
    depois: 4905407.44, depoisDir: 'up',
    depoisP: '8.64 %',
    variacao: '20.73 %', variacaoCor: 'green',
    desconto: 1808322.26, descontoBadge: 'teal',
  },
  {
    label: 'Desconto extra Finalizadora', badge: null, indent: 0, bold: false,
    antes: 15660.58, antesDir: null,
    antesP: null,
    depois: 15660.58, depoisDir: null,
    depoisP: null,
    variacao: null, variacaoCor: null,
    desconto: null, descontoBadge: null,
  },
  {
    label: 'Margem Líquida', badge: null, indent: 0, bold: true,
    antes: 16452463.44, antesDir: 'up',
    antesP: '20.23 %',
    depois: 16452463.44, depoisDir: 'up',
    depoisP: '20.23 %',
    variacao: '0.00 %', variacaoCor: null,
    desconto: null, descontoBadge: null,
  },
  {
    label: 'Taxa BuyHelp (i)', badge: 'teal', indent: 0, bold: false,
    antes: null, antesDir: null,
    antesP: null,
    depois: 447690.78, depoisDir: null,
    depoisP: null,
    variacao: '0.56%', variacaoCor: null,
    desconto: 1355116.28, descontoBadge: 'teal',
  },
  {
    label: 'Margem Líquida Final', badge: null, indent: 0, bold: true,
    antes: 16452463.44, antesDir: null,
    antesP: '20.23 %',
    depois: 16452463.44, depoisDir: null,
    depoisP: '20.23 %',
    variacao: '0.00 %', variacaoCor: null,
    desconto: null, descontoBadge: null,
  },
]

function fmt(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function ValueCell({ value, dir }: { value: number | null; dir: string | null }) {
  if (value === null) return <span className="text-bh-subtle">-</span>
  return (
    <span className="flex items-center gap-1 justify-end">
      {dir === 'up' && <TrendingUp size={12} className="text-emerald-400 shrink-0" />}
      {dir === 'down' && <TrendingDown size={12} className="text-red-400 shrink-0" />}
      <span>{fmt(value)}</span>
    </span>
  )
}

function DescontoCell({ value, badge }: { value: number | null; badge: string | null }) {
  if (value === null) return <span className="text-bh-subtle">-</span>
  const cls = badge === 'orange'
    ? 'bg-transparent border border-orange-500 text-orange-400'
    : badge === 'teal'
      ? 'bg-teal-500/20 text-teal-300'
      : ''
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>
      {fmt(value)}
    </span>
  )
}

export function AvaliacaoResultadosModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="w-full max-w-5xl rounded-2xl border border-bh-border/40 overflow-hidden shadow-2xl"
        style={{ background: '#000000' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-bh-border/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.25) 0%, rgba(255,102,0,0.1) 100%)' }}>
              <BarChart2 size={22} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-bh-text text-xl font-bold">Avaliação de Resultados</h2>
              <p className="text-bh-subtle text-sm mt-0.5">Análise comparativa de indicadores financeiros  Antes vs Depois da Intermediação</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bh-surface2 text-bh-subtle hover:text-bh-text transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[75vh]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bh-border/30">
                <th className="text-left px-8 py-3 text-bh-subtle text-[10px] font-semibold tracking-widest uppercase">Avaliação Resultado</th>
                <th className="text-right px-4 py-3 text-bh-subtle text-[10px] font-semibold tracking-widest uppercase">Antes</th>
                <th className="text-right px-4 py-3 text-bh-subtle text-[10px] font-semibold tracking-widest uppercase">%</th>
                <th className="text-right px-4 py-3 text-bh-subtle text-[10px] font-semibold tracking-widest uppercase">Depois</th>
                <th className="text-right px-4 py-3 text-bh-subtle text-[10px] font-semibold tracking-widest uppercase">%</th>
                <th className="text-right px-4 py-3 text-bh-subtle text-[10px] font-semibold tracking-widest uppercase">Variação</th>
                <th className="text-right px-8 py-3 text-bh-subtle text-[10px] font-semibold tracking-widest uppercase">Desconto</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={`border-b border-white/[0.04] ${row.bold ? 'bg-white/[0.02]' : ''} hover:bg-white/[0.03] transition-colors`}>
                  {/* Label */}
                  <td className="px-8 py-3">
                    <span style={{ paddingLeft: row.indent * 16 }}>
                      {row.badge === 'orange' && (
                        <span className="inline-flex items-center bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded mr-1">
                          {row.label}
                        </span>
                      )}
                      {row.badge === 'teal' && (
                        <span className="inline-flex items-center bg-teal-500 text-bh-text text-xs font-bold px-2.5 py-0.5 rounded mr-1">
                          {row.label}
                        </span>
                      )}
                      {!row.badge && (
                        <span className={row.bold ? 'text-bh-text font-semibold' : 'text-[#aaa]'}>
                          {row.label}
                        </span>
                      )}
                    </span>
                  </td>

                  {/* Antes */}
                  <td className="px-4 py-3 text-right text-bh-text">
                    <ValueCell value={row.antes} dir={row.antesDir} />
                  </td>

                  {/* Antes % */}
                  <td className="px-4 py-3 text-right text-bh-subtle">
                    {row.antesP ?? '-'}
                  </td>

                  {/* Depois */}
                  <td className="px-4 py-3 text-right text-bh-text">
                    <ValueCell value={row.depois} dir={row.depoisDir} />
                  </td>

                  {/* Depois % */}
                  <td className="px-4 py-3 text-right text-bh-subtle">
                    {row.depoisP ?? '-'}
                  </td>

                  {/* Variação */}
                  <td className={`px-4 py-3 text-right font-semibold ${row.variacaoCor === 'green' ? 'text-emerald-400' : 'text-[#aaa]'}`}>
                    {row.variacao ?? '-'}
                  </td>

                  {/* Desconto */}
                  <td className="px-8 py-3 text-right">
                    <DescontoCell value={row.desconto} badge={row.descontoBadge} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
