import { useState, useEffect } from 'react'
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
import { getSoftwareHouseById, createSoftwareHouse, updateSoftwareHouse } from '../services/supabase/softwareHouseService'
import { listRepresentantes, createRepresentantesLote } from '../services/supabase/representanteService'
import { listFingers, createFingersLote } from '../services/supabase/fingerService'
import { listSHCredenciados, createSHCredenciadosLote } from '../services/supabase/credenciadoService'
import type { SoftwareHouse, RepresentanteForm, FingerForm, CredenciadoVinculo } from '../types/sh.types'

interface Props {
  mode: 'create' | 'edit'
}

export function SoftwareHouseWizard({ mode }: Props) {
  const navigate = useNavigate()
  const { id } = useParams()
  const {
    state, goToStep,
    updateDadosBasicos, updateDadosOperacionais,
    addRepresentante, updateRepresentante, removeRepresentante, advanceFromRepresentantes,
    addFinger, updateFinger, removeFinger, advanceFromFingers,
    addCredenciado, removeCredenciado,
    initFromEdit,
    reset,
  } = useWizardState()

  const [isLoading, setIsLoading] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(mode === 'edit')
  const [existingSH, setExistingSH] = useState<SoftwareHouse | undefined>()
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Carrega dados da SH existente no modo edit
  useEffect(() => {
    if (mode !== 'edit' || !id) return
    setLoadingEdit(true)
    Promise.all([
      getSoftwareHouseById(id),
      listRepresentantes(id),
      listFingers(id),
      listSHCredenciados(id),
    ])
      .then(([sh, reps, fings, shCreds]) => {
        setExistingSH(sh)

        const repForms: RepresentanteForm[] = reps.map(
          ({ id: _id, software_house_id: _shId, data_vinculo: _dv, ...rest }) => rest
        )
        const fingerForms: FingerForm[] = fings.map(
          ({ id: _id, software_house_id: _shId, data_vinculo: _dv, ...rest }) => rest
        )
        const credVinculos: CredenciadoVinculo[] = shCreds
          .map(sc => ({
            credenciado_id: sc.credenciado_id,
            representante_idx: reps.findIndex(r => r.id === sc.representante_id),
            finger_idx: fings.findIndex(f => f.id === sc.finger_id),
          }))
          .filter(v => v.representante_idx >= 0 && v.finger_idx >= 0)

        initFromEdit(repForms, fingerForms, credVinculos)
      })
      .catch(() => showToast('error', 'Erro ao carregar Software House'))
      .finally(() => setLoadingEdit(false))
  }, [mode, id])

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleFinalize() {
    setIsLoading(true)
    try {
      const dadosBasicos = state.dadosBasicos as Required<typeof state.dadosBasicos>
      const dadosOp = state.dadosOperacionais as Required<typeof state.dadosOperacionais>

      if (mode === 'edit' && id) {
        await updateSoftwareHouse(id, { ...dadosBasicos, ...dadosOp })
        showToast('success', 'Software House atualizada com sucesso!')
      } else {
        // 1. Cria a SH
        const sh = await createSoftwareHouse({ ...dadosBasicos, ...dadosOp })

        // 2. Cria representantes e fingers em lote
        const [reps, fingers] = await Promise.all([
          createRepresentantesLote(sh.id, state.representantes),
          createFingersLote(sh.id, state.fingers),
        ])

        // 3. Cria vínculos de credenciados
        const repIds = reps.map(r => r.id)
        const fingerIds = fingers.map(f => f.id)
        await createSHCredenciadosLote(sh.id, state.credenciados, repIds, fingerIds)

        showToast('success', 'Software House criada com sucesso!')
      }

      reset()
      setTimeout(() => navigate('/software-house'), 1200)
    } catch (e: any) {
      showToast('error', e?.message ?? 'Erro ao salvar. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingEdit) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-bh-muted">
          Carregando...
        </div>
      </AppLayout>
    )
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
          <p className="text-bh-muted text-sm">
            Preencha os dados para a {mode === 'edit' ? 'edição' : 'criação'} de uma nova software house
          </p>
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
