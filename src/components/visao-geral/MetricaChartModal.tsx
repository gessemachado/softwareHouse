import { X } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Cell, Tooltip
} from 'recharts'

import { MESES, METRICAS } from '../../mocks/dashboardData'

const MONTHS_LABELS = MESES
const IDX_2026_START = 9  // Jan/26
const MOCK_DATA = METRICAS

const CURRENCY_LABELS = new Set(['Total de Vendas', 'Ticket Médio', 'Total de Intermediações', 'Desconto Usado', 'Taxa'])

function formatY(label: string, v: number) {
  if (CURRENCY_LABELS.has(label)) return `R$${Math.round(v / 1000)}k`
  return String(v)
}

function formatTooltip(label: string, v: number) {
  if (CURRENCY_LABELS.has(label)) return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  return String(v)
}

interface Props {
  metricLabel: string
  onClose: () => void
}

// Ticket Médio usa média, demais usam soma
const AVG_METRICS = new Set(['Ticket Médio'])

export function MetricaChartModal({ metricLabel, onClose }: Props) {
  const raw = (MOCK_DATA as Record<string, number[]>)[metricLabel] ?? []
  const data = MONTHS_LABELS.map((month, i) => ({ month, value: raw[i] ?? 0 }))
  const avg = Math.round(raw.reduce((s: number, v: number) => s + v, 0) / raw.length)
  const peak = Math.max(...raw)
  const minVal = Math.min(...raw)

  const avgLabel = metricLabel === 'Total de Vendas'
    ? `R$${Math.round(avg / 1000)}k`
    : metricLabel === 'Ticket Médio'
      ? `R$${avg.toLocaleString('pt-BR')}`
      : String(avg)

  // Acumulado 2026 (Jan/26 → Abr/26)
  const raw2026 = raw.slice(IDX_2026_START)
  const acum2026 = AVG_METRICS.has(metricLabel)
    ? raw2026.reduce((s: number, v: number) => s + v, 0) / raw2026.length
    : raw2026.reduce((s: number, v: number) => s + v, 0)

  const acum2026Label = CURRENCY_LABELS.has(metricLabel)
    ? `R$ ${acum2026.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : AVG_METRICS.has(metricLabel)
      ? `R$ ${acum2026.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : String(acum2026)

  const acum2026Sub = AVG_METRICS.has(metricLabel) ? 'Média 2026' : 'Acumulado 2026'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl border border-bh-border/40 overflow-hidden shadow-2xl"
        style={{ background: '#000000', maxWidth: '90vw' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bh-border/30">
          <h3 className="text-bh-text font-bold text-base">{metricLabel} " ltimos 13 Meses</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bh-surface2 text-bh-subtle hover:text-bh-text transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-bh-border/30">
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">{acum2026Sub}</p>
            <p className="text-orange-400 text-2xl font-bold">{acum2026Label}</p>
            <p className="text-bh-subtle text-[10px] mt-1">Jan → Abr/2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Média 13 Meses</p>
            <p className="text-bh-text text-2xl font-bold">{avgLabel}</p>
            <p className="text-bh-subtle text-[10px] mt-1">Abr/2025 → Abr/2026</p>
          </div>
          <div className="rounded-xl border border-bh-border/30 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-bh-subtle text-[9px] font-bold tracking-widest uppercase mb-2">Pico</p>
            <p className="text-bh-text text-2xl font-bold">{formatTooltip(metricLabel, peak)}</p>
            <p className="text-bh-subtle text-[10px] mt-1">Maior valor no período</p>
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 pt-4 pb-2">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={data} margin={{ top: 20, right: 10, bottom: 5, left: 10 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgb(var(--bh-muted))', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => formatY(metricLabel, v)}
                tick={{ fill: 'rgb(var(--bh-muted))', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip
                formatter={v => [formatTooltip(metricLabel, Number(v)), metricLabel]}
                contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 6, color: '#111827' }}
                labelStyle={{ color: '#6b7280' }}
              />
              <ReferenceLine
                y={avg}
                stroke="#ff6600"
                strokeDasharray="4 4"
                label={{ value: `Média: ${avgLabel}`, fill: '#ff6600', fontSize: 10, position: 'insideTopLeft' }}
              />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={entry.month}
                    fill={entry.value >= avg ? '#ff6600' : 'rgba(255,102,0,0.3)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer legend */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-bh-border/30">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#ff6600]" />
              <span className="text-bh-muted text-xs">Acima da Média</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[rgba(255,102,0,0.3)]" />
              <span className="text-bh-muted text-xs">Abaixo da Média</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 border-t-2 border-dashed border-orange-500/60" />
              <span className="text-orange-500 text-xs font-medium">Média ({avgLabel})</span>
            </div>
          </div>
          <span className="text-bh-subtle text-xs">
            Pico: {formatTooltip(metricLabel, peak)} | Mínimo: {formatTooltip(metricLabel, minVal)}
          </span>
        </div>
      </div>
    </div>
  )
}
