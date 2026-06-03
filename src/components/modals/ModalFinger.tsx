import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Fingerprint, User, Mail, Phone, CreditCard, Percent, MapPin, Globe,
  Save, Calendar, Clock, Search, X, Plus, Trash2, Link2,
  SlidersHorizontal, ChevronRight, ChevronLeft, Check,
} from 'lucide-react'
import { Modal } from '../ui/Modal'
import { WizardStepper } from '../sh/WizardStepper'
import { mockCredenciadosDisponiveis, mockCredenciadosVinculados } from '../../mocks/credenciados'
import type { FingerForm, Credenciado } from '../../types/sh.types'

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtCPF = (v: string) => v.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2').slice(0,14)
const fmtTel = (v: string) => v.replace(/\D/g,'').replace(/^(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d{1,4})$/,'$1-$2').slice(0,15)

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

// ─── Validation ───────────────────────────────────────────────────────────────

const schema = z.object({
  nome_completo: z.string().min(2, 'Nome obrigatório'),
  email:         z.string().email('E-mail inválido'),
  telefone:      z.string().min(14, 'Telefone inválido'),
  cpf:           z.string().min(14, 'CPF inválido'),
  porcentagem:   z.number().min(0).max(100, 'Entre 0 e 100'),
  data_ativacao: z.string().optional(),
  prazo_meses:   z.number().min(1).max(120).optional().or(z.nan().transform(() => undefined)),
  cidade:        z.string().optional(),
  estado:        z.string().optional(),
})

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ icon: Icon, label, required, children, error }: {
  icon: React.ElementType; label: string; required?: boolean; children: React.ReactNode; error?: string
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={13} className="text-bh-primary" />
        <span className="text-sm text-bh-muted">{label}{required && <span className="text-bh-primary ml-0.5">*</span>}</span>
      </div>
      {children}
      {error && <p className="error-msg">{error}</p>}
    </div>
  )
}

// ─── Steps ────────────────────────────────────────────────────────────────────

type Tab = 'dados' | 'credenciados'

const FINGER_STEPS = [
  { label: 'Dados do Finger', sublabel: 'Configurações do Finger'      },
  { label: 'Credenciados',    sublabel: 'Configurações do Credenciado' },
]

// ─── Vinculo local type ───────────────────────────────────────────────────────

interface VinculoLocal {
  credenciadoId:   string
  representanteId: string | null
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ nome, color = 'primary' }: { nome: string; color?: 'primary' | 'green' | 'blue' }) {
  const styles = {
    primary: 'bg-bh-primary/20 text-bh-primary',
    green:   'text-green-400',
    blue:    'text-blue-400',
  }
  const bgStyle = color === 'green'
    ? { background: 'rgba(34,197,94,0.15)' }
    : color === 'blue'
    ? { background: 'rgba(59,130,246,0.15)' }
    : {}

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${color === 'primary' ? styles.primary : ''}`}
      style={color !== 'primary' ? bgStyle : {}}
    >
      <span style={color !== 'primary' ? { color: color === 'green' ? 'rgb(34,197,94)' : 'rgb(59,130,246)' } : {}}>
        {nome.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

// ─── Modal de confirmação de vínculo ─────────────────────────────────────────

interface ModalVinculoProps {
  open: boolean
  credenciado: Credenciado | null
  fingerNome: string
  fingerEmail: string
  fingerTelefone: string
  onClose: () => void
  onConfirm: () => void
}

function ModalConfirmarVinculo({ open, credenciado, fingerNome, fingerEmail, fingerTelefone, onClose, onConfirm }: ModalVinculoProps) {
  function handleConfirm() {
    onConfirm()
    onClose()
  }

  if (!credenciado) return null

  return (
    <Modal
      open={open}
      onClose={() => { setSelectedRepId(null); onClose() }}
      title="Vincular Credenciado"
      subtitle="Confirme o finger para vincular ao credenciado"
      icon={<Link2 size={22} />}
      footer={
        <>
          <span className="text-xs text-bh-subtle">Confirme o vínculo do credenciado com este finger.</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => { setSelectedRepId(null); onClose() }} className="btn-ghost">
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn-primary"
            >
              <Check size={14} /> Confirmar Vínculo
            </button>
          </div>
        </>
      }
    >
      {/* Credenciado selecionado */}
      <div className="bg-bh-surface2 border border-bh-border rounded-lg p-4">
        <p className="text-bh-muted text-xs mb-2">Credenciado Selecionado</p>
        <div className="flex items-center gap-3">
          <Avatar nome={credenciado.nome} />
          <div>
            <p className="text-bh-text text-sm font-semibold">{credenciado.nome}</p>
            <p className="text-bh-muted text-xs">{credenciado.cidade}, {credenciado.estado} · {credenciado.cnpj}</p>
          </div>
        </div>
      </div>

      {/* Finger pré-preenchido */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Fingerprint size={14} className="text-bh-primary" />
          <p className="text-bh-text text-sm font-medium">Selecione o Finger</p>
        </div>
        <div className="p-3 rounded-lg border border-bh-primary bg-bh-primary/10">
          <div className="flex items-center gap-2">
            <Avatar nome={fingerNome || 'FI'} color="green" />
            <div className="min-w-0">
              <p className="text-bh-text text-xs font-medium truncate">{fingerNome || '—'}</p>
              <p className="text-bh-muted text-xs truncate">{fingerEmail}</p>
              <p className="text-bh-muted text-xs">{fingerTelefone}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ─── Credenciados tab ─────────────────────────────────────────────────────────

interface CredenciadosTabProps {
  fingerId?:       string
  fingerNome:      string
  fingerEmail:     string
  fingerTelefone:  string
  shId?:           string
}

function CredenciadosTab({ fingerId, fingerNome, fingerEmail, fingerTelefone, shId }: CredenciadosTabProps) {
  const [search, setSearch]   = useState('')
  const [applied, setApplied] = useState('')
  const [page, setPage]       = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [vinculos, setVinculos] = useState<VinculoLocal[]>(() => {
    if (!fingerId) return []
    return mockCredenciadosVinculados
      .filter(v => v.finger_id === fingerId)
      .map(v => ({ credenciadoId: v.credenciado_id, representanteId: v.representante_id }))
  })
  const [pendingCred, setPendingCred] = useState<Credenciado | null>(null)

  const linkedIds = useMemo(() => new Set(vinculos.map(v => v.credenciadoId)), [vinculos])

  const available = useMemo(() => {
    const q = applied.toLowerCase()
    return mockCredenciadosDisponiveis.filter(c =>
      !linkedIds.has(c.id) &&
      (!q || c.nome.toLowerCase().includes(q) || c.cnpj.includes(q))
    )
  }, [linkedIds, applied])

  const totalPages  = Math.max(1, Math.ceil(available.length / pageSize))
  const paginatedAvailable = useMemo(() => {
    const from = (page - 1) * pageSize
    return available.slice(from, from + pageSize)
  }, [available, page, pageSize])

  function handleConfirmVinculo() {
    if (!pendingCred) return
    setVinculos(prev => [...prev, { credenciadoId: pendingCred.id, representanteId: null }])
    setPendingCred(null)
  }

  function removeVinculo(credenciadoId: string) {
    setVinculos(prev => prev.filter(v => v.credenciadoId !== credenciadoId))
  }

  function getCredenciado(id: string) { return mockCredenciadosDisponiveis.find(c => c.id === id) }

  return (
    <div className="flex flex-col gap-4">
      {/* Disponíveis */}
      <div className="card-bh">
        <div className="p-4 border-b border-bh-border">
          <div className="flex items-center gap-2 mb-1">
            <SlidersHorizontal size={14} className="text-bh-primary" />
            <span className="text-bh-text text-sm font-medium">Filtros</span>
          </div>
          <p className="text-bh-muted text-xs mb-3">Pesquise credenciados disponíveis</p>
          <input
            className="input-bh"
            placeholder="Credenciado"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setApplied(search)}
          />
          <div className="flex gap-2 mt-3">
            <button type="button" onClick={() => setApplied(search)} className="btn-primary text-xs py-1.5 px-3">
              <Search size={13} /> Pesquisar
            </button>
            <button type="button" onClick={() => { setSearch(''); setApplied('') }} className="btn-ghost text-xs">
              <X size={13} /> Limpar
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-bh-text font-medium text-sm">Credenciados Disponíveis</h3>
              <p className="text-bh-muted text-xs">Selecione os credenciados para vincular</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-bh-subtle text-xs">Por página:</span>
              {[5, 10, 15].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setPageSize(n); setPage(1) }}
                  className="px-2 py-0.5 rounded text-xs font-medium transition-colors"
                  style={pageSize === n
                    ? { background: 'rgb(var(--bh-primary))', color: '#fff' }
                    : { background: 'rgb(var(--bh-surface2))', color: 'rgb(var(--bh-muted))' }
                  }
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {available.length === 0 ? (
            <p className="text-bh-muted text-sm py-4 text-center">
              {applied ? 'Nenhum credenciado encontrado.' : 'Todos os credenciados já foram vinculados.'}
            </p>
          ) : (
            <>
              <div className="divide-y divide-bh-border">
                {paginatedAvailable.map(c => (
                  <div key={c.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Avatar nome={c.nome} />
                      <div>
                        <p className="text-bh-text text-sm font-medium">{c.nome}</p>
                        <p className="text-bh-muted text-xs">CNPJ: {c.cnpj} · {c.cidade}, {c.estado}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setPendingCred(c)} className="btn-primary text-xs py-1.5 flex-shrink-0">
                      Adicionar
                    </button>
                  </div>
                ))}
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-end gap-4 pt-3 mt-1 border-t border-bh-border">
                <button
                  type="button"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-sm text-bh-muted hover:text-bh-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <span className="text-sm text-bh-muted">
                  Página <span className="text-bh-text font-semibold">{page}</span> de{' '}
                  <span className="text-bh-text font-semibold">{totalPages}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-sm font-bold text-bh-primary hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                >
                  Próximo
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Vinculados — tabela */}
      <div className="card-bh">
        <div className="p-4 border-b border-bh-border flex items-center gap-3">
          <div className="w-7 h-7 bg-bh-primary/20 rounded flex items-center justify-center text-bh-primary">
            <Link2 size={14} />
          </div>
          <div>
            <h3 className="text-bh-text font-medium text-sm">Credenciados Vinculados</h3>
            <p className="text-bh-muted text-xs">Credenciados vinculados a este Finger</p>
          </div>
        </div>

        {vinculos.length === 0 ? (
          <p className="py-8 text-center text-bh-muted text-sm">Nenhum credenciado vinculado ainda.</p>
        ) : (
          <table className="table-bh">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Finger</th>
                <th>E-mail</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vinculos.map((v, i) => {
                const cred = getCredenciado(v.credenciadoId)
                return (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar nome={cred?.nome ?? '?'} />
                        <div>
                          <p className="font-medium text-bh-text text-sm">{cred?.nome ?? '—'}</p>
                          <p className="text-bh-muted text-xs">{cred?.cnpj}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar nome={fingerNome || 'FI'} color="green" />
                        <span className="text-bh-text text-sm">{fingerNome || '—'}</span>
                      </div>
                    </td>
                    <td className="text-bh-muted text-sm">
                      {cred ? `contato@${cred.nome.toLowerCase().replace(/\s+/g, '').slice(0,20)}.com.br` : '—'}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeVinculo(v.credenciadoId)}
                        className="text-bh-subtle hover:text-bh-danger transition-colors"
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

      {/* Modal de confirmação */}
      <ModalConfirmarVinculo
        open={pendingCred !== null}
        credenciado={pendingCred}
        fingerNome={fingerNome}
        fingerEmail={fingerEmail}
        fingerTelefone={fingerTelefone}
        onClose={() => setPendingCred(null)}
        onConfirm={handleConfirmVinculo}
      />
    </div>
  )
}

// ─── Modal principal ──────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
  onSave: (data: FingerForm) => void
  defaultValues?: Partial<FingerForm>
  fingerId?: string
  shId?: string
}

export function ModalFinger({ open, onClose, onSave, defaultValues, fingerId, shId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('dados')

  const { register, handleSubmit, setValue, reset, trigger, watch, formState: { errors } } = useForm<FingerForm>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  })

  useEffect(() => {
    if (open) {
      reset(defaultValues ?? {})
      setActiveTab('dados')
    }
  }, [open])

  const fingerNome     = watch('nome_completo') || ''
  const fingerEmail    = watch('email')         || ''
  const fingerTelefone = watch('telefone')      || ''

  async function handleNext() {
    const valid = await trigger()
    if (valid) setActiveTab('credenciados')
  }

  function onSubmit(data: FingerForm) {
    onSave(data)
    reset()
    setActiveTab('dados')
    onClose()
  }

  function handleClose() {
    reset()
    setActiveTab('dados')
    onClose()
  }

  const isEdit = !!defaultValues?.nome_completo

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Editar Finger' : 'Adicionar Novo Finger'}
      subtitle={isEdit ? 'Atualize os dados do finger' : 'Preencha os dados do finger'}
      icon={<Fingerprint size={22} />}
      footer={
        <>
          <span className="text-xs text-bh-subtle">Campos marcados com * são obrigatórios.</span>
          <div className="flex gap-2">
            <button type="button" onClick={handleClose} className="btn-ghost">Cancelar</button>

            {activeTab === 'dados' && (
              <button type="button" onClick={handleNext} className="btn-primary">
                Próximo: Credenciado <ChevronRight size={15} />
              </button>
            )}

            {activeTab === 'credenciados' && (
              <>
                <button type="button" onClick={() => setActiveTab('dados')} className="btn-secondary">
                  <ChevronLeft size={15} /> Voltar
                </button>
                <button type="submit" form="form-finger" className="btn-primary">
                  <Save size={14} /> {isEdit ? 'Salvar Alterações' : 'Salvar Finger'}
                </button>
              </>
            )}
          </div>
        </>
      }
    >
      {/* Stepper */}
      <WizardStepper
        currentStep={activeTab === 'dados' ? 1 : 2}
        completedSteps={activeTab === 'credenciados' ? [1] : []}
        steps={FINGER_STEPS}
        onStepClick={step => setActiveTab(step === 1 ? 'dados' : 'credenciados')}
        className="card-bh p-5"
      />

      {/* Tab: Dados */}
      {activeTab === 'dados' && (
        <form id="form-finger" onSubmit={handleSubmit(onSubmit)} className="contents">
          <Field icon={User} label="Nome Completo" required error={errors.nome_completo?.message}>
            <input className="input-bh" placeholder="Digite o nome completo" {...register('nome_completo')} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field icon={Mail} label="E-mail" required error={errors.email?.message}>
              <input className="input-bh" type="email" placeholder="exemplo@email.com" {...register('email')} />
            </Field>
            <Field icon={Phone} label="Telefone" required error={errors.telefone?.message}>
              <input className="input-bh" placeholder="(00) 00000-0000" {...register('telefone')}
                onChange={e => setValue('telefone', fmtTel(e.target.value))} />
            </Field>
          </div>

          <Field icon={CreditCard} label="CPF" required error={errors.cpf?.message}>
            <input className="input-bh" placeholder="000.000.000-00" {...register('cpf')}
              onChange={e => setValue('cpf', fmtCPF(e.target.value))} />
          </Field>

          <Field icon={Percent} label="Porcentagem" required error={errors.porcentagem?.message}>
            <div className="relative">
              <input type="number" step="0.01" className="input-bh pr-8" placeholder="0.00"
                {...register('porcentagem', { valueAsNumber: true })} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bh-muted text-sm">%</span>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field icon={Calendar} label="Data de Ativação" error={errors.data_ativacao?.message}>
              <input type="date" className="input-bh" {...register('data_ativacao')} />
            </Field>
            <Field icon={Clock} label="Prazo (meses)" error={errors.prazo_meses?.message}>
              <div className="relative">
                <input type="number" min={1} max={120} className="input-bh pr-12" placeholder="Ex: 12"
                  {...register('prazo_meses', { valueAsNumber: true })} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bh-muted text-xs">meses</span>
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field icon={MapPin} label="Cidade">
              <input className="input-bh" placeholder="Nome da cidade" {...register('cidade')} />
            </Field>
            <Field icon={Globe} label="Estado">
              <select className="input-bh" {...register('estado')}>
                <option value="">Selecione</option>
                {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </Field>
          </div>
        </form>
      )}

      {/* Tab: Credenciados */}
      {activeTab === 'credenciados' && (
        <CredenciadosTab
          fingerId={fingerId}
          fingerNome={fingerNome}
          fingerEmail={fingerEmail}
          fingerTelefone={fingerTelefone}
          shId={shId}
        />
      )}
    </Modal>
  )
}
