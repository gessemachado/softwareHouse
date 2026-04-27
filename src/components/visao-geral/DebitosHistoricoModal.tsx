import { X } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { AVALIACAO, MESES } from '../../mocks/dashboardData'

const data = MESES.map((mes, i) => ({
  mes,
  antes:   Math.round(AVALIACAO[i].debito.a),
  depois:  Math.round(AVALIACAO[i].debito.d),
  economia: Math.round(AVALIACAO[i].debito.a - AVALIACAO[i].debito.d),
}))

const data2026 = data.filter(d => d.mes.includes('/26'))

function fmtM(v: number) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`
  return `R$ ${Math.round(v / 1000)}k`
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const antes   = payload.find((p: any) => p.dataKey === 'antes')
  const depois  = payload.find((p: any) => p.dataKey === 'depois')
  const eco     = payload.find((p: any) => p.dataKey === 'economia')
  const redPct  = antes?.value > 0 ? ((eco?.value ?? 0) / antes.value * 100).toFixed(1) : '0.0'
  return (
    <div className="rounded-xl border border-gray-200 px-4 py-3 shadow-2xl text-xs min-w-[200px]"
      style={{ background: '#ffffff' }}>
      <p className="text-gray-500 font-mono font-bold tracking-widest uppercase mb-2">{label}</p>
      {antes  && <div className="flex justify-between gap-4 mb-1"><span className="text-gray-500">Antes</span><span className="font-bold text-red-500">{fmtM(antes.value)}</span></div>}
      {depois && <div className="flex justify-between gap-4 mb-1"><span className="text-gray-500">Depois</span><span className="font-bold text-green-600">{fmtM(depois.value)}</span></div>}
      {eco    && (
        <div className="border-t border-gray-100 mt-2 pt-2">
          <div className="flex justify-between gap-4 mb-0.5"><span className="text-gray-400">Economia</span><span className="font-bold text-emerald-500">{fmtM(eco.value)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-gray-400">Redução</span><span className="font-bold text-gray-700">{redPct}%</span></div>
        </div>
      )}
    </div>
  )
}

function CustomLegend({ payload }: any) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-2">
      {payload?.map((p: any) => (
        <span key={p.value} className="flex items-center gap-1.5 text-[10px] font-semibold text-[#888]">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.color }} />
          {p.value}
        </span>
      ))}
    </div>
  )
}

interface Props { onClose: () => void }

export function DebitosHistoricoModal({ onClose }: Props) {
  const totalAntes2026   = data2026.reduce((s, d) => s + d.antes, 0)
  const totalDepois2026  = data2026.reduce((s, d) => s + d.depois, 0)
  const totalEcon2026    = totalAntes2026 - totalDepois2026
  const redPct2026       = totalAntes2026 > 0 ? ((totalEcon2026 / totalAntes2026) * 100).toFixed(1) : '0.0'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }} onClick={onClose}>
      <div className="w-full rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        style={{ background: '#0d0d0d', maxWidth: '92vw', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-start justify-between px-8 py-6 border-b border-white/5 shrink-0">
          <div>
            <h2 className="text-white text-xl font-bold">Total de Débitos — Histórico</h2>
            <p className="text-[#555] text-xs mt-1">Abr/2025 → Abr/2026 · Antes vs Depois BuyHelp</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#666] hover:text-white transition-colors shrink-0 ml-4">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 px-8 py-5 border-b border-white/5 shrink-0">
          <div className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[#555] text-[9px] font-bold tracking-widest uppercase mb-2">Total Antes</p>
            <p className="text-red-400 text-2xl font-bold">{fmtM(totalAntes2026)}</p>
            <p className="text-[#444] text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[#555] text-[9px] font-bold tracking-widest uppercase mb-2">Total Depois</p>
            <p className="text-emerald-400 text-2xl font-bold">{fmtM(totalDepois2026)}</p>
            <p className="text-[#444] text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[#555] text-[9px] font-bold tracking-widest uppercase mb-2">Economia Total</p>
            <p className="text-white text-2xl font-bold">{fmtM(totalEcon2026)}</p>
            <p className="text-[#444] text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[#555] text-[9px] font-bold tracking-widest uppercase mb-2">Redução Média</p>
            <p className="text-orange-400 text-2xl font-bold">{redPct2026}%</p>
            <p className="text-[#444] text-[10px] mt-1">Sobre total antes</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-8 py-6">
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: 0 }} barCategoryGap="25%">
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} width={48}
                tickFormatter={v => `${(v / 1_000_000).toFixed(1)}M`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend content={<CustomLegend />} verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 12 }} />
              <Bar dataKey="antes"   name="Antes"   fill="#ef4444" radius={[3,3,0,0]} maxBarSize={28} />
              <Bar dataKey="depois"  name="Depois"  fill="#22c55e" radius={[3,3,0,0]} maxBarSize={28} />
              <Bar dataKey="economia" name="Economia" fill="#f97316" radius={[3,3,0,0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
