import { useState, useEffect } from 'react'
import type { Credenciado, CredenciadoVinculo } from '../types/sh.types'
import { listAllCredenciados } from '../services/supabase/credenciadoService'

export function useCredenciadosDisponiveis(vinculados: CredenciadoVinculo[]) {
  const [todos, setTodos] = useState<Credenciado[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    listAllCredenciados()
      .then(setTodos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const vinculadosIds = new Set(vinculados.map(v => v.credenciado_id))

  const disponiveis = todos.filter(c => {
    const notVinculado = !vinculadosIds.has(c.id)
    const q = search.toLowerCase()
    const matchSearch = !q || c.nome.toLowerCase().includes(q) || c.cnpj.includes(q)
    return notVinculado && matchSearch
  })

  function getCredenciado(id: string): Credenciado | undefined {
    return todos.find(c => c.id === id)
  }

  return { disponiveis, search, setSearch, getCredenciado, loading }
}
