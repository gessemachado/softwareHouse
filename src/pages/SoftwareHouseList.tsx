import { useNavigate } from 'react-router-dom'
import { Search, X, FileText, Plus, SlidersHorizontal, LayoutGrid, BarChart2, Pencil } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { SHStatusBadge } from '../components/sh/SHStatusBadge'
import { Pagination } from '../components/ui/Pagination'
import { TabNav } from '../components/ui/TabNav'
import { useSoftwareHouses } from '../hooks/useSoftwareHouses'

export function SoftwareHouseList() {
  const navigate = useNavigate()
  const { data, total, filters, setFilters, applyFilters, clearFilters, pagination, setPage } = useSoftwareHouses()

  return (
    <AppLayout title="">
      <TabNav />

      {/* Filtros */}
      <div className="card-bh p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-bh-primary/20 rounded flex items-center justify-center text-bh-primary">
              <SlidersHorizontal size={16} />
            </div>
            <div>
              <h2 className="text-bh-text font-semibold text-sm">Filtros</h2>
              <p className="text-bh-muted text-xs">Pesquise e filtre suas software house</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/software-house/nova')}
            className="btn-primary"
          >
            <Plus size={15} /> Nova Software House
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar por arquivo ou credenciado..."
            className="input-bh"
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
          />
          <select
            className="input-bh"
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value as '' | 'ativa' | 'inativa' })}
          >
            <option value="">Todos os status</option>
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
          <span className="text-bh-muted text-sm">{total} resultado{total !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Tabela */}
      <div className="card-bh">
        <div className="p-5 border-b border-bh-border flex items-center gap-3">
          <div className="w-8 h-8 bg-bh-primary/20 rounded flex items-center justify-center text-bh-primary">
            <LayoutGrid size={16} />
          </div>
          <div>
            <h2 className="text-bh-text font-semibold text-sm">Software House</h2>
            <p className="text-bh-muted text-xs">Lista completa de todas as software house</p>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="py-12 text-center text-bh-muted">
            Nenhuma software house encontrada
          </div>
        ) : (
          <table className="table-bh">
            <thead>
              <tr>
                <th>Software House</th>
                <th className="text-center">Qtd. Lojas Vinculadas</th>
                <th className="text-center">Qtd. Representante</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map(sh => (
                <tr key={sh.id}>
                  <td>
                    <div className="font-medium text-bh-text">{sh.nome_fantasia}</div>
                    <div className="text-bh-muted text-xs mt-0.5">
                      {sh.estado}, {sh.municipio} · {sh.cnpj}
                    </div>
                  </td>
                  <td className="text-center">{sh.qtd_lojas_vinculadas ?? 0}</td>
                  <td className="text-center">{sh.qtd_representantes ?? 0}</td>
                  <td><SHStatusBadge status={sh.status} /></td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        title="Relatório"
                        className="text-green-500 hover:text-green-400 transition-colors"
                        onClick={() => navigate('/software-house/relatorio')}
                      >
                        <BarChart2 size={18} />
                      </button>
                      <button
                        title="Editar"
                        className="text-bh-primary hover:text-bh-primary-hover transition-colors"
                        onClick={() => navigate(`/software-house/${sh.id}/editar`)}
                      >
                        <Pencil size={16} />
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
    </AppLayout>
  )
}
