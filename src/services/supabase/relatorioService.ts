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

  // Página atual — filtros aplicados ANTES do range
  let pageQ = supabase.from('vw_relatorio_sh').select('*', { count: 'exact' })
  if (filters.search)  pageQ = pageQ.ilike('busca', `%${filters.search.toLowerCase()}%`)
  if (filters.mes_ano) pageQ = pageQ.eq('periodo', filters.mes_ano)
  pageQ = pageQ.order('software_house').range(from, to)
  const { data, error, count } = await pageQ
  if (error) throw error

  // Totais gerais (sem paginação)
  let totQ = supabase.from('vw_relatorio_sh').select('valor_taxa,imposto,valor_sh')
  if (filters.search)  totQ = totQ.ilike('busca', `%${filters.search.toLowerCase()}%`)
  if (filters.mes_ano) totQ = totQ.eq('periodo', filters.mes_ano)
  const { data: allRows, error: e2 } = await totQ
  if (e2) throw e2

  const totais: RelatorioTotais = {
    valor_taxa: (allRows ?? []).reduce((s: number, r: any) => s + (r.valor_taxa ?? 0), 0),
    imposto:    (allRows ?? []).reduce((s: number, r: any) => s + (r.imposto    ?? 0), 0),
    valor_sh:   (allRows ?? []).reduce((s: number, r: any) => s + (r.valor_sh   ?? 0), 0),
    variacao_pct: 0,
  }

  return { data: (data ?? []) as RelatorioRegistro[], totais, total: count ?? 0 }
}

// ─── Relatório Fingers ────────────────────────────────────────────────────────

export async function fetchRelatorioFingers(
  filters: RelatorioFilters,
  pagination: Pick<PaginationState, 'page' | 'pageSize'>
): Promise<{ data: RelatorioFingerRegistro[]; totais: RelatorioFingerTotais; total: number }> {
  const { page, pageSize } = pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Página atual — filtros aplicados ANTES do range
  let pageQ = supabase.from('vw_relatorio_fingers').select('*', { count: 'exact' })
  if (filters.search)  pageQ = pageQ.ilike('busca', `%${filters.search.toLowerCase()}%`)
  if (filters.mes_ano) pageQ = pageQ.eq('periodo', filters.mes_ano)
  pageQ = pageQ.order('finger').range(from, to)
  const { data, error, count } = await pageQ
  if (error) throw error

  // Totais gerais (sem paginação)
  let totQ = supabase.from('vw_relatorio_fingers').select('valor_finger,porcentagem,finger')
  if (filters.search)  totQ = totQ.ilike('busca', `%${filters.search.toLowerCase()}%`)
  if (filters.mes_ano) totQ = totQ.eq('periodo', filters.mes_ano)
  const { data: allRows, error: e2 } = await totQ
  if (e2) throw e2

  const all = (allRows ?? []) as any[]
  const totais: RelatorioFingerTotais = {
    valor_total_fingers:     all.reduce((s, r) => s + (r.valor_finger ?? 0), 0),
    valor_medio_porcentagem: all.length ? Math.round(all.reduce((s, r) => s + (r.porcentagem ?? 0), 0) / all.length * 100) / 100 : 0,
    qtd_fingers:             new Set(all.map(r => r.finger)).size,
    variacao_pct: 0,
  }

  return { data: (data ?? []) as RelatorioFingerRegistro[], totais, total: count ?? 0 }
}
