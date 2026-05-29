import { X } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line,
} from 'recharts'
import { METRICAS, OPERACAO, MESES } from '../../mocks/dashboardData'

const data = MESES.map((mes, i) => {
  const pedidosVal  = METRICAS['Total de Vendas'][i]
  const intermedVal = METRICAS['Total de Intermediações'][i]
  const convPct     = pedidosVal > 0 ? +((intermedVal / pedidosVal) * 100).toFixed(2) : 0
  return {
    mes,
    pedidos:        METRICAS['Total de Vendas'][i],
    intermediacoes: METRICAS['Total de Intermediações'][i],
    pedidosQty:     OPERACAO[i].pedido,
    intermedQty:    OPERACAO[i].intermediacao,
    conversao:      convPct,
  }
})

const data2026 = data.filter(d => d.mes.includes('/26'))

function fmtK(v: number) { return `R$ ${Math.round(v / 1000)}k` }

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const conv = payload.find((p: any) => p.dataKey === 'conversao')
  const ped  = payload.find((p: any) => p.dataKey === 'pedidos')
  const int  = payload.find((p: any) => p.dataKey === 'intermediacoes')
  return (
    <div className="rounded-xl border border-gray-200 px-4 py-3 shadow-2xl text-xs min-w-[200px]"
      style={{ background: '#ffffff' }}>
      <p className="text-gray-500 font-mono font-bold tracking-widest uppercase mb-2">{label}</p>
      {ped  && <div className="flex justify-between gap-4 mb-1"><span className="text-gray-500">Pedidos</span><span className="font-bold text-gray-900">{fmtK(ped.value)}</span></div>}
      {int  && <div className="flex justify-between gap-4 mb-1"><span className="text-gray-500">Intermediações</span><span className="font-bold text-green-600">{fmtK(int.value)}</span></div>}
      {conv && <div className="flex justify-between gap-4 border-t border-gray-100 mt-2 pt-2"><span className="text-gray-500">Conversão</span><span className="font-bold text-orange-500">{conv.value.toFixed(2)}%</span></div>}
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

export function OperacaoGaugeHistoricoModal({ onClose }: Props) {
  const totalPedidos2026  = data2026.reduce((s, d) => s + d.pedidos, 0)
  const totalInterm2026   = data2026.reduce((s, d) => s + d.intermediacoes, 0)
  const avgConv2026       = data2026.length > 0
    ? (data2026.reduce((s, d) => s + d.conversao, 0) / data2026.length).toFixed(2)
    : '0.00'
  const maxConv           = Math.max(...data.map(d => d.conversao))
  const maxConvMes        = data.find(d => d.conversao === maxConv)?.mes ?? '�"'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }} onClick={onClose}>
      <div className="w-full rounded-2xl border border-bh-border/40 shadow-2xl flex flex-col"
        style={{ background: 'rgb(var(--bh-surface))', maxWidth: '92vw', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-bh-border/30 shrink-0">
          <div>
            <h2 className="text-bh-text text-xl font-bold">Taxa de Conversão �" Histórico</h2>
            <p className="text-bh-subtle text-xs mt-1">Abr/2025 → Abr/2026 · Pedidos vs Intermediações</p>
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
            <p className="text-bh-text text-2xl font-bold">{fmtK(totalPedidos2026)}</p>
            <p className="text-bh-subtle text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Intermediações</p>
            <p className="text-emerald-400 text-2xl font-bold">{fmtK(totalInterm2026)}</p>
            <p className="text-bh-subtle text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Conversão Média</p>
            <p className="text-orange-400 text-2xl font-bold">{avgConv2026}%</p>
            <p className="text-bh-subtle text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Melhor Mês</p>
            <p className="text-bh-text text-2xl font-bold">{maxConv.toFixed(2)}%</p>
            <p className="text-bh-subtle text-[10px] mt-1">{maxConvMes}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="flex-1 overflow-auto px-8 py-6 flex flex-col gap-6">
          <div>
            <p className="text-bh-subtle text-[10px] font-bold tracking-widest uppercase mb-3">Volume de Pedidos vs Intermediações</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} barCategoryGap="25%">
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }} axisLine={false} tickLine={false} width={40}
                  tickFormatter={v => `${Math.round(v / 1000)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend content={<CustomLegend />} verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 8 }} />
                <Bar dataKey="pedidos"        name="Pedidos"        fill="#6b7280" radius={[3,3,0,0]} maxBarSize={28} />
                <Bar dataKey="intermediacoes" name="Intermediações" fill="#22c55e" radius={[3,3,0,0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <p className="text-bh-subtle text-[10px] font-bold tracking-widest uppercase mb-3">Taxa de Conversão (%)</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }} axisLine={false} tickLine={false} width={36}
                  tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: '#374151', fontWeight: 600 }}
                  formatter={(v) => [`${Number(v).toFixed(2)}%`, 'Conversão']}
                />
                <Line dataKey="conversao" name="Conversão" stroke="#f97316" strokeWidth={2}
                  dot={{ fill: '#f97316', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
