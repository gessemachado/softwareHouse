import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, X, Download, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { Pagination } from '../components/ui/Pagination'
import { useRelatorio } from '../hooks/useRelatorio'

function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function RelatorioFinanceiro({ scope = 'sh' }: { scope?: 'sh' | 'finger' }) {
  const navigate = useNavigate()
  const {
    totais, registros, loadingSH, filters, setFilters, applyFilters, clearFilters,
    pagination, setPage,
    fingerTotais, fingerRegistros, loadingFinger, fingerFilters, setFingerFilters, applyFingerFilters, clearFingerFilters,
    fingerPagination, setFingerPage,
    exportarCSV,
  } = useRelatorio()

  const totalValorTaxa = registros.reduce((s, r) => s + r.valor_taxa, 0)
  const totalImposto = registros.reduce((s, r) => s + r.imposto, 0)
  const totalValorSH = registros.reduce((s, r) => s + r.valor_sh, 0)
  const totalValorRepresentante = registros.reduce((s, r) => s + r.valor_representante, 0)
  const totalValorFinger = fingerRegistros.reduce((s, r) => s + r.valor_finger, 0)

  return (
    <AppLayout>
      {/* Back + Title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(scope === 'finger' ? '/finger' : '/software-house')}
          className="w-8 h-8 rounded bg-bh-surface2 border border-bh-border flex items-center justify-center text-bh-muted hover:text-bh-text transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-bh-text text-xl font-semibold">
          {scope === 'finger' ? 'Relatório — Finger' : 'Relatório Financeiro'}
        </h2>
      </div>

      {/* ── ABA SOFTWARE HOUSE ────────────────────────────────────────────────── */}
      {scope === 'sh' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="card-bh p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <DollarSign size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-bh-muted text-xs uppercase tracking-wider font-medium mb-1">Valor Taxa</p>
                <p className="text-bh-text text-2xl font-bold">{formatBRL(totais.valor_taxa)}</p>
              </div>
            </div>
            <div className="card-bh p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <TrendingDown size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-bh-muted text-xs uppercase tracking-wider font-medium mb-1">Imposto (20%)</p>
                <p className="text-bh-text text-2xl font-bold">{formatBRL(totais.imposto)}</p>
              </div>
            </div>
            <div className="card-bh p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <BarChart3 size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-bh-muted text-xs uppercase tracking-wider font-medium mb-1">Valor Software House</p>
                <p className="text-bh-text text-2xl font-bold">{formatBRL(totais.valor_sh)}</p>
              </div>
            </div>
          </div>

          <div className="card-bh p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-bh-subtle" />
                <input
                  className="input-bh pl-9"
                  placeholder="Buscar por Software House, Credenciado, CNPJ..."
                  value={filters.search}
                  onChange={e => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <input
                className="input-bh sm:w-52"
                placeholder="Mês/Ano (ex: 04/2026)"
                value={filters.mes_ano}
                onChange={e => setFilters({ ...filters, mes_ano: e.target.value })}
              />
              <div className="flex gap-2">
                <button onClick={applyFilters} className="btn-primary"><Search size={13} /> Pesquisar</button>
                <button onClick={clearFilters} className="btn-ghost"><X size={13} /> Limpar</button>
                <button onClick={() => exportarCSV('sh')} className="btn-secondary"><Download size={13} /> Exportar</button>
              </div>
            </div>
          </div>

          <div className="card-bh">
            <div className="p-5 border-b border-bh-border">
              <h3 className="text-bh-text font-bold text-lg">Relatório Financeiro — Software House</h3>
              <p className="text-bh-muted text-sm mt-1">{pagination.total} registro{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}</p>
            </div>
            <table className="table-bh">
              <thead>
                <tr>
                  <th>Período</th>
                  <th>Software House</th>
                  <th>Credenciado</th>
                  <th>Representante</th>
                  <th>Valor R$</th>
                  <th>Imposto (20%) R$</th>
                  <th>Valor Líquido R$</th>
                  <th>Valor SH R$</th>
                  <th>Valor Rep. R$</th>
                </tr>
              </thead>
              <tbody>
                {registros.map(r => (
                  <tr key={`${r.id}-${r.periodo}`}>
                    <td>
                      <span className="bg-bh-surface2 border border-bh-border text-bh-text text-xs font-mono px-2 py-0.5 rounded">
                        {r.periodo}
                      </span>
                    </td>
                    <td>
                      <p className="font-medium">{r.software_house}</p>
                      <p className="text-bh-muted text-xs">{r.cnpj_sh}</p>
                    </td>
                    <td>
                      <p>{r.credenciado}</p>
                      <p className="text-bh-muted text-xs">{r.cnpj_credenciado}</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-bh-secondary/20 flex items-center justify-center text-bh-secondary text-xs font-semibold flex-shrink-0">
                          {r.representante.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <p className="font-medium">{r.representante}</p>
                      </div>
                    </td>
                    <td className="font-medium">{formatBRL(r.valor_taxa)}</td>
                    <td className="text-red-400">{formatBRL(r.imposto)}</td>
                    <td className="font-medium">{formatBRL(r.valor_taxa - r.imposto)}</td>
                    <td className="text-green-400">{formatBRL(r.valor_sh)}</td>
                    <td className="text-blue-400">{formatBRL(r.valor_representante)}</td>
                  </tr>
                ))}
                {registros.length > 0 && (
                  <tr className="bg-bh-surface2">
                    <td colSpan={4} className="font-bold text-bh-text">TOTAL</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalValorTaxa)}</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalImposto)}</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalValorTaxa - totalImposto)}</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalValorSH)}</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalValorRepresentante)}</td>
                  </tr>
                )}
              </tbody>
            </table>
            {registros.length === 0 && !loadingSH && (
              <div className="py-10 text-center text-bh-muted">Nenhum registro encontrado.</div>
            )}
            <div className="px-5 pb-4">
              <Pagination
                page={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onPageChange={setPage}
                pageSizeOptions={[10, 20, 50]}
              />
            </div>
          </div>
        </>
      )}

      {/* ── ABA FINGER ────────────────────────────────────────────────────────── */}
      {scope === 'finger' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="card-bh p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <DollarSign size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-bh-muted text-xs uppercase tracking-wider font-medium mb-1">Valor Taxa</p>
                <p className="text-bh-text text-2xl font-bold">{formatBRL(totais.valor_taxa)}</p>
              </div>
            </div>
            <div className="card-bh p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <TrendingDown size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-bh-muted text-xs uppercase tracking-wider font-medium mb-1">Imposto (20%)</p>
                <p className="text-bh-text text-2xl font-bold">{formatBRL(totais.imposto)}</p>
              </div>
            </div>
            <div className="card-bh p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <BarChart3 size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-bh-muted text-xs uppercase tracking-wider font-medium mb-1">Total Fingers R$</p>
                <p className="text-bh-text text-2xl font-bold">{formatBRL(fingerTotais.valor_total_fingers)}</p>
              </div>
            </div>
          </div>

          <div className="card-bh p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-bh-subtle" />
                <input
                  className="input-bh pl-9"
                  placeholder="Buscar por Finger, CPF, Software House, Credenciado..."
                  value={fingerFilters.search}
                  onChange={e => setFingerFilters({ ...fingerFilters, search: e.target.value })}
                />
              </div>
              <input
                className="input-bh sm:w-52"
                placeholder="Mês/Ano (ex: 01/2025)"
                value={fingerFilters.mes_ano}
                onChange={e => setFingerFilters({ ...fingerFilters, mes_ano: e.target.value })}
              />
              <div className="flex gap-2">
                <button onClick={applyFingerFilters} className="btn-primary"><Search size={13} /> Pesquisar</button>
                <button onClick={clearFingerFilters} className="btn-ghost"><X size={13} /> Limpar</button>
                <button onClick={() => exportarCSV('finger')} className="btn-secondary"><Download size={13} /> Exportar</button>
              </div>
            </div>
          </div>

          <div className="card-bh">
            <div className="p-5 border-b border-bh-border">
              <h3 className="text-bh-text font-bold text-lg">Relatório — Finger</h3>
              <p className="text-bh-muted text-sm mt-1">{fingerPagination.total} registro{fingerPagination.total !== 1 ? 's' : ''} encontrado{fingerPagination.total !== 1 ? 's' : ''}</p>
            </div>
            <table className="table-bh">
              <thead>
                <tr>
                  <th>Período</th>
                  <th>Finger</th>
                  <th>Software House</th>
                  <th>Credenciado</th>
                  <th>Porcentagem</th>
                  <th>Valor R$</th>
                  <th>Imposto (20%) R$</th>
                  <th>Valor Líquido R$</th>
                  <th>Valor Finger R$</th>
                </tr>
              </thead>
              <tbody>
                {fingerRegistros.map(r => (
                  <tr key={`${r.id}-${r.periodo}-${r.finger}`}>
                    <td>
                      <span className="bg-bh-surface2 border border-bh-border text-bh-text text-xs font-mono px-2 py-0.5 rounded">
                        {r.periodo}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-bh-primary/20 flex items-center justify-center text-bh-primary text-xs font-semibold flex-shrink-0">
                          {r.finger.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{r.finger}</p>
                          <p className="text-bh-muted text-xs">{r.cpf_finger}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p>{r.software_house}</p>
                      <p className="text-bh-muted text-xs">{r.cnpj_sh}</p>
                    </td>
                    <td>
                      <p>{r.credenciado}</p>
                      <p className="text-bh-muted text-xs">{r.cnpj_credenciado}</p>
                    </td>
                    <td>
                      <span className="bg-orange-500/15 text-orange-400 text-xs px-2 py-0.5 rounded font-medium">
                        {r.porcentagem}%
                      </span>
                    </td>
                    <td className="font-medium">{formatBRL(r.valor_finger)}</td>
                    <td className="text-red-400">{formatBRL(r.valor_finger * 0.2)}</td>
                    <td className="text-green-400 font-medium">{formatBRL(r.valor_finger * 0.8)}</td>
                    <td className="text-orange-400 font-medium">{formatBRL(r.valor_finger * 0.8 * (r.porcentagem / 100))}</td>
                  </tr>
                ))}
                {fingerRegistros.length > 0 && (
                  <tr className="bg-bh-surface2">
                    <td colSpan={5} className="font-bold text-bh-text">TOTAL</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalValorFinger)}</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalValorFinger * 0.2)}</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalValorFinger * 0.8)}</td>
                    <td className="font-bold text-bh-primary">
                      {formatBRL(fingerRegistros.reduce((s, r) => s + r.valor_finger * 0.8 * (r.porcentagem / 100), 0))}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {fingerRegistros.length === 0 && !loadingFinger && (
              <div className="py-10 text-center text-bh-muted">Nenhum registro encontrado.</div>
            )}
            <div className="px-5 pb-4">
              <Pagination
                page={fingerPagination.page}
                pageSize={fingerPagination.pageSize}
                total={fingerPagination.total}
                onPageChange={setFingerPage}
                pageSizeOptions={[10, 20, 50]}
              />
            </div>
          </div>
        </>
      )}
    </AppLayout>
  )
}
