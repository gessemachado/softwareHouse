import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, CreditCard, MapPin, Globe, Save } from 'lucide-react'
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

function LabelIcon({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <label className="label-bh flex items-center gap-1.5">
      <Icon size={12} className="text-bh-primary" /> {children}
    </label>
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
    <Modal open={open} onClose={onClose} title="Adicionar Novo Representante" subtitle="Preencha os dados do representante">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <LabelIcon icon={User}>Nome Completo <span className="text-bh-primary">*</span></LabelIcon>
          <input className="input-bh" placeholder="Digite o nome completo" {...register('nome_completo')} />
          {errors.nome_completo && <p className="error-msg">{errors.nome_completo.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <LabelIcon icon={Mail}>E-mail <span className="text-bh-primary">*</span></LabelIcon>
            <input className="input-bh" type="email" placeholder="exemplo@email.com" {...register('email')} />
            {errors.email && <p className="error-msg">{errors.email.message}</p>}
          </div>
          <div>
            <LabelIcon icon={Phone}>Telefone <span className="text-bh-primary">*</span></LabelIcon>
            <input
              className="input-bh"
              placeholder="(00) 00000-0000"
              {...register('telefone')}
              onChange={e => setValue('telefone', fmtTel(e.target.value))}
            />
            {errors.telefone && <p className="error-msg">{errors.telefone.message}</p>}
          </div>
        </div>

        <div>
          <LabelIcon icon={CreditCard}>CPF <span className="text-bh-primary">*</span></LabelIcon>
          <input
            className="input-bh"
            placeholder="000.000.000-00"
            {...register('cpf')}
            onChange={e => setValue('cpf', fmtCPF(e.target.value))}
          />
          {errors.cpf && <p className="error-msg">{errors.cpf.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <LabelIcon icon={MapPin}>Cidade</LabelIcon>
            <input className="input-bh" placeholder="Nome da cidade" {...register('cidade')} />
          </div>
          <div>
            <LabelIcon icon={Globe}>Estado</LabelIcon>
            <select className="input-bh" {...register('estado')}>
              <option value="">Selecione</option>
              {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-bh-primary/5 border border-bh-primary/20 rounded p-3 mt-2">
          <span className="text-xs text-bh-muted">Os campos marcados com * são obrigatórios.</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" className="btn-primary"><Save size={14} /> Salvar Representante</button>
        </div>
      </form>
    </Modal>
  )
}
