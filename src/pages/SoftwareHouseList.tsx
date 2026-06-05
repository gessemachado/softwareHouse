import { useNavigate } from 'react-router-dom'
import { Search, X, FileText, Plus, AlignJustify, BarChart2, Pencil } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { SHStatusBadge } from '../components/sh/SHStatusBadge'
import { Pagination } from '../components/ui/Pagination'
import { TabNav } from '../components/ui/TabNav'
import { useSoftwareHouses } from '../hooks/useSoftwareHouses'
import type { SoftwareHouse } from '../types/sh.types'

// ─── Tabela interna ───────────────────────────────────────────────────────────

const COLS = [
  { label: 'Software House', w: '32%' },
  { label: 'Lojas',          w: '8%'  },
  { label: 'Representantes', w: '13%' },
  { label: 'Status',         w: '11%' },
  { label: 'Cadastro',       w: '13%' },
  { label: 'Ações',          w: '23%' },
]

function SHTable({
  data,
  onDashboard,
  onEdit,
}: {
  data: SoftwareHouse[]
  onDashboard: (id: string) => void
  onEdit: (id: string) => void
}) {
  if (data.length === 0) {
    return (
      <div
        className="mx-6 mb-5 rounded-xl py-14 text-center"
        style={{ border: '1px solid rgb(var(--bh-border))', color: 'rgb(var(--bh-muted))' }}
      >
        Nenhuma software house encontrada
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
            {data.map((sh, idx) => (
              <tr
                key={sh.id}
                className="transition-colors duration-100 hover:bg-white/[0.03]"
                style={{ borderBottom: idx < data.length - 1 ? '1px solid rgb(var(--bh-border))' : 'none' }}
              >
                <td className="py-5 px-5">
                  <div className="font-bold text-bh-text uppercase text-xs tracking-wide leading-tight">
                    {sh.nome_fantasia}
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: 'rgb(var(--bh-muted))' }}>
                    {sh.municipio}/{sh.estado} · {sh.cnpj}
                  </div>
                </td>
                <td className="py-5 px-5 tabular-nums text-bh-text text-sm">
                  {sh.qtd_lojas_vinculadas ?? 0}
                </td>
                <td className="py-5 px-5 tabular-nums text-bh-text text-sm">
                  {sh.qtd_representantes ?? 0}
                </td>
                <td className="py-5 px-5">
                  <SHStatusBadge status={sh.status} />
                </td>
                <td className="py-5 px-5">
                  <div className="text-xs text-bh-text">
                    {new Date(sh.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'rgb(var(--bh-muted))' }}>
                    {new Date(sh.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="py-5 px-5">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => onDashboard(sh.id)}
                      className="flex items-center gap-2 text-xs transition-colors duration-150"
                      style={{ color: 'rgb(var(--bh-muted))' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgb(var(--bh-muted))')}
                    >
                      <BarChart2 size={15} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => onEdit(sh.id)}
                      className="flex items-center gap-2 text-xs transition-colors duration-150"
                      style={{ color: 'rgb(var(--bh-muted))' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgb(var(--bh-muted))')}
                    >
                      <Pencil size={14} />
                      <span>Editar</span>
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

export function SoftwareHouseList() {
  const navigate = useNavigate()
  const { data, total, filters, setFilters, applyFilters, clearFilters, pagination, setPage } = useSoftwareHouses()

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
            <AlignJustify size={20} color="#ff6600" />
          </div>
          <div>
            <h1 className="text-bh-text text-xl font-bold leading-tight">Software House</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgb(var(--bh-muted))' }}>
              Gerencie e acompanhe todas as software houses cadastradas
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/software-house/nova')}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={15} /> Nova Software House
        </button>
      </div>

      {/* Filtros */}
      <div
        className="rounded-xl p-5 mb-5"
        style={{
          background: 'rgb(var(--bh-bg))',
          border: '1px solid rgb(var(--bh-border))',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Search size={14} style={{ color: 'rgb(var(--bh-muted))' }} />
          <span className="text-sm font-semibold text-bh-text">Filtros</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar por nome ou CNPJ..."
            className="input-bh"
            style={{ background: 'rgb(var(--bh-bg))' }}
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
          />
          <select
            className="input-bh"
            style={{ background: 'rgb(var(--bh-bg))' }}
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value as '' | 'ativa' | 'inativa' })}
          >
            <option value="">Todos os Status</option>
            <option value="ativa">Ativa</option>
            <option value="inativa">Inativa</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={applyFilters} className="btn-primary">
              <Search size={14} /> Pesquisar
            </button>
            <button onClick={clearFilters} className="btn-ghost">
              <X size={14} /> Limpar
            </button>
            <button
              onClick={() => navigate('/software-house/relatorio')}
              className="btn-ghost"
            >
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
          <h2 className="text-bh-text font-semibold text-base">Software Houses Cadastradas</h2>
        </div>

        {/* Card interno */}
        <SHTable data={data} onDashboard={id => navigate(`/software-house/${id}/dashboard`)} onEdit={id => navigate(`/software-house/${id}/editar`)} />

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
    </AppLayout>
  )
}
