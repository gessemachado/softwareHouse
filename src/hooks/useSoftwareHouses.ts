import { useState, useEffect, useCallback } from 'react'
import type { SoftwareHouse, SHFilters, PaginationState } from '../types/sh.types'
import {
  listSoftwareHouses,
  toggleSoftwareHouseStatus,
  deleteSoftwareHouse,
} from '../services/supabase/softwareHouseService'

export function useSoftwareHouses() {
  const [data, setData] = useState<SoftwareHouse[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState<SHFilters>({ search: '', status: '' })
  const [appliedFilters, setAppliedFilters] = useState<SHFilters>({ search: '', status: '' })
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 10, total: 0 })

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await listSoftwareHouses(appliedFilters, {
        page: pagination.page,
        pageSize: pagination.pageSize,
      })
      setData(result.data)
      setTotal(result.total)
    } catch (e: any) {
      setError(e.message ?? 'Erro ao carregar software houses')
    } finally {
      setLoading(false)
    }
  }, [appliedFilters, pagination.page, pagination.pageSize])

  useEffect(() => { fetch() }, [fetch])

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

  async function toggleStatus(id: string, status: 'ativa' | 'inativa') {
    await toggleSoftwareHouseStatus(id, status)
    await fetch()
  }

  async function remove(id: string) {
    await deleteSoftwareHouse(id)
    await fetch()
  }

  return {
    data,
    total,
    loading,
    error,
    filters,
    setFilters,
    applyFilters,
    clearFilters,
    pagination: { ...pagination, total },
    setPage: (page: number) => setPagination(p => ({ ...p, page })),
    reload: fetch,
    toggleStatus,
    remove,
  }
}
