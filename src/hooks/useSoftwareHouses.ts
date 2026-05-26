import { useState, useMemo } from 'react'
import type { SoftwareHouse, SHFilters, PaginationState } from '../types/sh.types'
import { mockSoftwareHouses } from '../mocks/softwareHouses'

export function useSoftwareHouses() {
  const [filters, setFilters] = useState<SHFilters>({ search: '', status: '' })
  const [appliedFilters, setAppliedFilters] = useState<SHFilters>({ search: '', status: '' })
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 10, total: 0 })

  const filtered = useMemo(() => {
    let list = [...mockSoftwareHouses]
    if (appliedFilters.search) {
      const q = appliedFilters.search.toLowerCase()
      list = list.filter(sh =>
        sh.nome_fantasia.toLowerCase().includes(q) ||
        sh.razao_social.toLowerCase().includes(q) ||
        sh.cnpj.includes(q) ||
        sh.municipio.toLowerCase().includes(q)
      )
    }
    if (appliedFilters.status) {
      list = list.filter(sh => sh.status === appliedFilters.status)
    }
    return list
  }, [appliedFilters])

  const total = filtered.length
  const data: SoftwareHouse[] = useMemo(() => {
    const from = (pagination.page - 1) * pagination.pageSize
    return filtered.slice(from, from + pagination.pageSize)
  }, [filtered, pagination.page, pagination.pageSize])

  function applyFilters() {
    setAppliedFilters({ ...filters })
    setPagination(p => ({ ...p, page: 1 }))
  }

  function clearFilters() {
    const empty: SHFilters = { search: '', status: '' }
    setFilters(empty)
    setAppliedFilters(empty)
    setPagination(p => ({ ...p, page: 1 }))
  }

  return {
    data,
    total,
    loading: false,
    error: null,
    filters,
    setFilters,
    applyFilters,
    clearFilters,
    pagination: { ...pagination, total },
    setPage: (page: number) => setPagination(p => ({ ...p, page })),
    reload: () => {},
    toggleStatus: async () => {},
    remove: async () => {},
  }
}
