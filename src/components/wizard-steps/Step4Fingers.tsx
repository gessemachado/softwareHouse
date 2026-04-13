import { useState } from 'react'
import { Fingerprint, SlidersHorizontal, Search, X, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { FingerForm } from '../../types/sh.types'
import { ModalFinger } from '../modals/ModalFinger'
import { Pagination } from '../ui/Pagination'

interface Props {
  fingers: FingerForm[]
  onAdd: (f: FingerForm) => void
  onUpdate: (idx: number, f: FingerForm) => void
  onRemove: (idx: number) => void
  onNext: () => void
  onBack: () => void
}

export function Step4Fingers({ fingers, onAdd, onUpdate, onRemove, onNext, onBack }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5

  const filtered = fingers.filter(f =>
    !search || f.nome_completo.toLowerCase().includes(search.toLowerCase())
  )
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSave(data: FingerForm) {
    if (editIdx !== null) onUpdate(editIdx, data)
    else onAdd(data)
    setEditIdx(null)
  }

  return (
    <div>
      {/* Filtros */}
      <div className="card-bh p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <SlidersHorizontal size={14} className="text-bh-primary" />
          <span className="text-bh-text text-sm font-medium">Filtros</span>
        </div>
        <p className="text-bh-muted text-xs mb-3">Pesquise os fingers</p>
        <div className="flex gap-3">
          <input
            className="input-bh flex-1"
            placeholder="Finger"
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
              <Fingerprint size={14} />
            </div>
            <div>
              <h3 className="text-bh-text font-medium text-sm">Fingers Vinculados</h3>
              <p className="text-bh-muted text-xs">{fingers.length} finger{fingers.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button className="btn-primary text-xs py-1.5" onClick={() => { setEditIdx(null); setModalOpen(true) }}>
            <Plus size={13} /> Adicionar Novo
          </button>
        </div>

        {paginated.length === 0 ? (
          <div className="py-10 text-center text-bh-muted text-sm">
            {search ? 'Nenhum finger encontrado.' : 'Nenhum finger vinculado ainda.'}
          </div>
        ) : (
          <table className="table-bh">
            <thead>
              <tr>
                <th></th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Porcentagem</th>
                <th>Prazo</th>
                <th>Data Vínculo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((f, i) => {
                const realIdx = (page - 1) * PAGE_SIZE + i
                return (
                  <tr key={i}>
                    <td>
                      <div className="w-7 h-7 rounded-full bg-bh-primary/20 flex items-center justify-center text-bh-primary text-xs font-semibold">
                        {f.nome_completo.slice(0, 2).toUpperCase()}
                      </div>
                    </td>
                    <td className="font-medium">{f.nome_completo}</td>
                    <td className="text-bh-muted">{f.email}</td>
                    <td className="text-bh-muted">{f.telefone}</td>
                    <td>
                      <span className="bg-bh-primary/20 text-bh-primary text-xs px-2 py-0.5 rounded font-medium">
                        {f.porcentagem}%
                      </span>
                    </td>
                    <td className="text-bh-muted">{f.prazo_meses ? `${f.prazo_meses} meses` : '—'}</td>
                    <td className="text-bh-muted">{new Date().toLocaleDateString('pt-BR')}</td>
                    <td>
                      <div className="flex gap-3">
                        <button onClick={() => { setEditIdx(realIdx); setModalOpen(true) }} className="text-bh-muted hover:text-bh-primary transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => { if(confirm('Remover este finger?')) onRemove(realIdx) }} className="text-bh-muted hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
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
        <button onClick={onNext} className="btn-primary">Próximo: Credenciado <ChevronRight size={15} /></button>
      </div>

      <ModalFinger
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditIdx(null) }}
        onSave={handleSave}
        defaultValues={editIdx !== null ? fingers[editIdx] : undefined}
      />
    </div>
  )
}
