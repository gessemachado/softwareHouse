import { useState, useRef, useEffect } from 'react'
import { TrendingUp, ChevronDown, FileText, TrendingDown } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Cell, Tooltip
} from 'recharts'
import { AvaliacaoResultadosInline } from './AvaliacaoResultadosInline'
import { useDashboardFilter, MONTHS_SHORT } from '../../contexts/DashboardFilterContext'
import { MESES, METRICAS, TAXA_PARTS, mesIdx } from '../../mocks/dashboardData'

type MetricKey = keyof typeof METRICAS

const METRICS: MetricKey[] = [
  'Total de Vendas',
  'Qtd de Pedidos',
  'Qtd de Intermediações',
  'Total de Intermediações',
  'Ticket Médio',
  'Desconto Usado',
  'Taxa',
]

const METRIC_LABELS: Record<MetricKey, string> = {
  'Total de Vendas':          'Total de Vendas',
  'Qtd de Pedidos':           'Qtd Pedidos',
  'Clientes que Compraram':   'Clientes',
  'Ticket Médio':             'Ticket Médio',
  'Qtd de Intermediações':    'Qtd Intermediações',
  'Total de Intermediações':  'Total de Intermediações',
  'Desconto Usado':           'Desconto Usado',
  'Taxa':                     'Taxa',
}

function isCurrency(m: MetricKey) {
  return ['Total de Vendas', 'Total de Intermediações', 'Desconto Usado', 'Taxa'].includes(m)
}
function isTicket(m: MetricKey) { return m === 'Ticket Médio' }

function formatY(metric: MetricKey, v: number) {
  if (isCurrency(metric)) return `R$${Math.round(v / 1000)}k`
  if (isTicket(metric))   return `R$${Math.round(v)}`
  return String(v)
}

function formatFull(metric: MetricKey, v: number) {
  if (isCurrency(metric)) return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  if (isTicket(metric))   return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  return v.toLocaleString('pt-BR')
}

export function SalesAnalysisSection() {
  const {
    selectedMonth, selectedYear,
    compareMonth, compareYear, compareLabel,
  } = useDashboardFilter()

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

  const curIdx  = mesIdx(selectedMonth, selectedYear)
  const prevIdx = mesIdx(compareMonth, compareYear)

  const raw      = METRICAS[metric]
  const isTaxa   = metric === 'Taxa'
  const chartData = MESES.map((month, i) => ({
    month,
    value: raw[i],
    taxa1: TAXA_PARTS[i].taxa1,
    taxa2: TAXA_PARTS[i].taxa2,
    isCur: i === curIdx,
    isPrev: i === prevIdx,
  }))
  const avg      = Math.round(raw.reduce((s, v) => s + v, 0) / raw.length)
  const peak     = Math.max(...raw)
  const minVal   = Math.min(...raw)

  const current  = raw[curIdx]
  const prevVal  = raw[prevIdx]
  const diff     = current - prevVal
  const diffPct  = prevVal !== 0 ? ((diff / prevVal) * 100).toFixed(1) : '0'
  const diffPositive = diff >= 0

  const selLabel  = `${MONTHS_SHORT[selectedMonth]}/${selectedYear}`
  const avgFormatted   = formatFull(metric, avg)
  const currentLabel   = formatFull(metric, current)
  const prevLabel      = formatFull(metric, prevVal)
  const diffLabel      = formatFull(metric, Math.abs(diff))

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
            <h2 className="text-white text-xl font-bold">Análise — Últimos 13 Meses</h2>
            <p className="text-[#999] text-sm mt-0.5">Abr/2025 → Abr/2026 · Visualização mensal</p>
          </div>
        </div>

        {/* Metric dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(v => !v)}
            className="flex items-center gap-2 border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/50 text-white px-4 py-2 rounded-lg text-sm hover:border-orange-500/40 transition-colors"
          >
            {METRIC_LABELS[metric]}
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
                  {METRIC_LABELS[m]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Left card */}
        <div className="w-full sm:w-64 sm:shrink-0 border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/50 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.25) 0%, rgba(255,102,0,0.1) 100%)' }}>
              <TrendingUp size={20} className="text-orange-500" />
            </div>
            <div>
              <span className="text-[#999] text-sm font-semibold leading-tight">{METRIC_LABELS[metric]}</span>
              <p className="text-orange-400 text-[10px] font-mono mt-0.5">{selLabel}</p>
            </div>
          </div>

          <p className="text-white text-3xl font-bold mb-4 leading-tight">{currentLabel}</p>

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
                {diffPositive ? '+' : '-'}{diffLabel}
              </p>
            </div>
          </div>

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
                tick={{ fill: '#999', fontSize: 10 }}
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
                formatter={(v, name) => [formatFull(metric, Number(v)), isTaxa ? String(name) : METRIC_LABELS[metric]]}
                contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#fff' }}
                labelStyle={{ color: '#999' }}
              />
              <ReferenceLine
                y={avg}
                stroke="#ff6600"
                strokeDasharray="4 4"
                label={{ value: `Média: ${avgFormatted}`, fill: '#ff6600', fontSize: 10, position: 'insideTopLeft' }}
              />
              {isTaxa ? (
                <>
                  <Bar dataKey="taxa1" name="Taxa 1" stackId="taxa" fill="#ff6600" radius={[0,0,0,0]} maxBarSize={32} />
                  <Bar dataKey="taxa2" name="Taxa 2" stackId="taxa" fill="#2a2a2a" radius={[2,2,0,0]} maxBarSize={32} />
                </>
              ) : (
                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                  {chartData.map(entry => {
                    let fill = entry.value >= avg ? '#ff6600' : 'rgba(255,102,0,0.3)'
                    if (entry.isCur)  fill = '#ff6600'
                    if (entry.isPrev) fill = 'rgba(255,255,255,0.25)'
                    return <Cell key={entry.month} fill={fill} />
                  })}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-white/5">
        <button
          onClick={() => setShowAvaliacao(v => !v)}
          className="flex items-center gap-2 border border-orange-500/40 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-lg text-sm hover:bg-orange-500/20 transition-colors w-fit"
        >
          <FileText size={14} />
          {showAvaliacao ? 'Ocultar Avaliação de Resultado' : 'Avaliação de Resultado'}
        </button>
        {isTaxa ? (
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-[#ff6600]" />
              <span className="text-[#999] text-xs">Taxa 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-[#2a2a2a]" />
              <span className="text-[#999] text-xs">Taxa 2</span>
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
        ) : (
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-orange-500" />
              <span className="text-[#999] text-xs">Acima da Média / Selecionado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded" style={{ background: 'rgba(255,255,255,0.25)' }} />
              <span className="text-[#999] text-xs">Comparação</span>
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
        )}
      </div>
      {showAvaliacao && <AvaliacaoResultadosInline />}
    </div>
  )
}
