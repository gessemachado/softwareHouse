import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, AlignJustify, Fingerprint, SlidersHorizontal, Search, X, Download, TrendingUp, CircleDollarSign } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { Pagination } from '../components/ui/Pagination'
import { useRelatorio } from '../hooks/useRelatorio'

function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function RelatorioFinanceiro() {
  const navigate = useNavigate()
  const {
    totais, registros, loadingSH, filters, setFilters, applyFilters, clearFilters,
    pagination, setPage,
    fingerTotais, fingerRegistros, loadingFinger, fingerFilters, setFingerFilters, applyFingerFilters, clearFingerFilters,
    fingerPagination, setFingerPage,
    exportarCSV,
  } = useRelatorio()

  const [activeTab, setActiveTab] = useState<'sh' | 'finger'>('sh')

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
          onClick={() => navigate('/software-house')}
          className="w-8 h-8 rounded bg-bh-surface2 border border-bh-border flex items-center justify-center text-bh-muted hover:text-bh-text transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-bh-text text-xl font-semibold">Relatório Financeiro</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('sh')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
            activeTab === 'sh'
              ? 'bg-bh-primary text-white'
              : 'bg-bh-surface2 text-bh-muted border border-bh-border hover:text-bh-text'
          }`}
        >
          <AlignJustify size={14} /> Software House
        </button>
        <button
          onClick={() => setActiveTab('finger')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
            activeTab === 'finger'
              ? 'bg-bh-primary text-white'
              : 'bg-bh-surface2 text-bh-muted border border-bh-border hover:text-bh-text'
          }`}
        >
          <Fingerprint size={14} /> Finger
        </button>
      </div>

      {/* ── ABA SOFTWARE HOUSE ────────────────────────────────────────────────── */}
      {activeTab === 'sh' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Valor taxa R$', value: totais.valor_taxa, color: 'text-blue-400' },
              { label: 'Imposto R$', value: totais.imposto, color: 'text-green-400' },
              { label: 'Valor Software House R$', value: totais.valor_sh, color: 'text-yellow-400' },
            ].map(card => (
              <div key={card.label} className="card-bh p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CircleDollarSign size={16} className={card.color} />
                  <span className="text-bh-muted text-sm">{card.label}</span>
                </div>
                <p className="text-bh-text text-2xl font-bold">{formatBRL(card.value)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={12} className="text-green-400" />
                  <p className="text-green-400 text-xs">+{totais.variacao_pct}% vs mês anterior</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card-bh p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal size={14} className="text-bh-primary" />
              <div>
                <h3 className="text-bh-text font-medium text-sm">Filtros</h3>
                <p className="text-bh-muted text-xs">Buscar e filtrar relatórios</p>
              </div>
            </div>
            <input
              className="input-bh mb-3"
              placeholder="Buscar por Software House, Credenciado, CNPJ, UF, Cidade..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <input
                className="input-bh"
                placeholder="Grupo econômico"
                value={filters.grupo_economico}
                onChange={e => setFilters({ ...filters, grupo_economico: e.target.value })}
              />
              <input
                className="input-bh"
                placeholder="Mês / Ano (ex: 01/2026)"
                value={filters.mes_ano}
                onChange={e => setFilters({ ...filters, mes_ano: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button onClick={applyFilters} className="btn-primary"><Search size={13} /> Pesquisar</button>
                <button onClick={clearFilters} className="btn-ghost"><X size={13} /> Limpar</button>
                <button onClick={() => exportarCSV('sh')} className="btn-secondary"><Download size={13} /> Exportar</button>
              </div>
              <span className="text-bh-muted text-sm">{pagination.total} resultado{pagination.total !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="card-bh">
            <div className="p-4 border-b border-bh-border flex items-center gap-3">
              <div className="w-7 h-7 bg-bh-primary rounded flex items-center justify-center text-white text-xs font-bold">b</div>
              <div>
                <h3 className="text-bh-text font-medium text-sm">Relatório</h3>
                <p className="text-bh-muted text-xs">Visualizar dados consolidados</p>
              </div>
            </div>
            <table className="table-bh">
              <thead>
                <tr>
                  <th>Software House</th>
                  <th>Credenciado</th>
                  <th>Representante</th>
                  <th>Período</th>
                  <th>Data Vínculo</th>
                  <th>Prazo</th>
                  <th>Valor R$</th>
                  <th>Imposto (20%) R$</th>
                  <th>Valor Software House R$</th>
                  <th>Valor Representante R$</th>
                </tr>
              </thead>
              <tbody>
                {registros.map(r => (
                  <tr key={`${r.id}-${r.periodo}`}>
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
                    <td>{r.periodo}</td>
                    <td>{r.data_vinculo}</td>
                    <td>{r.prazo}</td>
                    <td>{formatBRL(r.valor_taxa)}</td>
                    <td>{formatBRL(r.imposto)}</td>
                    <td>{formatBRL(r.valor_sh)}</td>
                    <td>{formatBRL(r.valor_representante)}</td>
                  </tr>
                ))}
                {registros.length > 0 && (
                  <tr className="bg-bh-surface2">
                    <td colSpan={6} className="font-bold text-bh-text">TOTAL</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalValorTaxa)}</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalImposto)}</td>
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
      {activeTab === 'finger' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card-bh p-5">
              <div className="flex items-center gap-2 mb-2">
                <CircleDollarSign size={16} className="text-blue-400" />
                <span className="text-bh-muted text-sm">Total Fingers R$</span>
              </div>
              <p className="text-bh-text text-2xl font-bold">{formatBRL(fingerTotais.valor_total_fingers)}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={12} className="text-green-400" />
                <p className="text-green-400 text-xs">+{fingerTotais.variacao_pct}% vs mês anterior</p>
              </div>
            </div>
            <div className="card-bh p-5">
              <div className="flex items-center gap-2 mb-2">
                <CircleDollarSign size={16} className="text-green-400" />
                <span className="text-bh-muted text-sm">Porcentagem Média</span>
              </div>
              <p className="text-bh-text text-2xl font-bold">{fingerTotais.valor_medio_porcentagem}%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={12} className="text-green-400" />
                <p className="text-green-400 text-xs">+{fingerTotais.variacao_pct}% vs mês anterior</p>
              </div>
            </div>
            <div className="card-bh p-5">
              <div className="flex items-center gap-2 mb-2">
                <CircleDollarSign size={16} className="text-yellow-400" />
                <span className="text-bh-muted text-sm">Qtd. Fingers Ativos</span>
              </div>
              <p className="text-bh-text text-2xl font-bold">{fingerTotais.qtd_fingers}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={12} className="text-green-400" />
                <p className="text-green-400 text-xs">+{fingerTotais.variacao_pct}% vs mês anterior</p>
              </div>
            </div>
          </div>

          <div className="card-bh p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal size={14} className="text-bh-primary" />
              <div>
                <h3 className="text-bh-text font-medium text-sm">Filtros</h3>
                <p className="text-bh-muted text-xs">Buscar e filtrar relatórios por finger</p>
              </div>
            </div>
            <input
              className="input-bh mb-3"
              placeholder="Buscar por Finger, CPF, Software House, Credenciado..."
              value={fingerFilters.search}
              onChange={e => setFingerFilters({ ...fingerFilters, search: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <input
                className="input-bh"
                placeholder="Grupo econômico"
                value={fingerFilters.grupo_economico}
                onChange={e => setFingerFilters({ ...fingerFilters, grupo_economico: e.target.value })}
              />
              <input
                className="input-bh"
                placeholder="Mês / Ano (ex: 01/2026)"
                value={fingerFilters.mes_ano}
                onChange={e => setFingerFilters({ ...fingerFilters, mes_ano: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button onClick={applyFingerFilters} className="btn-primary"><Search size={13} /> Pesquisar</button>
                <button onClick={clearFingerFilters} className="btn-ghost"><X size={13} /> Limpar</button>
                <button onClick={() => exportarCSV('finger')} className="btn-secondary"><Download size={13} /> Exportar</button>
              </div>
              <span className="text-bh-muted text-sm">{fingerPagination.total} resultado{fingerPagination.total !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="card-bh">
            <div className="p-4 border-b border-bh-border flex items-center gap-3">
              <div className="w-7 h-7 bg-bh-primary rounded flex items-center justify-center text-white text-xs font-bold">b</div>
              <div>
                <h3 className="text-bh-text font-medium text-sm">Relatório — Finger</h3>
                <p className="text-bh-muted text-xs">Visualizar dados consolidados por finger</p>
              </div>
            </div>
            <table className="table-bh">
              <thead>
                <tr>
                  <th>Finger</th>
                  <th>Software House</th>
                  <th>Credenciado</th>
                  <th>Porcentagem</th>
                  <th>Valor Finger</th>
                  <th>Período</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {fingerRegistros.map(r => (
                  <tr key={`${r.id}-${r.periodo}-${r.finger}`}>
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
                      <span className="bg-bh-primary/20 text-bh-primary text-xs px-2 py-0.5 rounded font-medium">
                        {r.porcentagem}%
                      </span>
                    </td>
                    <td className="font-medium">{formatBRL(r.valor_finger)}</td>
                    <td>{r.periodo}</td>
                    <td>{r.data}</td>
                  </tr>
                ))}
                {fingerRegistros.length > 0 && (
                  <tr className="bg-bh-surface2">
                    <td colSpan={4} className="font-bold text-bh-text">TOTAL</td>
                    <td className="font-bold text-bh-text">{formatBRL(totalValorFinger)}</td>
                    <td colSpan={2}></td>
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
