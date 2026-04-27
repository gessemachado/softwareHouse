import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClipboardList, Calendar, Percent, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import type { DadosOperacionaisForm } from '../../types/sh.types'

const schema = z.object({
  prazo_pagamento: z.number().int().positive('Prazo deve ser maior que zero'),
  participacao_sh: z.number().min(0).max(100),
  participacao_representante: z.number().min(0).max(100),
})

interface Props {
  defaultValues?: Partial<DadosOperacionaisForm>
  onNext: (data: DadosOperacionaisForm) => void
  onBack: () => void
}

export function Step2DadosOperacionais({ defaultValues, onNext, onBack }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<DadosOperacionaisForm>({
    resolver: zodResolver(schema),
    defaultValues: { prazo_pagamento: 30, participacao_sh: 0, participacao_representante: 0, ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <div className="card-bh p-5 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-bh-primary/20 rounded flex items-center justify-center text-bh-primary">
            <ClipboardList size={16} />
          </div>
          <div>
            <h3 className="text-bh-text font-semibold text-sm">Dados Operacionais</h3>
            <p className="text-bh-muted text-xs">Configurações financeiras e comissionamento</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-bh flex items-center gap-1.5">
              <Calendar size={12} className="text-bh-primary" /> Prazo para pagamento após o recebimento <span className="text-bh-primary">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                className="input-bh pr-12"
                placeholder="30"
                {...register('prazo_pagamento', { valueAsNumber: true })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bh-muted text-sm">dias</span>
            </div>
            <p className="text-bh-muted text-xs mt-1">Prazo em dias para o pagamento após a venda</p>
            {errors.prazo_pagamento && <p className="error-msg">{errors.prazo_pagamento.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <Percent size={12} className="text-bh-primary" /> Participação Software House
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  className="input-bh pr-8"
                  placeholder="0.00"
                  {...register('participacao_sh', { valueAsNumber: true })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bh-muted text-sm">%</span>
              </div>
              <p className="text-bh-muted text-xs mt-1">Percentual de comissão da Software House</p>
              {errors.participacao_sh && <p className="error-msg">{errors.participacao_sh.message}</p>}
            </div>
            <div>
              <label className="label-bh flex items-center gap-1.5">
                <Users size={12} className="text-bh-primary" /> Participação Representante
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  className="input-bh pr-8"
                  placeholder="0.00"
                  {...register('participacao_representante', { valueAsNumber: true })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bh-muted text-sm">%</span>
              </div>
              <p className="text-bh-muted text-xs mt-1">Percentual de comissão do Representante</p>
              {errors.participacao_representante && <p className="error-msg">{errors.participacao_representante.message}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="btn-ghost">
          <ChevronLeft size={15} /> Voltar
        </button>
        <button type="submit" className="btn-primary">
          Próximo: Representantes <ChevronRight size={15} />
        </button>
      </div>
    </form>
  )
}
