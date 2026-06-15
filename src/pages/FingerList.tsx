import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Fingerprint, Pencil, Trash2, FileText, X } from 'lucide-react'
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

// ─── Tabela interna ───────────────────────────────────────────────────────────

const COLS = [
  { label: 'Nome',        w: '18%' },
  { label: 'CPF',         w: '11%' },
  { label: 'E-mail',      w: '16%' },
  { label: 'Telefone',    w: '11%' },
  { label: 'Percentual',  w: '9%'  },
  { label: 'Lojas',       w: '7%'  },
  { label: 'Cidade/UF',   w: '10%' },
  { label: 'Prazo',       w: '7%'  },
  { label: 'Ativação',    w: '7%'  },
  { label: 'Ações',       w: '14%' },
]

function FingerTable({
  data,
  onEdit,
  onDelete,
}: {
  data: FingerEnriquecido[]
  onEdit: (f: FingerEnriquecido) => void
  onDelete: (id: string) => void
}) {
  if (data.length === 0) {
    return (
      <div
        className="mx-6 mb-5 rounded-xl py-14 flex flex-col items-center gap-3"
        style={{ border: '1px solid rgb(var(--bh-border))', color: 'rgb(var(--bh-muted))' }}
      >
        <Fingerprint size={28} className="opacity-25" />
        <p className="text-sm">Nenhum finger encontrado</p>
      </div>
    )
  }

  return (
    <div
      className="mx-6 mb-5 rounded-xl overflow-hidden"
      style={{ border: '1px solid rgb(var(--bh-border))' }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgb(var(--bh-surface2))', borderBottom: '1px solid rgb(var(--bh-border))' }}>
              {COLS.map(({ label, w }) => (
                <th
                  key={label}
                  className="text-left py-3 px-5 text-xs font-medium"
                  style={{ color: 'rgb(var(--bh-muted))', width: w }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((finger, idx) => (
              <tr
                key={finger.id}
                className="transition-colors duration-100 hover:bg-white/[0.03]"
                style={{ borderBottom: idx < data.length - 1 ? '1px solid rgb(var(--bh-border))' : 'none' }}
              >
                <td className="py-5 px-5">
                  <div className="font-bold text-bh-text uppercase text-xs tracking-wide leading-tight">
                    {finger.nome_completo}
                  </div>
                </td>
                <td className="py-5 px-5 tabular-nums text-xs" style={{ color: 'rgb(var(--bh-muted))' }}>
                  {finger.cpf}
                </td>
                <td className="py-5 px-5 text-xs truncate" style={{ color: 'rgb(var(--bh-muted))', maxWidth: 0 }}>
                  {finger.email}
                </td>
                <td className="py-5 px-5 tabular-nums text-xs" style={{ color: 'rgb(var(--bh-muted))' }}>
                  {finger.telefone}
                </td>
                <td className="py-5 px-5">
                  <span
                    className="inline-block text-xs font-bold px-2 py-0.5 rounded tabular-nums"
                    style={{ background: 'rgba(255,102,0,0.12)', color: '#ff6600' }}
                  >
                    {finger.porcentagem.toFixed(0)}%
                  </span>
                </td>
                <td className="py-5 px-5 tabular-nums text-bh-text text-sm font-semibold">
                  {finger.qtd_lojas_vinculadas}
                </td>
                <td className="py-5 px-5 text-xs" style={{ color: 'rgb(var(--bh-muted))' }}>
                  {[finger.cidade, finger.estado].filter(Boolean).join('/') || '—'}
                </td>
                <td className="py-5 px-5 text-xs" style={{ color: 'rgb(var(--bh-muted))' }}>
                  {finger.prazo_meses ? `${finger.prazo_meses}m` : '—'}
                </td>
                <td className="py-5 px-5 text-xs" style={{ color: 'rgb(var(--bh-muted))' }}>
                  {fmtData(finger.data_ativacao)}
                </td>
                <td className="py-5 px-5">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => onEdit(finger)}
                      className="flex items-center gap-2 text-xs transition-colors duration-150"
                      style={{ color: 'rgb(var(--bh-muted))' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgb(var(--bh-muted))')}
                    >
                      <Pencil size={14} />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => onDelete(finger.id)}
                      className="flex items-center gap-2 text-xs transition-colors duration-150"
                      style={{ color: 'rgb(var(--bh-muted))' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgb(var(--bh-danger))')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgb(var(--bh-muted))')}
                    >
                      <Trash2 size={14} />
                      <span>Excluir</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function FingerList() {
  const navigate = useNavigate()
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
    <AppLayout title="" subtitle="" breadcrumb="">
      <TabNav />

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(255,102,0,0.12)' }}
          >
            <Fingerprint size={20} color="#ff6600" />
          </div>
          <div>
            <h1 className="text-bh-text text-xl font-bold leading-tight">Finger</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgb(var(--bh-muted))' }}>
              Gerencie os fingers vinculados às software houses
            </p>
          </div>
        </div>
        <button
          onClick={handleNovo}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={15} /> Novo Finger
        </button>
      </div>

      {/* Filtros */}
      <div
        className="rounded-xl p-5 mb-5"
        style={{ background: 'rgb(var(--bh-bg))', border: '1px solid rgb(var(--bh-border))' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Search size={14} style={{ color: 'rgb(var(--bh-muted))' }} />
          <span className="text-sm font-semibold text-bh-text">Filtros</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar por nome, CPF, e-mail ou telefone..."
            className="input-bh"
            style={{ background: 'rgb(var(--bh-bg))' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') applySearch()
              if (e.key === 'Escape') clearSearch()
            }}
          />
          <select
            className="input-bh"
            style={{ background: 'rgb(var(--bh-bg))' }}
            value={shParaNovo}
            onChange={e => setShParaNovo(e.target.value)}
          >
            <option value="">Selecione a Software House...</option>
            {softwareHouses.map(sh => (
              <option key={sh.id} value={sh.id}>{sh.nome_fantasia}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={applySearch} className="btn-primary">
              <Search size={14} /> Pesquisar
            </button>
            <button onClick={clearSearch} className="btn-ghost">
              <X size={14} /> Limpar
            </button>
            <button onClick={() => navigate('/finger/relatorio')} className="btn-ghost">
              <FileText size={14} /> Relatórios
            </button>
          </div>
          <span className="text-sm" style={{ color: 'rgb(var(--bh-muted))' }}>
            {total} resultado{total !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Tabela — card externo */}
      <div
        className="rounded-xl"
        style={{ background: 'rgb(var(--bh-bg))', border: '1px solid rgb(var(--bh-border))' }}
      >
        <div className="px-6 pt-5 pb-4">
          <h2 className="text-bh-text font-semibold text-base">Fingers Cadastrados</h2>
        </div>

        {/* Card interno */}
        <FingerTable data={data} onEdit={handleEditar} onDelete={setConfirmDelete} />

        <div className="px-6 pb-4 pt-3">
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
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          />
          <div
            className="relative rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            style={{ background: 'rgb(var(--bh-bg))', border: '1px solid rgb(var(--bh-border))' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(220,40,40,0.12)' }}
              >
                <Trash2 size={18} className="text-bh-danger" />
              </div>
              <div>
                <h3 className="text-bh-text font-bold">Excluir finger</h3>
                <p className="text-sm" style={{ color: 'rgb(var(--bh-muted))' }}>
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="btn-ghost">
                Cancelar
              </button>
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
