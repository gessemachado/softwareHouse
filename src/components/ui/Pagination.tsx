interface Props {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange, pageSizeOptions, onPageSizeChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <div className="flex items-center gap-2 text-bh-muted">
        {pageSizeOptions && onPageSizeChange && (
          <>
            <span>Itens por página:</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              className="bg-bh-surface2 border border-bh-border text-bh-text rounded px-2 py-0.5 text-xs"
            >
              {pageSizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-bh-muted text-xs">
          {total === 0 ? '0 resultados' : `${total} resultado${total !== 1 ? 's' : ''}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!canPrev}
            className="px-3 py-1 rounded bg-bh-surface2 border border-bh-border text-bh-text text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bh-border transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-bh-muted text-xs px-2">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!canNext}
            className="px-3 py-1 rounded bg-bh-surface2 border border-bh-border text-bh-text text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bh-border transition-colors"
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  )
}
