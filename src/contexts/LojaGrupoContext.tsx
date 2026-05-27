import { createContext, useContext, useState, type ReactNode } from 'react'
import { CREDENCIADOS_MOCK, GRUPOS_MOCK } from '../mocks/buyhelp-index.mock'

interface LojaGrupoState {
  modo: 'loja' | 'grupo'
  setModo: (m: 'loja' | 'grupo') => void
  credenciadoUuid: string
  setCredenciadoUuid: (uuid: string) => void
  grupoUuid: string
  setGrupoUuid: (uuid: string) => void
  pickerOpen: boolean
  setPickerOpen: (open: boolean) => void
}

const LojaGrupoContext = createContext<LojaGrupoState | null>(null)

export function LojaGrupoProvider({ children }: { children: ReactNode }) {
  const [modo, setModo]                   = useState<'loja' | 'grupo'>('loja')
  const [credenciadoUuid, setCredenciadoUuid] = useState(CREDENCIADOS_MOCK[0].uuid)
  const [grupoUuid, setGrupoUuid]         = useState(GRUPOS_MOCK[0].uuid)
  const [pickerOpen, setPickerOpen]       = useState(false)

  return (
    <LojaGrupoContext.Provider value={{
      modo, setModo,
      credenciadoUuid, setCredenciadoUuid,
      grupoUuid, setGrupoUuid,
      pickerOpen, setPickerOpen,
    }}>
      {children}
    </LojaGrupoContext.Provider>
  )
}

export function useLojaGrupo() {
  const ctx = useContext(LojaGrupoContext)
  if (!ctx) throw new Error('useLojaGrupo must be used within LojaGrupoProvider')
  return ctx
}
