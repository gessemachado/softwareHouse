import type { BuyHelpIndexResponse, CredenciadoOption, PilarDefinicao } from '../types/buyhelp-index.types'

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
      { mes: '2026-01', score: 58 },
      { mes: '2026-02', score: 61 },
      { mes: '2026-03', score: 65 },
      { mes: '2026-04', score: 69 },
      { mes: '2026-05', score: 72 },
    ],
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
      { mes: '2026-01', score: 52 },
      { mes: '2026-02', score: 50 },
      { mes: '2026-03', score: 49 },
      { mes: '2026-04', score: 50 },
      { mes: '2026-05', score: 48 },
    ],
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
      { mes: '2026-01', score: 75 },
      { mes: '2026-02', score: 78 },
      { mes: '2026-03', score: 81 },
      { mes: '2026-04', score: 83 },
      { mes: '2026-05', score: 88 },
    ],
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
