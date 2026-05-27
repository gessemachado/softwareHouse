import { useEffect, useRef, useState } from 'react'
import type { BuyHelpIndexClassificacao } from '../../types/buyhelp-index.types'

const W = 240, H = 148
const CX = 120, CY = 138
const R_OUT = 108, R_IN = 74

const CLS_MAP: Record<BuyHelpIndexClassificacao, { label: string; cor: string; bg: string }> = {
  excelente: { label: 'Excelente', cor: '#639922', bg: 'rgba(99,153,34,0.18)'  },
  saudavel:  { label: 'Saudável',  cor: '#22c9a0', bg: 'rgba(34,201,160,0.18)' },
  atencao:   { label: 'Atenção',   cor: '#EF9F27', bg: 'rgba(239,159,39,0.18)' },
  critico:   { label: 'Crítico',   cor: '#E24B4A', bg: 'rgba(226,75,74,0.18)'  },
}

// angle: score 0 → 180° (left), score 100 → 360° (right), through top at 270°
function scoreToRad(score: number) {
  return (180 + (score / 100) * 180) * (Math.PI / 180)
}

function arcPoint(angleDeg: number, r: number) {
  const a = angleDeg * (Math.PI / 180)
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

function segPath(s0: number, s1: number, rOut = R_OUT, rIn = R_IN) {
  const a0 = 180 + (s0 / 100) * 180
  const a1 = 180 + (s1 / 100) * 180
  const span = a1 - a0
  const large = span > 180 ? 1 : 0
  const oo = arcPoint(a0, rOut), oe = arcPoint(a1, rOut)
  const io = arcPoint(a0, rIn),  ie = arcPoint(a1, rIn)
  return [
    `M ${oo.x.toFixed(2)} ${oo.y.toFixed(2)}`,
    `A ${rOut} ${rOut} 0 ${large} 1 ${oe.x.toFixed(2)} ${oe.y.toFixed(2)}`,
    `L ${ie.x.toFixed(2)} ${ie.y.toFixed(2)}`,
    `A ${rIn} ${rIn} 0 ${large} 0 ${io.x.toFixed(2)} ${io.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

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
    const dur = 1000
    const animate = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayed(Math.round(eased * score))
      if (t < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score])

  const needleA = scoreToRad(displayed)
  const needleTipR = R_IN - 6
  const nx = CX + needleTipR * Math.cos(needleA)
  const ny = CY + needleTipR * Math.sin(needleA)

  // Marker dot on outer rim
  const markerX = CX + (R_OUT + 7) * Math.cos(needleA)
  const markerY = CY + (R_OUT + 7) * Math.sin(needleA)

  const deltaPos = delta >= 0
  const corDelta = deltaPos ? '#4ade80' : '#f87171'

  return (
    <div
      className={`flex flex-col items-center ${onClick ? 'cursor-pointer select-none' : ''}`}
      onClick={onClick}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: 280, display: 'block' }}
      >
        {/* Track background */}
        <path d={segPath(0, 100)} fill="#1c1c1c" />

        {/* Faixa: Crítico 0-39 */}
        <path d={segPath(0, 39)} fill="#E24B4A" opacity="0.85" />
        {/* Faixa: Atenção 40-59 */}
        <path d={segPath(40, 59)} fill="#EF9F27" opacity="0.85" />
        {/* Faixa: Saudável 60-79 */}
        <path d={segPath(60, 79)} fill="#22c9a0" opacity="0.85" />
        {/* Faixa: Excelente 80-100 */}
        <path d={segPath(80, 100)} fill="#639922" opacity="0.85" />

        {/* Tiny gaps between segments */}
        <path d={segPath(39, 40)} fill="#000" />
        <path d={segPath(59, 60)} fill="#000" />
        <path d={segPath(79, 80)} fill="#000" />

        {/* Needle */}
        <line
          x1={CX} y1={CY}
          x2={nx.toFixed(2)} y2={ny.toFixed(2)}
          stroke={cls.cor} strokeWidth="3" strokeLinecap="round"
        />

        {/* Center circle */}
        <circle cx={CX} cy={CY} r={11} fill="#000" stroke={cls.cor} strokeWidth="2.5" />
        <circle cx={CX} cy={CY} r={5} fill={cls.cor} />

        {/* Marker dot on outer rim */}
        <circle cx={markerX.toFixed(2)} cy={markerY.toFixed(2)} r={5} fill={cls.cor} />

        {/* Score number */}
        <text
          x={CX} y={CY - 24}
          textAnchor="middle"
          fill={cls.cor}
          fontSize="44"
          fontWeight="900"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {displayed}
        </text>
        <text
          x={CX} y={CY - 8}
          textAnchor="middle"
          fill="#555"
          fontSize="11"
          fontFamily="Inter, system-ui, sans-serif"
        >
          de 0 a 100
        </text>
      </svg>

      {/* Classification badge */}
      <span
        className="px-4 py-1 rounded-full text-sm font-bold mt-1"
        style={{ background: cls.bg, color: cls.cor }}
      >
        {cls.label}
      </span>

      {/* Delta */}
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-lg font-bold" style={{ color: corDelta }}>
          {deltaPos ? '↑' : '↓'} {Math.abs(delta).toFixed(1)} pts
        </span>
        <span className="text-xs" style={{ color: '#666' }}>vs período anterior</span>
      </div>

      {/* Click hint */}
      {onClick && (
        <p className="text-[10px] mt-2 font-medium uppercase tracking-widest" style={{ color: '#666' }}>
          Clique para ver detalhes
        </p>
      )}
    </div>
  )
}
