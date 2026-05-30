import { useState, useRef, useEffect } from 'react'
import {
  RefreshCw, Calendar, ChevronDown, ChevronLeft as ChevLeft, ChevronRight as ChevRight,
  ArrowLeft, TrendingUp, TrendingDown, Minus, BookOpen, Settings2,
  ShoppingCart, Tag, Users, Receipt, type LucideIcon,
  BarChart2, X,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { AppLayout } from '../components/layout/AppLayout'
import { TabNav } from '../components/ui/TabNav'
import { ScoreGaugeSVG } from '../components/buyhelp-index/ScoreGaugeSVG'
import { useBuyHelpIndex } from '../hooks/useBuyHelpIndex'
import { PILARES_DEF, fetchGrupoIndex } from '../mocks/buyhelp-index.mock'
import { useLojaGrupo } from '../contexts/LojaGrupoContext'
import { ConversaoHistoricoModal } from '../components/buyhelp-index/ConversaoHistoricoModal'
import { DescontoAbsorcaoModal } from '../components/visao-geral/DescontoAbsorcaoModal'
import { ConfiguracaoIndexView } from '../components/buyhelp-index/ConfiguracaoIndexView'
import type { BuyHelpIndexResponse, BuyHelpIndexClassificacao, GrupoIndexResponse } from '../types/buyhelp-index.types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FAIXAS = [
  { label: 'Excelente', range: '80 – 100', cor: '#639922', bg: 'rgba(99,153,34,0.15)' },
  { label: 'Saudável',  range: '60 – 79',  cor: '#22c9a0', bg: 'rgba(34,201,160,0.15)' },
  { label: 'Atenção',   range: '40 – 59',  cor: '#EF9F27', bg: 'rgba(239,159,39,0.15)' },
  { label: 'Crítico',   range: '0 – 39',   cor: '#E24B4A', bg: 'rgba(226,75,74,0.15)'  },
]

function pilarClassify(score: number) {
  if (score >= 80) return { label: 'Excelente', cor: '#639922', bg: 'rgba(99,153,34,0.18)' }
  if (score >= 60) return { label: 'Saudável',  cor: '#22c9a0', bg: 'rgba(34,201,160,0.18)' }
  if (score >= 40) return { label: 'Atenção',   cor: '#EF9F27', bg: 'rgba(239,159,39,0.18)' }
  return               { label: 'Crítico',  cor: '#E24B4A', bg: 'rgba(226,75,74,0.18)'  }
}


function fmtMes(mes: string) {
  const [ano, m] = mes.split('-')
  const nomes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${nomes[parseInt(m) - 1]}/${ano.slice(2)}`
}


// ─── DateRangePicker ──────────────────────────────────────────────────────────

const MONTHS_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const MONTHS_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function MonthPicker({ dataInicio, onChange }: {
  dataInicio: string
  onChange: (inicio: string, fim: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [calYear, setCalYear] = useState(() => {
    return dataInicio ? parseInt(dataInicio.split('-')[0]) : new Date().getFullYear()
  })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function selectMonth(monthIndex: number) {
    const month = monthIndex + 1
    const lastDay = new Date(calYear, month, 0).getDate()
    const pad = (n: number) => String(n).padStart(2, '0')
    onChange(
      `${calYear}-${pad(month)}-01`,
      `${calYear}-${pad(month)}-${lastDay}`,
    )
    setOpen(false)
  }

  const selMonth = dataInicio ? parseInt(dataInicio.split('-')[1]) - 1 : -1
  const selYear  = dataInicio ? parseInt(dataInicio.split('-')[0]) : -1
  const label = selMonth >= 0 ? `${MONTHS_FULL[selMonth]} ${selYear}` : 'Selecione o mês'

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-bh-border bg-bh-surface text-sm transition-colors hover:border-orange-500/50">
        <Calendar size={14} className="text-orange-500 flex-shrink-0"/>
        <span className={dataInicio ? 'text-bh-text' : 'text-bh-muted'}>{label}</span>
        <ChevronDown size={12} className={`text-bh-muted transition-transform ${open ? 'rotate-180' : ''}`}/>
      </button>
      {open && (
        <div className="absolute z-30 top-full mt-2 right-0 rounded-xl shadow-2xl border border-orange-500/30 p-4 w-56"
          style={{background:'rgb(var(--bh-surface))'}}>
          {/* Year nav */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setCalYear(y => y - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bh-surface2 text-bh-muted hover:text-bh-text transition-colors">
              <ChevLeft size={16}/>
            </button>
            <span className="text-bh-text font-semibold text-sm">{calYear}</span>
            <button onClick={() => setCalYear(y => y + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bh-surface2 text-bh-muted hover:text-bh-text transition-colors">
              <ChevRight size={16}/>
            </button>
          </div>
          {/* Month grid 4×3 */}
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS_PT.map((m, i) => {
              const isSelected = i === selMonth && calYear === selYear
              return (
                <button key={m} onClick={() => selectMonth(i)}
                  className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow shadow-orange-500/30'
                      : 'text-[#aaa] hover:bg-orange-500/10 hover:text-orange-400'
                  }`}>
                  {m}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Sk({ className='' }: { className?: string }) {
  return <div className={`rounded animate-pulse ${className}`} style={{background:'rgb(var(--bh-surface2))'}}/>
}
function SkeletonLayout() {
  return (
    <>
      <div className="grid grid-cols-5 gap-5 mb-5">
        <div className="col-span-2"><Sk className="h-96"/></div>
        <div className="col-span-3"><Sk className="h-96"/></div>
      </div>
    </>
  )
}

// ─── Overview Section ─────────────────────────────────────────────────────────

function OverviewSection({ data }: { data: BuyHelpIndexResponse }) {
  const cls = FAIXAS.find(f => {
    const s = data.index.score
    if (f.label === 'Excelente') return s >= 80
    if (f.label === 'Saudável')  return s >= 60 && s < 80
    if (f.label === 'Atenção')   return s >= 40 && s < 60
    return s < 40
  })!

  const evoData = data.historico_mensal.map(h => ({ mes: fmtMes(h.mes), score: h.score }))
  const pilarEvoData = data.historico_pilares.map(h => ({
    mes: fmtMes(h.mes),
    Conversão: h.conversao,
    Desconto:  h.desconto,
    Recorrência: h.recorrencia,
    CMV: h.cmv,
  }))
  const PILAR_KEYS = [
    { key: 'Conversão',    cor: PILARES_DEF[0].cor },
    { key: 'Desconto',     cor: PILARES_DEF[1].cor },
    { key: 'Recorrência',  cor: PILARES_DEF[2].cor },
    { key: 'CMV',          cor: PILARES_DEF[3].cor },
  ]

  return (
    <div className="grid grid-cols-5 gap-5 mb-5">

      {/* Gauge + faixas */}
      <div className="col-span-2 card-bh p-6 flex flex-col">
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'rgb(var(--bh-subtle))'}}>
            Índice de Saúde Comercial
          </p>
          <h2 className="text-bh-text text-lg font-bold">BuyHelp Index</h2>
        </div>

        <div className="flex-1 flex items-center justify-center py-2">
          <ScoreGaugeSVG
            score={data.index.score}
            classificacao={data.index.classificacao}
            delta={data.index.delta_periodo_anterior}
          />
        </div>


        <div className="mt-4 space-y-2">
          <p className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{color:'rgb(var(--bh-subtle))'}}>
            Faixas de Classificação
          </p>
          {FAIXAS.map(f => (
            <div key={f.label}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
              style={{background:`${f.cor}12`, border:`1px solid ${f.cor}25`}}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:f.cor}}/>
                <span className="text-xs font-semibold" style={{color:f.cor}}>{f.label}</span>
              </div>
              <span className="text-xs font-mono" style={{color:'rgb(var(--bh-subtle))'}}>{f.range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gráficos de evolução */}
      <div className="col-span-3 flex flex-col gap-4">

        {/* Evolução mensal */}
        <div className="card-bh p-5 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'rgb(var(--bh-subtle))'}}>
            Evolução Mensal do BuyHelp Index
          </p>
          <p className="text-xs font-medium text-bh-text mb-3">Score ao longo do tempo</p>
          <div style={{height:130}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evoData} margin={{top:4,right:8,left:-16,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--bh-surface2))"/>
                <XAxis dataKey="mes" tick={{fill:'rgb(var(--bh-subtle))',fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,100]} tick={{fill:'rgb(var(--bh-subtle))',fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:'rgb(var(--bh-surface))',border:'1px solid #222',borderRadius:8,fontSize:12,color:'rgb(var(--bh-border))'}}/>
                <ReferenceLine y={80} stroke="#639922" strokeDasharray="4 4" strokeOpacity={0.4}/>
                <ReferenceLine y={60} stroke="#22c9a0" strokeDasharray="4 4" strokeOpacity={0.4}/>
                <ReferenceLine y={40} stroke="#EF9F27" strokeDasharray="4 4" strokeOpacity={0.4}/>
                <Line type="monotone" dataKey="score" stroke={cls.cor} strokeWidth={2.5}
                  dot={{fill:cls.cor,stroke:'rgb(var(--bh-surface))',strokeWidth:2,r:4}}
                  activeDot={{r:6,fill:cls.cor,stroke:'rgb(var(--bh-surface))',strokeWidth:2}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolução por pilar */}
        <div className="card-bh p-5 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'rgb(var(--bh-subtle))'}}>
            Evolução por Pilar
          </p>
          <div className="flex flex-wrap gap-3 mb-3 mt-1">
            {PILAR_KEYS.map(pk => (
              <div key={pk.key} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{background:pk.cor}}/>
                <span className="text-[10px]" style={{color:'rgb(var(--bh-muted))'}}>{pk.key}</span>
              </div>
            ))}
          </div>
          <div style={{height:130}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pilarEvoData} margin={{top:4,right:16,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--bh-surface2))"/>
                <XAxis dataKey="mes" tick={{fill:'rgb(var(--bh-subtle))',fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,100]} tick={{fill:'rgb(var(--bh-subtle))',fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:'rgb(var(--bh-surface))',border:'1px solid #222',borderRadius:8,fontSize:11,color:'rgb(var(--bh-border))'}}/>
                {PILAR_KEYS.map(pk => (
                  <Line key={pk.key} type="monotone" dataKey={pk.key}
                    stroke={pk.cor} strokeWidth={2} dot={false}
                    activeDot={{r:4,fill:pk.cor,stroke:'rgb(var(--bh-surface))',strokeWidth:1}}/>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Pilares Section ──────────────────────────────────────────────────────────

const ICONE_MAP: Record<string, LucideIcon> = { ShoppingCart, Tag, Users, Receipt, TrendingUp }

function PilarHistoricoModal({
  pilar, delta, historico, onClose,
}: {
  pilar: typeof PILARES_DEF[0]
  delta: number
  historico: { mes: string; score: number }[]
  onClose: () => void
}) {
  const deltaPos  = delta > 0
  const deltaZero = delta === 0
  const deltaColor = deltaZero ? '#6b7280' : deltaPos ? '#4ade80' : '#f87171'

  const media    = historico.length ? Math.round(historico.reduce((s, h) => s + h.score, 0) / historico.length) : 0
  const pico     = historico.length ? Math.max(...historico.map(h => h.score)) : 0
  const minScore = historico.length ? Math.min(...historico.map(h => h.score)) : 0

  const kpis = [
    { label: 'Score Médio',  value: media,                                 suffix: '/100', sub: `Média dos ${historico.length} meses`,  color: pilar.cor },
    { label: 'Melhor Score', value: pico,                                  suffix: '/100', sub: 'Melhor mês do período',                 color: '#4ade80' },
    { label: 'Variação',     value: `${deltaPos?'+':''}${delta.toFixed(1)}`, suffix: ' pts', sub: 'vs período anterior',               color: deltaColor },
  ]

  const BELOW_COLOR = '#2d1a00'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{background:'rgba(0,0,0,0.92)'}}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl border border-bh-border/40 shadow-2xl flex flex-col"
        style={{background:'rgb(var(--bh-surface))', maxWidth:'92vw', height:'88vh', maxHeight:'88vh'}}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-7 pb-5 shrink-0">
          <div>
            <h2 className="text-bh-text text-2xl font-bold leading-tight">
              {pilar.label} — Últimos {historico.length} Meses
            </h2>
            <p className="text-xs mt-1" style={{color:'rgb(var(--bh-subtle))'}}>
              {historico[0]?.mes} → {historico[historico.length - 1]?.mes} · Evolução mensal do score por período
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-bh-border/40 text-bh-subtle hover:text-bh-text hover:border-bh-border/60 transition-colors mt-1 shrink-0">
            <X size={15}/>
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4 px-8 pb-6 shrink-0">
          {kpis.map(k => (
            <div key={k.label} className="rounded-xl border border-bh-border/30 px-6 py-5"
              style={{background:'rgba(255,255,255,0.02)'}}>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{color:'rgb(var(--bh-subtle))'}}>{k.label}</p>
              <p className="leading-none mb-2">
                <span className="text-4xl font-black" style={{color: k.color}}>{k.value}</span>
                <span className="text-lg font-bold ml-1" style={{color:'rgba(255,255,255,0.2)'}}>{k.suffix}</span>
              </p>
              <p className="text-[10px]" style={{color:'rgb(var(--bh-subtle))'}}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 px-8 pb-8 flex flex-col" style={{minHeight:0}}>
          {/* Legend */}
          <div className="flex items-center gap-5 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{background: pilar.cor}}/>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{color:'rgb(var(--bh-muted))'}}>Acima da Média</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{background: BELOW_COLOR, border:'1px solid #555'}}/>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{color:'rgb(var(--bh-muted))'}}>Abaixo da Média</span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{width:20, borderTop:`2px dashed ${pilar.cor}`, opacity:0.7}}/>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{color:'rgb(var(--bh-muted))'}}>
                Média ({media} pts)
              </span>
            </div>
            <div className="ml-auto text-[10px]" style={{color:'rgb(var(--bh-subtle))'}}>
              Pico: {pico}/100 &nbsp;|&nbsp; Mínimo: {minScore}/100
            </div>
          </div>

          <div style={{flex:1, minHeight:240}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historico} margin={{top:4,right:56,bottom:0,left:0}} barCategoryGap="28%">
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false}/>
                <XAxis dataKey="mes" tick={{fill:'rgb(var(--bh-subtle))',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,100]} tick={{fill:'rgb(var(--bh-subtle))',fontSize:11}} axisLine={false} tickLine={false} width={32}
                  tickFormatter={v => `${v}`}/>
                <Tooltip
                  cursor={{fill:'rgba(255,255,255,0.03)'}}
                  contentStyle={{background:'rgb(var(--bh-surface))',border:'1px solid #222',borderRadius:8,fontSize:12,color:'rgb(var(--bh-border))'}}
                  formatter={(v) => [`${v}/100`, 'Score']}/>
                <ReferenceLine
                  y={media}
                  stroke={pilar.cor}
                  strokeDasharray="5 4"
                  strokeOpacity={0.8}
                  label={{ value: `Média: ${media} pts`, fill: pilar.cor, fontSize: 10, position: 'right' }}
                />
                <Bar dataKey="score" radius={[4,4,0,0]}>
                  {historico.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.score >= media ? pilar.cor : BELOW_COLOR}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function WaterfallTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const isPos = d.deltaContrib >= 0
  return (
    <div className="rounded-xl border border-gray-800 px-3 py-2.5 shadow-2xl text-xs"
      style={{background:'rgb(var(--bh-surface))'}}>
      <p className="font-bold mb-1.5" style={{color:'#f9fafb'}}>{d.nome}</p>
      <div className="space-y-0.5" style={{color:'rgb(var(--bh-subtle))'}}>
        <p>Score anterior: <span className="font-medium" style={{color:'#f9fafb'}}>{Math.round(d.scoreAnt)}</span></p>
        <p>Score atual: <span className="font-medium" style={{color:'#f9fafb'}}>{d.score}</span></p>
        <p>Contribuição no índice:{' '}
          <span className="font-bold" style={{color: isPos ? '#22c9a0' : '#E24B4A'}}>
            {isPos && d.deltaContrib > 0 ? '+' : ''}{d.deltaContrib} pts
          </span>
        </p>
      </div>
    </div>
  )
}

function PilaresSection({ data }: { data: BuyHelpIndexResponse }) {
  const [modalPilar, setModalPilar] = useState<string | null>(null)
  const [showOperacao, setShowOperacao] = useState(false)
  const [showDesconto, setShowDesconto] = useState(false)

  const pilarAtivo = modalPilar ? PILARES_DEF.find(p => p.key === modalPilar) : null
  const pilarScore = modalPilar ? data.pilares[modalPilar as import('../types/buyhelp-index.types').PilarKey] : null
  const pilarHist  = modalPilar
    ? data.historico_pilares.map(h => ({
        mes: fmtMes(h.mes),
        score: (h as unknown as Record<string, number>)[modalPilar] ?? 0,
      }))
    : []

  function handleHistorico(key: string) {
    if (key === 'conversao') setShowOperacao(true)
    else if (key === 'desconto') setShowDesconto(true)
    else setModalPilar(key)
  }

  // ── Variation diagnostic ─────────────────────────────────────────────────────
  const deltaTotal   = data.index.delta_periodo_anterior
  const showBanner   = Math.abs(deltaTotal) >= 2
  const isQueda      = deltaTotal < 0

  const SHORT_LABEL: Record<string, string> = {
    conversao: 'Conversão', desconto: 'Desconto', recorrencia: 'Recorrência', cmv: 'CMV',
  }

  const variacoes = PILARES_DEF.map(pilar => {
    const p = data.pilares[pilar.key]
    const score = p.score ?? 0
    const scoreAnt = score - p.delta
    const deltaContrib = parseFloat((p.delta * pilar.peso / 100).toFixed(1))
    return {
      key: pilar.key,
      nome: SHORT_LABEL[pilar.key] ?? pilar.label,
      score, scoreAnt,
      deltaContrib,
      cor: deltaContrib > 0 ? '#22c9a0' : deltaContrib < 0 ? '#E24B4A' : '#6b7280',
    }
  })

  const principalQueda = [...variacoes].filter(v => v.deltaContrib < 0)
    .sort((a, b) => a.deltaContrib - b.deltaContrib)[0] ?? null
  const principalAlta  = [...variacoes].filter(v => v.deltaContrib > 0)
    .sort((a, b) => b.deltaContrib - a.deltaContrib)[0] ?? null

  const prevScore    = data.index.score - deltaTotal
  const prevClsLabel = pilarClassify(prevScore).label
  const currClsLabel = pilarClassify(data.index.score).label

  const bannerCor = isQueda ? '#E24B4A' : '#0F6E56'
  const bannerBg  = isQueda ? 'rgba(226,75,74,0.08)' : 'rgba(15,110,86,0.08)'

  const waterfallData = [...variacoes].sort((a, b) => a.deltaContrib - b.deltaContrib)

  function cardBadge(deltaContrib: number) {
    if (deltaContrib === 0) return { text: '— sem variação', cor: '#9ca3af' }
    const isPos = deltaContrib > 0
    const absPartic = deltaTotal !== 0 ? Math.abs(deltaContrib / deltaTotal) : 0
    const cor = isPos
      ? (absPartic >= 0.5 ? '#0F6E56' : '#22c9a0')
      : (absPartic >= 0.5 ? '#E24B4A' : '#EF9F27')
    return { text: `${isPos ? '⬆' : '⬇'} ${isPos ? '+' : ''}${deltaContrib} pts no índice`, cor }
  }

  return (
    <div className="mb-5">
      {pilarAtivo && pilarScore && (
        <PilarHistoricoModal
          pilar={pilarAtivo}
          delta={pilarScore.delta}
          historico={pilarHist}
          onClose={() => setModalPilar(null)}
        />
      )}
      {showOperacao && (
        <ConversaoHistoricoModal onClose={() => setShowOperacao(false)} />
      )}
      {showDesconto && (
        <DescontoAbsorcaoModal onClose={() => setShowDesconto(false)} />
      )}

      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'rgb(var(--bh-subtle))'}}>
          Composição do Índice
        </p>
        <h2 className="text-bh-text text-base font-bold">Pilares de Desempenho</h2>
      </div>

      {/* Variation diagnostic banner */}
      {showBanner && (
        <div className="mb-4 rounded-xl overflow-hidden"
          style={{border:`1px solid ${bannerCor}30`, borderLeft:`3px solid ${bannerCor}`, background:bannerBg}}>

          {/* Header */}
          <div className="flex items-center gap-2 px-5 pt-4 pb-3">
            {isQueda
              ? <TrendingDown size={15} color={bannerCor}/>
              : <TrendingUp   size={15} color={bannerCor}/>}
            <span className="text-sm font-bold" style={{color:bannerCor}}>
              O índice {isQueda ? 'caiu' : 'subiu'} {Math.abs(deltaTotal).toFixed(1)} pts este período
            </span>
            <span className="text-xs ml-1" style={{color:'rgb(var(--bh-subtle))'}}>
              ({prevClsLabel} → {currClsLabel})
            </span>
          </div>

          {/* Waterfall chart */}
          <div style={{height:106, paddingLeft:8, paddingRight:16, paddingBottom:4}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={waterfallData}
                margin={{top:0, right:48, bottom:0, left:0}}>
                <XAxis type="number" domain={['auto','auto']}
                  tick={{fill:'rgb(var(--bh-subtle))', fontSize:9}} axisLine={false} tickLine={false}
                  tickFormatter={v => `${v > 0 ? '+' : ''}${v}`}/>
                <YAxis type="category" dataKey="nome" width={86}
                  tick={{fill:'rgb(var(--bh-subtle))', fontSize:10}} axisLine={false} tickLine={false}/>
                <ReferenceLine x={0} stroke="rgba(255,255,255,0.12)" strokeWidth={1}/>
                <Tooltip content={<WaterfallTooltip/>} cursor={{fill:'rgba(255,255,255,0.03)'}}/>
                <Bar dataKey="deltaContrib" maxBarSize={13} radius={[0,3,3,0]}
                  label={{position:'right', fontSize:10, fill:'rgb(var(--bh-subtle))',
                    formatter:(v: number) => v !== 0 ? `${v > 0 ? '+' : ''}${v}` : ''}}>
                  {waterfallData.map((entry, i) => (
                    <Cell key={i} fill={entry.cor}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-5 pb-4 text-[11px]">
            {principalQueda && (
              <span>
                <span style={{color:'rgb(var(--bh-subtle))'}}>Principal queda: </span>
                <span className="font-semibold" style={{color:'#E24B4A'}}>
                  {principalQueda.nome} ({principalQueda.deltaContrib} pts)
                </span>
              </span>
            )}
            {principalAlta && (
              <span>
                <span style={{color:'rgb(var(--bh-subtle))'}}>
                  {isQueda ? 'Compensou: ' : 'Principal alta: '}
                </span>
                <span className="font-semibold" style={{color:'#22c9a0'}}>
                  {principalAlta.nome} (+{principalAlta.deltaContrib} pts)
                </span>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {PILARES_DEF.map(pilar => {
          const p = data.pilares[pilar.key]
          const score = p.score ?? 0
          const Icon = ICONE_MAP[pilar.icone] ?? TrendingUp
          const deltaPos  = p.delta > 0
          const deltaZero = p.delta === 0
          const deltaColor = deltaZero ? '#6b7280' : deltaPos ? '#4ade80' : '#f87171'
          const cls = pilarClassify(score)
          const vari = variacoes.find(v => v.key === pilar.key)!
          const badge = cardBadge(vari.deltaContrib)
          const isMainDrag = principalQueda?.key === pilar.key

          return (
            <div key={pilar.key}
              className="card-bh p-5 flex flex-col gap-3"
              style={isMainDrag ? {borderLeft:'3px solid #E24B4A'} : {}}>

              {/* Topo: label + ícone */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug mb-1.5" style={{color:'#9ca3af'}}>
                    {pilar.label}
                  </p>
                  <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                    style={{background:cls.bg, color:cls.cor}}>{cls.label}</span>
                </div>
                <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{background:`${pilar.cor}22`}}>
                  <Icon size={17} color={pilar.cor}/>
                </div>
              </div>

              {/* Score */}
              <div>
                <span className="text-4xl font-black tabular-nums leading-none" style={{color:'#f9fafb'}}>
                  {score}
                </span>
                <span className="text-sm font-normal ml-1.5" style={{color:'rgb(var(--bh-subtle))'}}>/100</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{background:'rgb(var(--bh-surface2))'}}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{width:`${score}%`, background:pilar.cor}}/>
              </div>

              {/* Contribution badge + action hint */}
              <p className="text-[10px] font-semibold" style={{color:badge.cor}}>{badge.text}</p>

              {/* Delta + botão histórico */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {deltaPos  && <TrendingUp   size={13} color={deltaColor}/>}
                  {!deltaPos && !deltaZero && <TrendingDown size={13} color={deltaColor}/>}
                  {deltaZero && <Minus        size={13} color={deltaColor}/>}
                  <span className="text-xs font-semibold" style={{color:deltaColor}}>
                    {deltaPos?'+':''}{p.delta.toFixed(1)} pts
                  </span>
                </div>
                <button
                  onClick={() => handleHistorico(pilar.key)}
                  className="flex items-center gap-1 rounded-lg border border-bh-border/40 px-2 py-1 text-[10px] font-semibold transition-colors hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5"
                  style={{color:'rgb(var(--bh-subtle))'}}
                >
                  <BarChart2 size={11}/> Histórico
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Grupo Econômico Section ─────────────────────────────────────────────────

const CLS_COR: Record<BuyHelpIndexClassificacao, string> = {
  excelente: '#639922',
  saudavel:  '#22c9a0',
  atencao:   '#EF9F27',
  critico:   '#E24B4A',
}
const CLS_LABEL: Record<BuyHelpIndexClassificacao, string> = {
  excelente: 'Excelente',
  saudavel:  'Saudável',
  atencao:   'Atenção',
  critico:   'Crítico',
}
const PILAR_SHORT: Record<string, string> = {
  conversao: 'Conversão', desconto: 'Desconto', recorrencia: 'Recorrência',
  cmv: 'CMV',
}

function GrupoSection({
  data,
  onVerLoja,
}: {
  data: GrupoIndexResponse
  onVerLoja: (uuid: string) => void
}) {
  const sorted = [...data.lojas].sort((a, b) => a.index.score - b.index.score)

  const dist = { excelente: 0, saudavel: 0, atencao: 0, critico: 0 } as Record<BuyHelpIndexClassificacao, number>
  data.lojas.forEach(l => dist[l.index.classificacao]++)

  const chartData = sorted.map(l => ({
    nome: l.credenciado.nome,
    score: l.index.score,
    classificacao: l.index.classificacao,
  }))

  const clsGrupo  = CLS_COR[data.classificacao_grupo]
  const deltaPos  = data.delta_grupo >= 0
  const deltaColor = deltaPos ? '#4ade80' : '#f87171'

  return (
    <div>
      {/* Top row */}
      <div className="grid grid-cols-5 gap-5 mb-5">

        {/* Aggregate score card */}
        <div className="col-span-2 card-bh p-6 flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'rgb(var(--bh-subtle))'}}>
              Score Consolidado do Grupo
            </p>
            <h2 className="text-bh-text text-lg font-bold leading-tight">{data.grupo.nome}</h2>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-7xl font-black leading-none" style={{color: clsGrupo}}>
              {data.score_grupo}
            </span>
            <div className="mb-2 flex flex-col gap-1.5">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                style={{background:`${clsGrupo}22`, color: clsGrupo}}>
                {CLS_LABEL[data.classificacao_grupo]}
              </span>
              <div className="flex items-center gap-1">
                {deltaPos ? <TrendingUp size={13} style={{color:deltaColor}}/> : <TrendingDown size={13} style={{color:deltaColor}}/>}
                <span className="text-xs font-bold" style={{color:deltaColor}}>
                  {deltaPos?'+':''}{data.delta_grupo.toFixed(1)} pts
                </span>
                <span className="text-[10px]" style={{color:'rgb(var(--bh-subtle))'}}>vs anterior</span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{color:'rgb(var(--bh-subtle))'}}>
              Distribuição por Classificação · {data.lojas.length} lojas
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(['excelente','saudavel','atencao','critico'] as BuyHelpIndexClassificacao[]).map(cls => (
                <div key={cls}
                  className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{background:`${CLS_COR[cls]}12`, border:`1px solid ${CLS_COR[cls]}25`}}>
                  <span className="text-[10px] font-semibold" style={{color:CLS_COR[cls]}}>{CLS_LABEL[cls]}</span>
                  <span className="text-xl font-black" style={{color: dist[cls] > 0 ? CLS_COR[cls] : 'rgb(var(--bh-border))'}}>
                    {dist[cls]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ranking chart */}
        <div className="col-span-3 card-bh p-5 flex flex-col">
          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'rgb(var(--bh-subtle))'}}>
              Ranking Visual · Pior → Melhor
            </p>
            <p className="text-bh-text text-base font-bold">Score por Loja</p>
          </div>
          <div style={{flex:1, minHeight:180}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{top:4, right:52, left:0, bottom:0}}
                barCategoryGap="30%"
              >
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" horizontal={false}/>
                <XAxis type="number" domain={[0,100]} tick={{fill:'rgb(var(--bh-subtle))',fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="nome" width={170}
                  tick={{fill:'rgb(var(--bh-muted))',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip
                  cursor={{fill:'rgba(255,255,255,0.03)'}}
                  contentStyle={{background:'rgb(var(--bh-surface))',border:'1px solid #222',borderRadius:8,fontSize:12,color:'rgb(var(--bh-border))'}}
                  formatter={(v) => [`${v}/100`, 'Score']}/>
                <ReferenceLine
                  x={data.score_grupo}
                  stroke="rgb(var(--bh-subtle))"
                  strokeDasharray="4 4"
                  label={{value:`Média: ${data.score_grupo}`, fill:'rgb(var(--bh-subtle))', fontSize:9, position:'insideTopRight'}}
                />
                <Bar dataKey="score" radius={[0,4,4,0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={CLS_COR[entry.classificacao as BuyHelpIndexClassificacao]}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Store ranking cards */}
      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'rgb(var(--bh-subtle))'}}>
          Análise Detalhada · Pior para Melhor
        </p>
        <h2 className="text-bh-text text-base font-bold">Performance Individual das Lojas</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {sorted.map((loja, idx) => {
          const cls       = loja.index.classificacao
          const clsCor    = CLS_COR[cls]
          const isAlert   = cls === 'critico' || cls === 'atencao'
          const dPos      = loja.index.delta_periodo_anterior > 0
          const dZero     = loja.index.delta_periodo_anterior === 0
          const dColor    = dZero ? '#6b7280' : dPos ? '#4ade80' : '#f87171'

          return (
            <div key={loja.credenciado.uuid}
              className="card-bh p-5 flex flex-col gap-4"
              style={isAlert ? {borderColor:`${clsCor}40`} : undefined}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    {idx === 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest"
                        style={{background:`${clsCor}22`, color:clsCor}}>
                        Maior impacto negativo
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-bh-text leading-tight">{loja.credenciado.nome}</p>
                  <p className="text-[10px] mt-0.5" style={{color:'rgb(var(--bh-subtle))'}}>{loja.credenciado.cnpj}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0"
                  style={{background:`${clsCor}18`, color:clsCor}}>
                  {CLS_LABEL[cls]}
                </span>
              </div>

              {/* Score + delta */}
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-5xl font-black leading-none" style={{color: clsCor}}>
                    {loja.index.score}
                  </span>
                  <span className="text-sm ml-1.5" style={{color:'rgb(var(--bh-subtle))'}}>/100</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {dPos  && <TrendingUp   size={12} style={{color:dColor}}/>}
                  {!dPos && !dZero && <TrendingDown size={12} style={{color:dColor}}/>}
                  {dZero && <Minus        size={12} style={{color:dColor}}/>}
                  <span className="text-xs font-bold" style={{color:dColor}}>
                    {dPos?'+':''}{loja.index.delta_periodo_anterior.toFixed(1)} pts
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{background:'rgb(var(--bh-surface2))'}}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{width:`${loja.index.score}%`, background:clsCor}}/>
              </div>

              {/* Pilar mini bars */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{color:'rgb(var(--bh-subtle))'}}>
                  Pilares — pontos fracos destacados
                </p>
                {PILARES_DEF.map(pilar => {
                  const s      = loja.pilares[pilar.key].score ?? 0
                  const isWeak = s < 50
                  return (
                    <div key={pilar.key} className="flex items-center gap-2">
                      <span className="text-[10px] w-20 flex-shrink-0 truncate font-medium"
                        style={{color: isWeak ? '#f87171' : 'rgb(var(--bh-subtle))'}}>
                        {PILAR_SHORT[pilar.key]}
                      </span>
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{background:'rgb(var(--bh-surface2))'}}>
                        <div className="h-full rounded-full"
                          style={{width:`${s}%`, background: isWeak ? '#f87171' : pilar.cor}}/>
                      </div>
                      <span className="text-[10px] font-bold w-6 text-right flex-shrink-0"
                        style={{color: isWeak ? '#f87171' : 'rgb(var(--bh-subtle))'}}>
                        {s}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Button */}
              <button
                onClick={() => onVerLoja(loja.credenciado.uuid)}
                className="w-full py-2 rounded-lg border text-xs font-semibold transition-colors hover:border-orange-500/40 hover:text-orange-400 hover:bg-orange-500/5"
                style={{color:'rgb(var(--bh-subtle))', borderColor: isAlert ? `${clsCor}30` : 'rgba(255,255,255,0.07)'}}
              >
                Ver BuyHelp Index individual →
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Composição View ─────────────────────────────────────────────────────────

const COMPOSICAO_PILARES = [
  {
    key: 'conversao',
    label: 'Conversão\nBuyHelp × Loja',
    peso: 30,
    cor: '#0F6E56',
    bg: 'rgba(15,110,86,0.85)',
    indicadores: [
      { nome: 'Total de Vendas',        descricao: 'Valor total de vendas realizadas pela loja no período analisado.' },
      { nome: 'Total de Intermediações',descricao: 'Valor total das vendas intermediadas pela plataforma BuyHelp no período.' },
      { nome: 'Conversão',              descricao: 'Percentual das vendas da loja intermediadas pela plataforma BuyHelp.' },
    ],
  },
  {
    key: 'desconto',
    label: 'Conversão\nde Desconto',
    peso: 25,
    cor: '#EF9F27',
    bg: 'rgba(180,110,0,0.85)',
    indicadores: [
      { nome: 'Taxa de Conversão',   descricao: 'Percentual de ofertas de desconto que resultaram em transação efetiva.' },
      { nome: 'Eficiência do Desconto', descricao: 'Relação entre o desconto médio concedido e a receita líquida gerada.' },
      { nome: 'Descontos Utilizados', descricao: 'Volume de cupons e ofertas efetivamente resgatados pelos consumidores.' },
    ],
  },
  {
    key: 'recorrencia',
    label: 'Recorrência\nde Clientes',
    peso: 30,
    cor: '#378ADD',
    bg: 'rgba(30,80,160,0.85)',
    indicadores: [
      { nome: 'Taxa de Recompra',    descricao: 'Percentual de clientes que realizaram mais de uma compra no período.' },
      { nome: 'Intervalo de Compra', descricao: 'Tempo médio em dias entre compras consecutivas do mesmo cliente.' },
      { nome: 'Retenção de Base',    descricao: 'Percentual de clientes do período anterior que retornaram à plataforma.' },
    ],
  },
  {
    key: 'cmv',
    label: 'CMV',
    peso: 15,
    cor: '#7F77DD',
    bg: 'rgba(80,60,180,0.85)',
    indicadores: [
      { nome: 'CMV sobre Vendas',       descricao: 'Percentual que o Custo das Mercadorias Vendidas representa sobre o total de vendas no período.' },
      { nome: 'Benchmark do Grupo',     descricao: 'Posição do CMV da loja em relação à média do grupo econômico comparável.' },
      { nome: 'Evolução do CMV',        descricao: 'Variação percentual do CMV em relação ao período anterior — queda indica melhora de eficiência.' },
    ],
  },
]

function ComposicaoView({ onBack }: { onBack: () => void }) {
  const totalIndicadores = COMPOSICAO_PILARES.reduce((s, p) => s + p.indicadores.length, 0)

  return (
    <div>
      {/* Nav */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-bh-border text-bh-muted hover:text-bh-text hover:border-bh-border/60 text-xs font-medium transition-colors"
        >
          <ArrowLeft size={13}/> Voltar
        </button>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{color:'rgb(var(--bh-subtle))'}}>
            Composição do Índice
          </p>
          <h2 className="text-bh-text text-lg font-bold leading-tight">
            BuyHelp Index — Metodologia e Indicadores
          </h2>
        </div>
      </div>

      {/* Stats header */}
      <div className="card-bh px-6 py-5 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xl font-black tracking-tight text-bh-text">BUYHELP INDEX</p>
          <p className="text-xs uppercase tracking-widest mt-0.5" style={{color:'rgb(var(--bh-subtle))'}}>
            Índice de Saúde Comercial de Credenciados
          </p>
        </div>
        <div className="flex items-center gap-8">
          {[
            { label: 'Pilares', value: COMPOSICAO_PILARES.length },
            { label: 'Indicadores', value: totalIndicadores },
          ].map(s => (
            <div key={s.label} className="text-right">
              <p className="text-3xl font-black leading-none" style={{color:'#ff6600'}}>{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest mt-1" style={{color:'rgb(var(--bh-subtle))'}}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-bh overflow-hidden mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{background:'rgba(255,255,255,0.04)', borderBottom:'2px solid rgba(255,255,255,0.07)'}}>
              {[
                { label: 'Pilar',          w: 154 },
                { label: 'Peso no Índice', w: 120 },
                { label: 'Indicador',      w: 220 },
                { label: 'Descrição',      w: undefined },
              ].map(h => (
                <th key={h.label}
                  className="text-left px-5 py-3"
                  style={{width: h.w, color:'rgb(var(--bh-subtle))', fontWeight:700, fontSize:10,
                    textTransform:'uppercase', letterSpacing:'0.08em'}}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPOSICAO_PILARES.map((pilar, pi) => (
              pilar.indicadores.map((ind, ii) => {
                const lastInPilar  = ii === pilar.indicadores.length - 1
                const lastPilar    = pi === COMPOSICAO_PILARES.length - 1
                return (
                  <tr
                    key={`${pilar.key}-${ii}`}
                    style={{
                      borderBottom: lastInPilar && !lastPilar
                        ? '2px solid rgba(255,255,255,0.07)'
                        : lastInPilar && lastPilar
                          ? 'none'
                          : '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    {/* PILAR cell — true rowSpan */}
                    {ii === 0 && (
                      <td
                        rowSpan={pilar.indicadores.length}
                        style={{
                          background: pilar.bg,
                          verticalAlign: 'middle',
                          textAlign: 'center',
                          padding: '18px 12px',
                          borderRight: '2px solid rgba(0,0,0,0.25)',
                          minWidth: 154,
                        }}
                      >
                        <span className="block text-[9px] font-bold uppercase tracking-widest mb-1"
                          style={{color:'rgba(255,255,255,0.5)'}}>
                          Pilar {pi + 1}
                        </span>
                        <span className="block text-[11px] font-black uppercase tracking-wide leading-snug whitespace-pre-line"
                          style={{color:'#fff'}}>
                          {pilar.label}
                        </span>
                      </td>
                    )}

                    {/* PESO cell — true rowSpan */}
                    {ii === 0 && (
                      <td
                        rowSpan={pilar.indicadores.length}
                        style={{
                          verticalAlign: 'middle',
                          textAlign: 'center',
                          padding: '18px 12px',
                          borderRight: '1px solid rgba(255,255,255,0.05)',
                          background: 'rgba(255,255,255,0.01)',
                          minWidth: 120,
                        }}
                      >
                        <span className="text-3xl font-black leading-none" style={{color: pilar.cor}}>
                          {pilar.peso}%
                        </span>
                      </td>
                    )}

                    {/* INDICADOR */}
                    <td className="px-5 py-4" style={{borderRight:'1px solid rgba(255,255,255,0.04)'}}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background: pilar.cor}}/>
                        <span className="text-sm font-semibold" style={{color:'#d1d5db'}}>{ind.nome}</span>
                      </div>
                    </td>

                    {/* DESCRIÇÃO */}
                    <td className="px-5 py-4">
                      <span className="text-sm leading-relaxed" style={{color:'rgb(var(--bh-muted))'}}>{ind.descricao}</span>
                    </td>
                  </tr>
                )
              })
            ))}
          </tbody>
        </table>
      </div>

      {/* Classification legend */}
      <div className="card-bh px-6 py-4 flex items-center gap-8 flex-wrap">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{color:'rgb(var(--bh-subtle))'}}>
          Classificação por Score
        </p>
        {FAIXAS.map(f => (
          <div key={f.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background: f.cor}}/>
            <span className="text-sm font-bold" style={{color: f.cor}}>{f.range}</span>
            <span className="text-xs font-medium" style={{color:'rgb(var(--bh-subtle))'}}>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Dashboard() {
  const [view, setView] = useState<'main' | 'composicao' | 'config'>('main')
  const { modo, setModo, credenciadoUuid, setCredenciadoUuid, grupoUuid } = useLojaGrupo()
  const [grupoData, setGrupoData]   = useState<GrupoIndexResponse | null>(null)
  const [grupoLoading, setGrupoLoading] = useState(false)

  const {
    data, loading,
    dataInicio, setDataInicio,
    dataFim, setDataFim,
    refetch,
  } = useBuyHelpIndex(credenciadoUuid)

  function loadGrupo(uuid: string, inicio: string, fim: string) {
    setGrupoLoading(true)
    fetchGrupoIndex(uuid, inicio, fim).then(d => {
      setGrupoData(d)
      setGrupoLoading(false)
    })
  }

  useEffect(() => {
    if (modo === 'grupo') loadGrupo(grupoUuid, dataInicio, dataFim)
  }, [modo, grupoUuid, dataInicio, dataFim])

  function handleVerLoja(uuid: string) {
    setCredenciadoUuid(uuid)
    setModo('loja')
    setView('main')
  }

  const isLoading = modo === 'grupo' ? grupoLoading : loading

  return (
    <AppLayout title="" subtitle="" breadcrumb="">
      <TabNav />

      {/* ── Filter bar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'rgb(var(--bh-subtle))'}}>
              Saúde Comercial
            </p>
            <h1 className="text-bh-text text-xl font-bold">BuyHelp Index</h1>
          </div>
          <button
            onClick={() => setView('composicao')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-bh-border text-xs font-medium transition-colors hover:border-orange-500/40 hover:text-orange-400 mt-1"
            style={{color:'rgb(var(--bh-subtle))'}}
          >
            <BookOpen size={12}/> Metodologia
          </button>
          <button
            onClick={() => setView('config')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-bh-border text-xs font-medium transition-colors hover:border-orange-500/40 hover:text-orange-400 mt-1"
            style={{color:'rgb(var(--bh-subtle))'}}
          >
            <Settings2 size={12}/> Configuração
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <MonthPicker
            dataInicio={dataInicio}
            onChange={(inicio, fim) => { setDataInicio(inicio); setDataFim(fim) }}
          />

          <button
            onClick={modo === 'grupo' ? () => loadGrupo(grupoUuid, dataInicio, dataFim) : refetch}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{background:'#ff6600',color:'#fff',opacity:isLoading?0.6:1,cursor:isLoading?'not-allowed':'pointer'}}
          >
            <RefreshCw size={14} className={isLoading?'animate-spin':''}/>
            Atualizar
          </button>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      {view === 'config'
        ? <ConfiguracaoIndexView onBack={() => setView('main')} />
        : view === 'composicao'
        ? <ComposicaoView onBack={() => setView('main')} />
        : modo === 'grupo'
          ? grupoLoading || !grupoData
            ? <SkeletonLayout />
            : <GrupoSection data={grupoData} onVerLoja={handleVerLoja} />
          : loading || !data
            ? <SkeletonLayout />
            : <>
                <OverviewSection data={data} />
                <PilaresSection data={data} />
              </>
      }
    </AppLayout>
  )
}
