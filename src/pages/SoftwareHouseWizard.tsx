import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Store, ChevronLeft } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { WizardStepper } from '../components/sh/WizardStepper'
import { Step1DadosBasicos } from '../components/wizard-steps/Step1DadosBasicos'
import { Step2DadosOperacionais } from '../components/wizard-steps/Step2DadosOperacionais'
import { Step3Representantes } from '../components/wizard-steps/Step3Representantes'
import { Step4Fingers } from '../components/wizard-steps/Step4Fingers'
import { Step5Credenciados } from '../components/wizard-steps/Step5Credenciados'
import { useWizardState } from '../hooks/useWizardState'
import { useSoftwareHouses } from '../hooks/useSoftwareHouses'

interface Props {
  mode: 'create' | 'edit'
}

export function SoftwareHouseWizard({ mode }: Props) {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getSoftwareHouse, addSoftwareHouse, updateSoftwareHouse } = useSoftwareHouses()
  const {
    state, goToStep,
    updateDadosBasicos, updateDadosOperacionais,
    addRepresentante, updateRepresentante, removeRepresentante, advanceFromRepresentantes,
    addFinger, updateFinger, removeFinger, advanceFromFingers,
    addCredenciado, removeCredenciado,
    reset,
  } = useWizardState()

  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const existingSH = mode === 'edit' && id ? getSoftwareHouse(id) : undefined

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleFinalize() {
    setIsLoading(true)
    try {
      await new Promise(r => setTimeout(r, 800))

      const shData = {
        ...state.dadosBasicos as Required<typeof state.dadosBasicos>,
        ...state.dadosOperacionais as Required<typeof state.dadosOperacionais>,
        status: 'ativa' as const,
        qtd_lojas_vinculadas: state.credenciados.length,
        qtd_representantes: state.representantes.length,
      }

      if (mode === 'edit' && id) {
        updateSoftwareHouse(id, shData)
        showToast('success', 'Software House atualizada com sucesso!')
      } else {
        addSoftwareHouse(shData)
        showToast('success', 'Software House criada com sucesso!')
      }

      reset()
      setTimeout(() => navigate('/software-house'), 1200)
    } catch {
      showToast('error', 'Erro ao salvar. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="mb-2">
        <button onClick={() => navigate('/software-house')} className="text-bh-muted text-sm hover:text-bh-text transition-colors flex items-center gap-1">
          <ChevronLeft size={14} /> Software House
        </button>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-bh-primary/20 rounded flex items-center justify-center text-bh-primary">
          <Store size={18} />
        </div>
        <div>
          <h2 className="text-bh-text font-semibold">
            {mode === 'edit' ? 'Editar Software House' : 'Nova Software House'}
          </h2>
          <p className="text-bh-muted text-sm">Preencha os dados para a {mode === 'edit' ? 'edição' : 'criação'} de uma nova software house</p>
        </div>
      </div>

      {/* Stepper */}
      <WizardStepper currentStep={state.step} completedSteps={state.completedSteps} />

      {/* Steps */}
      {state.step === 1 && (
        <Step1DadosBasicos
          defaultValues={mode === 'edit' && existingSH ? existingSH : state.dadosBasicos}
          onNext={updateDadosBasicos}
          onCancel={() => navigate('/software-house')}
        />
      )}
      {state.step === 2 && (
        <Step2DadosOperacionais
          defaultValues={mode === 'edit' && existingSH ? existingSH : state.dadosOperacionais}
          onNext={updateDadosOperacionais}
          onBack={() => goToStep(1)}
        />
      )}
      {state.step === 3 && (
        <Step3Representantes
          representantes={state.representantes}
          onAdd={addRepresentante}
          onUpdate={updateRepresentante}
          onRemove={removeRepresentante}
          onNext={advanceFromRepresentantes}
          onBack={() => goToStep(2)}
        />
      )}
      {state.step === 4 && (
        <Step4Fingers
          fingers={state.fingers}
          onAdd={addFinger}
          onUpdate={updateFinger}
          onRemove={removeFinger}
          onNext={advanceFromFingers}
          onBack={() => goToStep(3)}
        />
      )}
      {state.step === 5 && (
        <Step5Credenciados
          credenciados={state.credenciados}
          representantes={state.representantes}
          fingers={state.fingers}
          onAdd={addCredenciado}
          onRemove={removeCredenciado}
          onFinalize={handleFinalize}
          onBack={() => goToStep(4)}
          isLoading={isLoading}
        />
      )}
    </AppLayout>
  )
}
