import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserPlus, User, Mail, Phone, CreditCard, MapPin, Globe, Save } from 'lucide-react'
import { Modal } from '../ui/Modal'
import type { RepresentanteForm } from '../../types/sh.types'

const fmtCPF = (v: string) => v.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2').slice(0,14)
const fmtTel = (v: string) => v.replace(/\D/g,'').replace(/^(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d{1,4})$/,'$1-$2').slice(0,15)

const schema = z.object({
  nome_completo: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(14, 'Telefone inválido'),
  cpf: z.string().min(14, 'CPF inválido'),
  cidade: z.string().optional(),
  estado: z.string().optional(),
})

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

interface Props {
  open: boolean
  onClose: () => void
  onSave: (data: RepresentanteForm) => void
  defaultValues?: Partial<RepresentanteForm>
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

export function ModalRepresentante({ open, onClose, onSave, defaultValues }: Props) {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<RepresentanteForm>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  })

  function onSubmit(data: RepresentanteForm) {
    onSave(data)
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Adicionar Novo Representante"
      subtitle="Preencha os dados do representante"
      icon={<UserPlus size={22} />}
      footer={
        <>
          <span className="text-xs text-bh-subtle">Campos marcados com * são obrigatórios.</span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
            <button type="submit" form="form-representante" className="btn-primary">
              <Save size={14} /> Salvar Representante
            </button>
          </div>
        </>
      }
    >
      <form id="form-representante" onSubmit={handleSubmit(onSubmit)} className="contents">
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
