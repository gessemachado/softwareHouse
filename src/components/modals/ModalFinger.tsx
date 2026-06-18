import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Fingerprint, User, Mail, Phone, CreditCard, Percent, MapPin, Globe,
  Save, Calendar, Clock, Search, X, Trash2, Link2, Building2, Home, Hash,
  SlidersHorizontal, ChevronRight, ChevronLeft, Check, Briefcase, Tag, FileText, Settings, RotateCcw,
} from 'lucide-react'
import type { RenovacaoPrazo } from '../../types/sh.types'
import { Modal } from '../ui/Modal'
import { WizardStepper } from '../sh/WizardStepper'
import { mockCredenciadosDisponiveis, mockCredenciadosVinculados } from '../../mocks/credenciados'
import type { FingerForm, Credenciado } from '../../types/sh.types'

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtCPF  = (v: string) => v.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2').slice(0,14)
const fmtTel  = (v: string) => v.replace(/\D/g,'').replace(/^(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d{1,4})$/,'$1-$2').slice(0,15)
const fmtCNPJ = (v: string) => v.replace(/\D/g,'').replace(/^(\d{2})(\d)/,'$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/,'$1.$2.$3').replace(/\.(\d{3})(\d)/,'.$1/$2').replace(/(\d{4})(\d{1,2})$/,'$1-$2').slice(0,18)
const fmtCEP  = (v: string) => v.replace(/\D/g,'').replace(/^(\d{5})(\d)/,'$1-$2').slice(0,9)

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

// ─── Validation ───────────────────────────────────────────────────────────────

const schema = z.object({
  cnpj:          z.string().min(18, 'CNPJ inválido'),
  razao_social:  z.string().min(2, 'Razão Social obrigatória'),
  nome_fantasia: z.string().optional(),
  email:         z.string().email('E-mail inválido'),
  telefone:      z.string().min(14, 'Telefone inválido'),
  cep:           z.string().optional(),
  logradouro:    z.string().optional(),
  numero:        z.string().optional(),
  bairro:        z.string().optional(),
  municipio:     z.string().optional(),
  estado:        z.string().optional(),
  nome_completo: z.string().min(2, 'Nome obrigatório'),
  cpf:           z.string().min(14, 'CPF inválido'),
})

// ─── Field helpers ────────────────────────────────────────────────────────────

function FIcon({ icon: Icon }: { icon: React.ElementType }) {
  return <Icon size={12} className="text-bh-primary" />
}

function SectionCard({ icon: Icon, title, subtitle, children }: {
  icon: React.ElementType; title: string; subtitle: string; children: React.ReactNode
}) {
  return (
    <div className="card-bh p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-bh-primary/20 rounded flex items-center justify-center text-bh-primary">
          <Icon size={16} />
        </div>
        <div>
          <h3 className="text-bh-text font-semibold text-sm">{title}</h3>
          <p className="text-bh-muted text-xs">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// ─── Steps ────────────────────────────────────────────────────────────────────

type Tab = 'dados' | 'credenciados'

const FINGER_STEPS = [
  { label: 'Dados do Finger', sublabel: 'CNPJ, endereço e responsável'  },
  { label: 'Credenciados',    sublabel: 'Configurações do Credenciado'  },
]

// ─── Vinculo local type ───────────────────────────────────────────────────────

interface VinculoLocal {
  credenciadoId:   string
  representanteId: string | null
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ nome, color = 'primary' }: { nome: string; color?: 'primary' | 'green' | 'blue' }) {
  const bgStyle = color === 'green'
    ? { background: 'rgba(34,197,94,0.15)' }
    : color === 'blue'
    ? { background: 'rgba(59,130,246,0.15)' }
    : {}

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${color === 'primary' ? 'bg-bh-primary/20 text-bh-primary' : ''}`}
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
  if (!credenciado) return null
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Vincular Credenciado"
      subtitle="Confirme o finger para vincular ao credenciado"
      icon={<Link2 size={22} />}
      footer={
        <>
          <span className="text-xs text-bh-subtle">Confirme o vínculo do credenciado com este finger.</span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
            <button type="button" onClick={() => { onConfirm(); onClose() }} className="btn-primary">
              <Check size={14} /> Confirmar Vínculo
            </button>
          </div>
        </>
      }
    >
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
  fingerId?:      string
  fingerNome:     string
  fingerEmail:    string
  fingerTelefone: string
  shId?:          string
}

function CredenciadosTab({ fingerId, fingerNome, fingerEmail, fingerTelefone }: CredenciadosTabProps) {
  const [search, setSearch]     = useState('')
  const [applied, setApplied]   = useState('')
  const [page, setPage]         = useState(1)
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
      !linkedIds.has(c.id) && (!q || c.nome.toLowerCase().includes(q) || c.cnpj.includes(q))
    )
  }, [linkedIds, applied])

  const totalPages = Math.max(1, Math.ceil(available.length / pageSize))
  const paginatedAvailable = useMemo(() => {
    const from = (page - 1) * pageSize
    return available.slice(from, from + pageSize)
  }, [available, page, pageSize])

  function getCredenciado(id: string) { return mockCredenciadosDisponiveis.find(c => c.id === id) }

  return (
    <div className="flex flex-col gap-4">
      <div className="card-bh">
        <div className="p-4 border-b border-bh-border">
          <div className="flex items-center gap-2 mb-1">
            <SlidersHorizontal size={14} className="text-bh-primary" />
            <span className="text-bh-text text-sm font-medium">Filtros</span>
          </div>
          <p className="text-bh-muted text-xs mb-3">Pesquise credenciados disponíveis</p>
          <input className="input-bh" placeholder="Credenciado" value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setApplied(search)} />
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
                <button key={n} type="button" onClick={() => { setPageSize(n); setPage(1) }}
                  className="px-2 py-0.5 rounded text-xs font-medium transition-colors"
                  style={pageSize === n
                    ? { background: 'rgb(var(--bh-primary))', color: '#fff' }
                    : { background: 'rgb(var(--bh-surface2))', color: 'rgb(var(--bh-muted))' }}>
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
              <div className="flex items-center justify-end gap-4 pt-3 mt-1 border-t border-bh-border">
                <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="text-sm text-bh-muted hover:text-bh-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Anterior
                </button>
                <span className="text-sm text-bh-muted">
                  Página <span className="text-bh-text font-semibold">{page}</span> de{' '}
                  <span className="text-bh-text font-semibold">{totalPages}</span>
                </span>
                <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="text-sm font-bold text-bh-primary hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity">
                  Próximo
                </button>
              </div>
            </>
          )}
        </div>
      </div>

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
                      {cred ? `contato@${cred.nome.toLowerCase().replace(/\s+/g,'').slice(0,20)}.com.br` : '—'}
                    </td>
                    <td>
                      <button type="button"
                        onClick={() => setVinculos(prev => prev.filter(x => x.credenciadoId !== v.credenciadoId))}
                        className="text-bh-subtle hover:text-bh-danger transition-colors">
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

      <ModalConfirmarVinculo
        open={pendingCred !== null}
        credenciado={pendingCred}
        fingerNome={fingerNome}
        fingerEmail={fingerEmail}
        fingerTelefone={fingerTelefone}
        onClose={() => setPendingCred(null)}
        onConfirm={() => {
          if (pendingCred) setVinculos(prev => [...prev, { credenciadoId: pendingCred.id, representanteId: null }])
          setPendingCred(null)
        }}
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
  const [activeTab, setActiveTab]     = useState<Tab>('dados')
  const [renovacoes, setRenovacoes]   = useState<RenovacaoPrazo[]>([])
  const [stagingDate, setStagingDate]   = useState('')
  const [stagingMeses, setStagingMeses] = useState('')
  const [stagingPct, setStagingPct]     = useState('')

  const { register, handleSubmit, setValue, reset, trigger, watch, formState: { errors } } = useForm<FingerForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues ?? {},
  })

  useEffect(() => {
    if (open) {
      reset(defaultValues ?? {})
      setRenovacoes(defaultValues?.renovacoes ?? [])
      setStagingDate('')
      setStagingMeses('')
      setStagingPct('')
      setActiveTab('dados')
    }
  }, [open])

  const fingerNome     = watch('nome_completo') || ''
  const fingerEmail    = watch('email')         || ''
  const fingerTelefone = watch('telefone')      || ''

  const stepNumber     = activeTab === 'dados' ? 1 : 2
  const completedSteps = activeTab === 'credenciados' ? [1] : []

  async function handleNextDados() {
    const valid = await trigger(['cnpj', 'razao_social', 'email', 'telefone', 'nome_completo', 'cpf'])
    if (valid) setActiveTab('credenciados')
  }

  function addMonths(dateStr: string, months: number): string {
    const d = new Date(dateStr + 'T00:00:00')
    d.setMonth(d.getMonth() + months)
    return d.toISOString().slice(0, 10)
  }

  function adicionarVigencia() {
    const meses = parseInt(stagingMeses, 10)
    if (!stagingDate || !meses || meses < 1) return
    const pct = parseFloat(stagingPct)
    setRenovacoes(prev => [...prev, {
      data_inicio: stagingDate,
      meses,
      porcentagem: isNaN(pct) ? undefined : pct,
    }])
    setStagingDate('')
    setStagingMeses('')
    setStagingPct('')
  }

  function removerRenovacao(idx: number) {
    setRenovacoes(prev => prev.filter((_, i) => i !== idx))
  }

  const totalMeses = renovacoes.reduce((sum, r) => sum + (Number(r.meses) || 0), 0)

  function onSubmit(data: FingerForm) {
    onSave({ ...data, renovacoes }); reset(); setRenovacoes([]); setActiveTab('dados'); onClose()
  }

  function handleClose() {
    reset(); setActiveTab('dados'); onClose()
  }

  const isEdit = !!defaultValues?.cnpj

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
              <button type="button" onClick={handleNextDados} className="btn-primary">
                Próximo: Credenciados <ChevronRight size={15} />
              </button>
            )}
            {activeTab === 'credenciados' && (
              <>
                <button type="button" onClick={() => setActiveTab('dados')} className="btn-secondary">
                  <ChevronLeft size={15} /> Voltar
                </button>
                <button type="button" onClick={() => handleSubmit(onSubmit as any)()} className="btn-primary">
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
        currentStep={stepNumber}
        completedSteps={completedSteps}
        steps={FINGER_STEPS}
        onStepClick={step => setActiveTab(step === 1 ? 'dados' : 'credenciados')}
        className="card-bh p-5"
      />

      {/* ── Tab: Dados ── */}
      {activeTab === 'dados' && (
        <div className="contents">

          {/* Dados Básicos */}
          <SectionCard icon={Briefcase} title="Dados Básicos" subtitle="Informações da empresa">
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FIcon icon={CreditCard} /> CNPJ <span className="text-bh-primary">*</span>
              </label>
              <input className="input-bh" placeholder="00.000.000/0000-00" {...register('cnpj')}
                onChange={e => setValue('cnpj', fmtCNPJ(e.target.value))} />
              {errors.cnpj && <p className="error-msg">{errors.cnpj.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-bh flex items-center gap-1.5">
                  <FIcon icon={Tag} /> Nome Fantasia <span className="text-bh-primary">*</span>
                </label>
                <input className="input-bh" placeholder="Nome fantasia" {...register('nome_fantasia')} />
              </div>
              <div>
                <label className="label-bh flex items-center gap-1.5">
                  <FIcon icon={FileText} /> Razão Social <span className="text-bh-primary">*</span>
                </label>
                <input className="input-bh" placeholder="Razão social completa" {...register('razao_social')} />
                {errors.razao_social && <p className="error-msg">{errors.razao_social.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-bh flex items-center gap-1.5">
                  <FIcon icon={Mail} /> E-mail <span className="text-bh-primary">*</span>
                </label>
                <input className="input-bh" type="email" placeholder="exemplo@email.com" {...register('email')} />
                {errors.email && <p className="error-msg">{errors.email.message}</p>}
              </div>
              <div>
                <label className="label-bh flex items-center gap-1.5">
                  <FIcon icon={Phone} /> Telefone <span className="text-bh-primary">*</span>
                </label>
                <input className="input-bh" placeholder="(00) 00000-0000" {...register('telefone')}
                  onChange={e => setValue('telefone', fmtTel(e.target.value))} />
                {errors.telefone && <p className="error-msg">{errors.telefone.message}</p>}
              </div>
            </div>
          </SectionCard>

          {/* Endereço e Localização */}
          <SectionCard icon={MapPin} title="Endereço e Localização" subtitle="Localização da empresa">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-bh flex items-center gap-1.5">
                  <FIcon icon={Home} /> CEP
                </label>
                <input className="input-bh" placeholder="00000-000" {...register('cep')}
                  onChange={e => setValue('cep', fmtCEP(e.target.value))} />
              </div>
              <div>
                <label className="label-bh flex items-center gap-1.5">
                  <FIcon icon={MapPin} /> Logradouro
                </label>
                <input className="input-bh" placeholder="Rua, Avenida, etc." {...register('logradouro')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-bh flex items-center gap-1.5">
                  <FIcon icon={Hash} /> Número
                </label>
                <input className="input-bh" placeholder="Nº" {...register('numero')} />
              </div>
              <div>
                <label className="label-bh flex items-center gap-1.5">
                  <FIcon icon={Building2} /> Bairro
                </label>
                <input className="input-bh" placeholder="Nome do bairro" {...register('bairro')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-bh flex items-center gap-1.5">
                  <FIcon icon={Globe} /> Estado
                </label>
                <select className="input-bh" {...register('estado')}>
                  <option value="">Selecione</option>
                  {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
              <div>
                <label className="label-bh flex items-center gap-1.5">
                  <FIcon icon={Building2} /> Município
                </label>
                <input className="input-bh" placeholder="Nome do município" {...register('municipio')} />
              </div>
            </div>
          </SectionCard>

          {/* Configurações Comerciais */}
          <SectionCard icon={Settings} title="Configurações Comerciais" subtitle="Vigências e porcentagem por período">

            {/* Vigências — staging area */}
            <div className="pt-1">
              <div className="flex items-center gap-1.5 mb-3">
                <RotateCcw size={12} className="text-bh-primary" />
                <span className="label-bh">Vigências</span>
                {renovacoes.length > 0 && (
                  <span className="text-xs tabular-nums" style={{ color: 'rgb(var(--bh-muted))' }}>
                    · Total: <strong className="text-bh-text">{totalMeses}m</strong>
                  </span>
                )}
              </div>

              <div className="rounded-lg border border-bh-border p-3 mb-3"
                style={{ background: 'rgb(var(--bh-surface2))' }}>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="label-bh flex items-center gap-1.5 mb-1">
                      <FIcon icon={Calendar} /> Data de Início
                    </label>
                    <input
                      type="date"
                      className="input-bh text-sm"
                      value={stagingDate}
                      onChange={e => setStagingDate(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                    />
                  </div>
                  <div>
                    <label className="label-bh flex items-center gap-1.5 mb-1">
                      <FIcon icon={Clock} /> Prazo (meses)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        className="input-bh text-sm pr-12"
                        placeholder="Ex: 24"
                        value={stagingMeses}
                        onChange={e => setStagingMeses(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bh-muted text-xs">meses</span>
                    </div>
                  </div>
                  <div>
                    <label className="label-bh flex items-center gap-1.5 mb-1">
                      <FIcon icon={Percent} /> Porcentagem
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        className="input-bh text-sm pr-7"
                        placeholder="0.00"
                        value={stagingPct}
                        onChange={e => setStagingPct(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bh-muted text-xs">%</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={e => { e.preventDefault(); e.stopPropagation(); adicionarVigencia(); }}
                  disabled={!stagingDate || !parseInt(stagingMeses, 10)}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RotateCcw size={12} /> Adicionar Vigência
                </button>
              </div>

              {renovacoes.length === 0 ? (
                <p className="text-bh-subtle text-xs py-2.5 text-center border border-dashed border-bh-border rounded-lg">
                  Nenhuma vigência adicionada
                </p>
              ) : (
                <table className="w-full text-xs border border-bh-border rounded-lg overflow-hidden">
                  <thead>
                    <tr style={{ background: 'rgb(var(--bh-surface2))' }}>
                      <th className="text-left px-3 py-2 text-bh-muted font-medium">#</th>
                      <th className="text-left px-3 py-2 text-bh-muted font-medium">Data de Início</th>
                      <th className="text-left px-3 py-2 text-bh-muted font-medium">Data Fim</th>
                      <th className="text-left px-3 py-2 text-bh-muted font-medium">Prazo</th>
                      <th className="text-left px-3 py-2 text-bh-muted font-medium">Porcentagem</th>
                      <th className="text-left px-3 py-2 text-bh-muted font-medium">Acumulado</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {renovacoes.map((r, i) => {
                      const acumulado = renovacoes.slice(0, i + 1).reduce((s, x) => s + (Number(x.meses) || 0), 0)
                      const dataFim = r.data_inicio ? addMonths(r.data_inicio, r.meses) : '—'
                      return (
                        <tr key={i} className="border-t border-bh-border">
                          <td className="px-3 py-2 text-bh-muted font-semibold">{i + 1}</td>
                          <td className="px-3 py-2 text-bh-text tabular-nums">{r.data_inicio || '—'}</td>
                          <td className="px-3 py-2 text-bh-muted tabular-nums">{dataFim}</td>
                          <td className="px-3 py-2">
                            <span className="px-1.5 py-0.5 rounded font-semibold tabular-nums"
                              style={{ background: 'rgba(255,102,0,0.12)', color: '#ff6600' }}>
                              {r.meses}m
                            </span>
                          </td>
                          <td className="px-3 py-2 text-bh-text tabular-nums">
                            {r.porcentagem != null ? `${r.porcentagem}%` : '—'}
                          </td>
                          <td className="px-3 py-2 text-bh-muted tabular-nums">{acumulado}m</td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => removerRenovacao(i)}
                              className="text-bh-subtle hover:text-bh-danger transition-colors"
                            >
                              <X size={13} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </SectionCard>

          {/* Responsável */}
          <SectionCard icon={User} title="Dados do Responsável" subtitle="Pessoa responsável pelo finger">
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FIcon icon={User} /> Nome Completo <span className="text-bh-primary">*</span>
              </label>
              <input className="input-bh" placeholder="Digite o nome completo" {...register('nome_completo')} />
              {errors.nome_completo && <p className="error-msg">{errors.nome_completo.message}</p>}
            </div>
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FIcon icon={CreditCard} /> CPF <span className="text-bh-primary">*</span>
              </label>
              <input className="input-bh" placeholder="000.000.000-00" {...register('cpf')}
                onChange={e => setValue('cpf', fmtCPF(e.target.value))} />
              {errors.cpf && <p className="error-msg">{errors.cpf.message}</p>}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── Tab: Credenciados ── */}
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
