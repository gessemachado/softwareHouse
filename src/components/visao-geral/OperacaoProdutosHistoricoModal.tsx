import { X } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { OPERACAO_PRODUTOS } from '../../mocks/dashboardData'

const data     = OPERACAO_PRODUTOS
const data2026 = data.filter(d => d.mes.includes('/26'))

// aproveitado = barra independente (laranja)
// 4 sub-categorias empilhadas (stackId="nao") = naoAtuou total
const SUB_SERIES = [
  { key: 'mNegativa',    name: 'M. Negativa',   color: '#ef4444' },
  { key: 'custoZero',    name: 'Custo Zero',     color: '#f59e0b' },
  { key: 'exclusaoLoja', name: 'Exclusão Loja',  color: '#8b5cf6' },
  { key: 'blacklist',    name: 'Blacklist',       color: '#374151' },
]

function fmtK(v: number) { return `R$ ${Math.round(v / 1000)}k` }

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  const aprov = payload.find((p: any) => p.dataKey === 'aproveitado')?.value ?? 0
  const subs  = payload.filter((p: any) => p.dataKey !== 'aproveitado')
  const totalNao = subs.reduce((s: number, p: any) => s + (p.value ?? 0), 0)
  const total    = aprov + totalNao
  const pct      = total > 0 ? ((aprov / total) * 100).toFixed(1) : '0'

  return (
    <div className="rounded-xl border border-white/10 px-4 py-3 shadow-2xl text-xs min-w-[220px]"
      style={{ background: '#161616' }}>
      <p className="text-[#888] font-mono font-bold tracking-widest uppercase mb-2">{label}</p>

      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-sm shrink-0 bg-[#ff6600]" />
        <span className="text-[#aaa]">Aproveitado</span>
        <span className="font-bold ml-auto pl-4 text-orange-400">{fmtK(aprov)}</span>
        <span className="text-[#555] text-[10px]">{pct}%</span>
      </div>

      <div className="border-t border-white/10 pt-2 mb-1 flex items-center justify-between">
        <span className="text-[#555] text-[9px] font-bold tracking-widest uppercase">Não Atuou</span>
        <span className="text-red-400 font-bold">{fmtK(totalNao)}</span>
      </div>
      {subs.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1 pl-1">
          <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: p.fill }} />
          <span className="text-[#777]">{p.name}</span>
          <span className="font-bold ml-auto pl-4 text-white">{fmtK(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

function CustomLegend({ payload }: any) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-2">
      {payload?.map((p: any) => (
        <span key={p.value} className="flex items-center gap-1.5 text-[10px] font-semibold text-[#888]">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.color }} />
          {p.value}
        </span>
      ))}
    </div>
  )
}

interface Props { onClose: () => void }

export function OperacaoProdutosHistoricoModal({ onClose }: Props) {
  const totalAprov2026   = data2026.reduce((s, d) => s + d.aproveitado, 0)
  const totalNaoAtuado2026 = data2026.reduce((s, d) => s + d.naoAtuou, 0)
  const totalGeral2026   = totalAprov2026 + totalNaoAtuado2026
  const aprovPct2026     = totalGeral2026 > 0 ? ((totalAprov2026 / totalGeral2026) * 100).toFixed(1) : '0'

  const subTotals = SUB_SERIES.reduce((acc, s) => {
    acc[s.key] = data2026.reduce((sum, d) => sum + (d as any)[s.key], 0)
    return acc
  }, {} as Record<string, number>)

  const topSub = SUB_SERIES.reduce((a, b) => subTotals[a.key] >= subTotals[b.key] ? a : b)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        style={{ background: '#0d0d0d', maxWidth: '92vw', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-white/5 shrink-0">
          <div>
            <h2 className="text-white text-xl font-bold">Operação | Produtos — Evolução 13 Meses</h2>
            <p className="text-[#555] text-xs mt-1">
              Abr/2025 → Abr/2026 · Aproveitado vs composição do Não Atuado
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#666] hover:text-white transition-colors shrink-0 ml-4">
            <X size={18} />
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4 px-8 py-5 border-b border-white/5 shrink-0">
          <div className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[#555] text-[9px] font-bold tracking-widest uppercase mb-2">Aproveitado</p>
            <p className="text-orange-400 text-2xl font-bold">{aprovPct2026}%</p>
            <p className="text-orange-500/60 text-xs mt-1">{fmtK(totalAprov2026)} · Acumulado 2026</p>
          </div>

          <div className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[#555] text-[9px] font-bold tracking-widest uppercase mb-2">
              Não Atuou <span className="text-red-400 ml-1">{fmtK(totalNaoAtuado2026)}</span>
            </p>
            <div className="space-y-1.5 mt-1">
              {SUB_SERIES.map(s => (
                <div key={s.key} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] text-[#888]">
                    <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color }} />
                    {s.name}
                  </span>
                  <span className="text-white text-xs font-bold">{fmtK(subTotals[s.key])}</span>
                </div>
              ))}
            </div>
            <p className="text-[#444] text-[10px] mt-2">Acumulado 2026</p>
          </div>

          <div className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[#555] text-[9px] font-bold tracking-widest uppercase mb-2">Maior Sub-Categoria</p>
            <p className="text-white text-2xl font-bold">{topSub.name}</p>
            <p className="text-[#444] text-xs mt-1">
              {fmtK(subTotals[topSub.key])} ·{' '}
              {totalNaoAtuado2026 > 0
                ? ((subTotals[topSub.key] / totalNaoAtuado2026) * 100).toFixed(1)
                : '0'}% do não atuado
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: 0 }} barCategoryGap="25%" barGap={4}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="mes"
                tick={{ fill: '#666', fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#555', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={36}
                tickFormatter={v => `${Math.round(v / 1000)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend content={<CustomLegend />} verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 12 }} />

              {/* Barra independente: aproveitado */}
              <Bar dataKey="aproveitado" name="Aproveitado" fill="#ff6600" radius={[3, 3, 0, 0]} maxBarSize={22} />

              {/* Barras empilhadas: composição do naoAtuou */}
              {SUB_SERIES.map((s, idx) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.name}
                  fill={s.color}
                  stackId="nao"
                  radius={idx === SUB_SERIES.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                  maxBarSize={22}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
