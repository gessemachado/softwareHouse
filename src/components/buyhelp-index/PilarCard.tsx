import type React from 'react'
import {
  ShoppingCart, Tag, Users, Receipt, TrendingUp,
} from 'lucide-react'
import type { PilarDefinicao, PilarScore } from '../../types/buyhelp-index.types'

const ICONE_MAP: Record<string, React.FC<{ size?: number; color?: string }>> = {
  ShoppingCart, Tag, Users, Receipt, TrendingUp,
}

interface Props {
  pilar: PilarDefinicao
  dados: PilarScore
}

function TendenciaTag({ delta }: { delta: number }) {
  if (delta > 0) return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>
      ↑ +{delta.toFixed(1)} pts
    </span>
  )
  if (delta < 0) return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171' }}>
      ↓ {delta.toFixed(1)} pts
    </span>
  )
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(148,163,184,0.12)', color: '#94a3b8' }}>
      = estável
    </span>
  )
}

export function PilarCard({ pilar, dados }: Props) {
  const Icon = ICONE_MAP[pilar.icone] ?? TrendingUp
  const score = dados.score
  const semDados = score === null

  return (
    <div className="card-bh p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${pilar.cor}18` }}
          >
            <Icon size={16} color={pilar.cor} />
          </div>
          <div>
            <p className="text-bh-text text-sm font-medium leading-tight">{pilar.label}</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>Peso: {pilar.peso}%</p>
          </div>
        </div>
        <TendenciaTag delta={dados.delta} />
      </div>

      {/* Score */}
      {semDados ? (
        <div className="flex items-center gap-2">
          <span
            className="text-4xl font-black leading-none"
            style={{ color: '#4b5563' }}
          >—</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: '#1f2937', color: '#6b7280' }}
          >
            Sem dados
          </span>
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <span
            className="text-4xl font-black leading-none tabular-nums"
            style={{ color: pilar.cor }}
          >
            {score}
          </span>
          <span className="text-sm mb-1" style={{ color: '#6b7280' }}>/ 100</span>
        </div>
      )}

      {/* Barra de progresso */}
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgb(var(--bh-surface2))' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: semDados ? '0%' : `${score ?? 0}%`,
            background: pilar.cor,
            opacity: semDados ? 0 : 1,
          }}
        />
      </div>

      {/* Descrição */}
      <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>
        {pilar.descricao}
      </p>
    </div>
  )
}
