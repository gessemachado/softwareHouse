import { X } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { MESES, METRICAS } from '../../mocks/dashboardData'

const PEDIDOS = METRICAS['Total de Vendas']
const INTER   = METRICAS['Total de Intermediações']

const chartData = MESES.map((mes, i) => ({
  mes,
  pedidos:       PEDIDOS[i],
  intermediacoes: INTER[i],
  taxa: parseFloat(((INTER[i] / PEDIDOS[i]) * 100).toFixed(2)),
}))

const data2026       = chartData.filter(d => d.mes.includes('/26'))
const totalPed2026   = data2026.reduce((s, d) => s + d.pedidos, 0)
const totalInt2026   = data2026.reduce((s, d) => s + d.intermediacoes, 0)
const taxaMedia2026  = (data2026.reduce((s, d) => s + d.taxa, 0) / data2026.length).toFixed(2)
const melhorMes      = [...chartData].sort((a, b) => b.taxa - a.taxa)[0]

function fmtK(v: number) {
  return `R$ ${(v / 1000).toFixed(0)}k`
}

function fmtKAxis(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
}

export function ConversaoHistoricoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        style={{ background: '#0d0d0d', maxWidth: '92vw', height: '88vh', maxHeight: '88vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-7 pb-5 shrink-0">
          <div>
            <h2 className="text-white text-2xl font-bold">Taxa de Conversão — Histórico</h2>
            <p className="text-xs mt-1" style={{ color: '#555' }}>
              Abr/2025 → Abr/2026 · Pedidos vs Intermediações
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-[#555] hover:text-white hover:border-white/20 transition-colors mt-1 shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4 px-8 pb-6 shrink-0">
          {[
            { label: 'Total Pedidos',   value: fmtK(totalPed2026),  color: '#fff',    sub: 'Acumulado 2026' },
            { label: 'Intermediações',  value: fmtK(totalInt2026),  color: '#4ade80', sub: 'Acumulado 2026' },
            { label: 'Conversão Média', value: `${taxaMedia2026}%`, color: '#ff6600', sub: 'Acumulado 2026' },
            { label: 'Melhor Mês',      value: `${melhorMes.taxa}%`,color: '#fff',    sub: melhorMes.mes },
          ].map(k => (
            <div key={k.label} className="rounded-xl border border-white/5 px-6 py-5"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: '#555' }}>{k.label}</p>
              <p className="text-3xl font-black leading-none mb-2" style={{ color: k.color }}>{k.value}</p>
              <p className="text-[10px]" style={{ color: '#555' }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="flex-1 px-8 pb-8 flex flex-col gap-5" style={{ minHeight: 0 }}>

          {/* Bar chart — Volume */}
          <div className="flex flex-col" style={{ flex: 3, minHeight: 0 }}>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#555' }}>
              Volume de Pedidos vs Intermediações
            </p>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }} barCategoryGap="25%">
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} width={38}
                    tickFormatter={fmtKAxis}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 8, fontSize: 11, color: '#ccc' }}
                    formatter={(v: number, name: string) => [`R$ ${(v / 1000).toFixed(1)}k`, name]}
                  />
                  <Legend
                    verticalAlign="top" align="left" wrapperStyle={{ paddingBottom: 8 }}
                    formatter={v => <span style={{ color: '#888', fontSize: 10 }}>{v}</span>}
                  />
                  <Bar dataKey="intermediacoes" name="Intermediações" fill="#4ade80" radius={[3,3,0,0]} maxBarSize={32} />
                  <Bar dataKey="pedidos" name="Pedidos" fill="#6b7280" radius={[3,3,0,0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line chart — Taxa */}
          <div className="flex flex-col" style={{ flex: 2, minHeight: 0 }}>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#555' }}>
              Taxa de Conversão (%)
            </p>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 8]} tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} width={36}
                    tickFormatter={v => `${v}%`}
                  />
                  <Tooltip
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                    contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 8, fontSize: 11, color: '#ccc' }}
                    formatter={(v: number) => [`${v}%`, 'Taxa de Conversão']}
                  />
                  <Line
                    type="monotone" dataKey="taxa" stroke="#ff6600" strokeWidth={2.5}
                    dot={{ fill: '#ff6600', stroke: '#000', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#ff6600', stroke: '#000', strokeWidth: 2 }}
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
