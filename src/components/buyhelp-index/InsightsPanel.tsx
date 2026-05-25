import type React from 'react'
import { TrendingUp, AlertTriangle, Activity } from 'lucide-react'
import type { Insight, InsightTipo } from '../../types/buyhelp-index.types'

const TIPO_MAP: Record<InsightTipo, {
  Icon: React.FC<{ size?: number; color?: string }>
  cor: string
  bg: string
  label: string
}> = {
  positivo:  { Icon: TrendingUp,    cor: '#4ade80', bg: 'rgba(74,222,128,0.10)',   label: 'Positivo'   },
  atencao:   { Icon: AlertTriangle, cor: '#EF9F27', bg: 'rgba(239,159,39,0.10)',   label: 'Atenção'    },
  tendencia: { Icon: Activity,      cor: '#378ADD', bg: 'rgba(55,138,221,0.10)',   label: 'Tendência'  },
}

interface Props {
  insights: Insight[]
}

export function InsightsPanel({ insights }: Props) {
  return (
    <div className="card-bh p-5 flex flex-col h-full">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9ca3af' }}>
          Insights Automáticos
        </p>
        <p className="text-bh-text text-sm font-medium">Gerados a partir dos dados do período</p>
      </div>

      {insights.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm" style={{ color: '#6b7280' }}>Nenhum insight disponível.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          {insights.map((insight, i) => {
            const { Icon, cor, bg, label } = TIPO_MAP[insight.tipo]
            return (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-lg"
                style={{ background: bg, border: `1px solid ${cor}22` }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${cor}18` }}
                >
                  <Icon size={14} color={cor} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold" style={{ color: '#e5e7eb' }}>
                      {insight.titulo}
                    </p>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide"
                      style={{ background: `${cor}22`, color: cor }}
                    >
                      {label}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>
                    {insight.descricao}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
