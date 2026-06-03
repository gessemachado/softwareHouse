import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Fingerprint, User, Mail, Phone, CreditCard, Percent, MapPin, Globe,
  Save, Calendar, Clock, Search, X, Plus, Trash2, Link2, SlidersHorizontal, ChevronRight, ChevronLeft,
} from 'lucide-react'
import { Modal } from '../ui/Modal'
import { WizardStepper } from '../sh/WizardStepper'
import { mockCredenciadosDisponiveis } from '../../mocks/credenciados'
import type { FingerForm, Credenciado } from '../../types/sh.types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
  icon: React.ElementType
  label: string
  required?: boolean
  children: React.ReactNode
  error?: string
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={13} className="text-bh-primary" />
        <span className="text-sm text-bh-muted">
          {label}{required && <span className="text-bh-primary ml-0.5">*</span>}
        </span>
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

// ─── Credenciados tab ─────────────────────────────────────────────────────────

function CredenciadosTab({ fingerId }: { fingerId?: string }) {
  const [search, setSearch]           = useState('')
  const [applied, setApplied]         = useState('')
  const [linked, setLinked]           = useState<Set<string>>(() => {
    // Pre-populate from mock if editing an existing finger
    if (!fingerId) return new Set()
    const { mockCredenciadosVinculados } = require('../../mocks/credenciados')
    const ids = (mockCredenciadosVinculados as { finger_id: string; credenciado_id: string }[])
      .filter(v => v.finger_id === fingerId)
      .map(v => v.credenciado_id)
    return new Set(ids)
  })

  const available = useMemo(() => {
    const q = applied.toLowerCase()
    return mockCredenciadosDisponiveis.filter(c =>
      !linked.has(c.id) &&
      (!q || c.nome.toLowerCase().includes(q) || c.cnpj.includes(q))
    )
  }, [linked, applied])

  const linkedList: Credenciado[] = useMemo(
    () => mockCredenciadosDisponiveis.filter(c => linked.has(c.id)),
    [linked]
  )

  function add(id: string)    { setLinked(prev => new Set([...prev, id])) }
  function remove(id: string) { setLinked(prev => { const s = new Set(prev); s.delete(id); return s }) }

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
          <div className="mb-3">
            <h3 className="text-bh-text font-medium text-sm">Credenciados Disponíveis</h3>
            <p className="text-bh-muted text-xs">Selecione os credenciados para vincular</p>
          </div>

          {available.length === 0 ? (
            <p className="text-bh-muted text-sm py-4 text-center">
              {applied ? 'Nenhum credenciado encontrado.' : 'Todos os credenciados já foram vinculados.'}
            </p>
          ) : (
            <div className="divide-y divide-bh-border">
              {available.map(c => (
                <div key={c.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bh-primary/20 flex items-center justify-center text-bh-primary text-xs font-semibold flex-shrink-0">
                      {c.nome.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-bh-text text-sm font-medium">{c.nome}</p>
                      <p className="text-bh-muted text-xs">{c.cidade}, {c.estado} · {c.cnpj}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-green-400 text-xs bg-green-900/30 border border-green-700/30 px-2 py-0.5 rounded font-medium">
                      DISPONÍVEL
                    </span>
                    <button type="button" onClick={() => add(c.id)} className="btn-primary text-xs py-1.5">
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
      <div className="card-bh">
        <div className="p-4 border-b border-bh-border flex items-center gap-3">
          <div className="w-7 h-7 bg-bh-primary/20 rounded flex items-center justify-center text-bh-primary">
            <Link2 size={14} />
          </div>
          <div>
            <h3 className="text-bh-text font-medium text-sm">Credenciados Vinculados</h3>
            <p className="text-bh-muted text-xs">{linkedList.length} credenciado{linkedList.length !== 1 ? 's' : ''} vinculado{linkedList.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {linkedList.length === 0 ? (
          <p className="py-8 text-center text-bh-muted text-sm">Nenhum credenciado vinculado ainda.</p>
        ) : (
          <div className="divide-y divide-bh-border px-4">
            {linkedList.map(c => (
              <div key={c.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{ background: 'rgba(34,197,94,0.15)', color: 'rgb(var(--bh-success))' }}>
                    {c.nome.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-bh-text text-sm font-medium">{c.nome}</p>
                    <p className="text-bh-muted text-xs">{c.cidade}, {c.estado} · {c.cnpj}</p>
                  </div>
                </div>
                <button type="button" onClick={() => remove(c.id)}
                  className="text-bh-subtle hover:text-bh-danger transition-colors flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
  onSave: (data: FingerForm) => void
  defaultValues?: Partial<FingerForm>
  fingerId?: string
}

export function ModalFinger({ open, onClose, onSave, defaultValues, fingerId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('dados')

  const { register, handleSubmit, setValue, reset, trigger, formState: { errors } } = useForm<FingerForm>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  })

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
              <input
                className="input-bh"
                placeholder="(00) 00000-0000"
                {...register('telefone')}
                onChange={e => setValue('telefone', fmtTel(e.target.value))}
              />
            </Field>
          </div>

          <Field icon={CreditCard} label="CPF" required error={errors.cpf?.message}>
            <input
              className="input-bh"
              placeholder="000.000.000-00"
              {...register('cpf')}
              onChange={e => setValue('cpf', fmtCPF(e.target.value))}
            />
          </Field>

          <Field icon={Percent} label="Porcentagem" required error={errors.porcentagem?.message}>
            <div className="relative">
              <input
                type="number" step="0.01"
                className="input-bh pr-8"
                placeholder="0.00"
                {...register('porcentagem', { valueAsNumber: true })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bh-muted text-sm">%</span>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field icon={Calendar} label="Data de Ativação" error={errors.data_ativacao?.message}>
              <input type="date" className="input-bh" {...register('data_ativacao')} />
            </Field>
            <Field icon={Clock} label="Prazo (meses)" error={errors.prazo_meses?.message}>
              <div className="relative">
                <input
                  type="number" min={1} max={120}
                  className="input-bh pr-12"
                  placeholder="Ex: 12"
                  {...register('prazo_meses', { valueAsNumber: true })}
                />
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
        <CredenciadosTab fingerId={fingerId} />
      )}
    </Modal>
  )
}
