import { useState, useMemo } from 'react'
import type { RelatorioFilters } from '../types/sh.types'
import {
  mockRelatorioTotais,
  mockRelatorioRegistros,
  mockRelatorioFingerTotais,
  mockRelatorioFingerRegistros,
} from '../mocks/relatorio'

export function useRelatorio() {
  const [filters, setFilters] = useState<RelatorioFilters>({ search: '', grupo_economico: '', mes_ano: '' })
  const [appliedFilters, setAppliedFilters] = useState<RelatorioFilters>({ search: '', grupo_economico: '', mes_ano: '' })

  const [fingerFilters, setFingerFilters] = useState<RelatorioFilters>({ search: '', grupo_economico: '', mes_ano: '' })
  const [appliedFingerFilters, setAppliedFingerFilters] = useState<RelatorioFilters>({ search: '', grupo_economico: '', mes_ano: '' })

  // ── SH ──────────────────────────────────────────────────────────────────────
  const registros = useMemo(() => {
    return mockRelatorioRegistros.filter(r => {
      const q = appliedFilters.search.toLowerCase()
      const matchSearch = !q ||
        r.software_house.toLowerCase().includes(q) ||
        r.cnpj_sh.includes(q) ||
        r.credenciado.toLowerCase().includes(q) ||
        r.representante.toLowerCase().includes(q)
      const matchMes = !appliedFilters.mes_ano || r.periodo === appliedFilters.mes_ano
      return matchSearch && matchMes
    })
  }, [appliedFilters])

  function applyFilters() { setAppliedFilters({ ...filters }) }
  function clearFilters() {
    const empty = { search: '', grupo_economico: '', mes_ano: '' }
    setFilters(empty)
    setAppliedFilters(empty)
  }

  // ── Finger ──────────────────────────────────────────────────────────────────
  const fingerRegistros = useMemo(() => {
    return mockRelatorioFingerRegistros.filter(r => {
      const q = appliedFingerFilters.search.toLowerCase()
      const matchSearch = !q ||
        r.finger.toLowerCase().includes(q) ||
        r.cpf_finger.includes(q) ||
        r.software_house.toLowerCase().includes(q) ||
        r.credenciado.toLowerCase().includes(q)
      const matchMes = !appliedFingerFilters.mes_ano || r.periodo === appliedFingerFilters.mes_ano
      return matchSearch && matchMes
    })
  }, [appliedFingerFilters])

  function applyFingerFilters() { setAppliedFingerFilters({ ...fingerFilters }) }
  function clearFingerFilters() {
    const empty = { search: '', grupo_economico: '', mes_ano: '' }
    setFingerFilters(empty)
    setAppliedFingerFilters(empty)
  }

  // ── Export ──────────────────────────────────────────────────────────────────
  function exportarCSV(tab: 'sh' | 'finger') {
    let headers: string[]
    let rows: string[][]

    if (tab === 'sh') {
      headers = ['Software House', 'CNPJ SH', 'Credenciado', 'CNPJ Credenciado', 'Representante', 'Período', 'Data Vínculo', 'Prazo', 'Valor R$', 'Imposto (20%) R$', 'Valor SH R$']
      rows = registros.map(r => [r.software_house, r.cnpj_sh, r.credenciado, r.cnpj_credenciado, r.representante, r.periodo, r.data_vinculo, r.prazo, String(r.valor_taxa), String(r.imposto), String(r.valor_sh)])
    } else {
      headers = ['Finger', 'CPF', 'Software House', 'CNPJ SH', 'Credenciado', 'CNPJ Credenciado', 'Porcentagem', 'Valor Finger', 'Período', 'Data']
      rows = fingerRegistros.map(r => [r.finger, r.cpf_finger, r.software_house, r.cnpj_sh, r.credenciado, r.cnpj_credenciado, `${r.porcentagem}%`, String(r.valor_finger), r.periodo, r.data])
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
    // SH
    totais: mockRelatorioTotais,
    registros,
    filters,
    setFilters,
    applyFilters,
    clearFilters,
    // Finger
    fingerTotais: mockRelatorioFingerTotais,
    fingerRegistros,
    fingerFilters,
    setFingerFilters,
    applyFingerFilters,
    clearFingerFilters,
    // Shared
    exportarCSV,
  }
}
