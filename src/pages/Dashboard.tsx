import { useState, useRef, useEffect } from 'react'
import {
  RefreshCw, Store, Calendar, ChevronDown, ChevronLeft as ChevLeft, ChevronRight as ChevRight,
  ArrowLeft, TrendingUp, TrendingDown, Minus, BookOpen,
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
import { CREDENCIADOS_MOCK, PILARES_DEF } from '../mocks/buyhelp-index.mock'
import type { BuyHelpIndexResponse } from '../types/buyhelp-index.types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FAIXAS = [
  { label: 'Excelente', range: '80 – 100', cor: '#639922', bg: 'rgba(99,153,34,0.15)' },
  { label: 'Saudável',  range: '60 – 79',  cor: '#22c9a0', bg: 'rgba(34,201,160,0.15)' },
  { label: 'Atenção',   range: '40 – 59',  cor: '#EF9F27', bg: 'rgba(239,159,39,0.15)' },
  { label: 'Crítico',   range: '0 – 39',   cor: '#E24B4A', bg: 'rgba(226,75,74,0.15)'  },
]

function fmtMes(mes: string) {
  const [ano, m] = mes.split('-')
  const nomes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${nomes[parseInt(m) - 1]}/${ano.slice(2)}`
}

function TendIcon({ delta }: { delta: number }) {
  if (delta > 0) return <TrendingUp size={14} style={{ color: '#4ade80' }} />
  if (delta < 0) return <TrendingDown size={14} style={{ color: '#f87171' }} />
  return <Minus size={14} style={{ color: '#6b7280' }} />
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
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-bh-border bg-black text-sm transition-colors hover:border-orange-500/50">
        <Calendar size={14} className="text-orange-500 flex-shrink-0"/>
        <span className={dataInicio ? 'text-bh-text' : 'text-bh-muted'}>{label}</span>
        <ChevronDown size={12} className={`text-bh-muted transition-transform ${open ? 'rotate-180' : ''}`}/>
      </button>
      {open && (
        <div className="absolute z-30 top-full mt-2 right-0 rounded-xl shadow-2xl border border-orange-500/30 p-4 w-56"
          style={{background:'#000'}}>
          {/* Year nav */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setCalYear(y => y - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#999] hover:text-white transition-colors">
              <ChevLeft size={16}/>
            </button>
            <span className="text-white font-semibold text-sm">{calYear}</span>
            <button onClick={() => setCalYear(y => y + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#999] hover:text-white transition-colors">
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
  return <div className={`rounded animate-pulse ${className}`} style={{background:'#1a1a1a'}}/>
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
    'Ticket Médio': h.ticket_medio,
    Margem:    h.margem,
  }))
  const PILAR_KEYS = [
    { key: 'Conversão',    cor: PILARES_DEF[0].cor },
    { key: 'Desconto',     cor: PILARES_DEF[1].cor },
    { key: 'Recorrência',  cor: PILARES_DEF[2].cor },
    { key: 'Ticket Médio', cor: PILARES_DEF[3].cor },
    { key: 'Margem',       cor: PILARES_DEF[4].cor },
  ]

  return (
    <div className="grid grid-cols-5 gap-5 mb-5">

      {/* Gauge + faixas */}
      <div className="col-span-2 card-bh p-6 flex flex-col">
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'#555'}}>
            Índice de Saúde Comercial
          </p>
          <h2 className="text-white text-lg font-bold">BuyHelp Index</h2>
        </div>

        <div className="flex-1 flex items-center justify-center py-2">
          <ScoreGaugeSVG
            score={data.index.score}
            classificacao={data.index.classificacao}
            delta={data.index.delta_periodo_anterior}
          />
        </div>

        {(() => {
          const pos = data.index.delta_periodo_anterior >= 0
          return (
            <div className="mt-3 px-3 py-2.5 rounded-lg border"
              style={{
                background: pos ? 'rgba(74,222,128,0.05)' : 'rgba(248,113,113,0.05)',
                borderColor: pos ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
              }}>
              <p className="text-xs font-medium" style={{color: pos ? '#4ade80' : '#f87171'}}>
                {pos ? '↗ O negócio está em trajetória de melhoria.' : '↘ O negócio requer atenção especial neste período.'}
              </p>
            </div>
          )
        })()}

        <div className="mt-4 space-y-2">
          <p className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{color:'#444'}}>
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
              <span className="text-xs font-mono" style={{color:'#666'}}>{f.range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gráficos de evolução */}
      <div className="col-span-3 flex flex-col gap-4">

        {/* Evolução mensal */}
        <div className="card-bh p-5 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'#555'}}>
            Evolução Mensal do BuyHelp Index
          </p>
          <p className="text-xs font-medium text-bh-text mb-3">Score ao longo do tempo</p>
          <div style={{height:130}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evoData} margin={{top:4,right:8,left:-16,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e"/>
                <XAxis dataKey="mes" tick={{fill:'#555',fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,100]} tick={{fill:'#555',fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:'#0a0a0a',border:'1px solid #222',borderRadius:8,fontSize:12,color:'#ccc'}}/>
                <ReferenceLine y={80} stroke="#639922" strokeDasharray="4 4" strokeOpacity={0.4}/>
                <ReferenceLine y={60} stroke="#22c9a0" strokeDasharray="4 4" strokeOpacity={0.4}/>
                <ReferenceLine y={40} stroke="#EF9F27" strokeDasharray="4 4" strokeOpacity={0.4}/>
                <Line type="monotone" dataKey="score" stroke={cls.cor} strokeWidth={2.5}
                  dot={{fill:cls.cor,stroke:'#000',strokeWidth:2,r:4}}
                  activeDot={{r:6,fill:cls.cor,stroke:'#000',strokeWidth:2}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolução por pilar */}
        <div className="card-bh p-5 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'#555'}}>
            Evolução por Pilar
          </p>
          <div className="flex flex-wrap gap-3 mb-3 mt-1">
            {PILAR_KEYS.map(pk => (
              <div key={pk.key} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{background:pk.cor}}/>
                <span className="text-[10px]" style={{color:'#888'}}>{pk.key}</span>
              </div>
            ))}
          </div>
          <div style={{height:130}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pilarEvoData} margin={{top:4,right:16,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a"/>
                <XAxis dataKey="mes" tick={{fill:'#555',fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,100]} tick={{fill:'#555',fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:'#0a0a0a',border:'1px solid #222',borderRadius:8,fontSize:11,color:'#ccc'}}/>
                {PILAR_KEYS.map(pk => (
                  <Line key={pk.key} type="monotone" dataKey={pk.key}
                    stroke={pk.cor} strokeWidth={2} dot={false}
                    activeDot={{r:4,fill:pk.cor,stroke:'#000',strokeWidth:1}}/>
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
        className="w-full rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        style={{background:'#0d0d0d', maxWidth:'92vw', height:'88vh', maxHeight:'88vh'}}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-7 pb-5 shrink-0">
          <div>
            <h2 className="text-white text-2xl font-bold leading-tight">
              {pilar.label} — Últimos {historico.length} Meses
            </h2>
            <p className="text-xs mt-1" style={{color:'#555'}}>
              {historico[0]?.mes} → {historico[historico.length - 1]?.mes} · Evolução mensal do score por período
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-[#555] hover:text-white hover:border-white/20 transition-colors mt-1 shrink-0">
            <X size={15}/>
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4 px-8 pb-6 shrink-0">
          {kpis.map(k => (
            <div key={k.label} className="rounded-xl border border-white/5 px-6 py-5"
              style={{background:'rgba(255,255,255,0.02)'}}>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{color:'#555'}}>{k.label}</p>
              <p className="leading-none mb-2">
                <span className="text-4xl font-black" style={{color: k.color}}>{k.value}</span>
                <span className="text-lg font-bold ml-1" style={{color:'rgba(255,255,255,0.2)'}}>{k.suffix}</span>
              </p>
              <p className="text-[10px]" style={{color:'#555'}}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 px-8 pb-8 flex flex-col" style={{minHeight:0}}>
          {/* Legend */}
          <div className="flex items-center gap-5 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{background: pilar.cor}}/>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{color:'#888'}}>Acima da Média</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{background: BELOW_COLOR, border:'1px solid #555'}}/>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{color:'#888'}}>Abaixo da Média</span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{width:20, borderTop:`2px dashed ${pilar.cor}`, opacity:0.7}}/>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{color:'#888'}}>
                Média ({media} pts)
              </span>
            </div>
            <div className="ml-auto text-[10px]" style={{color:'#555'}}>
              Pico: {pico}/100 &nbsp;|&nbsp; Mínimo: {minScore}/100
            </div>
          </div>

          <div style={{flex:1, minHeight:240}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historico} margin={{top:4,right:56,bottom:0,left:0}} barCategoryGap="28%">
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false}/>
                <XAxis dataKey="mes" tick={{fill:'#666',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,100]} tick={{fill:'#555',fontSize:11}} axisLine={false} tickLine={false} width={32}
                  tickFormatter={v => `${v}`}/>
                <Tooltip
                  cursor={{fill:'rgba(255,255,255,0.03)'}}
                  contentStyle={{background:'#0a0a0a',border:'1px solid #222',borderRadius:8,fontSize:12,color:'#ccc'}}
                  formatter={(v: number) => [`${v}/100`, 'Score']}/>
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

function PilaresSection({ data }: { data: BuyHelpIndexResponse }) {
  const [modalPilar, setModalPilar] = useState<string | null>(null)

  const pilarAtivo = modalPilar ? PILARES_DEF.find(p => p.key === modalPilar) : null
  const pilarScore = modalPilar ? data.pilares[modalPilar] : null
  const pilarHist  = modalPilar
    ? data.historico_pilares.map(h => ({
        mes: fmtMes(h.mes),
        score: (h as Record<string, number>)[modalPilar] ?? 0,
      }))
    : []

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

      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'#555'}}>
          Composição do Índice
        </p>
        <h2 className="text-white text-base font-bold">Pilares de Desempenho</h2>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {PILARES_DEF.map(pilar => {
          const p = data.pilares[pilar.key]
          const score = p.score ?? 0
          const Icon = ICONE_MAP[pilar.icone] ?? TrendingUp
          const deltaPos  = p.delta > 0
          const deltaZero = p.delta === 0
          const deltaColor = deltaZero ? '#6b7280' : deltaPos ? '#4ade80' : '#f87171'

          return (
            <div key={pilar.key} className="card-bh p-5 flex flex-col gap-4">
              {/* Topo: label + ícone */}
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-snug" style={{color:'#9ca3af'}}>
                  {pilar.label}
                </p>
                <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{background:`${pilar.cor}22`}}>
                  <Icon size={17} color={pilar.cor}/>
                </div>
              </div>

              {/* Valor principal */}
              <div>
                <span className="text-4xl font-black tabular-nums leading-none" style={{color:'#f9fafb'}}>
                  {score}
                </span>
                <span className="text-sm font-normal ml-1.5" style={{color:'#555'}}>/100</span>
              </div>

              {/* Barra de progresso */}
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{background:'#1a1a1a'}}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{width:`${score}%`, background:pilar.cor}}/>
              </div>

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
                  onClick={() => setModalPilar(pilar.key)}
                  className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[10px] font-semibold transition-colors hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5"
                  style={{color:'#555'}}
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

// ─── Composição View ─────────────────────────────────────────────────────────

const COMPOSICAO_PILARES = [
  {
    key: 'conversao',
    label: 'Conversão\nBuyHelp × Loja',
    peso: 25,
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
    peso: 20,
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
    peso: 25,
    cor: '#378ADD',
    bg: 'rgba(30,80,160,0.85)',
    indicadores: [
      { nome: 'Taxa de Recompra',    descricao: 'Percentual de clientes que realizaram mais de uma compra no período.' },
      { nome: 'Intervalo de Compra', descricao: 'Tempo médio em dias entre compras consecutivas do mesmo cliente.' },
      { nome: 'Retenção de Base',    descricao: 'Percentual de clientes do período anterior que retornaram à plataforma.' },
    ],
  },
  {
    key: 'ticket_medio',
    label: 'Ticket\nMédio',
    peso: 15,
    cor: '#7F77DD',
    bg: 'rgba(80,60,180,0.85)',
    indicadores: [
      { nome: 'Ticket Médio BuyHelp', descricao: 'Valor médio por cesta nas compras realizadas via plataforma BuyHelp.' },
      { nome: 'Benchmark do Grupo',   descricao: 'Posição do ticket em relação à média do grupo econômico comparável.' },
      { nome: 'Evolução do Ticket',   descricao: 'Variação percentual do ticket médio em relação ao período anterior.' },
    ],
  },
  {
    key: 'margem',
    label: 'Margem de\nContribuição',
    peso: 15,
    cor: '#97C459',
    bg: 'rgba(70,110,20,0.85)',
    indicadores: [
      { nome: 'Margem Líquida BuyHelp', descricao: 'Percentual de margem gerada nas vendas intermediadas pela plataforma.' },
      { nome: 'Contribuição Absoluta',  descricao: 'Valor líquido total gerado pela operação BuyHelp no período.' },
      { nome: 'Comparativo Direto',     descricao: 'Margem das vendas BuyHelp versus margem de venda direta ao consumidor.' },
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-bh-border text-bh-muted hover:text-bh-text hover:border-white/20 text-xs font-medium transition-colors"
        >
          <ArrowLeft size={13}/> Voltar
        </button>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{color:'#555'}}>
            Composição do Índice
          </p>
          <h2 className="text-white text-lg font-bold leading-tight">
            BuyHelp Index — Metodologia e Indicadores
          </h2>
        </div>
      </div>

      {/* Stats header */}
      <div className="card-bh px-6 py-5 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xl font-black tracking-tight text-white">BUYHELP INDEX</p>
          <p className="text-xs uppercase tracking-widest mt-0.5" style={{color:'#555'}}>
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
              <p className="text-[10px] uppercase tracking-widest mt-1" style={{color:'#555'}}>{s.label}</p>
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
                  style={{width: h.w, color:'#555', fontWeight:700, fontSize:10,
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
                      <span className="text-sm leading-relaxed" style={{color:'#888'}}>{ind.descricao}</span>
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
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{color:'#444'}}>
          Classificação por Score
        </p>
        {FAIXAS.map(f => (
          <div key={f.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background: f.cor}}/>
            <span className="text-sm font-bold" style={{color: f.cor}}>{f.range}</span>
            <span className="text-xs font-medium" style={{color:'#555'}}>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Dashboard() {
  const [view, setView] = useState<'main' | 'composicao'>('main')
  const {
    data, loading,
    credenciadoUuid, setCredenciadoUuid,
    dataInicio, setDataInicio,
    dataFim, setDataFim,
    refetch,
  } = useBuyHelpIndex()

  return (
    <AppLayout title="" subtitle="" breadcrumb="">
      <TabNav />

      {/* ── Filter bar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{color:'#555'}}>
              Saúde Comercial
            </p>
            <h1 className="text-bh-text text-xl font-bold">BuyHelp Index</h1>
          </div>
          <button
            onClick={() => setView('composicao')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-bh-border text-xs font-medium transition-colors hover:border-orange-500/40 hover:text-orange-400 mt-1"
            style={{color:'#666'}}
          >
            <BookOpen size={12}/> Metodologia
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-bh-border bg-black text-sm">
            <Store size={14} className="text-bh-muted flex-shrink-0"/>
            <select
              value={credenciadoUuid}
              onChange={e => setCredenciadoUuid(e.target.value)}
              className="bg-transparent text-bh-text text-sm outline-none cursor-pointer"
            >
              {CREDENCIADOS_MOCK.map(c => (
                <option key={c.uuid} value={c.uuid} style={{background:'#0d0d0d'}}>
                  {c.nome} · {c.cnpj}
                </option>
              ))}
            </select>
          </div>

          <MonthPicker
            dataInicio={dataInicio}
            onChange={(inicio, fim) => { setDataInicio(inicio); setDataFim(fim) }}
          />

          <button
            onClick={refetch} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{background:'#ff6600',color:'#fff',opacity:loading?0.6:1,cursor:loading?'not-allowed':'pointer'}}
          >
            <RefreshCw size={14} className={loading?'animate-spin':''}/>
            Atualizar
          </button>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      {view === 'composicao'
        ? <ComposicaoView onBack={() => setView('main')} />
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
