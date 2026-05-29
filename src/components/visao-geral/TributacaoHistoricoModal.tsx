import { X } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { TRIBUTACAO, MESES } from '../../mocks/dashboardData'

const data = MESES.map((mes, i) => ({
  mes,
  tributado: TRIBUTACAO[i].tributado,
  isento:    TRIBUTACAO[i].isento,
}))

const data2026 = data.filter(d => d.mes.includes('/26'))

function fmtK(v: number) { return `R$ ${Math.round(v / 1000)}k` }

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const trib = payload.find((p: any) => p.dataKey === 'tributado')
  const isen = payload.find((p: any) => p.dataKey === 'isento')
  const total = (trib?.value ?? 0) + (isen?.value ?? 0)
  const tribPct = total > 0 ? ((trib?.value ?? 0) / total * 100).toFixed(1) : '0.0'
  return (
    <div className="rounded-xl border border-gray-200 px-4 py-3 shadow-2xl text-xs min-w-[190px]"
      style={{ background: '#ffffff' }}>
      <p className="text-gray-500 font-mono font-bold tracking-widest uppercase mb-2">{label}</p>
      {trib && <div className="flex justify-between gap-4 mb-1"><span className="text-gray-500">Tributado</span><span className="font-bold text-orange-500">{fmtK(trib.value)}</span></div>}
      {isen && <div className="flex justify-between gap-4 mb-1"><span className="text-gray-500">Isento</span><span className="font-bold text-green-600">{fmtK(isen.value)}</span></div>}
      <div className="flex justify-between gap-4 border-t border-gray-100 mt-2 pt-2">
        <span className="text-gray-400">% Tributado</span>
        <span className="font-bold text-gray-900">{tribPct}%</span>
      </div>
    </div>
  )
}

function CustomLegend({ payload }: any) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-2">
      {payload?.map((p: any) => (
        <span key={p.value} className="flex items-center gap-1.5 text-[10px] font-semibold text-bh-muted">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.color }} />
          {p.value}
        </span>
      ))}
    </div>
  )
}

interface Props { onClose: () => void }

export function TributacaoHistoricoModal({ onClose }: Props) {
  const totalTrib2026  = data2026.reduce((s, d) => s + d.tributado, 0)
  const totalIsen2026  = data2026.reduce((s, d) => s + d.isento, 0)
  const totalGeral2026 = totalTrib2026 + totalIsen2026
  const pctTrib2026    = totalGeral2026 > 0 ? ((totalTrib2026 / totalGeral2026) * 100).toFixed(1) : '0.0'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }} onClick={onClose}>
      <div className="w-full rounded-2xl border border-bh-border/40 shadow-2xl flex flex-col"
        style={{ background: 'rgb(var(--bh-surface))', maxWidth: '92vw', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-bh-border/30 shrink-0">
          <div>
            <h2 className="text-bh-text text-xl font-bold">Tributação de Produtos " Histórico</h2>
            <p className="text-bh-subtle text-xs mt-1">Abr/2025 → Abr/2026 · Tributados vs Isentos</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bh-surface2 text-bh-subtle hover:text-bh-text transition-colors shrink-0 ml-4">
            <X size={18} />
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4 px-8 py-5 border-b border-bh-border/30 shrink-0">
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Total Tributado</p>
            <p className="text-orange-400 text-2xl font-bold">{fmtK(totalTrib2026)}</p>
            <p className="text-bh-subtle text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Total Isento</p>
            <p className="text-emerald-400 text-2xl font-bold">{fmtK(totalIsen2026)}</p>
            <p className="text-bh-subtle text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">% Tributado</p>
            <p className="text-bh-text text-2xl font-bold">{pctTrib2026}%</p>
            <p className="text-bh-subtle text-[10px] mt-1">Sobre total de vendas</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: 0 }} barCategoryGap="25%">
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }} axisLine={false} tickLine={false} width={44}
                tickFormatter={v => `${Math.round(v / 1000)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend content={<CustomLegend />} verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 12 }} />
              <Bar dataKey="tributado" name="Tributado" fill="#f97316" radius={[3,3,0,0]} maxBarSize={32} />
              <Bar dataKey="isento"    name="Isento"    fill="#22c55e" radius={[3,3,0,0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
