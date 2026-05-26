import { supabase } from '../../lib/supabase'
import { mockFingers } from '../../mocks/fingers'
import type { Finger, FingerForm } from '../../types/sh.types'

export async function listFingers(softwareHouseId: string): Promise<Finger[]> {
  return mockFingers.filter(f => f.software_house_id === softwareHouseId)
}

export async function createFinger(
  softwareHouseId: string,
  form: FingerForm
): Promise<Finger> {
  const { data, error } = await supabase
    .from('fingers')
    .insert({ ...form, software_house_id: softwareHouseId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateFinger(
  id: string,
  form: Partial<FingerForm>
): Promise<Finger> {
  const { data, error } = await supabase
    .from('fingers')
    .update(form)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteFinger(id: string): Promise<void> {
  const { error } = await supabase.from('fingers').delete().eq('id', id)
  if (error) throw error
}

export async function createFingersLote(
  softwareHouseId: string,
  forms: FingerForm[]
): Promise<Finger[]> {
  if (forms.length === 0) return []
  const { data, error } = await supabase
    .from('fingers')
    .insert(forms.map(f => ({ ...f, software_house_id: softwareHouseId })))
    .select()

  if (error) throw error
  return data ?? []
}
