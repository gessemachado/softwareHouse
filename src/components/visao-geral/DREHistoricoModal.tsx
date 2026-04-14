import { X, Download, TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

// Mai/25 → Abr/26
const MONTHS = ['Mai/25','Jun/25','Jul/25','Ago/25','Set/25','Out/25','Nov/25','Dez/25','Jan/26','Fev/26','Mar/26','Abr/26']

type RowDef = {
  key: string
  label: string
  badge?: 'orange' | 'teal'
  indent?: number
  bold?: boolean
  dim?: boolean
  highlight?: 'orange' | 'green'
  isCost?: boolean  // subida = ruim
}

const ROW_DEFS: RowDef[] = [
  { key: 'Vendas',            label: 'Vendas +',                   badge: 'orange', bold: true },
  { key: 'BaseICMS',          label: 'Base (ICMS - IBS)',           indent: 1, dim: true },
  { key: 'BasePIS',           label: 'Base (PIS/COFINS - CBS)',     indent: 1, dim: true },
  { key: 'CMV',               label: 'CMV',                        bold: true, isCost: true },
  { key: 'MargemBruta',       label: 'Margem Bruta',               bold: true },
  { key: 'Debito',            label: 'Débito',                     bold: true, isCost: true },
  { key: 'DescontoExtra',     label: 'Desconto extra Finalizadora', dim: true },
  { key: 'MargemLiquida',     label: 'Margem Líquida',             bold: true, highlight: 'orange' },
  { key: 'TaxaBuyHelp',       label: 'Taxa BuyHelp (i)',           badge: 'teal' },
  { key: 'MargemLiquidaFinal',label: 'Margem Líquida Final',       bold: true },
]

// Valores mensais (em R$ milhões)
const RAW: Record<string, number[]> = {
  'Vendas':             [79.2, 74.8, 83.1, 80.5, 76.3, 84.9, 81.7, 86.2, 77.4, 80.1, 82.3, 79.9],
  'BaseICMS':           [31.4, 29.7, 33.0, 31.9, 30.2, 33.7, 32.4, 34.2, 30.7, 31.8, 32.6, 31.7],
  'BasePIS':            [22.8, 21.5, 23.9, 23.1, 21.9, 24.4, 23.5, 24.8, 22.2, 23.0, 23.6, 23.0],
  'CMV':                [54.7, 51.7, 57.4, 55.6, 52.7, 58.6, 56.4, 59.6, 53.5, 55.3, 56.8, 55.2],
  'MargemBruta':        [24.5, 23.1, 25.7, 24.9, 23.6, 26.3, 25.3, 26.6, 23.9, 24.8, 25.5, 24.7],
  'Debito':             [6.5,  5.8,  6.9,  6.6,  5.9,  7.1,  6.8,  7.4,  6.1,  6.4,  6.7,  4.9],
  'DescontoExtra':      [0.016,0.014,0.017,0.016,0.015,0.017,0.016,0.018,0.015,0.016,0.016,0.016],
  'MargemLiquida':      [16.2, 15.3, 17.0, 16.5, 15.6, 17.4, 16.8, 17.6, 15.8, 16.4, 16.9, 16.5],
  'TaxaBuyHelp':        [0.41, 0.38, 0.44, 0.42, 0.39, 0.45, 0.43, 0.45, 0.40, 0.42, 0.43, 0.45],
  'MargemLiquidaFinal': [16.2, 15.3, 17.0, 16.5, 15.6, 17.4, 16.8, 17.6, 15.8, 16.4, 16.9, 16.5],
}

function pct(curr: number, prev: number) {
  if (!prev) return null
  return ((curr - prev) / prev * 100).toFixed(1)
}

function fmtM(v: number) {
  if (v < 0.1) return `R$${(v * 1000).toFixed(0)}k`
  return `R$${v.toFixed(1)}M`
}

// Chart uses Vendas + Margem Líquida
const chartData = MONTHS.map((m, i) => ({
  month: m,
  Vendas: RAW['Vendas'][i],
  'Marg. Líquida': RAW['MargemLiquida'][i],
}))

const ytdVendas  = RAW['Vendas'].reduce((a, b) => a + b, 0)
const ytdMargem  = RAW['MargemLiquida'].reduce((a, b) => a + b, 0)
const avgDebito  = RAW['Debito'].reduce((a, b) => a + b, 0) / 12
const margemPct  = ((ytdMargem / ytdVendas) * 100).toFixed(1)

const kpis = [
  { label: 'Vendas YTD',         value: fmtM(ytdVendas),  change: '+12.4%', up: true },
  { label: 'Débito Médio Mensal', value: fmtM(avgDebito),  change: '-20.7%', up: false },
  { label: 'Margem Líquida %',   value: `${margemPct}%`,  change: '+0.8%',  up: true },
  { label: 'Margem Líquida YTD', value: fmtM(ytdMargem),  change: '+5.2%',  up: true },
]

interface Props { onClose: () => void }

export function DREHistoricoModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[96vw] rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        style={{ background: '#0d0d0d', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 shrink-0">
          <div>
            <h2 className="text-white text-xl font-bold">DRE — Histórico 12 Meses</h2>
            <p className="text-[#666] text-xs mt-0.5">Mai/2025 → Abr/2026 • Variação mês a mês</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 border border-white/10 bg-white/5 text-[#aaa] hover:text-white px-3 py-2 rounded-lg text-xs transition-colors">
              <Download size={13} /> Exportar
            </button>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#666] hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-1 px-8 py-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.label} className="rounded-xl border border-white/5 p-4"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-[#555] text-[9px] font-semibold tracking-widest uppercase mb-3">{k.label}</p>
                <div className="flex items-end justify-between gap-2">
                  <p className="text-white text-xl font-bold">{k.value}</p>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    k.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {k.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {k.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-white/5 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-orange-500" />
                <span className="text-[#aaa] text-xs">Vendas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                <span className="text-[#aaa] text-xs">Margem Líquida</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }} barGap={2}>
                <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `R$${v}M`} tick={{ fill: '#555', fontSize: 9 }} axisLine={false} tickLine={false} width={45} />
                <Tooltip
                  formatter={(v, name) => [`R$ ${Number(v).toFixed(1)}M`, name]}
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#fff' }}
                  labelStyle={{ color: '#999' }}
                />
                <Bar dataKey="Vendas" fill="#ff6600" radius={[2,2,0,0]} opacity={0.85} />
                <Bar dataKey="Marg. Líquida" fill="#34d399" radius={[2,2,0,0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* DRE Table */}
          <div className="rounded-xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th className="sticky left-0 z-10 px-5 py-3 text-left text-[#555] text-[9px] font-bold tracking-widest uppercase whitespace-nowrap min-w-[200px]"
                      style={{ background: '#111' }}>
                      Descrição
                    </th>
                    {MONTHS.map(m => (
                      <th key={m} className="px-3 py-3 text-center text-[#555] text-[9px] font-bold tracking-widest uppercase whitespace-nowrap">
                        {m}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-orange-500 text-[9px] font-bold tracking-widest uppercase whitespace-nowrap bg-orange-500/5">
                      YTD / Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ROW_DEFS.map((row, ri) => {
                    const values = RAW[row.key]
                    const ytd = values.reduce((a, b) => a + b, 0)
                    const isSubtotal = row.highlight === 'orange' || row.bold

                    return (
                      <tr
                        key={row.key}
                        className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                        style={isSubtotal && !row.badge ? { background: 'rgba(255,255,255,0.015)' } : {}}
                      >
                        {/* Label cell */}
                        <td
                          className="sticky left-0 z-10 px-5 py-3 whitespace-nowrap"
                          style={{ background: isSubtotal && !row.badge ? '#111' : '#0d0d0d' }}
                        >
                          <span style={{ paddingLeft: (row.indent ?? 0) * 16 }}>
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
                              <span className={
                                row.highlight === 'orange' ? 'text-orange-400 font-bold' :
                                row.bold ? 'text-white font-semibold' :
                                'text-[#777]'
                              }>
                                {row.label}
                              </span>
                            )}
                          </span>
                        </td>

                        {/* Month cells */}
                        {values.map((v, i) => {
                          const change = i === 0 ? null : pct(v, values[i - 1])
                          const up = change !== null && parseFloat(change) >= 0
                          const positive = row.isCost ? !up : up

                          return (
                            <td key={i} className="px-3 py-3 text-center whitespace-nowrap">
                              <div className={`font-medium tabular-nums ${row.highlight === 'orange' ? 'text-orange-400' : 'text-white'}`}>
                                {fmtM(v)}
                              </div>
                              {change !== null && (
                                <div className={`text-[9px] font-semibold mt-0.5 ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {up ? '+' : ''}{change}%
                                </div>
                              )}
                            </td>
                          )
                        })}

                        {/* YTD */}
                        <td className="px-4 py-3 text-center whitespace-nowrap bg-orange-500/5">
                          <span className={`font-bold tabular-nums ${row.highlight === 'orange' ? 'text-orange-400' : 'text-white'}`}>
                            {fmtM(ytd)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-white/5"
              style={{ background: 'rgba(255,255,255,0.01)' }}>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[9px] font-bold text-[#555] tracking-widest uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Melhora
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-bold text-[#555] tracking-widest uppercase">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> Piora
                </span>
              </div>
              <p className="text-[#444] text-[9px] italic">Valores em R$ milhões (M). Variação % mês a mês.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
