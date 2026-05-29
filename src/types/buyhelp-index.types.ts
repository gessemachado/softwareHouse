// ─── Classificação ────────────────────────────────────────────────────────────

export type BuyHelpIndexClassificacao = 'critico' | 'atencao' | 'saudavel' | 'excelente'

// ─── Pilar ────────────────────────────────────────────────────────────────────

export interface PilarScore {
  score: number | null   // null = sem dados suficientes
  valor_real: number | null
  delta: number          // pontos vs período anterior
}

export type PilarKey = 'conversao' | 'desconto' | 'recorrencia' | 'cmv'

export interface PilarDefinicao {
  key: PilarKey
  label: string
  peso: number          // % ex: 25
  cor: string
  icone: string
  descricao: string
}

// ─── Histórico ────────────────────────────────────────────────────────────────

export interface HistoricoMes {
  mes: string     // 'YYYY-MM'
  score: number
}

export interface HistoricoPilarMes {
  mes: string
  conversao: number
  desconto: number
  recorrencia: number
  cmv: number
}

// ─── Credenciado (seletor) ────────────────────────────────────────────────────

export interface CredenciadoOption {
  uuid: string
  nome: string
  cnpj: string
}

// ─── Response da API ──────────────────────────────────────────────────────────

export interface BuyHelpIndexResponse {
  credenciado: {
    uuid: string
    nome: string
    cnpj: string
  }
  periodo: {
    inicio: string
    fim: string
  }
  index: {
    score: number
    classificacao: BuyHelpIndexClassificacao
    delta_periodo_anterior: number
  }
  pilares: Record<PilarKey, PilarScore>
  historico_mensal: HistoricoMes[]
  historico_pilares: HistoricoPilarMes[]
}

// ─── Grupo Econômico ──────────────────────────────────────────────────────────

export interface GrupoEconomico {
  uuid: string
  nome: string
}

export interface LojaNoGrupo {
  credenciado: CredenciadoOption
  index: {
    score: number
    classificacao: BuyHelpIndexClassificacao
    delta_periodo_anterior: number
  }
  pilares: Record<PilarKey, PilarScore>
}

export interface GrupoIndexResponse {
  grupo: GrupoEconomico
  periodo: { inicio: string; fim: string }
  score_grupo: number
  classificacao_grupo: BuyHelpIndexClassificacao
  delta_grupo: number
  lojas: LojaNoGrupo[]
}

// ─── Insight / Recomendação ───────────────────────────────────────────────────

export type InsightTipo = 'positivo' | 'atencao' | 'tendencia'

export interface Insight {
  tipo: InsightTipo
  titulo: string
  descricao: string
}

export interface Recomendacao {
  pilar: PilarKey
  titulo: string
  descricao: string
}
