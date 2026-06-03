import { useState } from 'react'
import { Search, Plus, Fingerprint, Pencil, Trash2, FileText } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { TabNav } from '../components/ui/TabNav'
import { Pagination } from '../components/ui/Pagination'
import { ModalFinger } from '../components/modals/ModalFinger'
import { useFingers, type FingerEnriquecido } from '../hooks/useFingers'
import type { FingerForm } from '../types/sh.types'

function fmtData(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

export function FingerList() {
  const {
    data, total, search, setSearch,
    applySearch, clearSearch,
    pagination, setPage,
    addFinger, editFinger, deleteFinger,
    softwareHouses,
  } = useFingers()

  const [modalOpen, setModalOpen]         = useState(false)
  const [editingFinger, setEditingFinger] = useState<FingerEnriquecido | null>(null)
  const [shParaNovo, setShParaNovo]       = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function handleNovo() {
    setEditingFinger(null)
    setModalOpen(true)
  }

  function handleEditar(f: FingerEnriquecido) {
    setEditingFinger(f)
    setShParaNovo(f.software_house_id)
    setModalOpen(true)
  }

  function handleSave(form: FingerForm) {
    if (editingFinger) {
      editFinger(editingFinger.id, form)
    } else {
      addFinger(shParaNovo || softwareHouses[0]?.id, form)
    }
    setModalOpen(false)
    setEditingFinger(null)
  }

  const defaultValues: Partial<FingerForm> | undefined = editingFinger
    ? {
        nome_completo: editingFinger.nome_completo,
        email:         editingFinger.email,
        telefone:      editingFinger.telefone,
        cpf:           editingFinger.cpf,
        porcentagem:   editingFinger.porcentagem,
        prazo_meses:   editingFinger.prazo_meses,
        data_ativacao: editingFinger.data_ativacao,
        cidade:        editingFinger.cidade,
        estado:        editingFinger.estado,
      }
    : undefined

  return (
    <AppLayout title="">
      <TabNav />

      {/* Busca + ações */}
      <div className="card-bh p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-bh-subtle pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF, e-mail ou telefone..."
              className="input-bh pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') applySearch()
                if (e.key === 'Escape') clearSearch()
              }}
            />
          </div>
          <button onClick={applySearch} className="btn-primary">
            <Search size={14} /> Pesquisar
          </button>

          <div className="h-6 w-px bg-bh-border" />

          <button className="btn-secondary">
            <FileText size={14} /> Relatórios
          </button>

          {/* SH selector oculto — exibido apenas para novo finger */}
          {!editingFinger && (
            <select
              className="input-bh w-48"
              value={shParaNovo}
              onChange={e => setShParaNovo(e.target.value)}
              title="Selecione a Software House para o novo finger"
            >
              <option value="">Software House...</option>
              {softwareHouses.map(sh => (
                <option key={sh.id} value={sh.id}>{sh.nome_fantasia}</option>
              ))}
            </select>
          )}

          <button
            onClick={handleNovo}
            disabled={!shParaNovo && !editingFinger}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} /> Novo Finger
          </button>
        </div>

        {total > 0 && search !== '' && (
          <p className="text-bh-muted text-xs mt-3">
            {total} resultado{total !== 1 ? 's' : ''} para <span className="text-bh-text font-medium">"{search}"</span>
          </p>
        )}
      </div>

      {/* Tabela */}
      <div className="card-bh">
        {data.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-bh-muted">
            <Fingerprint size={32} className="opacity-30" />
            <p className="text-sm">Nenhum finger encontrado</p>
          </div>
        ) : (
          <table className="table-bh">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th className="text-center">Percentual</th>
                <th>Cidade/UF</th>
                <th className="text-center">Prazo</th>
                <th>Ativação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map(finger => (
                <tr key={finger.id}>
                  <td>
                    <div className="font-semibold text-bh-text">{finger.nome_completo}</div>
                    <div className="text-bh-subtle text-xs mt-0.5">{finger.software_house_nome}</div>
                  </td>
                  <td className="text-bh-muted tabular-nums">{finger.cpf}</td>
                  <td className="text-bh-muted">{finger.email}</td>
                  <td className="text-bh-muted tabular-nums">{finger.telefone}</td>
                  <td className="text-center">
                    <span
                      className="inline-block text-sm font-bold px-2 py-0.5 rounded tabular-nums"
                      style={{ background: 'rgba(255,102,0,0.12)', color: '#ff6600' }}
                    >
                      {finger.porcentagem.toFixed(0)}%
                    </span>
                  </td>
                  <td className="text-bh-muted">
                    {[finger.cidade, finger.estado].filter(Boolean).join('/') || '—'}
                  </td>
                  <td className="text-center text-bh-muted">
                    {finger.prazo_meses ? `${finger.prazo_meses} meses` : '—'}
                  </td>
                  <td className="text-bh-muted">
                    {fmtData(finger.data_ativacao)}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        title="Editar"
                        onClick={() => handleEditar(finger)}
                        className="text-bh-primary hover:text-bh-primary-hover transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        title="Excluir"
                        onClick={() => setConfirmDelete(finger.id)}
                        className="text-bh-danger hover:opacity-80 transition-opacity"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="px-5 pb-4">
          <Pagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={total}
            onPageChange={setPage}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </div>

      {/* Confirmação de exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative card-bh p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(220,40,40,0.12)' }}>
                <Trash2 size={18} className="text-bh-danger" />
              </div>
              <div>
                <h3 className="text-bh-text font-bold">Excluir finger</h3>
                <p className="text-bh-muted text-sm">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="btn-ghost">Cancelar</button>
              <button
                onClick={() => { deleteFinger(confirmDelete); setConfirmDelete(null) }}
                className="btn-primary"
                style={{ background: 'rgb(var(--bh-danger))' }}
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalFinger
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingFinger(null) }}
        onSave={handleSave}
        defaultValues={defaultValues}
        fingerId={editingFinger?.id}
        shId={editingFinger?.software_house_id || shParaNovo}
      />
    </AppLayout>
  )
}
