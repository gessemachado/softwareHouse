import { X } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

import { CADASTROS } from '../../mocks/dashboardData'
const data = CADASTROS

interface Props { onClose: () => void }

// Tooltip customizado no estilo dark do app
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
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
    </div>
  )
}

// Legenda customizada
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

const data2026 = data.filter(d => d.mes.includes('/26'))

export function CadastrosHistoricoModal({ onClose }: Props) {
  const totalNovos2026       = data2026.reduce((s, d) => s + d.novos, 0)
  const totalPerdidos2026    = data2026.reduce((s, d) => s + d.perdidos, 0)
  const totalRecuperados2026 = data2026.reduce((s, d) => s + d.recuperados, 0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl border border-bh-border/40 shadow-2xl flex flex-col"
        style={{ background: 'rgb(var(--bh-surface))', maxWidth: '95vw', maxHeight: '95vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-bh-border/30 shrink-0">
          <div>
            <h2 className="text-bh-text text-xl font-bold">Histórico de Cadastros (13 Meses)</h2>
            <p className="text-bh-subtle text-xs mt-1">
              Abr/2025 → Abr/2026 · Movimentação de base de clientes
            </p>
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
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Novos Cadastros</p>
            <p className="text-bh-text text-2xl font-bold">{totalNovos2026}</p>
            <p className="text-bh-subtle text-[10px] mt-0.5">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Clientes Perdidos</p>
            <p className="text-red-400 text-2xl font-bold">{totalPerdidos2026}</p>
            <p className="text-bh-subtle text-[10px] mt-0.5">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Clientes Recuperados</p>
            <p className="text-emerald-400 text-2xl font-bold">{totalRecuperados2026}</p>
            <p className="text-bh-subtle text-[10px] mt-0.5">Acumulado 2026</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: 0 }} barCategoryGap="25%">
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="mes"
                tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend content={<CustomLegend />} verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 12 }} />
              <Bar dataKey="novos"       name="Novos Cadastros"      fill="#a0a0c0" radius={[3,3,0,0]} maxBarSize={28} />
              <Bar dataKey="perdidos"    name="Clientes Perdidos"    fill="#e05252" radius={[3,3,0,0]} maxBarSize={28} />
              <Bar dataKey="recuperados" name="Clientes Recuperados" fill="#22c55e" radius={[3,3,0,0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}
