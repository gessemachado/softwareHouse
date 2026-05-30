import { X, Users } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { MESES } from '../../mocks/dashboardData'

interface Props { onClose: () => void }

const ORIGEM_DATA = MESES.map((mes, i) => ({
  mes,
  crm:       [18,22,16,28,31,29,36,35,38,37,44,43,46][i],
  loja:      [15,17,14,24,27,25,33,32,36,34,40,38,41][i],
  afiliados: [ 9,  9,  8,13,14,14,16,16,17,17,21,21,21][i],
}))

const CORES = {
  crm:       '#ff6600',
  loja:      '#2499e4',
  afiliados: '#22c55e',
}

const TOTAL_ATIVOS = 5235

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s: number, p: any) => s + p.value, 0)
  return (
    <div className="rounded-xl border border-gray-200 px-4 py-3 shadow-2xl text-xs"
      style={{ background: '#ffffff' }}>
      <p className="text-gray-500 font-mono font-bold tracking-widest uppercase mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-gray-600">{p.name}</span>
          <span className="font-semibold ml-auto pl-4" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
      <div className="border-t border-gray-100 mt-2 pt-2 flex items-center justify-between">
        <span className="text-gray-500">Total</span>
        <span className="text-gray-900 font-bold">{total}</span>
      </div>
    </div>
  )
}

function CustomLegend({ payload }: any) {
  return (
    <div className="flex items-center gap-6 mb-2">
      {payload?.map((p: any) => (
        <span key={p.value} className="flex items-center gap-2 text-xs text-[#aaa]">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.color }} />
          {p.value}
        </span>
      ))}
    </div>
  )
}

export function ComposicaoClientesModal({ onClose }: Props) {
  const totalCRM       = ORIGEM_DATA.reduce((s, d) => s + d.crm, 0)
  const totalLoja      = ORIGEM_DATA.reduce((s, d) => s + d.loja, 0)
  const totalAfiliados = ORIGEM_DATA.reduce((s, d) => s + d.afiliados, 0)
  const totalGeral     = totalCRM + totalLoja + totalAfiliados

  const origens = [
    { key: 'crm',       label: 'Cadastro Externo (CRM)', total: totalCRM,       color: CORES.crm,       pct: (totalCRM / totalGeral * 100).toFixed(1) },
    { key: 'loja',      label: 'Loja',                   total: totalLoja,      color: CORES.loja,      pct: (totalLoja / totalGeral * 100).toFixed(1) },
    { key: 'afiliados', label: 'Afiliados',              total: totalAfiliados, color: CORES.afiliados, pct: (totalAfiliados / totalGeral * 100).toFixed(1) },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl border border-bh-border/40 shadow-2xl flex flex-col"
        style={{ background: '#000000', maxWidth: '95vw', maxHeight: '95vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-bh-border/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.25) 0%, rgba(255,102,0,0.1) 100%)' }}>
              <Users size={18} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-bh-text text-xl font-bold">Composição por Origem</h2>
              <p className="text-bh-subtle text-xs mt-1">
                Total: {TOTAL_ATIVOS.toLocaleString('pt-BR')} clientes ativos · Abr/2025 → Abr/2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bh-surface2 text-bh-subtle hover:text-bh-text transition-colors shrink-0 ml-4"
          >
            <X size={18} />
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4 px-8 py-5 border-b border-bh-border/30 shrink-0">
          {origens.map(o => (
            <div key={o.key} className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full" style={{ background: o.color }} />
                <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase">{o.label}</p>
              </div>
              <p className="text-bh-text text-2xl font-bold">{o.total.toLocaleString('pt-BR')}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-bh-subtle text-[10px]">Novos cadastros (13 meses)</p>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ color: o.color, background: `${o.color}18` }}>{o.pct}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + table */}
        <div className="flex-1 overflow-auto px-8 py-6 space-y-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ORIGEM_DATA} margin={{ top: 10, right: 10, bottom: 5, left: 0 }} barCategoryGap="25%">
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend content={<CustomLegend />} verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 12 }} />
              <Bar dataKey="crm"       name="Cadastro Externo (CRM)" fill={CORES.crm}       radius={[3,3,0,0]} maxBarSize={22} />
              <Bar dataKey="loja"      name="Loja"                   fill={CORES.loja}      radius={[3,3,0,0]} maxBarSize={22} />
              <Bar dataKey="afiliados" name="Afiliados"              fill={CORES.afiliados} radius={[3,3,0,0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>

          {/* Tabela de distribuição */}
          <div className="rounded-xl border border-bh-border/30 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bh-border/30" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th className="text-left px-5 py-3 text-bh-subtle text-[10px] font-semibold tracking-widest uppercase">Origem</th>
                  <th className="text-right px-4 py-3 text-bh-subtle text-[10px] font-semibold tracking-widest uppercase">Novos (13m)</th>
                  <th className="text-right px-4 py-3 text-bh-subtle text-[10px] font-semibold tracking-widest uppercase">% do Total</th>
                  <th className="text-right px-5 py-3 text-bh-subtle text-[10px] font-semibold tracking-widest uppercase">lt. mês</th>
                </tr>
              </thead>
              <tbody>
                {origens.map(o => {
                  const lastMonth = ORIGEM_DATA[ORIGEM_DATA.length - 1][o.key as keyof typeof ORIGEM_DATA[0]] as number
                  return (
                    <tr key={o.key} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: o.color }} />
                          <span className="text-bh-text text-sm">{o.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-bh-text font-semibold">{o.total.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ color: o.color, background: `${o.color}18` }}>{o.pct}%</span>
                      </td>
                      <td className="px-5 py-3 text-right text-[#aaa] font-semibold">{lastMonth}</td>
                    </tr>
                  )
                })}
                <tr className="bg-white/[0.02]">
                  <td className="px-5 py-3 text-bh-text font-semibold">Total</td>
                  <td className="px-4 py-3 text-right text-bh-text font-bold">{totalGeral.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right text-bh-subtle text-xs">100%</td>
                  <td className="px-5 py-3 text-right text-[#aaa] font-semibold">
                    {ORIGEM_DATA[ORIGEM_DATA.length - 1].crm + ORIGEM_DATA[ORIGEM_DATA.length - 1].loja + ORIGEM_DATA[ORIGEM_DATA.length - 1].afiliados}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
