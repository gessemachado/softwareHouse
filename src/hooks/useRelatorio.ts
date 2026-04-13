import { useState, useEffect, useCallback } from 'react'
import type {
  RelatorioFilters,
  RelatorioRegistro,
  RelatorioTotais,
  RelatorioFingerRegistro,
  RelatorioFingerTotais,
  PaginationState,
} from '../types/sh.types'
import { fetchRelatorioSH, fetchRelatorioFingers } from '../services/supabase/relatorioService'

const emptyFilters: RelatorioFilters = { search: '', grupo_economico: '', mes_ano: '' }

const emptyTotais: RelatorioTotais = { valor_taxa: 0, imposto: 0, valor_sh: 0, variacao_pct: 0 }
const emptyFingerTotais: RelatorioFingerTotais = {
  valor_total_fingers: 0,
  valor_medio_porcentagem: 0,
  qtd_fingers: 0,
  variacao_pct: 0,
}

export function useRelatorio() {
  // ── SH ──────────────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<RelatorioFilters>(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState<RelatorioFilters>(emptyFilters)
  const [registros, setRegistros] = useState<RelatorioRegistro[]>([])
  const [totais, setTotais] = useState<RelatorioTotais>(emptyTotais)
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 20, total: 0 })
  const [loadingSH, setLoadingSH] = useState(false)

  const fetchSH = useCallback(async () => {
    setLoadingSH(true)
    try {
      const result = await fetchRelatorioSH(appliedFilters, {
        page: pagination.page,
        pageSize: pagination.pageSize,
      })
      setRegistros(result.data)
      setTotais(result.totais)
      setPagination(p => ({ ...p, total: result.total }))
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingSH(false)
    }
  }, [appliedFilters, pagination.page, pagination.pageSize])

  useEffect(() => { fetchSH() }, [fetchSH])

  function applyFilters() {
    setAppliedFilters({ ...filters })
    setPagination(p => ({ ...p, page: 1 }))
  }
  function clearFilters() {
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setPagination(p => ({ ...p, page: 1 }))
  }

  // ── Fingers ─────────────────────────────────────────────────────────────────
  const [fingerFilters, setFingerFilters] = useState<RelatorioFilters>(emptyFilters)
  const [appliedFingerFilters, setAppliedFingerFilters] = useState<RelatorioFilters>(emptyFilters)
  const [fingerRegistros, setFingerRegistros] = useState<RelatorioFingerRegistro[]>([])
  const [fingerTotais, setFingerTotais] = useState<RelatorioFingerTotais>(emptyFingerTotais)
  const [fingerPagination, setFingerPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 20,
    total: 0,
  })
  const [loadingFinger, setLoadingFinger] = useState(false)

  const fetchFingers = useCallback(async () => {
    setLoadingFinger(true)
    try {
      const result = await fetchRelatorioFingers(appliedFingerFilters, {
        page: fingerPagination.page,
        pageSize: fingerPagination.pageSize,
      })
      setFingerRegistros(result.data)
      setFingerTotais(result.totais)
      setFingerPagination(p => ({ ...p, total: result.total }))
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingFinger(false)
    }
  }, [appliedFingerFilters, fingerPagination.page, fingerPagination.pageSize])

  useEffect(() => { fetchFingers() }, [fetchFingers])

  function applyFingerFilters() {
    setAppliedFingerFilters({ ...fingerFilters })
    setFingerPagination(p => ({ ...p, page: 1 }))
  }
  function clearFingerFilters() {
    setFingerFilters(emptyFilters)
    setAppliedFingerFilters(emptyFilters)
    setFingerPagination(p => ({ ...p, page: 1 }))
  }

  // ── Export ──────────────────────────────────────────────────────────────────
  function exportarCSV(tab: 'sh' | 'finger') {
    let headers: string[]
    let rows: string[][]

    if (tab === 'sh') {
      headers = ['Software House','CNPJ SH','Credenciado','CNPJ Credenciado','Representante','Período','Data Vínculo','Prazo','Valor R$','Imposto (20%) R$','Valor SH R$']
      rows = registros.map(r => [r.software_house,r.cnpj_sh,r.credenciado,r.cnpj_credenciado,r.representante,r.periodo,r.data_vinculo,r.prazo,String(r.valor_taxa),String(r.imposto),String(r.valor_sh)])
    } else {
      headers = ['Finger','CPF','Software House','CNPJ SH','Credenciado','CNPJ Credenciado','Porcentagem','Valor Finger','Período','Data']
      rows = fingerRegistros.map(r => [r.finger,r.cpf_finger,r.software_house,r.cnpj_sh,r.credenciado,r.cnpj_credenciado,`${r.porcentagem}%`,String(r.valor_finger),r.periodo,r.data])
    }

    const csv = [headers, ...rows].map(row => row.join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-${tab}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    totais, registros, loadingSH,
    filters, setFilters, applyFilters, clearFilters,
    pagination: { ...pagination, total: pagination.total },
    setPage: (page: number) => setPagination(p => ({ ...p, page })),
    fingerTotais, fingerRegistros, loadingFinger,
    fingerFilters, setFingerFilters, applyFingerFilters, clearFingerFilters,
    fingerPagination: { ...fingerPagination, total: fingerPagination.total },
    setFingerPage: (page: number) => setFingerPagination(p => ({ ...p, page })),
    exportarCSV,
  }
}
