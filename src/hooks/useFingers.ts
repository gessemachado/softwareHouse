import { useState, useMemo } from 'react'
import type { Finger, FingerForm } from '../types/sh.types'
import { mockFingers } from '../mocks/fingers'
import { mockSoftwareHouses } from '../mocks/softwareHouses'
import { mockCredenciadosVinculados } from '../mocks/credenciados'

export interface FingerEnriquecido extends Finger {
  software_house_nome:  string
  qtd_lojas_vinculadas: number
}

const INITIAL_FINGERS: FingerEnriquecido[] = mockFingers.map(f => ({
  ...f,
  software_house_nome:  mockSoftwareHouses.find(sh => sh.id === f.software_house_id)?.nome_fantasia ?? '—',
  qtd_lojas_vinculadas: mockCredenciadosVinculados.filter(v => v.finger_id === f.id).length,
}))

export function useFingers() {
  const [fingers, setFingers] = useState<FingerEnriquecido[]>(INITIAL_FINGERS)
  const [search, setSearch]   = useState('')
  const [applied, setApplied] = useState('')
  const [page, setPage]       = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    if (!applied) return fingers
    const q = applied.toLowerCase()
    return fingers.filter(f =>
      f.razao_social.toLowerCase().includes(q) ||
      f.cnpj.includes(q) ||
      f.nome_completo.toLowerCase().includes(q)
    )
  }, [fingers, applied])

  const total = filtered.length
  const data  = useMemo(() => {
    const from = (page - 1) * pageSize
    return filtered.slice(from, from + pageSize)
  }, [filtered, page])

  function applySearch() { setApplied(search); setPage(1) }
  function clearSearch()  { setSearch(''); setApplied(''); setPage(1) }

  function addFinger(shId: string, form: FingerForm) {
    setFingers(prev => [{
      ...form,
      id: `finger-${Date.now()}`,
      software_house_id: shId,
      data_vinculo: new Date().toISOString(),
      software_house_nome:  mockSoftwareHouses.find(sh => sh.id === shId)?.nome_fantasia ?? '—',
      qtd_lojas_vinculadas: 0,
    }, ...prev])
  }

  function editFinger(id: string, form: FingerForm) {
    setFingers(prev => prev.map(f => f.id === id ? { ...f, ...form } : f))
  }

  function deleteFinger(id: string) {
    setFingers(prev => prev.filter(f => f.id !== id))
  }

  return {
    data, total, search, setSearch,
    applySearch, clearSearch,
    pagination: { page, pageSize, total },
    setPage,
    addFinger, editFinger, deleteFinger,
    softwareHouses: mockSoftwareHouses,
  }
}
