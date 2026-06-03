import { useState, useMemo } from 'react'
import {
  ArrowLeft, ChevronDown, ChevronUp,
  ShoppingCart, Tag, Users, Receipt,
  Plus, Trash2, RotateCcw, Save,
  AlertTriangle, CheckCircle2, TrendingDown,
  type LucideIcon,
} from 'lucide-react'
import type { PilarKey } from '../../types/buyhelp-index.types'
import { useDashboardConfig } from '../../contexts/DashboardConfigContext'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Banda {
  id: string
  label: string
  min: number
  max: number
  pts: number
}

interface PilarConfigState {
  key: PilarKey
  nome: string
  peso: number
  cor: string
  icone: string
  invertido: boolean  // true → menor = melhor; accumulate when valor <= max
  bandas: Banda[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  ShoppingCart, Tag, Users, Receipt,
}

const CLASSIFICACOES = [
  { label: 'Excelente', range: '80 – 100', cor: '#639922', bg: 'rgba(99,153,34,0.15)' },
  { label: 'Saudável',  range: '60 – 79',  cor: '#22c9a0', bg: 'rgba(34,201,160,0.15)' },
  { label: 'Atenção',   range: '40 – 59',  cor: '#EF9F27', bg: 'rgba(239,159,39,0.15)' },
  { label: 'Crítico',   range: '0 – 39',   cor: '#E24B4A', bg: 'rgba(226,75,74,0.15)'  },
]

const CLASS_COLORS: Record<string, string> = {
  excelente: '#639922', saudavel: '#22c9a0', atencao: '#EF9F27', critico: '#E24B4A',
}
const CLASS_LABELS: Record<string, string> = {
  excelente: 'Excelente', saudavel: 'Saudável', atencao: 'Atenção', critico: 'Crítico',
}

const DEFAULT_PILARES: PilarConfigState[] = [
  {
    key: 'conversao', nome: 'Conversão BuyHelp', peso: 30, cor: '#0F6E56', icone: 'ShoppingCart',
    invertido: false,
    bandas: [
      { id: 'conv-1', label: 'Base',  min: 5,  max: 19,  pts: 10 },
      { id: 'conv-2', label: 'Médio', min: 20, max: 39,  pts: 20 },
      { id: 'conv-3', label: 'Bom',   min: 40, max: 59,  pts: 30 },
      { id: 'conv-4', label: 'Ótimo', min: 60, max: 100, pts: 40 },
    ],
  },
  {
    key: 'desconto', nome: 'Conversão de Desconto', peso: 25, cor: '#EF9F27', icone: 'Tag',
    invertido: false,
    bandas: [
      { id: 'desc-1', label: 'Base',  min: 20, max: 39,  pts: 10 },
      { id: 'desc-2', label: 'Médio', min: 40, max: 59,  pts: 20 },
      { id: 'desc-3', label: 'Bom',   min: 60, max: 79,  pts: 30 },
      { id: 'desc-4', label: 'Ótimo', min: 80, max: 100, pts: 40 },
    ],
  },
  {
    key: 'recorrencia', nome: 'Recorrência de Clientes', peso: 30, cor: '#378ADD', icone: 'Users',
    invertido: false,
    bandas: [
      { id: 'rec-1', label: 'Base',  min: 15, max: 29,  pts: 10 },
      { id: 'rec-2', label: 'Médio', min: 30, max: 49,  pts: 20 },
      { id: 'rec-3', label: 'Bom',   min: 50, max: 69,  pts: 30 },
      { id: 'rec-4', label: 'Ótimo', min: 70, max: 100, pts: 40 },
    ],
  },
  {
    key: 'cmv', nome: 'CMV', peso: 15, cor: '#7F77DD', icone: 'Receipt',
    invertido: true,  // menor CMV = melhor; accumulate when valor <= max
    bandas: [
      { id: 'cmv-1', label: '< 70%',    min: 0,  max: 69,  pts: 40 },
      { id: 'cmv-2', label: '70 – 80%', min: 70, max: 80,  pts: 30 },
      { id: 'cmv-3', label: '81 – 90%', min: 81, max: 90,  pts: 20 },
      { id: 'cmv-4', label: '> 91%',    min: 91, max: 100, pts: 10 },
    ],
  },
]

// ─── Scoring helpers ──────────────────────────────────────────────────────────

function scoreForValue(pilar: PilarConfigState, valor: number): number {
  let score = 0
  if (pilar.invertido) {
    // Menor é melhor — sort by max DESC, accumulate when valor <= max
    const bandas = [...pilar.bandas].sort((a, b) => b.max - a.max)
    for (const b of bandas) if (valor <= b.max) score += b.pts
  } else {
    // Maior é melhor — sort by min ASC, accumulate when valor >= min
    const bandas = [...pilar.bandas].sort((a, b) => a.min - b.min)
    for (const b of bandas) if (valor >= b.min) score += b.pts
  }
  return Math.min(score, 100)
}

function calcIndex(pilares: PilarConfigState[], simulador: Record<string, number>): number {
  return pilares.reduce((acc, p) => {
    return acc + (scoreForValue(p, simulador[p.key] ?? 0) * p.peso / 100)
  }, 0)
}

function classifyIndex(score: number): string {
  if (score >= 80) return 'excelente'
  if (score >= 60) return 'saudavel'
  if (score >= 40) return 'atencao'
  return 'critico'
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ConfiguracaoIndexViewProps {
  onBack: () => void
}

export function ConfiguracaoIndexView({ onBack }: ConfiguracaoIndexViewProps) {
  const { setPilarPesos, pilarPesos } = useDashboardConfig()
  const [pilares, setPilares] = useState<PilarConfigState[]>(() =>
    DEFAULT_PILARES.map(p => ({ ...p, peso: pilarPesos[p.key] ?? p.peso }))
  )
  const [expanded, setExpanded] = useState<PilarKey | null>(null)
  const [simulador, setSimulador] = useState<Record<string, number>>({
    conversao: 60, desconto: 50, recorrencia: 65, cmv: 65,
  })
  const [saved, setSaved] = useState(false)

  const somaP = pilares.reduce((s, p) => s + p.peso, 0)
  const somaOk = somaP === 100

  const indexScore    = useMemo(() => calcIndex(pilares, simulador),                  [pilares, simulador])
  const classificacao = useMemo(() => classifyIndex(indexScore), [indexScore])

  function updatePeso(key: PilarKey, val: number) {
    setPilares(prev => prev.map(p => p.key === key ? { ...p, peso: val } : p))
  }

  function toggleInvertido(key: PilarKey) {
    setPilares(prev => prev.map(p => p.key === key ? { ...p, invertido: !p.invertido } : p))
  }

  function updateBanda(key: PilarKey, id: string, field: keyof Banda, val: string | number) {
    setPilares(prev => prev.map(p =>
      p.key === key
        ? { ...p, bandas: p.bandas.map(b => b.id === id ? { ...b, [field]: val } : b) }
        : p
    ))
  }

  function addBanda(key: PilarKey) {
    const id = `${key}-${Date.now()}`
    setPilares(prev => prev.map(p =>
      p.key === key
        ? { ...p, bandas: [...p.bandas, { id, label: 'Nova faixa', min: 0, max: 100, pts: 0 }] }
        : p
    ))
  }

  function removeBanda(key: PilarKey, id: string) {
    setPilares(prev => prev.map(p =>
      p.key === key ? { ...p, bandas: p.bandas.filter(b => b.id !== id) } : p
    ))
  }

  function handleRestore() {
    setPilares(DEFAULT_PILARES)
    setExpanded(null)
    setSaved(false)
  }

  function handleSave() {
    if (!somaOk) return
    const pesos = Object.fromEntries(pilares.map(p => [p.key, p.peso]))
    setPilarPesos(pesos)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm transition-colors hover:text-orange-400"
            style={{ color: 'rgb(var(--bh-subtle))' }}
          >
            <ArrowLeft size={15} /> BuyHelp Index
          </button>
          <span style={{ color: 'rgb(var(--bh-subtle))' }}>/</span>
          <h2 className="text-bh-text font-semibold text-base">Configuração do Índice</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRestore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-bh-border text-xs font-medium transition-colors hover:border-orange-500/40 hover:text-orange-400"
            style={{ color: 'rgb(var(--bh-subtle))' }}
          >
            <RotateCcw size={12} /> Restaurar padrão
          </button>
          <button
            onClick={handleSave}
            disabled={!somaOk}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: somaOk ? '#ff6600' : 'rgba(255,255,255,0.06)',
              color: somaOk ? '#fff' : 'rgb(var(--bh-subtle))',
              cursor: somaOk ? 'pointer' : 'not-allowed',
            }}
          >
            {saved ? <CheckCircle2 size={12} /> : <Save size={12} />}
            {saved ? 'Salvo!' : 'Salvar configuração'}
          </button>
        </div>
      </div>

      {/* ── Main layout ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        {/* Left: Pilares list */}
        <div className="lg:col-span-2 flex flex-col gap-3">

          {!somaOk && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
              style={{ background: 'rgba(226,75,74,0.1)', color: '#E24B4A', border: '1px solid rgba(226,75,74,0.25)' }}
            >
              <AlertTriangle size={12} />
              Soma dos pesos: {somaP}% — ajuste até totalizar exatamente 100%.
            </div>
          )}

          {pilares.map(pilar => {
            const Icon    = ICON_MAP[pilar.icone] ?? ShoppingCart
            const isOpen  = expanded === pilar.key
            const somaPts = pilar.bandas.reduce((s, b) => s + b.pts, 0)
            const bandasOk = somaPts === 100 && pilar.bandas.length >= 1

            return (
              <div
                key={pilar.key}
                className="rounded-xl border overflow-hidden"
                style={{
                  background: 'rgb(var(--bh-card))',
                  borderColor: pilar.invertido ? `${pilar.cor}50` : 'rgb(var(--bh-border))',
                }}
              >
                {/* Card header */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-white/5 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : pilar.key)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg" style={{ background: `${pilar.cor}22` }}>
                      <Icon size={14} style={{ color: pilar.cor }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-bh-text text-sm font-semibold">{pilar.nome}</p>
                        {pilar.invertido && (
                          <span
                            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                            style={{ background: `${pilar.cor}20`, color: pilar.cor }}
                          >
                            <TrendingDown size={9} /> menor é melhor
                          </span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: 'rgb(var(--bh-subtle))' }}>
                        {pilar.bandas.length} faixa{pilar.bandas.length !== 1 ? 's' : ''}
                        {' · '}
                        <span style={{ color: bandasOk ? 'rgb(var(--bh-subtle))' : '#E24B4A' }}>
                          {somaPts}/100%{!bandasOk && ' ⚠'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <input
                        type="number" min={0} max={100}
                        value={pilar.peso}
                        onChange={e => updatePeso(pilar.key, parseInt(e.target.value) || 0)}
                        className="w-12 text-center text-sm font-bold rounded-lg border border-bh-border bg-transparent focus:outline-none focus:border-orange-500 py-0.5"
                        style={{ color: pilar.cor }}
                      />
                      <span className="text-xs" style={{ color: 'rgb(var(--bh-subtle))' }}>%</span>
                    </div>
                    {isOpen
                      ? <ChevronUp   size={14} style={{ color: 'rgb(var(--bh-subtle))' }} />
                      : <ChevronDown size={14} style={{ color: 'rgb(var(--bh-subtle))' }} />
                    }
                  </div>
                </div>

                {/* Expanded: bands editor */}
                {isOpen && (
                  <div
                    className="px-4 pb-4 flex flex-col gap-3"
                    style={{ borderTop: '1px solid rgb(var(--bh-border))' }}
                  >
                    {/* Invertido toggle */}
                    <div className="flex items-center justify-between pt-3">
                      <p className="text-xs" style={{ color: 'rgb(var(--bh-subtle))' }}>
                        {pilar.invertido
                          ? 'Pontuação cumulativa: acumula nas faixas onde valor real ≤ Até %.'
                          : 'Pontuação cumulativa: acumula nas faixas onde valor real ≥ De %.'}
                      </p>
                      <button
                        onClick={() => toggleInvertido(pilar.key)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ml-3"
                        style={{
                          background: pilar.invertido ? `${pilar.cor}20` : 'rgba(255,255,255,0.05)',
                          color: pilar.invertido ? pilar.cor : 'rgb(var(--bh-subtle))',
                          border: `1px solid ${pilar.invertido ? pilar.cor + '50' : 'rgb(var(--bh-border))'}`,
                        }}
                      >
                        <TrendingDown size={11} />
                        Menor é melhor
                      </button>
                    </div>

                    {/* Bands table */}
                    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgb(var(--bh-border))' }}>
                      <table className="w-full text-xs">
                        <thead>
                          <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <th className="text-left px-3 py-2 font-semibold" style={{ color: 'rgb(var(--bh-subtle))' }}>Rótulo</th>
                            <th
                              className="text-center px-3 py-2 font-semibold"
                              style={{ color: pilar.invertido ? 'rgb(var(--bh-subtle))' : pilar.cor }}
                            >
                              De %
                            </th>
                            <th
                              className="text-center px-3 py-2 font-semibold"
                              style={{ color: pilar.invertido ? pilar.cor : 'rgb(var(--bh-subtle))' }}
                            >
                              Até %
                            </th>
                            <th className="text-center px-3 py-2 font-semibold" style={{ color: 'rgb(var(--bh-subtle))' }}>Score %</th>
                            <th className="w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {pilar.bandas.map((b, i) => (
                            <tr
                              key={b.id}
                              style={{ borderTop: i > 0 ? '1px solid rgb(var(--bh-border))' : undefined }}
                            >
                              <td className="px-3 py-2">
                                <input
                                  value={b.label}
                                  onChange={e => updateBanda(pilar.key, b.id, 'label', e.target.value)}
                                  className="w-full bg-transparent text-bh-text focus:outline-none"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <input
                                  type="number" min={0} max={100}
                                  value={b.min}
                                  onChange={e => updateBanda(pilar.key, b.id, 'min', parseInt(e.target.value) || 0)}
                                  className="w-14 text-center bg-transparent text-bh-text focus:outline-none rounded border border-transparent focus:border-orange-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <input
                                  type="number" min={0} max={100}
                                  value={b.max}
                                  onChange={e => updateBanda(pilar.key, b.id, 'max', parseInt(e.target.value) || 0)}
                                  className="w-14 text-center bg-transparent text-bh-text focus:outline-none rounded border border-transparent focus:border-orange-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <input
                                  type="number" min={0} max={100}
                                  value={b.pts}
                                  onChange={e => updateBanda(pilar.key, b.id, 'pts', parseInt(e.target.value) || 0)}
                                  className="w-14 text-center bg-transparent focus:outline-none rounded border border-transparent focus:border-orange-500 font-bold"
                                  style={{ color: pilar.cor }}
                                />
                              </td>
                              <td className="px-2 py-2">
                                <button
                                  onClick={() => removeBanda(pilar.key, b.id)}
                                  disabled={pilar.bandas.length <= 1}
                                  className="p-1 rounded hover:bg-red-500/10 disabled:opacity-30 transition-colors"
                                  style={{ color: '#E24B4A' }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs">
                        {bandasOk
                          ? <><CheckCircle2 size={12} style={{ color: '#639922' }} /><span style={{ color: '#639922' }}>Total: 100%</span></>
                          : <><AlertTriangle size={12} style={{ color: '#E24B4A' }} /><span style={{ color: '#E24B4A' }}>Total: {somaPts}% (a soma precisa ser 100%)</span></>
                        }
                      </div>
                      <button
                        onClick={() => addBanda(pilar.key)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors hover:text-orange-400"
                        style={{ color: 'rgb(var(--bh-subtle))', border: '1px dashed rgb(var(--bh-border))' }}
                      >
                        <Plus size={11} /> Adicionar faixa
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Right: panels */}
        <div className="flex flex-col gap-4">

          {/* Weight distribution */}
          <div className="rounded-xl border border-bh-border p-4" style={{ background: 'rgb(var(--bh-card))' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgb(var(--bh-subtle))' }}>
              Distribuição de pesos
            </p>
            <div className="flex flex-col gap-2.5">
              {pilares.map(p => (
                <div key={p.key} className="flex items-center gap-2">
                  <p className="text-xs w-20 truncate" style={{ color: 'rgb(var(--bh-subtle))' }}>
                    {p.nome.split(' ')[0]}
                  </p>
                  <div className="flex-1 h-3.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(p.peso, 100)}%`, background: p.cor }}
                    />
                  </div>
                  <p className="text-xs w-8 text-right font-bold" style={{ color: somaOk ? p.cor : '#E24B4A' }}>
                    {p.peso}%
                  </p>
                </div>
              ))}
              <div
                className="flex items-center justify-between pt-2 mt-0.5"
                style={{ borderTop: '1px solid rgb(var(--bh-border))' }}
              >
                <p className="text-xs font-medium" style={{ color: 'rgb(var(--bh-subtle))' }}>Total</p>
                <p className="text-xs font-black" style={{ color: somaOk ? '#639922' : '#E24B4A' }}>
                  {somaP}%
                </p>
              </div>
            </div>
          </div>

          {/* Simulator */}
          <div className="rounded-xl border border-bh-border p-4" style={{ background: 'rgb(var(--bh-card))' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgb(var(--bh-subtle))' }}>
              Simulador
            </p>
            <div className="flex flex-col gap-4">
              {pilares.map(p => {
                const simVal     = simulador[p.key] ?? 0
                const pilarScore = scoreForValue(p, simVal)

                return (
                  <div key={p.key}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs truncate" style={{ color: 'rgb(var(--bh-subtle))' }}>
                          {p.nome.split(' ')[0]}
                        </p>
                        {p.invertido && (
                          <TrendingDown size={9} style={{ color: p.cor, opacity: 0.7 }} />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: p.cor }}>{pilarScore}%</span>
                        <span className="text-xs tabular-nums" style={{ color: 'rgb(var(--bh-subtle))' }}>{simVal}%</span>
                      </div>
                    </div>
                    <input
                      type="range" min={0} max={100}
                      value={simVal}
                      onChange={e => setSimulador(prev => ({ ...prev, [p.key]: parseInt(e.target.value) }))}
                      className="w-full h-1.5 cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:bg-[var(--rc)] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-[var(--rc)]"
                      style={{
                        '--rc': p.cor,
                        background: `linear-gradient(to right, ${p.cor} ${simVal}%, rgba(0,0,0,0.25) ${simVal}%)`,
                      } as React.CSSProperties}
                    />
                  </div>
                )
              })}
            </div>

            {/* Result */}
            <div
              className="mt-4 pt-3 flex items-center justify-between"
              style={{ borderTop: '1px solid rgb(var(--bh-border))' }}
            >
              <div>
                <p className="text-2xl font-black text-bh-text leading-none">{Math.round(indexScore)}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgb(var(--bh-subtle))' }}>pontos (índice)</p>
              </div>
              <div
                className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{
                  background: `${CLASS_COLORS[classificacao]}20`,
                  color: CLASS_COLORS[classificacao],
                  border: `1px solid ${CLASS_COLORS[classificacao]}40`,
                }}
              >
                {CLASS_LABELS[classificacao]}
              </div>
            </div>

          </div>

          {/* Classification reference */}
          <div className="rounded-xl border border-bh-border p-4" style={{ background: 'rgb(var(--bh-card))' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgb(var(--bh-subtle))' }}>
              Classificação
            </p>
            <div className="flex flex-col gap-1.5">
              {CLASSIFICACOES.map(c => (
                <div
                  key={c.label}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs"
                  style={{ background: c.bg, border: `1px solid ${c.cor}30` }}
                >
                  <span className="font-bold" style={{ color: c.cor }}>{c.label}</span>
                  <span style={{ color: 'rgb(var(--bh-subtle))' }}>{c.range} pts</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
