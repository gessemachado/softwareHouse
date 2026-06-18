import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { ArrowLeft, Search, X, Download, TrendingDown, DollarSign, BarChart3, Paperclip, CheckCircle2, Eye } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { Pagination } from '../components/ui/Pagination'
import { MonthPicker } from '../components/ui/MonthPicker'
import { useRelatorio } from '../hooks/useRelatorio'

function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function StatCard({ label, value, subtitle, icon: Icon }: {
  label: string
  value: string
  subtitle: string
  icon: React.ElementType
}) {
  return (
    <div className="card-bh p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-bh-muted text-sm font-medium">{label}</span>
        <Icon size={16} className="text-bh-muted mt-0.5" />
      </div>
      <p className="text-bh-text text-2xl font-bold leading-none">{value}</p>
      <p className="text-bh-muted text-xs">{subtitle}</p>
    </div>
  )
}

export function RelatorioFinanceiro({ scope = 'sh' }: { scope?: 'sh' | 'finger' }) {
  const navigate = useNavigate()
  const [notasFiscais, setNotasFiscais] = useState<Record<string, File>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function handleAnexar(key: string) {
    fileInputRefs.current[key]?.click()
  }

  function handleFileChange(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setNotasFiscais(prev => ({ ...prev, [key]: file }))
    e.target.value = ''
  }

  function handleVisualizar(file: File) {
    const url = URL.createObjectURL(file)
    window.open(url, '_blank')
  }
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
            <StatCard
              label="Valor Taxa"
              value={formatBRL(totais.valor_taxa)}
              subtitle="Valor bruto cobrado"
              icon={DollarSign}
            />
            <StatCard
              label="Imposto (20%)"
              value={formatBRL(totais.imposto)}
              subtitle="Deduzido do valor bruto"
              icon={TrendingDown}
            />
            <StatCard
              label="Valor Software House"
              value={formatBRL(totais.valor_sh)}
              subtitle="Após impostos"
              icon={BarChart3}
            />
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
              <div className="sm:w-56">
                <MonthPicker
                  value={filters.meses ?? []}
                  onChange={v => setFilters({ ...filters, meses: v })}
                />
              </div>
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
            <StatCard
              label="Valor Taxa"
              value={formatBRL(totais.valor_taxa)}
              subtitle="Valor bruto cobrado"
              icon={DollarSign}
            />
            <StatCard
              label="Imposto (20%)"
              value={formatBRL(totais.imposto)}
              subtitle="Deduzido do valor bruto"
              icon={TrendingDown}
            />
            <StatCard
              label="Total Fingers"
              value={formatBRL(fingerTotais.valor_total_fingers)}
              subtitle="Participação acumulada"
              icon={BarChart3}
            />
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
              <div className="sm:w-56">
                <MonthPicker
                  value={fingerFilters.meses ?? []}
                  onChange={v => setFingerFilters({ ...fingerFilters, meses: v })}
                />
              </div>
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
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {fingerRegistros.map(r => {
                  const key = `${r.id}-${r.periodo}`
                  const nf  = notasFiscais[key]
                  return (
                    <tr key={key}>
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
                      <td>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          ref={el => { fileInputRefs.current[key] = el }}
                          onChange={e => handleFileChange(key, e)}
                        />
                        {nf ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                            <span className="text-xs text-bh-muted truncate max-w-[100px]" title={nf.name}>
                              {nf.name}
                            </span>
                            <button
                              title="Visualizar"
                              onClick={() => handleVisualizar(nf)}
                              className="text-bh-muted hover:text-bh-primary transition-colors flex-shrink-0"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              title="Substituir"
                              onClick={() => handleAnexar(key)}
                              className="text-bh-muted hover:text-bh-text transition-colors flex-shrink-0"
                            >
                              <Paperclip size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            title="Anexar Nota Fiscal"
                            onClick={() => handleAnexar(key)}
                            className="flex items-center gap-1.5 text-xs text-bh-muted hover:text-bh-primary transition-colors"
                          >
                            <Paperclip size={13} />
                            <span>Anexar NF</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {fingerRegistros.length > 0 && (
                  <tr className="bg-bh-surface2">
                    <td colSpan={5} className="font-bold text-bh-text">TOTAL</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalValorFinger)}</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalValorFinger * 0.2)}</td>
                    <td className="font-bold text-bh-primary">{formatBRL(totalValorFinger * 0.8)}</td>
                    <td className="font-bold text-bh-primary">
                      {formatBRL(fingerRegistros.reduce((s, r) => s + r.valor_finger * 0.8 * (r.porcentagem / 100), 0))}
                    </td>
                    <td />
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
