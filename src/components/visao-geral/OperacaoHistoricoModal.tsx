import { X } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

import { OPERACAO } from '../../mocks/dashboardData'
const data = OPERACAO

const data2026 = data.filter(d => d.mes.includes('/26'))

const SERIES = [
  { key: 'pedido',        name: 'Pedido',             color: '#6b7280' },
  { key: 'intermediacao', name: 'Intermediação',       color: '#16a34a' },
  { key: 'mesmaTrib',     name: 'Mesma Tributação',    color: '#fca5a5' },
  { key: 'somenteItem',   name: 'Somente um Item',     color: '#b45309' },
  { key: 'naoAceitou',    name: 'Cliente não aceitou', color: '#7f1d1d' },
]

const NAO_APROV_KEYS = new Set(['mesmaTrib', 'somenteItem', 'naoAceitou'])

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  const pedido        = payload.find((p: any) => p.dataKey === 'pedido')?.value ?? 0
  const intermediacao = payload.find((p: any) => p.dataKey === 'intermediacao')?.value ?? 0
  const naoAprovTotal = payload
    .filter((p: any) => NAO_APROV_KEYS.has(p.dataKey))
    .reduce((s: number, p: any) => s + (p.value ?? 0), 0)
  const absorcao = pedido > 0 ? ((intermediacao / pedido) * 100).toFixed(1) : '0'

  const principais  = payload.filter((p: any) => !NAO_APROV_KEYS.has(p.dataKey))
  const naoAprovItems = payload.filter((p: any) => NAO_APROV_KEYS.has(p.dataKey))

  return (
    <div className="rounded-xl border border-gray-200 px-4 py-3 shadow-2xl text-xs min-w-[210px]"
      style={{ background: '#ffffff' }}>
      <p className="text-gray-500 font-mono font-bold tracking-widest uppercase mb-2">{label}</p>

      {/* Pedido + Intermediação */}
      {principais.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: p.fill }} />
          <span className="text-gray-600">{p.name}</span>
          <span className="font-bold ml-auto pl-4 text-gray-900">{p.value}</span>
        </div>
      ))}

      {/* Não Aproveitados */}
      <div className="border-t border-gray-100 mt-2 pt-2 mb-1 flex items-center justify-between">
        <span className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">Não Aproveitados</span>
        <span className="text-red-500 font-bold">{naoAprovTotal}</span>
      </div>
      {naoAprovItems.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1 pl-1">
          <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: p.fill }} />
          <span className="text-gray-500">{p.name}</span>
          <span className="font-bold ml-auto pl-4 text-gray-900">{p.value}</span>
        </div>
      ))}

      {/* Conversão */}
      <div className="border-t border-gray-100 mt-2 pt-2 flex items-center justify-between">
        <span className="text-gray-400">Conversão</span>
        <span className="text-orange-500 font-bold font-mono">{absorcao}%</span>
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

export function OperacaoHistoricoModal({ onClose }: Props) {
  const totalPedidos2026   = data2026.reduce((s, d) => s + d.pedido, 0)
  const totalInter2026     = data2026.reduce((s, d) => s + d.intermediacao, 0)
  const totalMesmaTrib2026 = data2026.reduce((s, d) => s + d.mesmaTrib, 0)
  const totalSomItem2026   = data2026.reduce((s, d) => s + d.somenteItem, 0)
  const totalNaoAceit2026  = data2026.reduce((s, d) => s + d.naoAceitou, 0)
  const totalNaoAprov2026  = totalMesmaTrib2026 + totalSomItem2026 + totalNaoAceit2026
  const absorcao2026       = ((totalInter2026 / totalPedidos2026) * 100).toFixed(1)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl border border-bh-border/40 shadow-2xl flex flex-col"
        style={{ background: '#000000', maxWidth: '92vw', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-bh-border/30 shrink-0">
          <div>
            <h2 className="text-bh-text text-xl font-bold">Distribuição Mensal por Categoria</h2>
            <p className="text-bh-subtle text-xs mt-1">
              Abr/2025 → Abr/2026 · Pedido / Intermediação / Motivos de não aproveitamento
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bh-surface2 text-bh-subtle hover:text-bh-text transition-colors shrink-0 ml-4">
            <X size={18} />
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4 px-8 py-5 border-b border-bh-border/30 shrink-0">
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Total Pedidos</p>
            <p className="text-bh-text text-2xl font-bold">{totalPedidos2026}</p>
            <p className="text-bh-subtle text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Intermediações</p>
            <p className="text-emerald-400 text-2xl font-bold">{totalInter2026}</p>
            <p className="text-bh-subtle text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">
              Não Aproveitados <span className="text-red-400 ml-1">{totalNaoAprov2026}</span>
            </p>
            <div className="space-y-1.5 mt-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] text-bh-muted">
                  <span className="w-2 h-2 rounded-sm shrink-0 bg-[#fca5a5]" />
                  Mesma Tributação
                </span>
                <span className="text-bh-text text-xs font-bold">{totalMesmaTrib2026}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] text-bh-muted">
                  <span className="w-2 h-2 rounded-sm shrink-0 bg-[#b45309]" />
                  Somente um Item
                </span>
                <span className="text-bh-text text-xs font-bold">{totalSomItem2026}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] text-bh-muted">
                  <span className="w-2 h-2 rounded-sm shrink-0 bg-[#7f1d1d]" />
                  Cliente não aceitou
                </span>
                <span className="text-bh-text text-xs font-bold">{totalNaoAceit2026}</span>
              </div>
            </div>
            <p className="text-bh-subtle text-[10px] mt-2">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Conversão</p>
            <p className="text-orange-400 text-2xl font-bold">{absorcao2026}%</p>
            <p className="text-bh-subtle text-[10px] mt-1">Acumulado 2026</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <ResponsiveContainer width="100%" height={420}>
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
              {SERIES.map(s => (
                <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[3,3,0,0]} maxBarSize={28} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
