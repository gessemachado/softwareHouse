import { X } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Cell, Tooltip
} from 'recharts'

// Abr/2025 → Abr/2026 (13 meses)
const MONTHS_LABELS = [
  'Abr/25','Mai/25','Jun/25','Jul/25','Ago/25','Set/25',
  'Out/25','Nov/25','Dez/25','Jan/26','Fev/26','Mar/26','Abr/26'
]

const MOCK_DATA: Record<string, number[]> = {
  'Qtd de Pedidos':        [218, 231, 205, 244, 198, 227, 251, 239, 263, 221, 235, 244, 262],
  'Total de Vendas':       [148000, 156000, 139000, 163000, 134000, 151000, 171000, 162000, 178000, 149000, 158000, 163000, 172000],
  'Clientes que Compraram':[29, 31, 27, 33, 26, 30, 34, 32, 36, 29, 31, 33, 35],
  'Ticket Médio':          [130.50, 135.00, 128.00, 140.50, 126.00, 133.50, 142.00, 139.00, 148.50, 131.00, 136.50, 140.50, 148.50],
}

function formatY(label: string, v: number) {
  if (label === 'Total de Vendas') return `R$${Math.round(v / 1000)}k`
  if (label === 'Ticket Médio') return `R$${v.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`
  return String(v)
}

function formatTooltip(label: string, v: number) {
  if (label === 'Total de Vendas') return `R$ ${v.toLocaleString('pt-BR')}`
  if (label === 'Ticket Médio') return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  return String(v)
}

interface Props {
  metricLabel: string
  onClose: () => void
}

export function MetricaChartModal({ metricLabel, onClose }: Props) {
  const raw = MOCK_DATA[metricLabel] ?? []
  const data = MONTHS_LABELS.map((month, i) => ({ month, value: raw[i] ?? 0 }))
  const avg = Math.round(raw.reduce((s, v) => s + v, 0) / raw.length)
  const peak = Math.max(...raw)
  const minVal = Math.min(...raw)

  const avgLabel = metricLabel === 'Total de Vendas'
    ? `R$${Math.round(avg / 1000)}k`
    : metricLabel === 'Ticket Médio'
      ? `R$${avg.toLocaleString('pt-BR')}`
      : String(avg)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
        style={{ background: '#0d0d0d' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-white font-bold text-base">{metricLabel} — Últimos 13 Meses</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#666] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Chart */}
        <div className="px-4 pt-4 pb-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 20, right: 10, bottom: 5, left: 10 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: '#999', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => formatY(metricLabel, v)}
                tick={{ fill: '#999', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip
                formatter={v => [formatTooltip(metricLabel, Number(v)), metricLabel]}
                contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#fff' }}
                labelStyle={{ color: '#999' }}
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
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/5">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#ff6600]" />
              <span className="text-[#999] text-xs">Acima da Média</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[rgba(255,102,0,0.3)]" />
              <span className="text-[#999] text-xs">Abaixo da Média</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 border-t-2 border-dashed border-orange-500/60" />
              <span className="text-orange-500 text-xs font-medium">Média ({avgLabel})</span>
            </div>
          </div>
          <span className="text-[#555] text-xs">
            Pico: {formatTooltip(metricLabel, peak)} | Mínimo: {formatTooltip(metricLabel, minVal)}
          </span>
        </div>
      </div>
    </div>
  )
}
