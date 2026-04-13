import type { ViaCEPResponse } from '../types/sh.types'

export async function buscarEnderecoPorCEP(cep: string): Promise<ViaCEPResponse | null> {
  const raw = cep.replace(/\D/g, '')
  if (raw.length !== 8) return null
  try {
    const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`)
    const data: ViaCEPResponse = await res.json()
    if (data.erro) return null
    return data
  } catch {
    return null
  }
}
