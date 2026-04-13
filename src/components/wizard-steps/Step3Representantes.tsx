import { useState } from 'react'
import { UserRound, SlidersHorizontal, Search, X, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { RepresentanteForm } from '../../types/sh.types'
import { ModalRepresentante } from '../modals/ModalRepresentante'
import { Pagination } from '../ui/Pagination'

interface Props {
  representantes: RepresentanteForm[]
  onAdd: (rep: RepresentanteForm) => void
  onUpdate: (idx: number, rep: RepresentanteForm) => void
  onRemove: (idx: number) => void
  onNext: () => void
  onBack: () => void
}

export function Step3Representantes({ representantes, onAdd, onUpdate, onRemove, onNext, onBack }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5

  const filtered = representantes.filter(r =>
    !search || r.nome_completo.toLowerCase().includes(search.toLowerCase())
  )
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSave(data: RepresentanteForm) {
    if (editIdx !== null) onUpdate(editIdx, data)
    else onAdd(data)
    setEditIdx(null)
  }

  function handleEdit(idx: number) {
    setEditIdx(idx)
    setModalOpen(true)
  }

  function handleRemove(idx: number) {
    if (confirm('Remover este representante?')) onRemove(idx)
  }

  return (
    <div>
      {/* Filtros */}
      <div className="card-bh p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <SlidersHorizontal size={14} className="text-bh-primary" />
          <span className="text-bh-text text-sm font-medium">Filtros</span>
        </div>
        <p className="text-bh-muted text-xs mb-3">Filtre os representantes</p>
        <div className="flex gap-3">
          <input
            className="input-bh flex-1"
            placeholder="Representante"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
          <select className="input-bh w-40">
            <option>Todos</option>
          </select>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="btn-primary text-xs py-1.5 px-3"><Search size={13} /> Filtrar</button>
          <button className="btn-ghost text-xs" onClick={() => setSearch('')}><X size={13} /> Limpar</button>
        </div>
      </div>

      {/* Tabela */}
      <div className="card-bh mb-6">
        <div className="p-4 border-b border-bh-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-bh-primary/20 rounded flex items-center justify-center text-bh-primary">
              <UserRound size={14} />
            </div>
            <div>
              <h3 className="text-bh-text font-medium text-sm">Representantes Vinculados</h3>
              <p className="text-bh-muted text-xs">{representantes.length} representante{representantes.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button className="btn-primary text-xs py-1.5" onClick={() => { setEditIdx(null); setModalOpen(true) }}>
            <Plus size={13} /> Adicionar Novo
          </button>
        </div>

        {paginated.length === 0 ? (
          <div className="py-10 text-center text-bh-muted text-sm">
            {search ? 'Nenhum representante encontrado.' : 'Nenhum representante vinculado ainda.'}
          </div>
        ) : (
          <table className="table-bh">
            <thead>
              <tr>
                <th></th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Data Vínculo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((rep, i) => {
                const realIdx = (page - 1) * PAGE_SIZE + i
                return (
                  <tr key={i}>
                    <td>
                      <div className="w-7 h-7 rounded-full bg-bh-primary/20 flex items-center justify-center text-bh-primary text-xs font-semibold">
                        {rep.nome_completo.slice(0, 2).toUpperCase()}
                      </div>
                    </td>
                    <td className="font-medium">{rep.nome_completo}</td>
                    <td className="text-bh-muted">{rep.email}</td>
                    <td className="text-bh-muted">{rep.telefone}</td>
                    <td className="text-bh-muted">{new Date().toLocaleDateString('pt-BR')}</td>
                    <td>
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(realIdx)} className="text-bh-muted hover:text-bh-primary transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => handleRemove(realIdx)} className="text-bh-muted hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        <div className="px-4 pb-3">
          <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-ghost"><ChevronLeft size={15} /> Voltar</button>
        <button onClick={onNext} className="btn-primary">Próximo: Finger <ChevronRight size={15} /></button>
      </div>

      <ModalRepresentante
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditIdx(null) }}
        onSave={handleSave}
        defaultValues={editIdx !== null ? representantes[editIdx] : undefined}
      />
    </div>
  )
}
