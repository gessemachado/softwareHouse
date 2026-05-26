import { supabase } from '../../lib/supabase'
import { mockSoftwareHouses } from '../../mocks/softwareHouses'
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
  let list = [...mockSoftwareHouses]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    list = list.filter(sh =>
      sh.nome_fantasia.toLowerCase().includes(q) ||
      sh.razao_social.toLowerCase().includes(q) ||
      sh.cnpj.includes(q)
    )
  }
  if (filters.status) list = list.filter(sh => sh.status === filters.status)
  return { data: list.slice(from, from + pageSize), total: list.length }
}

// ─── Get by ID ────────────────────────────────────────────────────────────────

export async function getSoftwareHouseById(id: string): Promise<SoftwareHouse> {
  const found = mockSoftwareHouses.find(sh => sh.id === id)
  if (found) return found
  // fallback Supabase
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
