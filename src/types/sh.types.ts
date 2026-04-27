// ─── Status ───────────────────────────────────────────────────────────────────

export type SHStatus = 'ativa' | 'inativa'

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface SoftwareHouse {
  id: string
  cnpj: string
  nome_fantasia: string
  razao_social: string
  email: string
  telefone: string
  cep: string
  logradouro: string
  numero: string
  bairro: string
  municipio: string
  estado: string
  prazo_pagamento: number
  participacao_sh: number
  participacao_representante: number
  status: SHStatus
  created_at: string
  updated_at: string
  // computed
  qtd_lojas_vinculadas?: number
  qtd_representantes?: number
}

export interface Representante {
  id: string
  software_house_id: string
  nome_completo: string
  email: string
  telefone: string
  cpf: string
  cidade?: string
  estado?: string
  data_vinculo: string
}

export interface Finger {
  id: string
  software_house_id: string
  nome_completo: string
  email: string
  telefone: string
  cpf: string
  porcentagem: number
  prazo_meses?: number
  data_ativacao?: string
  cidade?: string
  estado?: string
  data_vinculo: string
}

export interface Credenciado {
  id: string
  nome: string
  cnpj: string
  cidade?: string
  estado?: string
}

export interface SHCredenciado {
  id: string
  software_house_id: string
  credenciado_id: string
  representante_id: string
  finger_id: string
  credenciado: Credenciado
  representante: Representante
  finger: Finger
}

// ─── Wizard State ─────────────────────────────────────────────────────────────

export type WizardStep = 1 | 2 | 3 | 4 | 5

export interface DadosBasicosForm {
  cnpj: string
  nome_fantasia: string
  razao_social: string
  email: string
  telefone: string
  cep: string
  logradouro: string
  numero: string
  bairro: string
  municipio: string
  estado: string
}

export interface DadosOperacionaisForm {
  prazo_pagamento: number
  participacao_sh: number
  participacao_representante: number
}

export type RepresentanteForm = Omit<Representante, 'id' | 'software_house_id' | 'data_vinculo'>
export type FingerForm = Omit<Finger, 'id' | 'software_house_id' | 'data_vinculo'>

export interface CredenciadoVinculo {
  credenciado_id: string
  representante_idx: number
  finger_idx: number
}

export interface WizardState {
  step: WizardStep
  completedSteps: WizardStep[]
  dadosBasicos: Partial<DadosBasicosForm>
  dadosOperacionais: Partial<DadosOperacionaisForm>
  representantes: RepresentanteForm[]
  fingers: FingerForm[]
  credenciados: CredenciadoVinculo[]
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface SHFilters {
  search: string
  status?: SHStatus | ''
}

export interface RelatorioFilters {
  search: string
  grupo_economico?: string
  mes_ano?: string
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

// ─── Relatório ────────────────────────────────────────────────────────────────

export interface RelatorioTotais {
  valor_taxa: number
  imposto: number
  valor_sh: number
  variacao_pct: number
}

export interface RelatorioRegistro {
  id: string
  software_house: string
  cnpj_sh: string
  credenciado: string
  cnpj_credenciado: string
  representante: string
  periodo: string
  data_vinculo: string
  prazo: string
  valor_taxa: number
  imposto: number
  valor_sh: number
}

export interface RelatorioFingerRegistro {
  id: string
  finger: string
  cpf_finger: string
  software_house: string
  cnpj_sh: string
  credenciado: string
  cnpj_credenciado: string
  porcentagem: number
  valor_finger: number
  periodo: string
  data: string
}

export interface RelatorioFingerTotais {
  valor_total_fingers: number
  valor_medio_porcentagem: number
  qtd_fingers: number
  variacao_pct: number
}

// ─── ViaCEP ───────────────────────────────────────────────────────────────────

export interface ViaCEPResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}
