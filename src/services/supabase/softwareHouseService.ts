import { supabase } from '../../lib/supabase'
import type {
  SoftwareHouse,
  SHFilters,
  PaginationState,
  DadosBasicosForm,
  DadosOperacionaisForm,
} from '../../types/sh.types'

// ─── List ──────────────────────────────────────────────────────────────────────

export async function listSoftwareHouses(
  filters: SHFilters,
  pagination: Pick<PaginationState, 'page' | 'pageSize'>
): Promise<{ data: SoftwareHouse[]; total: number }> {
  const { page, pageSize } = pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('software_houses')
    .select(
      `
      *,
      qtd_representantes:representantes(count),
      qtd_lojas_vinculadas:sh_credenciados(count)
    `,
      { count: 'exact' }
    )
    .order('nome_fantasia', { ascending: true })
    .range(from, to)

  if (filters.search) {
    query = query.or(
      `nome_fantasia.ilike.%${filters.search}%,razao_social.ilike.%${filters.search}%,cnpj.ilike.%${filters.search}%`
    )
  }

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error, count } = await query

  if (error) throw error

  const mapped = (data ?? []).map((row: any) => ({
    ...row,
    qtd_representantes: row.qtd_representantes?.[0]?.count ?? 0,
    qtd_lojas_vinculadas: row.qtd_lojas_vinculadas?.[0]?.count ?? 0,
  }))

  return { data: mapped, total: count ?? 0 }
}

// ─── Get by ID ────────────────────────────────────────────────────────────────

export async function getSoftwareHouseById(id: string): Promise<SoftwareHouse> {
  const { data, error } = await supabase
    .from('software_houses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createSoftwareHouse(
  dados: DadosBasicosForm & DadosOperacionaisForm
): Promise<SoftwareHouse> {
  const { data, error } = await supabase
    .from('software_houses')
    .insert({ ...dados, status: 'ativa' })
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateSoftwareHouse(
  id: string,
  dados: Partial<DadosBasicosForm & DadosOperacionaisForm>
): Promise<SoftwareHouse> {
  const { data, error } = await supabase
    .from('software_houses')
    .update(dados)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── Toggle Status ────────────────────────────────────────────────────────────

export async function toggleSoftwareHouseStatus(
  id: string,
  status: 'ativa' | 'inativa'
): Promise<void> {
  const { error } = await supabase
    .from('software_houses')
    .update({ status })
    .eq('id', id)

  if (error) throw error
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteSoftwareHouse(id: string): Promise<void> {
  const { error } = await supabase.from('software_houses').delete().eq('id', id)
  if (error) throw error
}
