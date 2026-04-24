import { useState } from 'react'
import { X, GripVertical, ChevronUp, ChevronDown, RotateCcw, Check, Eye, EyeOff } from 'lucide-react'
import { useDashboardConfig, type SectionConfig } from '../../contexts/DashboardConfigContext'

interface Props { onClose: () => void }

const ICONS: Record<string, string> = {
  intermediacoes: '⚡',
  vendas:         '📊',
  cadastros:      '👥',
  metricas:       '📈',
}

export function DashboardConfigModal({ onClose }: Props) {
  const { sections, setSections, resetSections } = useDashboardConfig()
  const [draft, setDraft] = useState<SectionConfig[]>([...sections])

  function toggleVisible(id: string) {
    setDraft(d => d.map(s => s.id === id ? { ...s, visible: !s.visible } : s))
  }

  function moveUp(index: number) {
    if (index === 0) return
    setDraft(d => {
      const next = [...d]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }

  function moveDown(index: number) {
    if (index === draft.length - 1) return
    setDraft(d => {
      const next = [...d]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }

  function handleReset() {
    resetSections()
    onClose()
  }

  function handleSave() {
    setSections(draft)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        style={{ background: '#0d0d0d' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="text-white text-lg font-bold">Configurar Dashboard</h2>
            <p className="text-[#555] text-xs mt-0.5">Defina quais seções exibir e a ordem de apresentação</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#555] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section list */}
        <div className="px-6 py-4 space-y-2">
          {draft.map((section, i) => (
            <div
              key={section.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                section.visible
                  ? 'border-orange-500/20 bg-orange-500/5'
                  : 'border-white/[0.06] bg-white/[0.02] opacity-50'
              }`}
            >
              {/* Grip */}
              <GripVertical size={16} className="text-[#333] shrink-0" />

              {/* Icon + label */}
              <span className="text-lg leading-none">{ICONS[section.id]}</span>
              <span className={`flex-1 text-sm font-semibold ${section.visible ? 'text-white' : 'text-[#666]'}`}>
                {section.label}
              </span>

              {/* Order buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="w-6 h-5 flex items-center justify-center rounded hover:bg-white/10 text-[#444] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  onClick={() => moveDown(i)}
                  disabled={i === draft.length - 1}
                  className="w-6 h-5 flex items-center justify-center rounded hover:bg-white/10 text-[#444] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronDown size={13} />
                </button>
              </div>

              {/* Visibility toggle */}
              <button
                onClick={() => toggleVisible(section.id)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition-colors ${
                  section.visible
                    ? 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10'
                    : 'border-white/10 text-[#555] hover:text-white hover:border-white/20'
                }`}
              >
                {section.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                {section.visible ? 'Visível' : 'Oculto'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-[#555] hover:text-white text-xs font-semibold transition-colors"
          >
            <RotateCcw size={13} />
            Restaurar padrão
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/10 text-[#666] hover:text-white text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors"
            >
              <Check size={13} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
