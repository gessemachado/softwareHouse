import { type ReactNode, useEffect } from 'react'
import { Plus } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  width?: string
}

export function Modal({ open, onClose, title, subtitle, children, width = 'max-w-lg' }: Props) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative z-10 w-full ${width} bg-bh-surface border border-bh-border rounded-lg shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-bh-border bg-bh-surface rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-bh-primary flex items-center justify-center text-white flex-shrink-0">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="text-bh-text font-semibold text-sm">{title}</h3>
              {subtitle && <p className="text-bh-muted text-xs mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-bh-muted hover:text-bh-text transition-colors text-xl leading-none ml-4 mt-0.5"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  )
}
