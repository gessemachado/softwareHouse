import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import {
  Briefcase, CreditCard, Tag, FileText, Mail, Phone,
  MapPin, Hash, Home, Globe, Building2, Info, ChevronRight,
  X, Users, UserPlus, CreditCard as IDCard,
} from 'lucide-react'
import type { DadosBasicosForm, SocioRepresentante } from '../../types/sh.types'
import { buscarEnderecoPorCEP } from '../../services/viacep'

function formatCNPJ(v: string) {
  return v.replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18)
}

function formatTelefone(v: string) {
  return v.replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
    .slice(0, 15)
}

function formatCEP(v: string) {
  return v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9)
}

function formatCPF(v: string) {
  return v.replace(/\D/g, '')
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
    .slice(0, 14)
}

const TIPOS_SOCIO = [
  'Sócio Administrador',
  'Sócio',
  'CEO',
  'Diretor',
  'Representante Legal',
  'Procurador',
]

const schema = z.object({
  cnpj: z.string().min(18, 'CNPJ inválido').max(18),
  nome_fantasia: z.string().min(2, 'Nome fantasia obrigatório'),
  razao_social: z.string().min(2, 'Razão social obrigatória'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(14, 'Telefone inválido'),
  cep: z.string().min(9, 'CEP inválido'),
  logradouro: z.string().min(2, 'Logradouro obrigatório'),
  numero: z.string().min(1, 'Número obrigatório'),
  bairro: z.string().min(2, 'Bairro obrigatório'),
  municipio: z.string().min(2, 'Município obrigatório'),
  estado: z.string().length(2, 'Estado obrigatório'),
})

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

interface Props {
  defaultValues?: Partial<DadosBasicosForm>
  onNext: (data: DadosBasicosForm) => void
  onCancel: () => void
}

function FieldIcon({ icon: Icon }: { icon: React.ElementType }) {
  return <Icon size={12} className="text-bh-primary" />
}

export function Step1DadosBasicos({ defaultValues, onNext, onCancel }: Props) {
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError]     = useState('')

  // ── Sócios staging ────────────────────────────────────────────────────────
  const [socios, setSocios]         = useState<SocioRepresentante[]>(defaultValues?.socios ?? [])
  const [sNome, setSNome]           = useState('')
  const [sCPF, setSCPF]             = useState('')
  const [sEmail, setSEmail]         = useState('')
  const [sTipo, setSTipo]           = useState('')

  function adicionarSocio() {
    if (!sNome.trim() || !sCPF.trim() || !sTipo) return
    setSocios(prev => [...prev, { nome: sNome.trim(), cpf: sCPF, email: sEmail.trim(), tipo: sTipo }])
    setSNome(''); setSCPF(''); setSEmail(''); setSTipo('')
  }

  function removerSocio(idx: number) {
    setSocios(prev => prev.filter((_, i) => i !== idx))
  }

  // ─────────────────────────────────────────────────────────────────────────
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DadosBasicosForm>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DadosBasicosForm ?? {},
  })

  async function onCEPBlur() {
    const cep = watch('cep')
    setCepError('')
    setCepLoading(true)
    const result = await buscarEnderecoPorCEP(cep)
    setCepLoading(false)
    if (result) {
      setValue('logradouro', result.logradouro)
      setValue('bairro', result.bairro)
      setValue('municipio', result.localidade)
      setValue('estado', result.uf)
    } else {
      setCepError('CEP não encontrado. Preencha o endereço manualmente.')
    }
  }

  function handleNext(data: DadosBasicosForm) {
    onNext({ ...data, socios })
  }

  return (
    <form onSubmit={handleSubmit(handleNext)} className="space-y-6">
      {/* Dados Básicos */}
      <div className="card-bh p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-bh-primary/20 rounded flex items-center justify-center text-bh-primary">
            <Briefcase size={16} />
          </div>
          <div>
            <h3 className="text-bh-text font-semibold text-sm">Dados Básicos</h3>
            <p className="text-bh-muted text-xs">Informações da empresa</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-bh flex items-center gap-1.5">
              <FieldIcon icon={CreditCard} /> CNPJ <span className="text-bh-primary">*</span>
            </label>
            <input
              className="input-bh"
              placeholder="00.000.000/0000-00"
              {...register('cnpj')}
              onChange={e => setValue('cnpj', formatCNPJ(e.target.value))}
            />
            {errors.cnpj && <p className="error-msg">{errors.cnpj.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FieldIcon icon={Tag} /> Nome Fantasia <span className="text-bh-primary">*</span>
              </label>
              <input className="input-bh" placeholder="Digite o nome fantasia" {...register('nome_fantasia')} />
              {errors.nome_fantasia && <p className="error-msg">{errors.nome_fantasia.message}</p>}
            </div>
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FieldIcon icon={FileText} /> Razão Social <span className="text-bh-primary">*</span>
              </label>
              <input className="input-bh" placeholder="Digite a razão social" {...register('razao_social')} />
              {errors.razao_social && <p className="error-msg">{errors.razao_social.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FieldIcon icon={Mail} /> E-mail <span className="text-bh-primary">*</span>
              </label>
              <input className="input-bh" type="email" placeholder="exemplo@email.com" {...register('email')} />
              {errors.email && <p className="error-msg">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FieldIcon icon={Phone} /> Telefone <span className="text-bh-primary">*</span>
              </label>
              <input
                className="input-bh"
                placeholder="(00) 00000-0000"
                {...register('telefone')}
                onChange={e => setValue('telefone', formatTelefone(e.target.value))}
              />
              {errors.telefone && <p className="error-msg">{errors.telefone.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="card-bh p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-bh-primary/20 rounded flex items-center justify-center text-bh-primary">
            <MapPin size={16} />
          </div>
          <div>
            <h3 className="text-bh-text font-semibold text-sm">Endereço e Localização</h3>
            <p className="text-bh-muted text-xs">Localização da empresa</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FieldIcon icon={Home} /> CEP <span className="text-bh-primary">*</span>
              </label>
              <input
                className="input-bh"
                placeholder="00000-000"
                {...register('cep')}
                onChange={e => setValue('cep', formatCEP(e.target.value))}
                onBlur={onCEPBlur}
              />
              {cepLoading && <p className="text-bh-muted text-xs mt-1">Buscando CEP...</p>}
              {cepError && <p className="error-msg">{cepError}</p>}
              {errors.cep && <p className="error-msg">{errors.cep.message}</p>}
            </div>
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FieldIcon icon={MapPin} /> Logradouro <span className="text-bh-primary">*</span>
              </label>
              <input className="input-bh" placeholder="Rua, Avenida, etc." {...register('logradouro')} />
              {errors.logradouro && <p className="error-msg">{errors.logradouro.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FieldIcon icon={Hash} /> Número <span className="text-bh-primary">*</span>
              </label>
              <input className="input-bh" placeholder="Nº" {...register('numero')} />
              {errors.numero && <p className="error-msg">{errors.numero.message}</p>}
            </div>
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FieldIcon icon={Building2} /> Bairro <span className="text-bh-primary">*</span>
              </label>
              <input className="input-bh" placeholder="Nome do bairro" {...register('bairro')} />
              {errors.bairro && <p className="error-msg">{errors.bairro.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FieldIcon icon={Globe} /> Estado <span className="text-bh-primary">*</span>
              </label>
              <select className="input-bh" {...register('estado')}>
                <option value="">Selecione o estado</option>
                {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
              {errors.estado && <p className="error-msg">{errors.estado.message}</p>}
            </div>
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <FieldIcon icon={Building2} /> Município <span className="text-bh-primary">*</span>
              </label>
              <input className="input-bh" placeholder="Nome do município" {...register('municipio')} />
              {errors.municipio && <p className="error-msg">{errors.municipio.message}</p>}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 bg-bh-primary/5 border border-bh-primary/20 rounded p-3">
          <Info size={14} className="text-bh-primary mt-0.5 flex-shrink-0" />
          <p className="text-bh-muted text-xs">
            <span className="text-bh-text font-medium">Campos obrigatórios</span><br />
            Todos os campos marcados com * são obrigatórios para o cadastro da Software House.
          </p>
        </div>
      </div>

      {/* Representantes da Empresa */}
      <div className="card-bh p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-bh-primary/20 rounded flex items-center justify-center text-bh-primary">
            <Users size={16} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-bh-text font-semibold text-sm">Representantes da Empresa</h3>
              {socios.length > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded font-semibold"
                  style={{ background: 'rgba(255,102,0,0.12)', color: '#ff6600' }}>
                  {socios.length}
                </span>
              )}
            </div>
            <p className="text-bh-muted text-xs">Sócios e representantes legais para o contrato</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Staging */}
          <div className="rounded-lg border border-bh-border p-4"
            style={{ background: 'rgb(var(--bh-surface2))' }}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="label-bh flex items-center gap-1.5 mb-1">
                  <UserPlus size={11} className="text-bh-primary" /> Nome completo
                </label>
                <input
                  className="input-bh text-sm"
                  placeholder="Nome do representante"
                  value={sNome}
                  onChange={e => setSNome(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                />
              </div>
              <div>
                <label className="label-bh flex items-center gap-1.5 mb-1">
                  <IDCard size={11} className="text-bh-primary" /> CPF
                </label>
                <input
                  className="input-bh text-sm"
                  placeholder="000.000.000-00"
                  value={sCPF}
                  onChange={e => setSCPF(formatCPF(e.target.value))}
                  onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                />
              </div>
              <div>
                <label className="label-bh flex items-center gap-1.5 mb-1">
                  <Mail size={11} className="text-bh-primary" /> E-mail
                </label>
                <input
                  className="input-bh text-sm"
                  type="email"
                  placeholder="email@empresa.com.br"
                  value={sEmail}
                  onChange={e => setSEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                />
              </div>
              <div>
                <label className="label-bh flex items-center gap-1.5 mb-1">
                  <FileText size={11} className="text-bh-primary" /> Tipo
                </label>
                <select
                  className="input-bh text-sm"
                  value={sTipo}
                  onChange={e => setSTipo(e.target.value)}
                >
                  <option value="">Selecione o tipo</option>
                  {TIPOS_SOCIO.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <button
              type="button"
              disabled={!sNome.trim() || !sCPF.trim() || !sTipo}
              onClick={e => { e.preventDefault(); e.stopPropagation(); adicionarSocio() }}
              className="btn-primary text-xs py-1.5 w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <UserPlus size={13} /> Adicionar Representante
            </button>
          </div>

          {/* Lista */}
          {socios.length === 0 ? (
            <p className="text-bh-subtle text-xs py-3 text-center border border-dashed border-bh-border rounded-lg">
              Nenhum representante adicionado
            </p>
          ) : (
            <table className="w-full text-xs border border-bh-border rounded-lg overflow-hidden">
              <thead>
                <tr style={{ background: 'rgb(var(--bh-surface2))' }}>
                  <th className="text-left px-3 py-2 text-bh-muted font-medium">Nome</th>
                  <th className="text-left px-3 py-2 text-bh-muted font-medium">CPF</th>
                  <th className="text-left px-3 py-2 text-bh-muted font-medium">E-mail</th>
                  <th className="text-left px-3 py-2 text-bh-muted font-medium">Tipo</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {socios.map((s, i) => (
                  <tr key={i} className="border-t border-bh-border">
                    <td className="px-3 py-2 text-bh-text font-medium">{s.nome}</td>
                    <td className="px-3 py-2 text-bh-muted tabular-nums">{s.cpf}</td>
                    <td className="px-3 py-2 text-bh-muted">{s.email || '—'}</td>
                    <td className="px-3 py-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                        style={{ background: 'rgba(255,102,0,0.10)', color: '#ff6600' }}>
                        {s.tipo}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removerSocio(i)}
                        className="text-bh-subtle hover:text-bh-danger transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={onCancel} className="btn-ghost">
          <X size={14} /> Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Próximo: Dados Operacionais <ChevronRight size={15} />
        </button>
      </div>
    </form>
  )
}
