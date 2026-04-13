import { useState, useMemo } from 'react'
import type { SoftwareHouse, SHFilters, PaginationState } from '../types/sh.types'
import { mockSoftwareHouses } from '../mocks/softwareHouses'

// In-memory store — substituído por Supabase futuramente
let store: SoftwareHouse[] = [...mockSoftwareHouses]

export function useSoftwareHouses() {
  const [filters, setFilters] = useState<SHFilters>({ search: '', status: '' })
  const [appliedFilters, setAppliedFilters] = useState<SHFilters>({ search: '', status: '' })
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 10, total: 0 })

  const filtered = useMemo(() => {
    return store.filter(sh => {
      const q = appliedFilters.search.toLowerCase()
      const matchSearch = !q ||
        sh.nome_fantasia.toLowerCase().includes(q) ||
        sh.cnpj.includes(q) ||
        sh.municipio.toLowerCase().includes(q)
      const matchStatus = !appliedFilters.status || sh.status === appliedFilters.status
      return matchSearch && matchStatus
    })
  }, [appliedFilters])

  const paginated = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize
    return filtered.slice(start, start + pagination.pageSize)
  }, [filtered, pagination.page, pagination.pageSize])

  function applyFilters() {
    setAppliedFilters({ ...filters })
    setPagination(p => ({ ...p, page: 1, total: filtered.length }))
  }

  function clearFilters() {
    setFilters({ search: '', status: '' })
    setAppliedFilters({ search: '', status: '' })
    setPagination(p => ({ ...p, page: 1, total: store.length }))
  }

  function addSoftwareHouse(sh: Omit<SoftwareHouse, 'id' | 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString()
    const newSH: SoftwareHouse = {
      ...sh,
      id: `sh-${Date.now()}`,
      created_at: now,
      updated_at: now,
    }
    store = [newSH, ...store]
  }

  function updateSoftwareHouse(id: string, data: Partial<SoftwareHouse>) {
    store = store.map(sh => sh.id === id ? { ...sh, ...data, updated_at: new Date().toISOString() } : sh)
  }

  const total = filtered.length

  return {
    data: paginated,
    total,
    filters,
    setFilters,
    applyFilters,
    clearFilters,
    pagination: { ...pagination, total },
    setPage: (page: number) => setPagination(p => ({ ...p, page })),
    addSoftwareHouse,
    updateSoftwareHouse,
    getSoftwareHouse: (id: string) => store.find(sh => sh.id === id),
  }
}
