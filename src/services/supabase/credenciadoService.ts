import { supabase } from '../../lib/supabase'
import type { Credenciado, SHCredenciado, CredenciadoVinculo } from '../../types/sh.types'

// ─── Credenciados disponíveis (global) ────────────────────────────────────────

export async function searchCredenciados(search: string): Promise<Credenciado[]> {
  const { data, error } = await supabase
    .from('credenciados')
    .select('id, nome, cnpj, cidade, estado')
    .or(`nome.ilike.%${search}%,cnpj.ilike.%${search}%`)
    .order('nome', { ascending: true })
    .limit(50)

  if (error) throw error
  return data ?? []
}

export async function listAllCredenciados(): Promise<Credenciado[]> {
  const { data, error } = await supabase
    .from('credenciados')
    .select('id, nome, cnpj, cidade, estado')
    .order('nome', { ascending: true })

  if (error) throw error
  return data ?? []
}

// ─── Vínculos SH ↔ Credenciado ───────────────────────────────────────────────

export async function listSHCredenciados(softwareHouseId: string): Promise<SHCredenciado[]> {
  const { data, error } = await supabase
    .from('sh_credenciados')
    .select(`
      id,
      software_house_id,
      credenciado_id,
      representante_id,
      finger_id,
      credenciado:credenciados(id, nome, cnpj, cidade, estado),
      representante:representantes(id, software_house_id, nome_completo, email, telefone, cpf, cidade, estado, data_vinculo),
      finger:fingers(id, software_house_id, nome_completo, email, telefone, cpf, porcentagem, prazo_meses, cidade, estado, data_vinculo)
    `)
    .eq('software_house_id', softwareHouseId)

  if (error) throw error
  return (data ?? []) as unknown as SHCredenciado[]
}

export async function createSHCredenciadosLote(
  softwareHouseId: string,
  vinculos: CredenciadoVinculo[],
  representanteIds: string[],
  fingerIds: string[]
): Promise<void> {
  if (vinculos.length === 0) return

  const inserts = vinculos.map(v => ({
    software_house_id: softwareHouseId,
    credenciado_id: v.credenciado_id,
    representante_id: representanteIds[v.representante_idx],
    finger_id: fingerIds[v.finger_idx],
  }))

  const { error } = await supabase.from('sh_credenciados').insert(inserts)
  if (error) throw error
}

export async function deleteSHCredenciado(id: string): Promise<void> {
  const { error } = await supabase.from('sh_credenciados').delete().eq('id', id)
  if (error) throw error
}

export async function deleteSHCredenciadosBySH(softwareHouseId: string): Promise<void> {
  const { error } = await supabase
    .from('sh_credenciados')
    .delete()
    .eq('software_house_id', softwareHouseId)
  if (error) throw error
}
