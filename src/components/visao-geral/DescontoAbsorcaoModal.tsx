import { X } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, ReferenceLine,
  XAxis, YAxis, CartesianGrid,
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
        <span key={p.value} className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-bh-muted">
          <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: p.color }} />
          {p.value === 'aproveitado' ? 'Valor Aproveitado' : 'Valor Disponível'}
        </span>
      ))}
    </div>
  )
}

interface Props { onClose: () => void }

const data2026 = data.filter(d => d.mes.includes('/26'))

const taxaData    = data.map(d => ({
  mes: d.mes,
  taxa: parseFloat(((d.aproveitado / (d.aproveitado + d.disponivel)) * 100).toFixed(1)),
}))
const mediaLoja    = parseFloat((taxaData.reduce((s, d) => s + d.taxa, 0) / taxaData.length).toFixed(1))
const mediaBuyHelp = 72.5  // média da rede BuyHelp (mock)

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
        className="w-full rounded-2xl border border-bh-border/40 shadow-2xl flex flex-col"
        style={{ background: 'rgb(var(--bh-surface))', maxWidth: '90vw', height: '92vh', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-bh-border/30 shrink-0">
          <div>
            <h2 className="text-bh-text text-xl font-bold">Performance de Absorção</h2>
            <p className="text-bh-subtle text-xs mt-1">
              Abr/2025 → Abr/2026 · Distribuição mensal de créditos vs. aproveitamento real
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
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Total Aproveitado</p>
            <p className="text-orange-400 text-2xl font-bold">{fmt(totalAproveitado)}</p>
            <p className="text-bh-subtle text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Total Disponível</p>
            <p className="text-bh-text text-2xl font-bold">{fmt(totalDisponivel)}</p>
            <p className="text-bh-subtle text-[10px] mt-1">Acumulado 2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Taxa de Absorção</p>
            <p className="text-orange-400 text-2xl font-bold">{absorcaoPct}%</p>
            <p className="text-bh-subtle text-[10px] mt-1">Acumulado 2026</p>
          </div>
        </div>

        {/* Charts */}
        <div className="flex-1 px-8 pb-8 flex flex-col gap-5" style={{ minHeight: 0 }}>

          {/* Bar chart — Volume */}
          <div className="flex flex-col" style={{ flex: 3, minHeight: 0 }}>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-2 pt-5" style={{ color: 'rgb(var(--bh-subtle))' }}>
              Volume Disponível vs Aproveitado
            </p>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 4, right: 10, bottom: 0, left: 10 }} barSize={36}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
                  <XAxis
                    dataKey="mes"
                    tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tickFormatter={v => `R$${Math.round(v / 1000)}k`}
                    tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }}
                    axisLine={false} tickLine={false} width={44}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Legend content={<CustomLegend />} verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 16 }} />
                  <Bar dataKey="aproveitado" stackId="a" fill="#ff6600" radius={[0,0,0,0]} />
                  <Bar dataKey="disponivel"  stackId="a" fill="rgba(255,255,255,0.10)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line chart — Taxa de Absorção */}
          <div className="flex flex-col" style={{ flex: 2, minHeight: 0 }}>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgb(var(--bh-subtle))' }}>
              Taxa de Absorção (%)
            </p>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taxaData} margin={{ top: 4, right: 130, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 10 }} axisLine={false} tickLine={false} width={36}
                    tickFormatter={v => `${v}%`}
                  />
                  <Tooltip
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                    contentStyle={{ background: 'rgb(var(--bh-surface))', border: '1px solid #222', borderRadius: 8, fontSize: 11 }}
                    formatter={(v) => [`${v}%`, 'Taxa de Absorção']}
                  />
                  <ReferenceLine
                    y={mediaLoja}
                    stroke="#ff6600"
                    strokeDasharray="5 3"
                    strokeWidth={1.5}
                    label={{ value: `Média loja ${mediaLoja}%`, position: 'right', fontSize: 10, fill: '#ff6600', fontWeight: 600 }}
                  />
                  <ReferenceLine
                    y={mediaBuyHelp}
                    stroke="#22c9a0"
                    strokeDasharray="5 3"
                    strokeWidth={1.5}
                    label={{ value: `Média BuyHelp ${mediaBuyHelp}%`, position: 'right', fontSize: 10, fill: '#22c9a0', fontWeight: 600 }}
                  />
                  <Line
                    type="monotone" dataKey="taxa" stroke="#EF9F27" strokeWidth={2.5}
                    dot={{ fill: '#EF9F27', stroke: 'rgb(var(--bh-surface))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#EF9F27', stroke: 'rgb(var(--bh-surface))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
