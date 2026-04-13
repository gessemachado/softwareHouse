import { supabase } from '../../lib/supabase'
import type { Representante, RepresentanteForm } from '../../types/sh.types'

export async function listRepresentantes(softwareHouseId: string): Promise<Representante[]> {
  const { data, error } = await supabase
    .from('representantes')
    .select('*')
    .eq('software_house_id', softwareHouseId)
    .order('nome_completo', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createRepresentante(
  softwareHouseId: string,
  form: RepresentanteForm
): Promise<Representante> {
  const { data, error } = await supabase
    .from('representantes')
    .insert({ ...form, software_house_id: softwareHouseId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRepresentante(
  id: string,
  form: Partial<RepresentanteForm>
): Promise<Representante> {
  const { data, error } = await supabase
    .from('representantes')
    .update(form)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRepresentante(id: string): Promise<void> {
  const { error } = await supabase.from('representantes').delete().eq('id', id)
  if (error) throw error
}

export async function createRepresentantesLote(
  softwareHouseId: string,
  forms: RepresentanteForm[]
): Promise<Representante[]> {
  if (forms.length === 0) return []
  const { data, error } = await supabase
    .from('representantes')
    .insert(forms.map(f => ({ ...f, software_house_id: softwareHouseId })))
    .select()

  if (error) throw error
  return data ?? []
}
