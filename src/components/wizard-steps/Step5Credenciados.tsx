import { useState } from 'react'
import { Link2, SlidersHorizontal, Search, X, Plus, Trash2, ChevronLeft, Check } from 'lucide-react'
import type { CredenciadoVinculo, Credenciado, RepresentanteForm, FingerForm } from '../../types/sh.types'
import { ModalVincularCredenciado } from '../modals/ModalVincularCredenciado'
import { useCredenciadosDisponiveis } from '../../hooks/useCredenciadosDisponiveis'

interface Props {
  credenciados: CredenciadoVinculo[]
  representantes: RepresentanteForm[]
  fingers: FingerForm[]
  onAdd: (vinculo: CredenciadoVinculo) => void
  onRemove: (credenciado_id: string) => void
  onFinalize: () => void
  onBack: () => void
  isLoading?: boolean
}

export function Step5Credenciados({ credenciados, representantes, fingers, onAdd, onRemove, onFinalize, onBack, isLoading }: Props) {
  const { disponiveis, search, setSearch, getCredenciado } = useCredenciadosDisponiveis(credenciados)
  const [vincularCredenciado, setVincularCredenciado] = useState<Credenciado | null>(null)

  function handleConfirmVinculo(rep_idx: number, finger_idx: number) {
    if (!vincularCredenciado) return
    onAdd({ credenciado_id: vincularCredenciado.id, representante_idx: rep_idx, finger_idx })
    setVincularCredenciado(null)
  }

  return (
    <div>
      {/* Disponíveis */}
      <div className="card-bh mb-4">
        <div className="p-4 border-b border-bh-border">
          <div className="flex items-center gap-2 mb-1">
            <SlidersHorizontal size={14} className="text-bh-primary" />
            <span className="text-bh-text text-sm font-medium">Filtros</span>
          </div>
          <p className="text-bh-muted text-xs mb-3">Pesquise credenciados disponíveis</p>
          <div className="flex gap-3">
            <input
              className="input-bh flex-1"
              placeholder="Credenciado"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary text-xs py-1.5 px-3"><Search size={13} /> Pesquisar</button>
            <button className="btn-ghost text-xs" onClick={() => setSearch('')}><X size={13} /> Limpar</button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-bh-text font-medium text-sm">Credenciados Disponíveis</h3>
              <p className="text-bh-muted text-xs">Selecione os credenciados para vincular</p>
            </div>
          </div>

          {disponiveis.length === 0 ? (
            <p className="text-bh-muted text-sm py-4 text-center">
              {search ? 'Nenhum credenciado encontrado.' : 'Todos os credenciados já estão vinculados.'}
            </p>
          ) : (
            <div className="divide-y divide-bh-border">
              {disponiveis.map(c => (
                <div key={c.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bh-primary/20 flex items-center justify-center text-bh-primary text-xs font-semibold">
                      {c.nome.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-bh-text text-sm font-medium">{c.nome}</p>
                      <p className="text-bh-muted text-xs">{c.cidade}, {c.estado} · {c.cnpj}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xs bg-green-900/30 border border-green-700/30 px-2 py-0.5 rounded">DISPONÍVEL</span>
                    <button
                      className="btn-primary text-xs py-1.5"
                      onClick={() => setVincularCredenciado(c)}
                    >
                      <Plus size={13} /> Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vinculados */}
      <div className="card-bh mb-6">
        <div className="p-4 border-b border-bh-border flex items-center gap-3">
          <div className="w-7 h-7 bg-bh-primary/20 rounded flex items-center justify-center text-bh-primary">
            <Link2 size={14} />
          </div>
          <div>
            <h3 className="text-bh-text font-medium text-sm">Credenciados Vinculados</h3>
            <p className="text-bh-muted text-xs">Credenciados vinculados a esta Software House</p>
          </div>
        </div>

        {credenciados.length === 0 ? (
          <p className="py-8 text-center text-bh-muted text-sm">Nenhum credenciado vinculado ainda.</p>
        ) : (
          <table className="table-bh">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Representante</th>
                <th>Finger</th>
                <th>E-mail</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {credenciados.map((v, i) => {
                const cred = getCredenciado(v.credenciado_id)
                const rep = representantes[v.representante_idx]
                const finger = fingers[v.finger_idx]
                return (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-bh-primary/20 flex items-center justify-center text-bh-primary text-xs font-semibold">
                          {cred?.nome.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{cred?.nome}</p>
                          <p className="text-bh-muted text-xs">{cred?.cnpj}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {rep && (
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-400 text-xs font-semibold">
                            {rep.nome_completo.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm">{rep.nome_completo}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      {finger && (
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full bg-green-900/40 flex items-center justify-center text-green-400 text-xs font-semibold">
                            {finger.nome_completo.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm">{finger.nome_completo}</span>
                        </div>
                      )}
                    </td>
                    <td className="text-bh-muted text-sm">{cred ? `contato@${cred.nome.toLowerCase().replace(/\s/g,'')}.com.br` : '—'}</td>
                    <td>
                      <button
                        onClick={() => { if(confirm('Desvincular este credenciado?')) onRemove(v.credenciado_id) }}
                        className="text-bh-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-ghost"><ChevronLeft size={15} /> Voltar</button>
        <button
          onClick={onFinalize}
          disabled={isLoading}
          className="btn-primary disabled:opacity-60"
        >
          {isLoading ? 'Salvando...' : <><Check size={15} /> Finalizar Criação</>}
        </button>
      </div>

      <ModalVincularCredenciado
        open={vincularCredenciado !== null}
        onClose={() => setVincularCredenciado(null)}
        credenciado={vincularCredenciado}
        representantes={representantes}
        fingers={fingers}
        onConfirm={handleConfirmVinculo}
      />
    </div>
  )
}
