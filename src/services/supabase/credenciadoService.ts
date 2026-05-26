import { supabase } from '../../lib/supabase'
import { mockCredenciadosDisponiveis, mockCredenciadosVinculados } from '../../mocks/credenciados'
import type { Credenciado, SHCredenciado, CredenciadoVinculo } from '../../types/sh.types'

// ─── Credenciados disponíveis (global) ────────────────────────────────────────

export async function searchCredenciados(search: string): Promise<Credenciado[]> {
  const q = search.toLowerCase()
  return mockCredenciadosDisponiveis.filter(c =>
    c.nome.toLowerCase().includes(q) || c.cnpj.includes(q)
  )
}

export async function listAllCredenciados(): Promise<Credenciado[]> {
  return [...mockCredenciadosDisponiveis]
}

// ─── Vínculos SH ↔ Credenciado ───────────────────────────────────────────────

export async function listSHCredenciados(softwareHouseId: string): Promise<SHCredenciado[]> {
  return mockCredenciadosVinculados.filter(v => v.software_house_id === softwareHouseId)
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
