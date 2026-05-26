import { useState } from 'react'
import type {
  WizardState, WizardStep,
  DadosBasicosForm, DadosOperacionaisForm,
  RepresentanteForm, FingerForm, CredenciadoVinculo
} from '../types/sh.types'

const initialState: WizardState = {
  step: 1,
  completedSteps: [],
  dadosBasicos: {},
  dadosOperacionais: { prazo_pagamento: 30, participacao_sh: 0, participacao_representante: 0 },
  representantes: [],
  fingers: [],
  credenciados: [],
}

export function useWizardState() {
  const [state, setState] = useState<WizardState>(initialState)

  function goToStep(step: WizardStep) {
    setState(s => ({ ...s, step }))
  }

  function completeStep(step: WizardStep, nextStep: WizardStep) {
    setState(s => ({
      ...s,
      step: nextStep,
      completedSteps: s.completedSteps.includes(step)
        ? s.completedSteps
        : [...s.completedSteps, step],
    }))
  }

  function updateDadosBasicos(data: DadosBasicosForm) {
    setState(s => ({ ...s, dadosBasicos: data }))
    completeStep(1, 2)
  }

  function updateDadosOperacionais(data: DadosOperacionaisForm) {
    setState(s => ({ ...s, dadosOperacionais: data }))
    completeStep(2, 3)
  }

  // Representantes
  function addRepresentante(rep: RepresentanteForm) {
    setState(s => ({ ...s, representantes: [...s.representantes, rep] }))
  }
  function updateRepresentante(idx: number, rep: RepresentanteForm) {
    setState(s => {
      const list = [...s.representantes]
      list[idx] = rep
      return { ...s, representantes: list }
    })
  }
  function removeRepresentante(idx: number) {
    setState(s => ({
      ...s,
      representantes: s.representantes.filter((_, i) => i !== idx),
      credenciados: s.credenciados.filter(c => c.representante_idx !== idx).map(c => ({
        ...c,
        representante_idx: c.representante_idx > idx ? c.representante_idx - 1 : c.representante_idx,
      })),
    }))
  }
  function advanceFromRepresentantes() {
    completeStep(3, 4)
  }

  // Fingers
  function addFinger(finger: FingerForm) {
    setState(s => ({ ...s, fingers: [...s.fingers, finger] }))
  }
  function updateFinger(idx: number, finger: FingerForm) {
    setState(s => {
      const list = [...s.fingers]
      list[idx] = finger
      return { ...s, fingers: list }
    })
  }
  function removeFinger(idx: number) {
    setState(s => ({
      ...s,
      fingers: s.fingers.filter((_, i) => i !== idx),
      credenciados: s.credenciados.filter(c => c.finger_idx !== idx).map(c => ({
        ...c,
        finger_idx: c.finger_idx > idx ? c.finger_idx - 1 : c.finger_idx,
      })),
    }))
  }
  function advanceFromFingers() {
    completeStep(4, 5)
  }

  // Credenciados
  function addCredenciado(vinculo: CredenciadoVinculo) {
    setState(s => ({ ...s, credenciados: [...s.credenciados, vinculo] }))
  }
  function removeCredenciado(credenciado_id: string) {
    setState(s => ({ ...s, credenciados: s.credenciados.filter(c => c.credenciado_id !== credenciado_id) }))
  }

  function initFromEdit(
    representantes: RepresentanteForm[],
    fingers: FingerForm[],
    credenciados: CredenciadoVinculo[]
  ) {
    setState(s => ({
      ...s,
      representantes,
      fingers,
      credenciados,
      completedSteps: [1, 2, 3, 4, 5],
    }))
  }

  function reset() {
    setState(initialState)
  }

  return {
    state,
    goToStep,
    updateDadosBasicos,
    updateDadosOperacionais,
    addRepresentante,
    updateRepresentante,
    removeRepresentante,
    advanceFromRepresentantes,
    addFinger,
    updateFinger,
    removeFinger,
    advanceFromFingers,
    addCredenciado,
    removeCredenciado,
    initFromEdit,
    reset,
  }
}
