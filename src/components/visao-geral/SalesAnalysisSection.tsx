import { useState, useRef, useEffect } from 'react'
import { TrendingUp, ChevronDown, FileText, TrendingDown } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Cell, Tooltip
} from 'recharts'
import { AvaliacaoResultadosInline } from './AvaliacaoResultadosInline'
import { useDashboardFilter } from '../../contexts/DashboardFilterContext'

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

type MetricKey = 'Total de Vendas' | 'Pedidos' | 'Intermediações' | 'Total de Intermediações' | 'Cadastro' | 'Ativações' | 'Taxa' | 'Total de Desconto'

const METRICS: MetricKey[] = [
  'Pedidos', 'Total de Vendas', 'Intermediações', 'Total de Intermediações',
  'Cadastro', 'Ativações', 'Taxa', 'Total de Desconto',
]

const DATA: Record<MetricKey, number[]> = {
  'Total de Vendas':          [312400, 289600, 354800, 321000, 398200, 276500, 415300, 362700, 298100, 441600, 387900, 378662],
  'Pedidos':                  [218,    231,    205,    244,    198,    227,    251,    239,    263,    221,    235,    262],
  'Intermediações':           [3,      4,      3,      5,      2,      4,      6,      4,      3,      5,      4,      4],
  'Total de Intermediações':  [5800,   6200,   5400,   6900,   4800,   6100,   7400,   6500,   5200,   7100,   6400,   6900],
  'Cadastro':                 [142,    158,    135,    171,    128,    149,    178,    162,    144,    183,    165,    172],
  'Ativações':                [89,     97,     82,     108,    76,     93,     114,    101,    86,     119,    104,    110],
  'Taxa':                     [1240,   1380,   1190,   1520,   1080,   1340,   1680,   1450,   1210,   1740,   1560,   1620],
  'Total de Desconto':        [18400,  16900,  20200,  17800,  22600,  15400,  24100,  21000,  17200,  25800,  22400,  21900],
}

// Mês anterior simulado = Março 2026 (penúltimo mês, índice 10)
const PREV_DATA: Record<MetricKey, number> = {
  'Total de Vendas':         424360,
  'Pedidos':                 244,
  'Intermediações':          5,
  'Total de Intermediações': 7100,
  'Cadastro':                165,
  'Ativações':               104,
  'Taxa':                    1560,
  'Total de Desconto':       22400,
}

function isCurrency(m: MetricKey) {
  return ['Total de Vendas', 'Total de Intermediações', 'Taxa', 'Total de Desconto'].includes(m)
}

function formatY(metric: MetricKey, v: number) {
  if (isCurrency(metric)) return `R$${Math.round(v / 1000)}k`
  return String(v)
}

function formatFull(metric: MetricKey, v: number) {
  if (isCurrency(metric)) return `R$ ${v.toLocaleString('pt-BR')}`
  return v.toLocaleString('pt-BR')
}

export function SalesAnalysisSection() {
  const { compareLabel } = useDashboardFilter()
  const [showAvaliacao, setShowAvaliacao] = useState(false)
  const [metric, setMetric] = useState<MetricKey>('Total de Vendas')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const raw = DATA[metric]
  const chartData = MONTHS.map((month, i) => ({ month, value: raw[i] }))
  const avg = Math.round(raw.reduce((s, v) => s + v, 0) / raw.length)
  const peak = Math.max(...raw)
  const minVal = Math.min(...raw)

  // Valor atual = último mês (Dez/Abr)
  const current = raw[raw.length - 1]
  const prevVal = PREV_DATA[metric]
  const diff = current - prevVal
  const diffPct = ((diff / prevVal) * 100).toFixed(1)
  const diffPositive = diff >= 0

  const avgFormatted = formatFull(metric, avg)
  const currentLabel = formatFull(metric, current)
  const prevLabel = formatFull(metric, prevVal)
  const diffLabel = (diff >= 0 ? '+' : '') + formatFull(metric, diff)

  return (
    <div className="rounded-lg border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 p-6 mb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.2) 0%, rgba(255,102,0,0.1) 100%)' }}>
            <TrendingUp size={20} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">Análise - Últimos 12 Meses</h2>
            <p className="text-[#999] text-sm mt-0.5">Período de Acompanhamento: Visualização mensal</p>
          </div>
        </div>

        {/* Metric dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(v => !v)}
            className="flex items-center gap-2 border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/50 text-white px-4 py-2 rounded-lg text-sm hover:border-orange-500/40 transition-colors"
          >
            {metric}
            <ChevronDown size={14} className={`text-[#999] transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showDropdown && (
            <div className="absolute z-20 right-0 top-full mt-1 w-52 rounded-xl border border-[rgba(41,41,41,0.8)] overflow-hidden shadow-xl"
              style={{ background: '#141414' }}>
              {METRICS.map(m => (
                <button
                  key={m}
                  onClick={() => { setMetric(m); setShowDropdown(false) }}
                  className={`w-full text-left px-4 py-3 text-sm border-b border-white/[0.04] last:border-0 transition-colors ${
                    m === metric
                      ? 'text-orange-500 bg-orange-500/10 font-semibold'
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Left card */}
        <div className="w-64 shrink-0 border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/50 rounded-lg p-5">
          {/* Title */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.25) 0%, rgba(255,102,0,0.1) 100%)' }}>
              <TrendingUp size={20} className="text-orange-500" />
            </div>
            <span className="text-[#999] text-sm font-semibold leading-tight">Valor Acumulado</span>
          </div>

          {/* Current value */}
          <p className="text-white text-3xl font-bold mb-4 leading-tight">{currentLabel}</p>

          {/* Diff row */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`flex items-center gap-1.5 rounded px-2 py-1 shrink-0 ${diffPositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {diffPositive
                ? <TrendingUp size={13} className="text-green-400" />
                : <TrendingDown size={13} className="text-red-400" />}
              <span className={`text-sm font-semibold ${diffPositive ? 'text-green-400' : 'text-red-400'}`}>
                {diffPositive ? '+' : ''}{diffPct}%
              </span>
            </div>
            <div>
              <p className="text-[#666] text-xs">Diferença</p>
              <p className={`text-base font-semibold ${diffPositive ? 'text-green-400' : 'text-red-400'}`}>
                {diffLabel}
              </p>
            </div>
          </div>

          {/* Previous month */}
          <div className="pt-3 border-t border-white/5">
            <p className="text-[#666] text-xs mb-1">Período anterior <span className="text-[#555]">({compareLabel})</span></p>
            <p className="text-white text-base font-semibold">{prevLabel}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: '#999', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => formatY(metric, v)}
                tick={{ fill: '#999', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip
                formatter={v => [formatFull(metric, Number(v)), metric]}
                contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#fff' }}
                labelStyle={{ color: '#999' }}
              />
              <ReferenceLine
                y={avg}
                stroke="#ff6600"
                strokeDasharray="4 4"
                label={{ value: `Média 12 Meses: ${avgFormatted}`, fill: '#ff6600', fontSize: 11, position: 'insideTopLeft' }}
              />
              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                {chartData.map(entry => (
                  <Cell
                    key={entry.month}
                    fill={entry.value >= avg ? '#ff6600' : 'rgba(255,102,0,0.3)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <button
          onClick={() => setShowAvaliacao(v => !v)}
          className="flex items-center gap-2 border border-orange-500/40 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-lg text-sm hover:bg-orange-500/20 transition-colors"
        >
          <FileText size={14} />
          {showAvaliacao ? 'Ocultar Avaliação de Resultado' : 'Avaliação de Resultado'}
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-orange-500" />
            <span className="text-[#999] text-xs">Acima da Média</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-orange-500/30" />
            <span className="text-[#999] text-xs">Abaixo da Média</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 border-t-2 border-dashed border-orange-500/50" />
            <span className="text-orange-500 text-xs font-medium">Média ({avgFormatted})</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[#666] text-xs">
            Pico: {formatFull(metric, peak)} | Mínimo: {formatFull(metric, minVal)}
          </span>
        </div>
      </div>
      {showAvaliacao && <AvaliacaoResultadosInline />}
    </div>
  )
}
