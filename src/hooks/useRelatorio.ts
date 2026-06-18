import { useState, useMemo } from 'react'
import type { RelatorioFilters, RelatorioRegistro, RelatorioTotais, RelatorioFingerRegistro, RelatorioFingerTotais } from '../types/sh.types'
import { mockRelatorioRegistros, mockRelatorioTotais, mockRelatorioFingerRegistros, mockRelatorioFingerTotais } from '../mocks/relatorio'

const emptyFilters: RelatorioFilters = { search: '', grupo_economico: '', meses: [] }

function applyRelatorioFilter(list: RelatorioRegistro[], f: RelatorioFilters) {
  let r = [...list]
  if (f.search) {
    const q = f.search.toLowerCase()
    r = r.filter(x =>
      x.software_house.toLowerCase().includes(q) ||
      x.credenciado.toLowerCase().includes(q) ||
      x.cnpj_sh.includes(q) ||
      x.representante.toLowerCase().includes(q)
    )
  }
  if (f.meses && f.meses.length > 0) r = r.filter(x => f.meses!.includes(x.periodo))
  return r
}

function applyFingerFilter(list: RelatorioFingerRegistro[], f: RelatorioFilters) {
  let r = [...list]
  if (f.search) {
    const q = f.search.toLowerCase()
    r = r.filter(x =>
      x.finger.toLowerCase().includes(q) ||
      x.software_house.toLowerCase().includes(q) ||
      x.credenciado.toLowerCase().includes(q) ||
      x.cpf_finger.includes(q)
    )
  }
  if (f.meses && f.meses.length > 0) r = r.filter(x => f.meses!.includes(x.periodo))
  return r
}

export function useRelatorio() {
  const [filters, setFilters] = useState<RelatorioFilters>(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState<RelatorioFilters>(emptyFilters)
  const [shPage, setShPage] = useState(1)
  const shPageSize = 20

  const shFiltered = useMemo(() => applyRelatorioFilter(mockRelatorioRegistros, appliedFilters), [appliedFilters])
  const registros = useMemo(() => shFiltered.slice((shPage - 1) * shPageSize, shPage * shPageSize), [shFiltered, shPage])
  const totais: RelatorioTotais = mockRelatorioTotais

  const [fingerFilters, setFingerFilters] = useState<RelatorioFilters>(emptyFilters)
  const [appliedFingerFilters, setAppliedFingerFilters] = useState<RelatorioFilters>(emptyFilters)
  const [fingerPage, setFingerPage] = useState(1)
  const fingerPageSize = 20

  const fingerFiltered = useMemo(() => applyFingerFilter(mockRelatorioFingerRegistros, appliedFingerFilters), [appliedFingerFilters])
  const fingerRegistros = useMemo(() => fingerFiltered.slice((fingerPage - 1) * fingerPageSize, fingerPage * fingerPageSize), [fingerFiltered, fingerPage])
  const fingerTotais: RelatorioFingerTotais = mockRelatorioFingerTotais

  function applyFilters() { setAppliedFilters({ ...filters }); setShPage(1) }
  function clearFilters() { setFilters(emptyFilters); setAppliedFilters(emptyFilters); setShPage(1) }
  function applyFingerFilters() { setAppliedFingerFilters({ ...fingerFilters }); setFingerPage(1) }
  function clearFingerFilters() { setFingerFilters(emptyFilters); setAppliedFingerFilters(emptyFilters); setFingerPage(1) }

  function exportarCSV(tab: 'sh' | 'finger') {
    let headers: string[]
    let rows: string[][]
    if (tab === 'sh') {
      headers = ['Período','Software House','CNPJ SH','Credenciado','CNPJ Credenciado','Representante','Valor R$','Imposto (20%) R$','Valor Líquido R$','Valor SH R$','Valor Rep. R$']
      rows = registros.map(r => [
        r.periodo,
        r.software_house,
        r.cnpj_sh,
        r.credenciado,
        r.cnpj_credenciado,
        r.representante,
        r.valor_taxa.toFixed(2),
        r.imposto.toFixed(2),
        (r.valor_taxa - r.imposto).toFixed(2),
        r.valor_sh.toFixed(2),
        r.valor_representante.toFixed(2),
      ])
    } else {
      headers = ['Período','Finger','CPF Finger','Software House','CNPJ SH','Credenciado','CNPJ Credenciado','Porcentagem','Valor R$','Imposto (20%) R$','Valor Líquido R$','Valor Finger R$']
      rows = fingerRegistros.map(r => [
        r.periodo,
        r.finger,
        r.cpf_finger,
        r.software_house,
        r.cnpj_sh,
        r.credenciado,
        r.cnpj_credenciado,
        `${r.porcentagem}%`,
        r.valor_finger.toFixed(2),
        (r.valor_finger * 0.2).toFixed(2),
        (r.valor_finger * 0.8).toFixed(2),
        (r.valor_finger * 0.8 * (r.porcentagem / 100)).toFixed(2),
      ])
    }
    const csv = [headers, ...rows].map(row => row.join(';')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-${tab}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    totais, registros, loadingSH: false,
    filters, setFilters, applyFilters, clearFilters,
    pagination: { page: shPage, pageSize: shPageSize, total: shFiltered.length },
    setPage: setShPage,
    fingerTotais, fingerRegistros, loadingFinger: false,
    fingerFilters, setFingerFilters, applyFingerFilters, clearFingerFilters,
    fingerPagination: { page: fingerPage, pageSize: fingerPageSize, total: fingerFiltered.length },
    setFingerPage,
    exportarCSV,
  }
}
