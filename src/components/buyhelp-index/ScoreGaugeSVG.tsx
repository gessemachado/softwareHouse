import { useEffect, useRef, useState } from 'react'
import type { BuyHelpIndexClassificacao } from '../../types/buyhelp-index.types'

const W = 280, H = 172
const CX = 140, CY = 158
const R_TRACK = 110   // inner radius of color track
const TRACK_W = 26    // track thickness
const R_OUT = R_TRACK + TRACK_W
const R_IN  = R_TRACK
const R_PROGRESS = R_OUT + 10   // thin outer progress ring

const CLS_MAP: Record<BuyHelpIndexClassificacao, { label: string; cor: string; bg: string; glow: string }> = {
  excelente: { label: 'Excelente', cor: '#639922', bg: 'rgba(99,153,34,0.15)',   glow: 'rgba(99,153,34,0.4)'   },
  saudavel:  { label: 'Saudável',  cor: '#22c9a0', bg: 'rgba(34,201,160,0.15)', glow: 'rgba(34,201,160,0.4)'  },
  atencao:   { label: 'Atenção',   cor: '#EF9F27', bg: 'rgba(239,159,39,0.15)', glow: 'rgba(239,159,39,0.4)'  },
  critico:   { label: 'Crítico',   cor: '#E24B4A', bg: 'rgba(226,75,74,0.15)',  glow: 'rgba(226,75,74,0.4)'   },
}

function deg(score: number) { return 180 + (score / 100) * 180 }
function rad(score: number) { return deg(score) * (Math.PI / 180) }

function pt(angleDeg: number, r: number) {
  const a = angleDeg * (Math.PI / 180)
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

function arcPath(s0: number, s1: number, rOut = R_OUT, rIn = R_IN) {
  const a0 = deg(s0), a1 = deg(s1)
  const large = (a1 - a0) > 180 ? 1 : 0
  const oo = pt(a0, rOut), oe = pt(a1, rOut)
  const io = pt(a0, rIn),  ie = pt(a1, rIn)
  return [
    `M ${oo.x.toFixed(2)} ${oo.y.toFixed(2)}`,
    `A ${rOut} ${rOut} 0 ${large} 1 ${oe.x.toFixed(2)} ${oe.y.toFixed(2)}`,
    `L ${ie.x.toFixed(2)} ${ie.y.toFixed(2)}`,
    `A ${rIn} ${rIn} 0 ${large} 0 ${io.x.toFixed(2)} ${io.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

// Thin arc line (stroke-based, not fill)
function thinArc(s0: number, s1: number, r: number) {
  const a0 = deg(s0), a1 = deg(s1)
  const large = (a1 - a0) > 180 ? 1 : 0
  const p0 = pt(a0, r), p1 = pt(a1, r)
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`
}

const SEGMENTS = [
  { s0: 0,  s1: 39,  fill: '#E24B4A' },
  { s0: 40, s1: 59,  fill: '#EF9F27' },
  { s0: 60, s1: 79,  fill: '#22c9a0' },
  { s0: 80, s1: 100, fill: '#639922' },
]

const TICKS = [0, 40, 60, 80, 100]

interface Props {
  score: number
  classificacao: BuyHelpIndexClassificacao
  delta: number
  onClick?: () => void
}

export function ScoreGaugeSVG({ score, classificacao, delta, onClick }: Props) {
  const [displayed, setDisplayed] = useState(0)
  const rafRef = useRef<number>(0)
  const cls = CLS_MAP[classificacao]

  useEffect(() => {
    const start = performance.now()
    const dur = 1100
    const animate = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayed(Math.round(eased * score))
      if (t < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score])

  const needleRad = rad(displayed)
  const deltaPos  = delta >= 0
  const corDelta  = deltaPos ? '#4ade80' : '#f87171'

  // Outer progress dot
  const dotX = CX + R_PROGRESS * Math.cos(needleRad)
  const dotY = CY + R_PROGRESS * Math.sin(needleRad)

  // Needle tip (just inside track)
  const tipR = R_IN - 4
  const tipX = CX + tipR * Math.cos(needleRad)
  const tipY = CY + tipR * Math.sin(needleRad)

  return (
    <div
      className={`flex flex-col items-center ${onClick ? 'cursor-pointer select-none' : ''}`}
      onClick={onClick}
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 300, display: 'block', overflow: 'visible' }}>
        <defs>
          <filter id="glow-gauge" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-dot" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Track background ──────────────────────────────────── */}
        <path d={arcPath(0, 100)} fill="rgb(var(--bh-surface2))" />

        {/* ── Colored segments ─────────────────────────────────── */}
        {SEGMENTS.map(s => (
          <path key={s.s0} d={arcPath(s.s0, s.s1)} fill={s.fill} opacity="0.75" />
        ))}

        {/* ── Segment gap lines ─────────────────────────────────── */}
        {[39, 59, 79].map(v => (
          <path key={v} d={arcPath(v, v + 1)} fill="rgb(var(--bh-surface))" />
        ))}

        {/* ── Outer progress ring background ───────────────────── */}
        <path
          d={thinArc(0, 100, R_PROGRESS)}
          fill="none" stroke="rgb(var(--bh-border) / 0.25)" strokeWidth="5" strokeLinecap="round"
        />

        {/* ── Outer progress ring filled ────────────────────────── */}
        {displayed > 0 && (
          <path
            d={thinArc(0, displayed, R_PROGRESS)}
            fill="none" stroke={cls.cor} strokeWidth="5" strokeLinecap="round"
            filter="url(#glow-gauge)" opacity="0.9"
          />
        )}

        {/* ── Tick marks at segment boundaries ─────────────────── */}
        {TICKS.map(v => {
          const inner = pt(deg(v), R_IN - 7)
          const outer = pt(deg(v), R_OUT + 4)
          const labelPt = pt(deg(v), R_OUT + 20)
          // clamp label so 0 and 100 don't clip at edges
          const lx = Math.max(10, Math.min(W - 10, labelPt.x))
          const ly = Math.max(10, labelPt.y + 4)
          return (
            <g key={v}>
              <line
                x1={inner.x.toFixed(1)} y1={inner.y.toFixed(1)}
                x2={outer.x.toFixed(1)} y2={outer.y.toFixed(1)}
                stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"
              />
              <text
                x={lx.toFixed(1)} y={ly.toFixed(1)}
                textAnchor="middle" fill="rgb(var(--bh-subtle))" fontSize="9"
                fontFamily="Inter, system-ui, sans-serif" fontWeight="600"
              >
                {v}
              </text>
            </g>
          )
        })}

        {/* ── Needle ────────────────────────────────────────────── */}
        <line
          x1={CX} y1={CY}
          x2={tipX.toFixed(2)} y2={tipY.toFixed(2)}
          stroke={cls.cor} strokeWidth="2.5" strokeLinecap="round"
          opacity="0.9"
        />

        {/* ── Center hub ────────────────────────────────────────── */}
        <circle cx={CX} cy={CY} r={13} fill="rgb(var(--bh-surface))" stroke={cls.cor} strokeWidth="2" />
        <circle cx={CX} cy={CY} r={5.5} fill={cls.cor} />

        {/* ── Outer rim dot (glowing) ───────────────────────────── */}
        <circle cx={dotX.toFixed(2)} cy={dotY.toFixed(2)} r={6} fill={cls.cor} filter="url(#glow-dot)" />
        <circle cx={dotX.toFixed(2)} cy={dotY.toFixed(2)} r={3.5} fill="#fff" opacity="0.9" />

        {/* ── Score number ──────────────────────────────────────── */}
        <text
          x={CX} y={CY - 42}
          textAnchor="middle"
          fill={cls.cor}
          fontSize="56"
          fontWeight="900"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="-2"
        >
          {displayed}
        </text>
      </svg>

      {/* ── Badge ───────────────────────────────────────────────── */}
      <span
        className="px-4 py-1.5 rounded-full text-sm font-bold mt-3"
        style={{ background: cls.bg, color: cls.cor, border: `1px solid ${cls.cor}30` }}
      >
        {cls.label}
      </span>

      {/* ── Delta ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 mt-2.5">
        <span className="text-base font-bold" style={{ color: corDelta }}>
          {deltaPos ? '↑' : '↓'} {Math.abs(delta).toFixed(1)} pts
        </span>
        <span className="text-xs" style={{ color: 'rgb(var(--bh-subtle))' }}>vs período anterior</span>
      </div>

      {onClick && (
        <p className="text-[10px] mt-2 font-medium uppercase tracking-widest" style={{ color: 'rgb(var(--bh-subtle))' }}>
          Clique para ver detalhes
        </p>
      )}
    </div>
  )
}
