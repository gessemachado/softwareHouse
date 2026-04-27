import { X } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

import { DESCONTO } from '../../mocks/dashboardData'
const data = DESCONTO

function fmt(v: number) {
  return `R$ ${v.toLocaleString('pt-BR')}`
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const aproveitado = payload.find((p: any) => p.dataKey === 'aproveitado')?.value ?? 0
  const disponivel  = payload.find((p: any) => p.dataKey === 'disponivel')?.value ?? 0
  const total = aproveitado + disponivel
  const pct = total > 0 ? ((aproveitado / total) * 100).toFixed(1) : '0'
  return (
    <div className="rounded-xl border border-gray-200 px-4 py-3 shadow-2xl text-xs"
      style={{ background: '#ffffff' }}>
      <p className="text-gray-500 font-mono font-bold tracking-widest uppercase mb-2">{label}</p>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-sm shrink-0 bg-orange-500" />
        <span className="text-gray-600">Valor Aproveitado</span>
        <span className="font-semibold ml-auto pl-4 text-orange-500">{fmt(aproveitado)}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-sm shrink-0 bg-gray-300" />
        <span className="text-gray-600">Valor Disponível</span>
        <span className="font-semibold ml-auto pl-4 text-gray-500">{fmt(disponivel)}</span>
      </div>
      <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
        <span className="text-gray-500">Absorção</span>
        <span className="text-orange-500 font-bold font-mono">{pct}%</span>
      </div>
    </div>
  )
}

function CustomLegend({ payload }: any) {
  return (
    <div className="flex items-center gap-6">
      {payload?.map((p: any) => (
        <span key={p.value} className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#888]">
          <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: p.color }} />
          {p.value === 'aproveitado' ? 'Valor Aproveitado' : 'Valor Disponível'}
        </span>
      ))}
    </div>
  )
}

interface Props { onClose: () => void }

const data2026 = data.filter(d => d.mes.includes('/26'))

export function DescontoAbsorcaoModal({ onClose }: Props) {
  const totalAproveitado = data2026.reduce((s, d) => s + d.aproveitado, 0)
  const totalDisponivel  = data2026.reduce((s, d) => s + d.disponivel, 0)
  const totalGeral       = totalAproveitado + totalDisponivel
  const absorcaoPct      = ((totalAproveitado / totalGeral) * 100).toFixed(1)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        style={{ background: '#0d0d0d', maxWidth: '90vw', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-white/5 shrink-0">
          <div>
            <h2 className="text-white text-xl font-bold">Performance de Absorção</h2>
            <p className="text-[#555] text-xs mt-1">
              Abr/2025 → Abr/2026 · Distribuição mensal de créditos vs. aproveitamento real
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#666] hover:text-white transition-colors shrink-0 ml-4"
          >
            <X size={18} />
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4 px-8 py-5 border-b border-white/5 shrink-0">
          <div className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[#555] text-[9px] font-bold tracking-widest uppercase mb-2">Total Aproveitado</p>
            <p className="text-orange-400 text-2xl font-bold">{fmt(totalAproveitado)}</p>
            <p className="text-[#444] text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[#555] text-[9px] font-bold tracking-widest uppercase mb-2">Total Disponível</p>
            <p className="text-white text-2xl font-bold">{fmt(totalDisponivel)}</p>
            <p className="text-[#444] text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[#555] text-[9px] font-bold tracking-widest uppercase mb-2">Taxa de Absorção</p>
            <p className="text-orange-400 text-2xl font-bold">{absorcaoPct}%</p>
            <p className="text-[#444] text-[10px] mt-1">Acumulado 2026</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: 10 }} barSize={36}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="mes"
                tick={{ fill: '#666', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => `R$${Math.round(v / 1000)}k`}
                tick={{ fill: '#555', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend content={<CustomLegend />} verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 16 }} />
              <Bar dataKey="aproveitado" stackId="a" fill="#ff6600" radius={[0,0,0,0]} />
              <Bar dataKey="disponivel"  stackId="a" fill="rgba(255,255,255,0.10)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
