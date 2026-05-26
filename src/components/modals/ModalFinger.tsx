import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Fingerprint, User, Mail, Phone, CreditCard, Percent, MapPin, Globe, Save, Calendar, Clock } from 'lucide-react'
import { Modal } from '../ui/Modal'
import type { FingerForm } from '../../types/sh.types'

const fmtCPF = (v: string) => v.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2').slice(0,14)
const fmtTel = (v: string) => v.replace(/\D/g,'').replace(/^(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d{1,4})$/,'$1-$2').slice(0,15)

const schema = z.object({
  nome_completo: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(14, 'Telefone inválido'),
  cpf: z.string().min(14, 'CPF inválido'),
  porcentagem: z.number().min(0).max(100, 'Entre 0 e 100'),
  data_ativacao: z.string().optional(),
  prazo_meses: z.number().min(1, 'Mínimo 1 mês').max(120, 'Máximo 120 meses').optional().or(z.nan().transform(() => undefined)),
  cidade: z.string().optional(),
  estado: z.string().optional(),
})

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

interface Props {
  open: boolean
  onClose: () => void
  onSave: (data: FingerForm) => void
  defaultValues?: Partial<FingerForm>
}

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
        <span className="text-sm text-bh-muted">{label}{required && <span className="text-bh-primary ml-0.5">*</span>}</span>
      </div>
      {children}
      {error && <p className="error-msg">{error}</p>}
    </div>
  )
}

export function ModalFinger({ open, onClose, onSave, defaultValues }: Props) {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FingerForm>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  })

  function onSubmit(data: FingerForm) {
    onSave(data)
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Adicionar Novo Finger"
      subtitle="Preencha os dados do finger"
      icon={<Fingerprint size={22} />}
      footer={
        <>
          <span className="text-xs text-bh-subtle">Campos marcados com * são obrigatórios.</span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
            <button type="submit" form="form-finger" className="btn-primary">
              <Save size={14} /> Salvar Finger
            </button>
          </div>
        </>
      }
    >
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
              type="number"
              step="0.01"
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
                type="number"
                min={1}
                max={120}
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
    </Modal>
  )
}
