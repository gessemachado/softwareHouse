import type React from 'react'
import {
  ShoppingCart, Tag, Users, Receipt, TrendingUp,
} from 'lucide-react'
import type { Recomendacao } from '../../types/buyhelp-index.types'
import { PILARES_DEF } from '../../mocks/buyhelp-index.mock'

const ICONE_MAP: Record<string, React.FC<{ size?: number; color?: string }>> = {
  ShoppingCart, Tag, Users, Receipt, TrendingUp,
}

interface Props {
  recomendacoes: Recomendacao[]
}

export function RecomendacoesPanel({ recomendacoes }: Props) {
  return (
    <div className="card-bh p-5 flex flex-col h-full">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9ca3af' }}>
          Recomendações
        </p>
        <p className="text-bh-text text-sm font-medium">Ações para pilares abaixo de 60 pts</p>
      </div>

      {recomendacoes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(15,110,86,0.15)' }}
          >
            <TrendingUp size={22} color="#0F6E56" />
          </div>
          <p className="text-sm font-medium" style={{ color: '#e5e7eb' }}>Todos os pilares saudáveis!</p>
          <p className="text-xs text-center" style={{ color: '#6b7280' }}>
            Nenhuma recomendação necessária. Continue monitorando.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          {recomendacoes.map((rec, i) => {
            const pilarDef = PILARES_DEF.find(p => p.key === rec.pilar)
            const Icon = pilarDef ? ICONE_MAP[pilarDef.icone] ?? TrendingUp : TrendingUp
            const cor = pilarDef?.cor ?? '#EF9F27'
            return (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-lg"
                style={{ background: '#0d0d0d', border: '1px solid #2a2a2a' }}
              >
                {/* Número */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                  style={{ background: '#1a1a1a', color: '#9ca3af' }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={13} color={cor} />
                    <p className="text-sm font-semibold" style={{ color: '#e5e7eb' }}>
                      {rec.titulo}
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>
                    {rec.descricao}
                  </p>
                  {pilarDef && (
                    <span
                      className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wide"
                      style={{ background: `${cor}18`, color: cor }}
                    >
                      {pilarDef.label}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
