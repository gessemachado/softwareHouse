import { supabase } from '../../lib/supabase'
import type {
  RelatorioRegistro,
  RelatorioTotais,
  RelatorioFingerRegistro,
  RelatorioFingerTotais,
  RelatorioFilters,
  PaginationState,
} from '../../types/sh.types'

// ─── Relatório SH ─────────────────────────────────────────────────────────────

export async function fetchRelatorioSH(
  filters: RelatorioFilters,
  pagination: Pick<PaginationState, 'page' | 'pageSize'>
): Promise<{ data: RelatorioRegistro[]; totais: RelatorioTotais; total: number }> {
  const { page, pageSize } = pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('vw_relatorio_sh')
    .select('*', { count: 'exact' })
    .order('software_house', { ascending: true })
    .range(from, to)

  if (filters.search) {
    query = query.or(
      `software_house.ilike.%${filters.search}%,credenciado.ilike.%${filters.search}%`
    )
  }

  if (filters.mes_ano) {
    query = query.eq('periodo', filters.mes_ano)
  }

  const { data, error, count } = await query
  if (error) throw error

  const rows = (data ?? []) as RelatorioRegistro[]

  const totais: RelatorioTotais = {
    valor_taxa: rows.reduce((s, r) => s + (r.valor_taxa ?? 0), 0),
    imposto: rows.reduce((s, r) => s + (r.imposto ?? 0), 0),
    valor_sh: rows.reduce((s, r) => s + (r.valor_sh ?? 0), 0),
    variacao_pct: 0,
  }

  return { data: rows, totais, total: count ?? 0 }
}

// ─── Relatório Fingers ────────────────────────────────────────────────────────

export async function fetchRelatorioFingers(
  filters: RelatorioFilters,
  pagination: Pick<PaginationState, 'page' | 'pageSize'>
): Promise<{ data: RelatorioFingerRegistro[]; totais: RelatorioFingerTotais; total: number }> {
  const { page, pageSize } = pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('vw_relatorio_fingers')
    .select('*', { count: 'exact' })
    .order('finger', { ascending: true })
    .range(from, to)

  if (filters.search) {
    query = query.or(`finger.ilike.%${filters.search}%,software_house.ilike.%${filters.search}%`)
  }

  if (filters.mes_ano) {
    query = query.eq('periodo', filters.mes_ano)
  }

  const { data, error, count } = await query
  if (error) throw error

  const rows = (data ?? []) as RelatorioFingerRegistro[]

  const totais: RelatorioFingerTotais = {
    valor_total_fingers: rows.reduce((s, r) => s + (r.valor_finger ?? 0), 0),
    valor_medio_porcentagem: rows.length
      ? rows.reduce((s, r) => s + (r.porcentagem ?? 0), 0) / rows.length
      : 0,
    qtd_fingers: new Set(rows.map(r => r.finger)).size,
    variacao_pct: 0,
  }

  return { data: rows, totais, total: count ?? 0 }
}
