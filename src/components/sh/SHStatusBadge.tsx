import type { SHStatus } from '../../types/sh.types'

interface Props {
  status: SHStatus
}

export function SHStatusBadge({ status }: Props) {
  if (status === 'ativa') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-900/40 text-green-400 border border-green-700/40">
        Ativa
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-bh-surface2 text-bh-subtle border border-bh-border">
      Inativa
    </span>
  )
}
