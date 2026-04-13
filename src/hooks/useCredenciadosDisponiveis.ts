import { useState, useMemo } from 'react'
import type { Credenciado, CredenciadoVinculo } from '../types/sh.types'
import { mockCredenciadosDisponiveis } from '../mocks/credenciados'

export function useCredenciadosDisponiveis(vinculados: CredenciadoVinculo[]) {
  const [search, setSearch] = useState('')

  const vinculadosIds = new Set(vinculados.map(v => v.credenciado_id))

  const disponiveis = useMemo(() => {
    return mockCredenciadosDisponiveis.filter(c => {
      const notVinculado = !vinculadosIds.has(c.id)
      const q = search.toLowerCase()
      const matchSearch = !q || c.nome.toLowerCase().includes(q) || c.cnpj.includes(q)
      return notVinculado && matchSearch
    })
  }, [vinculados, search])

  function getCredenciado(id: string): Credenciado | undefined {
    return mockCredenciadosDisponiveis.find(c => c.id === id)
  }

  return { disponiveis, search, setSearch, getCredenciado }
}
