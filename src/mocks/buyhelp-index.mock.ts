import type { BuyHelpIndexResponse, CredenciadoOption, PilarDefinicao, HistoricoPilarMes } from '../types/buyhelp-index.types'

// ─── Credenciados disponíveis no seletor ─────────────────────────────────────

export const CREDENCIADOS_MOCK: CredenciadoOption[] = [
  { uuid: 'cred-001', nome: 'Supermercado São Paulo', cnpj: '12.345.678/0001-90' },
  { uuid: 'cred-002', nome: 'Mercado Bom Preço',      cnpj: '98.765.432/0001-10' },
  { uuid: 'cred-003', nome: 'Hiper Center Plus',      cnpj: '55.123.456/0001-77' },
]

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
    key: 'ticket_medio',
    label: 'Ticket Médio',
    peso: 15,
    cor: '#7F77DD',
    icone: 'Receipt',
    descricao: 'Valor médio por cesta vs benchmark do grupo econômico',
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
    { mes: '2025-05', conversao: 55, desconto: 35, recorrencia: 60, ticket_medio: 58, margem: 45 },
    { mes: '2025-06', conversao: 57, desconto: 37, recorrencia: 62, ticket_medio: 59, margem: 47 },
    { mes: '2025-07', conversao: 58, desconto: 38, recorrencia: 63, ticket_medio: 60, margem: 48 },
    { mes: '2025-08', conversao: 59, desconto: 39, recorrencia: 65, ticket_medio: 61, margem: 50 },
    { mes: '2025-09', conversao: 60, desconto: 40, recorrencia: 66, ticket_medio: 61, margem: 51 },
    { mes: '2025-10', conversao: 61, desconto: 42, recorrencia: 68, ticket_medio: 62, margem: 52 },
    { mes: '2025-11', conversao: 62, desconto: 43, recorrencia: 69, ticket_medio: 62, margem: 53 },
    { mes: '2025-12', conversao: 62, desconto: 45, recorrencia: 70, ticket_medio: 62, margem: 54 },
    { mes: '2026-01', conversao: 65, desconto: 47, recorrencia: 73, ticket_medio: 64, margem: 57 },
    { mes: '2026-02', conversao: 68, desconto: 49, recorrencia: 76, ticket_medio: 66, margem: 60 },
    { mes: '2026-03', conversao: 71, desconto: 51, recorrencia: 79, ticket_medio: 67, margem: 63 },
    { mes: '2026-04', conversao: 74, desconto: 53, recorrencia: 81, ticket_medio: 69, margem: 65 },
    { mes: '2026-05', conversao: 78, desconto: 55, recorrencia: 83, ticket_medio: 70, margem: 68 },
  ],
  'cred-002': [
    { mes: '2025-05', conversao: 62, desconto: 58, recorrencia: 72, ticket_medio: 67, margem: 58 },
    { mes: '2025-06', conversao: 60, desconto: 56, recorrencia: 71, ticket_medio: 66, margem: 56 },
    { mes: '2025-07', conversao: 59, desconto: 55, recorrencia: 70, ticket_medio: 65, margem: 55 },
    { mes: '2025-08', conversao: 58, desconto: 54, recorrencia: 69, ticket_medio: 64, margem: 54 },
    { mes: '2025-09', conversao: 57, desconto: 53, recorrencia: 68, ticket_medio: 63, margem: 53 },
    { mes: '2025-10', conversao: 56, desconto: 52, recorrencia: 67, ticket_medio: 63, margem: 52 },
    { mes: '2025-11', conversao: 54, desconto: 50, recorrencia: 67, ticket_medio: 62, margem: 51 },
    { mes: '2025-12', conversao: 52, desconto: 48, recorrencia: 66, ticket_medio: 61, margem: 50 },
    { mes: '2026-01', conversao: 50, desconto: 46, recorrencia: 65, ticket_medio: 60, margem: 49 },
    { mes: '2026-02', conversao: 48, desconto: 44, recorrencia: 64, ticket_medio: 59, margem: 48 },
    { mes: '2026-03', conversao: 46, desconto: 42, recorrencia: 63, ticket_medio: 58, margem: 47 },
    { mes: '2026-04', conversao: 44, desconto: 40, recorrencia: 61, ticket_medio: 57, margem: 45 },
    { mes: '2026-05', conversao: 42, desconto: 38, recorrencia: 60, ticket_medio: 55, margem: 44 },
  ],
  'cred-003': [
    { mes: '2025-05', conversao: 60, desconto: 52, recorrencia: 65, ticket_medio: 60, margem: 53 },
    { mes: '2025-06', conversao: 63, desconto: 55, recorrencia: 68, ticket_medio: 62, margem: 55 },
    { mes: '2025-07', conversao: 66, desconto: 58, recorrencia: 70, ticket_medio: 64, margem: 57 },
    { mes: '2025-08', conversao: 68, desconto: 60, recorrencia: 72, ticket_medio: 66, margem: 59 },
    { mes: '2025-09', conversao: 70, desconto: 62, recorrencia: 74, ticket_medio: 68, margem: 61 },
    { mes: '2025-10', conversao: 72, desconto: 63, recorrencia: 75, ticket_medio: 69, margem: 62 },
    { mes: '2025-11', conversao: 72, desconto: 65, recorrencia: 75, ticket_medio: 71, margem: 64 },
    { mes: '2025-12', conversao: 72, desconto: 65, recorrencia: 75, ticket_medio: 71, margem: 64 },
    { mes: '2026-01', conversao: 78, desconto: 70, recorrencia: 80, ticket_medio: 75, margem: 68 },
    { mes: '2026-02', conversao: 82, desconto: 73, recorrencia: 83, ticket_medio: 78, margem: 70 },
    { mes: '2026-03', conversao: 86, desconto: 76, recorrencia: 86, ticket_medio: 81, margem: 73 },
    { mes: '2026-04', conversao: 90, desconto: 79, recorrencia: 89, ticket_medio: 83, margem: 76 },
    { mes: '2026-05', conversao: 95, desconto: 82, recorrencia: 91, ticket_medio: 85, margem: 79 },
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
      ticket_medio: { score: 70, valor_real: 187.40, delta: 0.0 },
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
      ticket_medio: { score: 55, valor_real: 142.10, delta: 0.0 },
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
      ticket_medio: { score: 85, valor_real: 224.80, delta: 2.0 },
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
}

// ─── Simulação de fetch ───────────────────────────────────────────────────────

export async function fetchBuyHelpIndex(
  credenciadoUuid: string,
  _dataInicio: string,
  _dataFim: string,
): Promise<BuyHelpIndexResponse> {
  await new Promise(r => setTimeout(r, 800))
  return MOCK_DATA[credenciadoUuid] ?? MOCK_DATA['cred-001']
}
