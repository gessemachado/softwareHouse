import { Check } from 'lucide-react'

interface Step {
  label: string
  sublabel: string
}

interface Props {
  currentStep: number
  completedSteps: number[]
  steps?: Step[]
  onStepClick?: (step: number) => void
  className?: string
}

const DEFAULT_STEPS: Step[] = [
  { label: 'Dados básicos', sublabel: 'Informações principais' },
  { label: 'Dados Operacionais', sublabel: 'Configurações da operação' },
  { label: 'Representantes', sublabel: 'Configurações do Representante' },
  { label: 'Finger', sublabel: 'Configurações do Finger' },
  { label: 'Credenciado', sublabel: 'Configurações do Credenciado' },
]

export function WizardStepper({ currentStep, completedSteps, steps = DEFAULT_STEPS, onStepClick, className }: Props) {
  return (
    <div className={className ?? 'card-bh p-6 mb-6'}>
      <div className="flex items-start justify-between">
        {steps.map((step, idx) => {
          const num = idx + 1
          const isCompleted = completedSteps.includes(num)
          const isActive = currentStep === num

          return (
            <div
              key={num}
              className={`flex items-start flex-1 ${onStepClick ? 'cursor-pointer' : ''}`}
              onClick={() => onStepClick?.(num)}
            >
              {/* Step */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-bh-primary text-white'
                      : 'bg-bh-surface2 text-bh-subtle border border-bh-border'
                  }`}
                >
                  {isCompleted ? <Check size={16} /> : num}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-xs font-medium ${isActive ? 'text-bh-primary' : isCompleted ? 'text-bh-text' : 'text-bh-subtle'}`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-bh-subtle mt-0.5 max-w-[100px]">{step.sublabel}</div>
                </div>
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 mt-4 mx-2 relative top-0.5">
                  <div
                    className={`h-full rounded transition-colors ${
                      isCompleted ? 'bg-green-500' : 'bg-bh-border'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
