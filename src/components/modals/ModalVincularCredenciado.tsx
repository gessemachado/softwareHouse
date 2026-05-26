import { useState } from 'react'
import { UserRound, Fingerprint, Link2, Check } from 'lucide-react'
import { Modal } from '../ui/Modal'
import type { Credenciado, RepresentanteForm, FingerForm } from '../../types/sh.types'

interface Props {
  open: boolean
  onClose: () => void
  credenciado: Credenciado | null
  representantes: RepresentanteForm[]
  fingers: FingerForm[]
  onConfirm: (representante_idx: number, finger_idx: number) => void
}

export function ModalVincularCredenciado({ open, onClose, credenciado, representantes, fingers, onConfirm }: Props) {
  const [selectedRep, setSelectedRep] = useState<number | null>(null)
  const [selectedFinger, setSelectedFinger] = useState<number | null>(null)

  function handleConfirm() {
    if (selectedRep === null || selectedFinger === null) return
    onConfirm(selectedRep, selectedFinger)
    setSelectedRep(null)
    setSelectedFinger(null)
    onClose()
  }

  if (!credenciado) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Vincular Credenciado"
      subtitle="Selecione o representante e finger para vincular"
      icon={<Link2 size={22} />}
      footer={
        <>
          <span className="text-xs text-bh-subtle">Selecione representante e finger para confirmar.</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-ghost">Cancelar</button>
            <button
              onClick={handleConfirm}
              disabled={selectedRep === null || selectedFinger === null}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={14} /> Confirmar Vínculo
            </button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Credenciado selecionado */}
        <div className="bg-bh-surface2 border border-bh-border rounded p-3">
          <p className="text-bh-muted text-xs mb-1">Credenciado Selecionado</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-bh-primary/20 flex items-center justify-center text-bh-primary text-xs font-semibold">
              {credenciado.nome.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-bh-text text-sm font-medium">{credenciado.nome}</p>
              <p className="text-bh-muted text-xs">{credenciado.cidade}, {credenciado.estado} · {credenciado.cnpj}</p>
            </div>
          </div>
        </div>

        {/* Selecionar Representante */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserRound size={14} className="text-bh-primary" />
            <p className="text-bh-text text-sm font-medium">Selecione o Representante *</p>
          </div>
          {representantes.length === 0 ? (
            <p className="text-bh-muted text-xs bg-bh-surface2 rounded p-3">Nenhum representante cadastrado. Volte ao passo 3 e adicione um.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {representantes.map((rep, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedRep(idx)}
                  className={`text-left p-3 rounded border transition-colors ${
                    selectedRep === idx
                      ? 'border-bh-primary bg-bh-primary/10'
                      : 'border-bh-border bg-bh-surface2 hover:border-bh-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-bh-primary/20 flex items-center justify-center text-bh-primary text-xs font-semibold flex-shrink-0">
                      {rep.nome_completo.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-bh-text text-xs font-medium">{rep.nome_completo}</p>
                      <p className="text-bh-muted text-xs">{rep.email}</p>
                      <p className="text-bh-muted text-xs">{rep.telefone}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selecionar Finger */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Fingerprint size={14} className="text-bh-primary" />
            <p className="text-bh-text text-sm font-medium">Selecione o Finger *</p>
          </div>
          {fingers.length === 0 ? (
            <p className="text-bh-muted text-xs bg-bh-surface2 rounded p-3">Nenhum finger cadastrado. Volte ao passo 4 e adicione um.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {fingers.map((f, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedFinger(idx)}
                  className={`text-left p-3 rounded border transition-colors ${
                    selectedFinger === idx
                      ? 'border-bh-primary bg-bh-primary/10'
                      : 'border-bh-border bg-bh-surface2 hover:border-bh-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-bh-primary/20 flex items-center justify-center text-bh-primary text-xs font-semibold flex-shrink-0">
                      {f.nome_completo.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-bh-text text-xs font-medium">{f.nome_completo}</p>
                      <p className="text-bh-muted text-xs">{f.email}</p>
                      <p className="text-bh-muted text-xs">{f.telefone}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </Modal>
  )
}
