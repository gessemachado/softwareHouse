import type {
  BuyHelpIndexResponse, CredenciadoOption, PilarDefinicao, HistoricoPilarMes,
  GrupoEconomico, GrupoIndexResponse,
} from '../types/buyhelp-index.types'

// ─── Credenciados disponíveis no seletor ─────────────────────────────────────

export const CREDENCIADOS_MOCK: CredenciadoOption[] = [
  { uuid: 'cred-001', nome: 'Supermercado São Paulo',   cnpj: '12.345.678/0001-90' },
  { uuid: 'cred-002', nome: 'Mercado Bom Preço',        cnpj: '98.765.432/0001-10' },
  { uuid: 'cred-003', nome: 'Hiper Center Plus',        cnpj: '55.123.456/0001-77' },
  { uuid: 'cred-004', nome: 'Atacadão Nordeste',        cnpj: '33.111.222/0001-44' },
  { uuid: 'cred-005', nome: 'Mercado Primavera',        cnpj: '44.222.333/0001-55' },
  { uuid: 'cred-006', nome: 'Hipermercado Bela Vista',  cnpj: '55.333.444/0001-66' },
]

// ─── Mapeamento grupo → lojas ─────────────────────────────────────────────────

export const GRUPO_LOJAS: Record<string, string[]> = {
  'grp-001': ['cred-001', 'cred-002', 'cred-003'],
  'grp-002': ['cred-004', 'cred-005', 'cred-006'],
}

// ─── Definições fixas dos 5 pilares ──────────────────────────────────────────

export const PILARES_DEF: PilarDefinicao[] = [
  {
    key: 'conversao',
    label: 'Conversão BuyHelp × Loja',
    peso: 25,
    cor: '#0F6E56',
    icone: 'ShoppingCart',
    descricao: 'Proporção das vendas da loja que passam pela plataforma BuyHelp',
  },
  {
    key: 'desconto',
    label: 'Conversão de Desconto',
    peso: 20,
    cor: '#EF9F27',
    icone: 'Tag',
    descricao: 'Eficiência do desconto ofertado que gerou transação efetiva',
  },
  {
    key: 'recorrencia',
    label: 'Recorrência de Clientes',
    peso: 25,
    cor: '#378ADD',
    icone: 'Users',
    descricao: 'Percentual de clientes que realizaram mais de uma compra no período',
  },
  {
    key: 'cmv',
    label: 'CMV',
    peso: 15,
    cor: '#7F77DD',
    icone: 'Receipt',
    descricao: 'Percentual do Custo das Mercadorias Vendidas sobre o total de vendas',
  },
  {
    key: 'margem',
    label: 'Margem de Contribuição',
    peso: 15,
    cor: '#97C459',
    icone: 'TrendingUp',
    descricao: 'Margem líquida real gerada pelas vendas intermediadas pela BuyHelp',
  },
]

// ─── Histórico por pilar (13 meses) ──────────────────────────────────────────

const HIST_PILARES: Record<string, HistoricoPilarMes[]> = {
  'cred-001': [
    { mes: '2025-05', conversao: 55, desconto: 35, recorrencia: 60, cmv: 58, margem: 45 },
    { mes: '2025-06', conversao: 57, desconto: 37, recorrencia: 62, cmv: 59, margem: 47 },
    { mes: '2025-07', conversao: 58, desconto: 38, recorrencia: 63, cmv: 60, margem: 48 },
    { mes: '2025-08', conversao: 59, desconto: 39, recorrencia: 65, cmv: 61, margem: 50 },
    { mes: '2025-09', conversao: 60, desconto: 40, recorrencia: 66, cmv: 61, margem: 51 },
    { mes: '2025-10', conversao: 61, desconto: 42, recorrencia: 68, cmv: 62, margem: 52 },
    { mes: '2025-11', conversao: 62, desconto: 43, recorrencia: 69, cmv: 62, margem: 53 },
    { mes: '2025-12', conversao: 62, desconto: 45, recorrencia: 70, cmv: 62, margem: 54 },
    { mes: '2026-01', conversao: 65, desconto: 47, recorrencia: 73, cmv: 64, margem: 57 },
    { mes: '2026-02', conversao: 68, desconto: 49, recorrencia: 76, cmv: 66, margem: 60 },
    { mes: '2026-03', conversao: 71, desconto: 51, recorrencia: 79, cmv: 67, margem: 63 },
    { mes: '2026-04', conversao: 74, desconto: 53, recorrencia: 81, cmv: 69, margem: 65 },
    { mes: '2026-05', conversao: 78, desconto: 55, recorrencia: 83, cmv: 70, margem: 68 },
  ],
  'cred-002': [
    { mes: '2025-05', conversao: 62, desconto: 58, recorrencia: 72, cmv: 67, margem: 58 },
    { mes: '2025-06', conversao: 60, desconto: 56, recorrencia: 71, cmv: 66, margem: 56 },
    { mes: '2025-07', conversao: 59, desconto: 55, recorrencia: 70, cmv: 65, margem: 55 },
    { mes: '2025-08', conversao: 58, desconto: 54, recorrencia: 69, cmv: 64, margem: 54 },
    { mes: '2025-09', conversao: 57, desconto: 53, recorrencia: 68, cmv: 63, margem: 53 },
    { mes: '2025-10', conversao: 56, desconto: 52, recorrencia: 67, cmv: 63, margem: 52 },
    { mes: '2025-11', conversao: 54, desconto: 50, recorrencia: 67, cmv: 62, margem: 51 },
    { mes: '2025-12', conversao: 52, desconto: 48, recorrencia: 66, cmv: 61, margem: 50 },
    { mes: '2026-01', conversao: 50, desconto: 46, recorrencia: 65, cmv: 60, margem: 49 },
    { mes: '2026-02', conversao: 48, desconto: 44, recorrencia: 64, cmv: 59, margem: 48 },
    { mes: '2026-03', conversao: 46, desconto: 42, recorrencia: 63, cmv: 58, margem: 47 },
    { mes: '2026-04', conversao: 44, desconto: 40, recorrencia: 61, cmv: 57, margem: 45 },
    { mes: '2026-05', conversao: 42, desconto: 38, recorrencia: 60, cmv: 55, margem: 44 },
  ],
  'cred-004': [
    { mes: '2025-05', conversao: 48, desconto: 44, recorrencia: 55, cmv: 50, margem: 40 },
    { mes: '2025-06', conversao: 46, desconto: 42, recorrencia: 53, cmv: 48, margem: 38 },
    { mes: '2025-07', conversao: 44, desconto: 41, recorrencia: 52, cmv: 46, margem: 37 },
    { mes: '2025-08', conversao: 42, desconto: 40, recorrencia: 51, cmv: 45, margem: 35 },
    { mes: '2025-09', conversao: 40, desconto: 38, recorrencia: 49, cmv: 43, margem: 34 },
    { mes: '2025-10', conversao: 38, desconto: 36, recorrencia: 47, cmv: 41, margem: 32 },
    { mes: '2025-11', conversao: 36, desconto: 34, recorrencia: 45, cmv: 40, margem: 30 },
    { mes: '2025-12', conversao: 34, desconto: 33, recorrencia: 43, cmv: 38, margem: 28 },
    { mes: '2026-01', conversao: 32, desconto: 32, recorrencia: 42, cmv: 37, margem: 27 },
    { mes: '2026-02', conversao: 31, desconto: 31, recorrencia: 41, cmv: 36, margem: 26 },
    { mes: '2026-03', conversao: 30, desconto: 31, recorrencia: 41, cmv: 36, margem: 25 },
    { mes: '2026-04', conversao: 29, desconto: 30, recorrencia: 40, cmv: 35, margem: 23 },
    { mes: '2026-05', conversao: 28, desconto: 30, recorrencia: 40, cmv: 35, margem: 22 },
  ],
  'cred-005': [
    { mes: '2025-05', conversao: 53, desconto: 46, recorrencia: 62, cmv: 57, margem: 50 },
    { mes: '2025-06', conversao: 53, desconto: 46, recorrencia: 62, cmv: 57, margem: 51 },
    { mes: '2025-07', conversao: 52, desconto: 47, recorrencia: 63, cmv: 57, margem: 51 },
    { mes: '2025-08', conversao: 52, desconto: 47, recorrencia: 63, cmv: 58, margem: 52 },
    { mes: '2025-09', conversao: 52, desconto: 47, recorrencia: 63, cmv: 58, margem: 52 },
    { mes: '2025-10', conversao: 52, desconto: 48, recorrencia: 63, cmv: 59, margem: 53 },
    { mes: '2025-11', conversao: 52, desconto: 48, recorrencia: 64, cmv: 59, margem: 53 },
    { mes: '2025-12', conversao: 52, desconto: 48, recorrencia: 64, cmv: 59, margem: 54 },
    { mes: '2026-01', conversao: 52, desconto: 48, recorrencia: 64, cmv: 60, margem: 54 },
    { mes: '2026-02', conversao: 52, desconto: 48, recorrencia: 64, cmv: 60, margem: 55 },
    { mes: '2026-03', conversao: 52, desconto: 48, recorrencia: 64, cmv: 60, margem: 55 },
    { mes: '2026-04', conversao: 52, desconto: 48, recorrencia: 64, cmv: 60, margem: 55 },
    { mes: '2026-05', conversao: 52, desconto: 48, recorrencia: 64, cmv: 60, margem: 55 },
  ],
  'cred-006': [
    { mes: '2025-05', conversao: 65, desconto: 60, recorrencia: 73, cmv: 68, margem: 62 },
    { mes: '2025-06', conversao: 66, desconto: 61, recorrencia: 74, cmv: 69, margem: 63 },
    { mes: '2025-07', conversao: 67, desconto: 62, recorrencia: 75, cmv: 70, margem: 64 },
    { mes: '2025-08', conversao: 68, desconto: 63, recorrencia: 76, cmv: 71, margem: 65 },
    { mes: '2025-09', conversao: 69, desconto: 64, recorrencia: 77, cmv: 72, margem: 66 },
    { mes: '2025-10', conversao: 70, desconto: 65, recorrencia: 78, cmv: 73, margem: 67 },
    { mes: '2025-11', conversao: 71, desconto: 66, recorrencia: 79, cmv: 73, margem: 68 },
    { mes: '2025-12', conversao: 71, desconto: 67, recorrencia: 79, cmv: 74, margem: 68 },
    { mes: '2026-01', conversao: 72, desconto: 68, recorrencia: 80, cmv: 74, margem: 69 },
    { mes: '2026-02', conversao: 72, desconto: 68, recorrencia: 80, cmv: 75, margem: 70 },
    { mes: '2026-03', conversao: 73, desconto: 69, recorrencia: 81, cmv: 75, margem: 71 },
    { mes: '2026-04', conversao: 73, desconto: 69, recorrencia: 81, cmv: 76, margem: 71 },
    { mes: '2026-05', conversao: 74, desconto: 70, recorrencia: 82, cmv: 76, margem: 72 },
  ],
  'cred-003': [
    { mes: '2025-05', conversao: 60, desconto: 52, recorrencia: 65, cmv: 60, margem: 53 },
    { mes: '2025-06', conversao: 63, desconto: 55, recorrencia: 68, cmv: 62, margem: 55 },
    { mes: '2025-07', conversao: 66, desconto: 58, recorrencia: 70, cmv: 64, margem: 57 },
    { mes: '2025-08', conversao: 68, desconto: 60, recorrencia: 72, cmv: 66, margem: 59 },
    { mes: '2025-09', conversao: 70, desconto: 62, recorrencia: 74, cmv: 68, margem: 61 },
    { mes: '2025-10', conversao: 72, desconto: 63, recorrencia: 75, cmv: 69, margem: 62 },
    { mes: '2025-11', conversao: 72, desconto: 65, recorrencia: 75, cmv: 71, margem: 64 },
    { mes: '2025-12', conversao: 72, desconto: 65, recorrencia: 75, cmv: 71, margem: 64 },
    { mes: '2026-01', conversao: 78, desconto: 70, recorrencia: 80, cmv: 75, margem: 68 },
    { mes: '2026-02', conversao: 82, desconto: 73, recorrencia: 83, cmv: 78, margem: 70 },
    { mes: '2026-03', conversao: 86, desconto: 76, recorrencia: 86, cmv: 81, margem: 73 },
    { mes: '2026-04', conversao: 90, desconto: 79, recorrencia: 89, cmv: 83, margem: 76 },
    { mes: '2026-05', conversao: 95, desconto: 82, recorrencia: 91, cmv: 85, margem: 79 },
  ],
}

// ─── Responses mockadas por credenciado ──────────────────────────────────────

const MOCK_DATA: Record<string, BuyHelpIndexResponse> = {
  'cred-001': {
    credenciado: { uuid: 'cred-001', nome: 'Supermercado São Paulo', cnpj: '12.345.678/0001-90' },
    periodo: { inicio: '2026-05-01', fim: '2026-05-20' },
    index: { score: 72, classificacao: 'saudavel', delta_periodo_anterior: 3.2 },
    pilares: {
      conversao:    { score: 78, valor_real: 0.64, delta: 4.0 },
      desconto:     { score: 55, valor_real: 0.43, delta: 1.0 },
      recorrencia:  { score: 83, valor_real: 0.52, delta: 6.0 },
      cmv: { score: 70, valor_real: 187.40, delta: 0.0 },
      margem:       { score: 68, valor_real: 0.21, delta: 2.0 },
    },
    historico_mensal: [
      { mes: '2025-05', score: 49 },
      { mes: '2025-06', score: 50 },
      { mes: '2025-07', score: 51 },
      { mes: '2025-08', score: 52 },
      { mes: '2025-09', score: 53 },
      { mes: '2025-10', score: 54 },
      { mes: '2025-11', score: 54 },
      { mes: '2025-12', score: 55 },
      { mes: '2026-01', score: 58 },
      { mes: '2026-02', score: 61 },
      { mes: '2026-03', score: 65 },
      { mes: '2026-04', score: 69 },
      { mes: '2026-05', score: 72 },
    ],
    historico_pilares: HIST_PILARES['cred-001'],
  },
  'cred-002': {
    credenciado: { uuid: 'cred-002', nome: 'Mercado Bom Preço', cnpj: '98.765.432/0001-10' },
    periodo: { inicio: '2026-05-01', fim: '2026-05-20' },
    index: { score: 48, classificacao: 'atencao', delta_periodo_anterior: -2.1 },
    pilares: {
      conversao:    { score: 42, valor_real: 0.31, delta: -3.0 },
      desconto:     { score: 38, valor_real: 0.28, delta: -5.0 },
      recorrencia:  { score: 60, valor_real: 0.38, delta: 1.0  },
      cmv: { score: 55, valor_real: 142.10, delta: 0.0 },
      margem:       { score: 44, valor_real: 0.12, delta: 1.0  },
    },
    historico_mensal: [
      { mes: '2025-05', score: 62 },
      { mes: '2025-06', score: 60 },
      { mes: '2025-07', score: 59 },
      { mes: '2025-08', score: 58 },
      { mes: '2025-09', score: 57 },
      { mes: '2025-10', score: 56 },
      { mes: '2025-11', score: 55 },
      { mes: '2025-12', score: 54 },
      { mes: '2026-01', score: 52 },
      { mes: '2026-02', score: 50 },
      { mes: '2026-03', score: 49 },
      { mes: '2026-04', score: 50 },
      { mes: '2026-05', score: 48 },
    ],
    historico_pilares: HIST_PILARES['cred-002'],
  },
  'cred-003': {
    credenciado: { uuid: 'cred-003', nome: 'Hiper Center Plus', cnpj: '55.123.456/0001-77' },
    periodo: { inicio: '2026-05-01', fim: '2026-05-20' },
    index: { score: 88, classificacao: 'excelente', delta_periodo_anterior: 5.4 },
    pilares: {
      conversao:    { score: 95, valor_real: 0.88, delta: 6.0  },
      desconto:     { score: 82, valor_real: 0.71, delta: 3.0  },
      recorrencia:  { score: 91, valor_real: 0.64, delta: 4.0  },
      cmv: { score: 85, valor_real: 224.80, delta: 2.0 },
      margem:       { score: 79, valor_real: 0.27, delta: 1.0  },
    },
    historico_mensal: [
      { mes: '2025-05', score: 60 },
      { mes: '2025-06', score: 63 },
      { mes: '2025-07', score: 66 },
      { mes: '2025-08', score: 68 },
      { mes: '2025-09', score: 70 },
      { mes: '2025-10', score: 72 },
      { mes: '2025-11', score: 72 },
      { mes: '2025-12', score: 70 },
      { mes: '2026-01', score: 75 },
      { mes: '2026-02', score: 78 },
      { mes: '2026-03', score: 81 },
      { mes: '2026-04', score: 83 },
      { mes: '2026-05', score: 88 },
    ],
    historico_pilares: HIST_PILARES['cred-003'],
  },
  'cred-004': {
    credenciado: { uuid: 'cred-004', nome: 'Atacadão Nordeste', cnpj: '33.111.222/0001-44' },
    periodo: { inicio: '2026-05-01', fim: '2026-05-20' },
    index: { score: 32, classificacao: 'critico', delta_periodo_anterior: -4.5 },
    pilares: {
      conversao:    { score: 28, valor_real: 0.18, delta: -5.0 },
      desconto:     { score: 30, valor_real: 0.15, delta: -3.0 },
      recorrencia:  { score: 40, valor_real: 0.22, delta: -2.0 },
      cmv: { score: 35, valor_real: 98.20, delta: -1.0 },
      margem:       { score: 22, valor_real: 0.06, delta: -4.0 },
    },
    historico_mensal: [
      { mes: '2025-05', score: 50 }, { mes: '2025-06', score: 48 }, { mes: '2025-07', score: 46 },
      { mes: '2025-08', score: 44 }, { mes: '2025-09', score: 42 }, { mes: '2025-10', score: 40 },
      { mes: '2025-11', score: 38 }, { mes: '2025-12', score: 37 }, { mes: '2026-01', score: 36 },
      { mes: '2026-02', score: 35 }, { mes: '2026-03', score: 34 }, { mes: '2026-04', score: 33 },
      { mes: '2026-05', score: 32 },
    ],
    historico_pilares: HIST_PILARES['cred-004'],
  },
  'cred-005': {
    credenciado: { uuid: 'cred-005', nome: 'Mercado Primavera', cnpj: '44.222.333/0001-55' },
    periodo: { inicio: '2026-05-01', fim: '2026-05-20' },
    index: { score: 58, classificacao: 'atencao', delta_periodo_anterior: 1.2 },
    pilares: {
      conversao:    { score: 52, valor_real: 0.40, delta: 2.0 },
      desconto:     { score: 48, valor_real: 0.35, delta: 1.0 },
      recorrencia:  { score: 64, valor_real: 0.41, delta: 3.0 },
      cmv: { score: 60, valor_real: 158.50, delta: 0.0 },
      margem:       { score: 55, valor_real: 0.16, delta: 1.0 },
    },
    historico_mensal: [
      { mes: '2025-05', score: 52 }, { mes: '2025-06', score: 53 }, { mes: '2025-07', score: 54 },
      { mes: '2025-08', score: 55 }, { mes: '2025-09', score: 55 }, { mes: '2025-10', score: 56 },
      { mes: '2025-11', score: 56 }, { mes: '2025-12', score: 57 }, { mes: '2026-01', score: 57 },
      { mes: '2026-02', score: 57 }, { mes: '2026-03', score: 58 }, { mes: '2026-04', score: 58 },
      { mes: '2026-05', score: 58 },
    ],
    historico_pilares: HIST_PILARES['cred-005'],
  },
  'cred-006': {
    credenciado: { uuid: 'cred-006', nome: 'Hipermercado Bela Vista', cnpj: '55.333.444/0001-66' },
    periodo: { inicio: '2026-05-01', fim: '2026-05-20' },
    index: { score: 77, classificacao: 'saudavel', delta_periodo_anterior: 2.8 },
    pilares: {
      conversao:    { score: 74, valor_real: 0.61, delta: 3.0 },
      desconto:     { score: 70, valor_real: 0.58, delta: 2.0 },
      recorrencia:  { score: 82, valor_real: 0.50, delta: 4.0 },
      cmv: { score: 76, valor_real: 196.30, delta: 1.0 },
      margem:       { score: 72, valor_real: 0.23, delta: 2.0 },
    },
    historico_mensal: [
      { mes: '2025-05', score: 65 }, { mes: '2025-06', score: 67 }, { mes: '2025-07', score: 68 },
      { mes: '2025-08', score: 70 }, { mes: '2025-09', score: 71 }, { mes: '2025-10', score: 72 },
      { mes: '2025-11', score: 73 }, { mes: '2025-12', score: 73 }, { mes: '2026-01', score: 74 },
      { mes: '2026-02', score: 75 }, { mes: '2026-03', score: 75 }, { mes: '2026-04', score: 76 },
      { mes: '2026-05', score: 77 },
    ],
    historico_pilares: HIST_PILARES['cred-006'],
  },
}

// ─── Grupos Econômicos ───────────────────────────────────────────────────────

export const GRUPOS_MOCK: GrupoEconomico[] = [
  { uuid: 'grp-001', nome: 'Rede Econômica Sul' },
  { uuid: 'grp-002', nome: 'Grupo Norte Varejo' },
]

const GRUPO_DATA: Record<string, GrupoIndexResponse> = {
  'grp-001': {
    grupo: { uuid: 'grp-001', nome: 'Rede Econômica Sul' },
    periodo: { inicio: '2026-05-01', fim: '2026-05-20' },
    score_grupo: 69,
    classificacao_grupo: 'saudavel',
    delta_grupo: 2.2,
    lojas: [
      {
        credenciado: { uuid: 'cred-001', nome: 'Supermercado São Paulo', cnpj: '12.345.678/0001-90' },
        index: { score: 72, classificacao: 'saudavel', delta_periodo_anterior: 3.2 },
        pilares: {
          conversao:    { score: 78, valor_real: 0.64, delta: 4.0 },
          desconto:     { score: 55, valor_real: 0.43, delta: 1.0 },
          recorrencia:  { score: 83, valor_real: 0.52, delta: 6.0 },
          cmv: { score: 70, valor_real: 187.40, delta: 0.0 },
          margem:       { score: 68, valor_real: 0.21, delta: 2.0 },
        },
      },
      {
        credenciado: { uuid: 'cred-002', nome: 'Mercado Bom Preço', cnpj: '98.765.432/0001-10' },
        index: { score: 48, classificacao: 'atencao', delta_periodo_anterior: -2.1 },
        pilares: {
          conversao:    { score: 42, valor_real: 0.31, delta: -3.0 },
          desconto:     { score: 38, valor_real: 0.28, delta: -5.0 },
          recorrencia:  { score: 60, valor_real: 0.38, delta: 1.0  },
          cmv: { score: 55, valor_real: 142.10, delta: 0.0 },
          margem:       { score: 44, valor_real: 0.12, delta: 1.0  },
        },
      },
      {
        credenciado: { uuid: 'cred-003', nome: 'Hiper Center Plus', cnpj: '55.123.456/0001-77' },
        index: { score: 88, classificacao: 'excelente', delta_periodo_anterior: 5.4 },
        pilares: {
          conversao:    { score: 95, valor_real: 0.88, delta: 6.0  },
          desconto:     { score: 82, valor_real: 0.71, delta: 3.0  },
          recorrencia:  { score: 91, valor_real: 0.64, delta: 4.0  },
          cmv: { score: 85, valor_real: 224.80, delta: 2.0 },
          margem:       { score: 79, valor_real: 0.27, delta: 1.0  },
        },
      },
    ],
  },
  'grp-002': {
    grupo: { uuid: 'grp-002', nome: 'Grupo Norte Varejo' },
    periodo: { inicio: '2026-05-01', fim: '2026-05-20' },
    score_grupo: 56,
    classificacao_grupo: 'atencao',
    delta_grupo: -0.2,
    lojas: [
      {
        credenciado: { uuid: 'cred-004', nome: 'Atacadão Nordeste', cnpj: '33.111.222/0001-44' },
        index: { score: 32, classificacao: 'critico', delta_periodo_anterior: -4.5 },
        pilares: {
          conversao:    { score: 28, valor_real: 0.18, delta: -5.0 },
          desconto:     { score: 30, valor_real: 0.15, delta: -3.0 },
          recorrencia:  { score: 40, valor_real: 0.22, delta: -2.0 },
          cmv: { score: 35, valor_real: 98.20, delta: -1.0 },
          margem:       { score: 22, valor_real: 0.06, delta: -4.0 },
        },
      },
      {
        credenciado: { uuid: 'cred-005', nome: 'Mercado Primavera', cnpj: '44.222.333/0001-55' },
        index: { score: 58, classificacao: 'atencao', delta_periodo_anterior: 1.2 },
        pilares: {
          conversao:    { score: 52, valor_real: 0.40, delta: 2.0  },
          desconto:     { score: 48, valor_real: 0.35, delta: 1.0  },
          recorrencia:  { score: 64, valor_real: 0.41, delta: 3.0  },
          cmv: { score: 60, valor_real: 158.50, delta: 0.0 },
          margem:       { score: 55, valor_real: 0.16, delta: 1.0  },
        },
      },
      {
        credenciado: { uuid: 'cred-006', nome: 'Hipermercado Bela Vista', cnpj: '55.333.444/0001-66' },
        index: { score: 77, classificacao: 'saudavel', delta_periodo_anterior: 2.8 },
        pilares: {
          conversao:    { score: 74, valor_real: 0.61, delta: 3.0  },
          desconto:     { score: 70, valor_real: 0.58, delta: 2.0  },
          recorrencia:  { score: 82, valor_real: 0.50, delta: 4.0  },
          cmv: { score: 76, valor_real: 196.30, delta: 1.0 },
          margem:       { score: 72, valor_real: 0.23, delta: 2.0  },
        },
      },
    ],
  },
}

// ─── Simulação de fetch ───────────────────────────────────────────────────────

export async function fetchGrupoIndex(
  grupoUuid: string,
  _dataInicio: string,
  _dataFim: string,
): Promise<GrupoIndexResponse> {
  await new Promise(r => setTimeout(r, 600))
  return GRUPO_DATA[grupoUuid] ?? GRUPO_DATA['grp-001']
}

export async function fetchBuyHelpIndex(
  credenciadoUuid: string,
  _dataInicio: string,
  _dataFim: string,
): Promise<BuyHelpIndexResponse> {
  await new Promise(r => setTimeout(r, 800))
  return MOCK_DATA[credenciadoUuid] ?? MOCK_DATA['cred-001']
}
