import { useState, useEffect, useRef } from 'react'
import type {
  RelatorioFilters,
  RelatorioRegistro,
  RelatorioTotais,
  RelatorioFingerRegistro,
  RelatorioFingerTotais,
} from '../types/sh.types'
import { fetchRelatorioSH, fetchRelatorioFingers } from '../services/supabase/relatorioService'

const emptyFilters: RelatorioFilters = { search: '', grupo_economico: '', mes_ano: '' }
const emptyTotais: RelatorioTotais = { valor_taxa: 0, imposto: 0, valor_sh: 0, variacao_pct: 0 }
const emptyFingerTotais: RelatorioFingerTotais = {
  valor_total_fingers: 0, valor_medio_porcentagem: 0, qtd_fingers: 0, variacao_pct: 0,
}

export function useRelatorio() {
  // ── SH ──────────────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<RelatorioFilters>(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState<RelatorioFilters>(emptyFilters)
  const [registros, setRegistros] = useState<RelatorioRegistro[]>([])
  const [totais, setTotais] = useState<RelatorioTotais>(emptyTotais)
  const [shPage, setShPage] = useState(1)
  const shPageSize = 20
  const [shTotal, setShTotal] = useState(0)
  const [loadingSH, setLoadingSH] = useState(false)

  // Referência para os filtros aplicados (evita stale closure)
  const appliedRef = useRef(appliedFilters)
  appliedRef.current = appliedFilters

  useEffect(() => {
    let cancelled = false
    setLoadingSH(true)
    fetchRelatorioSH(appliedRef.current, { page: shPage, pageSize: shPageSize })
      .then(result => {
        if (cancelled) return
        setRegistros(result.data)
        setTotais(result.totais)
        setShTotal(result.total)
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoadingSH(false) })
    return () => { cancelled = true }
  }, [appliedFilters, shPage])

  function applyFilters() {
    setAppliedFilters({ ...filters })
    setShPage(1)
  }
  function clearFilters() {
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setShPage(1)
  }

  // ── Fingers ─────────────────────────────────────────────────────────────────
  const [fingerFilters, setFingerFilters] = useState<RelatorioFilters>(emptyFilters)
  const [appliedFingerFilters, setAppliedFingerFilters] = useState<RelatorioFilters>(emptyFilters)
  const [fingerRegistros, setFingerRegistros] = useState<RelatorioFingerRegistro[]>([])
  const [fingerTotais, setFingerTotais] = useState<RelatorioFingerTotais>(emptyFingerTotais)
  const [fingerPage, setFingerPage] = useState(1)
  const fingerPageSize = 20
  const [fingerTotal, setFingerTotal] = useState(0)
  const [loadingFinger, setLoadingFinger] = useState(false)

  const appliedFingerRef = useRef(appliedFingerFilters)
  appliedFingerRef.current = appliedFingerFilters

  useEffect(() => {
    let cancelled = false
    setLoadingFinger(true)
    fetchRelatorioFingers(appliedFingerRef.current, { page: fingerPage, pageSize: fingerPageSize })
      .then(result => {
        if (cancelled) return
        setFingerRegistros(result.data)
        setFingerTotais(result.totais)
        setFingerTotal(result.total)
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoadingFinger(false) })
    return () => { cancelled = true }
  }, [appliedFingerFilters, fingerPage])

  function applyFingerFilters() {
    setAppliedFingerFilters({ ...fingerFilters })
    setFingerPage(1)
  }
  function clearFingerFilters() {
    setFingerFilters(emptyFilters)
    setAppliedFingerFilters(emptyFilters)
    setFingerPage(1)
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
    pagination: { page: shPage, pageSize: shPageSize, total: shTotal },
    setPage: setShPage,
    fingerTotais, fingerRegistros, loadingFinger,
    fingerFilters, setFingerFilters, applyFingerFilters, clearFingerFilters,
    fingerPagination: { page: fingerPage, pageSize: fingerPageSize, total: fingerTotal },
    setFingerPage,
    exportarCSV,
  }
}
