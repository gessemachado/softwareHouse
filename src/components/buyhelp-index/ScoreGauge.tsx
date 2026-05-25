import { useEffect, useRef, useState } from 'react'
import type { BuyHelpIndexClassificacao } from '../../types/buyhelp-index.types'

const FAIXAS = [
  { label: 'Excelente', range: '80 – 100', cor: '#639922', bg: 'rgba(99,153,34,0.15)' },
  { label: 'Saudável',  range: '60 – 79',  cor: '#0F6E56', bg: 'rgba(15,110,86,0.15)'  },
  { label: 'Atenção',   range: '40 – 59',  cor: '#EF9F27', bg: 'rgba(239,159,39,0.15)' },
  { label: 'Crítico',   range: '0 – 39',   cor: '#E24B4A', bg: 'rgba(226,75,74,0.15)'  },
]

const CLASSIFICACAO_MAP: Record<BuyHelpIndexClassificacao, { label: string; cor: string; bg: string }> = {
  excelente: { label: 'Excelente', cor: '#639922', bg: 'rgba(99,153,34,0.18)'  },
  saudavel:  { label: 'Saudável',  cor: '#0F6E56', bg: 'rgba(15,110,86,0.18)'  },
  atencao:   { label: 'Atenção',   cor: '#EF9F27', bg: 'rgba(239,159,39,0.18)' },
  critico:   { label: 'Crítico',   cor: '#E24B4A', bg: 'rgba(226,75,74,0.18)'  },
}

interface Props {
  score: number
  classificacao: BuyHelpIndexClassificacao
  delta: number
}

export function ScoreGauge({ score, classificacao, delta }: Props) {
  const [displayed, setDisplayed] = useState(0)
  const rafRef = useRef<number>(0)
  const cls = CLASSIFICACAO_MAP[classificacao]

  // Animação de contagem 0 → score
  useEffect(() => {
    const start = performance.now()
    const duration = 900
    const animate = (now: number) => {
      const elapsed = Math.min(now - start, duration)
      const eased = 1 - Math.pow(1 - elapsed / duration, 3)
      setDisplayed(Math.round(eased * score))
      if (elapsed < duration) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score])

  const deltaPositivo = delta >= 0
  const corDelta = deltaPositivo ? '#4ade80' : '#f87171'

  return (
    <div className="card-bh p-6 flex flex-col h-full">
      <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#9ca3af' }}>
        BuyHelp Index
      </p>

      {/* Score + badge */}
      <div className="flex items-end gap-4 mb-3">
        <span
          className="text-7xl font-black leading-none tabular-nums"
          style={{ color: cls.cor }}
        >
          {displayed}
        </span>
        <div className="mb-2">
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{ background: cls.bg, color: cls.cor }}
          >
            {cls.label}
          </span>
        </div>
      </div>

      {/* Delta */}
      <div className="flex items-center gap-1.5 mb-6">
        <span className="text-xl font-bold" style={{ color: corDelta }}>
          {deltaPositivo ? '↑' : '↓'} {Math.abs(delta).toFixed(1)} pts
        </span>
        <span className="text-xs text-bh-muted">vs período anterior</span>
      </div>

      {/* Régua de faixas */}
      <div className="mt-auto space-y-2">
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Faixas de classificação</p>
        {FAIXAS.map(f => (
          <div key={f.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: f.cor }} />
            <span className="text-xs font-medium" style={{ color: f.cor }}>{f.label}</span>
            <span className="text-xs ml-auto" style={{ color: '#6b7280' }}>{f.range}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
