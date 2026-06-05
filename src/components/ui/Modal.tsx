import { type ReactNode, useEffect, useState } from 'react'
import { X, Maximize2, Minimize2 } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: ReactNode
  footer?: ReactNode
  children: ReactNode
  bodyClassName?: string
}

export function Modal({ open, onClose, title, subtitle, icon, footer, children, bodyClassName }: Props) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!open) { setExpanded(false); return }
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-md" onClick={onClose} />

      {/* Dialog */}
      <div className={`absolute bg-bh-bg border border-bh-border shadow-2xl flex flex-col overflow-hidden transition-[inset,border-radius] duration-250 ease-[cubic-bezier(.16,1,.3,1)] ${
        expanded ? 'inset-0 rounded-none' : 'inset-16 rounded-lg'
      }`}>

        {/* Header */}
        <div className="flex-shrink-0 border-b border-bh-border px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && <div className="text-bh-primary flex-shrink-0">{icon}</div>}
            <div>
              <h3 className="text-xl font-bold text-bh-text leading-7">{title}</h3>
              {subtitle && <p className="text-bh-muted text-sm mt-1">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setExpanded(e => !e)}
              className="w-9 h-9 rounded-lg border border-bh-border bg-transparent flex items-center justify-center text-bh-subtle hover:text-bh-text hover:bg-bh-surface2 hover:border-bh-border/60 transition-colors"
              title={expanded ? 'Recolher' : 'Expandir'}
            >
              {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg border border-bh-border bg-transparent flex items-center justify-center text-bh-subtle hover:text-bh-text hover:bg-bh-surface2 hover:border-bh-border/60 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={bodyClassName ?? 'flex-1 overflow-y-auto overflow-x-hidden p-6 flex flex-col gap-4'}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 border-t border-bh-border px-6 py-3.5 flex items-center justify-between bg-bh-bg">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
