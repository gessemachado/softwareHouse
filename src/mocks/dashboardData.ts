// ─── Fonte única de dados mock — Abr/2025 → Abr/2026 ─────────────────────────
// Todos os gráficos e cards consomem deste arquivo.

export const MESES = [
  'Abr/25','Mai/25','Jun/25','Jul/25','Ago/25','Set/25',
  'Out/25','Nov/25','Dez/25','Jan/26','Fev/26','Mar/26','Abr/26',
]

// Mapeamento mês/ano → índice no array (month = 0-based)
export function mesIdx(month: number, year: number): number {
  const map: Record<string, number> = {
    '3-2025': 0, '4-2025': 1, '5-2025': 2, '6-2025': 3,
    '7-2025': 4, '8-2025': 5, '9-2025': 6, '10-2025': 7,
    '11-2025': 8, '0-2026': 9, '1-2026': 10, '2-2026': 11, '3-2026': 12,
  }
  return map[`${month}-${year}`] ?? 12
}

// ─── Métricas de vendas ────────────────────────────────────────────────────────
export const METRICAS = {
  'Qtd de Pedidos':          [218, 231, 205, 244, 198, 227, 251, 239, 263, 221, 235, 244, 262],
  'Total de Vendas':         [148000,156000,139000,163000,134000,151000,171000,162000,178000,149000,158000,163000,172000],
  'Clientes que Compraram':  [29, 31, 27, 33, 26, 30, 34, 32, 36, 29, 31, 33, 35],
  'Ticket Médio':            [130.50,135.00,128.00,140.50,126.00,133.50,142.00,139.00,148.50,131.00,136.50,140.50,148.50],
  'Qtd de Intermediações':   [5, 6, 4, 7, 3, 5, 6, 5, 7, 4, 5, 5, 4],
  'Total de Intermediações': [8600,9200,7400,10100,6800,8900,9800,8700,10400,7600,8800,8900,6900],
  'Desconto Usado':          [5500,5800,5200,6100,5000,5600,6000,5700,6300,5300,5500,5600,5400],
  'Taxa':                    [7200,7800,6900,8400,6500,7500,8100,7700,8800,7100,7400,7600,7300],
}

// Taxa 1 + Taxa 2 somam exatamente METRICAS['Taxa']
export const TAXA_PARTS = MESES.map((mes, i) => ({
  mes,
  taxa1: [4000,4300,3800,4600,3600,4100,4500,4200,4800,3900,4100,4200,4000][i],
  taxa2: [3200,3500,3100,3800,2900,3400,3600,3500,4000,3200,3300,3400,3300][i],
}))

// ─── Cadastros ────────────────────────────────────────────────────────────────
export const CADASTROS = MESES.map((mes, i) => ({
  mes,
  novos:       [42,48,38,65,72,68,85,83,91,88,105,102,108][i],
  perdidos:    [18,16,19,14,20,17,15,16,13,18, 12, 15, 14][i],
  recuperados: [ 4, 6, 5,12,10,14,18,22,20,24, 21, 26, 28][i],
}))

// ─── Desconto / Absorção ──────────────────────────────────────────────────────
export const DESCONTO = MESES.map((mes, i) => ({
  mes,
  aproveitado: [4200,4800,5100,5600,3900,6200,6000,5300,6400,6700,6100,6300,6500][i],
  disponivel:  [2100,2400,2200,1800,2800,1600,1900,2500,1500,1400,2000,1700,1600][i],
}))

// ─── Operação ─────────────────────────────────────────────────────────────────
export const OPERACAO = MESES.map((mes, i) => ({
  mes,
  pedido:        [138,145,122,158,130,142,162,155,170,148,155,160,138][i],
  intermediacao: [100,108, 80,118, 95,104,120,112,128,106,115,118,100][i],
  mesmaTrib:     [ 12, 14, 18,  9, 11, 13, 10, 15,  8, 16, 12, 14, 12][i],
  somenteItem:   [  8, 10, 12,  7,  9,  8,  6, 11,  5, 10,  9,  8,  8][i],
  naoAceitou:    [ 18, 13, 12, 24, 15, 17, 26, 17, 29, 16, 19, 20, 18][i],
}))

// ─── Operação | Produtos ─────────────────────────────────────────────────────
// naoAtuou = mNegativa + custoZero + exclusaoLoja + blacklist (sub-categorias do não atuado)
export const OPERACAO_PRODUTOS = MESES.map((mes, i) => {
  const mNegativa    = [3000,3200,2800,3500,2500,2900,3200,3000,3500,2800,2900,3100,3000][i]
  const custoZero    = [2000,2100,1800,2300,1700,2000,2100,2000,2300,1900,1900,2100,2000][i]
  const exclusaoLoja = [2500,2600,2300,2800,2000,2400,2600,2500,2900,2300,2400,2600,2500][i]
  const blacklist    = [2500,2600,2200,2800,2000,2400,2600,2500,2900,2300,2400,2500,2500][i]
  const naoAtuou     = mNegativa + custoZero + exclusaoLoja + blacklist
  const aproveitado  = [35000,37500,33000,41000,30000,36000,39000,37000,43000,34000,36000,38000,37000][i]
  return { mes, aproveitado, naoAtuou, mNegativa, custoZero, exclusaoLoja, blacklist }
})

// ─── Tributação de Produtos ───────────────────────────────────────────────────
// tributado + isento = Total de Vendas
export const TRIBUTACAO = MESES.map((mes, i) => ({
  mes,
  tributado: [96200,101400,90350,105950,87100,98150,111150,105300,115700,96850,102700,105950,111800][i],
  isento:    [51800, 54600,48650, 57050,46900,52850, 59850, 56700, 62300,52150, 55300, 57050, 60200][i],
}))

// ─── Avaliação de resultados por mês ─────────────────────────────────────────
// Escala proporcional às vendas de Abr/26 (referência)
const REF_VENDAS = 172000
const REF = {
  vendas:    { a: 81329965.53, d: 79969333.70 },
  baseICMS:  { a: 33740642.99, d: 31723373.20 },
  basePIS:   { a: 29705738.34, d: 23266335.29 },
  cmv:       { a: 56148131.82, d: 56148131.82 },
  margem:    { a: 25186183.13, d: 22805501.30 },
  debito:    { a:  6713729.69, d:  4905407.44 },
  dExtra:    { a:    15660.58, d:    15660.58 },
  margemLiq: { a: 16452463.44, d: 16452463.44 },
  taxaBH:    { d:   447690.78 },
  descontoVendas: 1360633.83,
  descontoDebito: 1808322.26,
  descontoICMS:   8011269.79,
  descontoPIS:    6439403.05,
  descontoBH:     1355116.28,
}

function scale(v: number, fator: number) { return Math.round(v * fator * 100) / 100 }

export const AVALIACAO = MESES.map((mes, i) => {
  const tv  = METRICAS['Total de Vendas'][i]
  const f   = tv / REF_VENDAS
  const pct = (a: number, d: number) =>
    `${Math.abs(((d - a) / a) * 100).toFixed(2)} %`
  const cmvPctA = ((scale(REF.cmv.a, f) / scale(REF.vendas.a, f)) * 100).toFixed(2) + ' %'
  const cmvPctD = ((scale(REF.cmv.d, f) / scale(REF.vendas.d, f)) * 100).toFixed(2) + ' %'
  const debitoA = ((scale(REF.debito.a, f) / scale(REF.vendas.a, f)) * 100).toFixed(2) + ' %'
  const debitoD = ((scale(REF.debito.d, f) / scale(REF.vendas.d, f)) * 100).toFixed(2) + ' %'
  const mlPctA  = ((scale(REF.margemLiq.a, f) / scale(REF.vendas.a, f)) * 100).toFixed(2) + ' %'
  const mlPctD  = ((scale(REF.margemLiq.d, f) / scale(REF.vendas.d, f)) * 100).toFixed(2) + ' %'

  return {
    mes,
    vendas:         { a: scale(REF.vendas.a, f),    d: scale(REF.vendas.d, f) },
    baseICMS:       { a: scale(REF.baseICMS.a, f),  d: scale(REF.baseICMS.d, f) },
    basePIS:        { a: scale(REF.basePIS.a, f),   d: scale(REF.basePIS.d, f) },
    cmv:            { a: scale(REF.cmv.a, f),       d: scale(REF.cmv.d, f),    ap: cmvPctA, dp: cmvPctD },
    margem:         { a: scale(REF.margem.a, f),    d: scale(REF.margem.d, f) },
    debito:         { a: scale(REF.debito.a, f),    d: scale(REF.debito.d, f), ap: debitoA, dp: debitoD },
    dExtra:         { a: REF.dExtra.a,              d: REF.dExtra.d },
    margemLiq:      { a: scale(REF.margemLiq.a, f), d: scale(REF.margemLiq.d, f), ap: mlPctA, dp: mlPctD },
    taxaBH:         { d: scale(REF.taxaBH.d, f),    pct: `${((scale(REF.taxaBH.d,f)/scale(REF.vendas.d,f))*100).toFixed(2)}%` },
    margemFinal:    { a: scale(REF.margemLiq.a, f), d: scale(REF.margemLiq.d, f), ap: mlPctA, dp: mlPctD },
    varDebitoLabel: pct(scale(REF.debito.a, f), scale(REF.debito.d, f)),
    descontoVendas: scale(REF.descontoVendas, f),
    descontoDebito: scale(REF.descontoDebito, f),
    descontoICMS:   scale(REF.descontoICMS, f),
    descontoPIS:    scale(REF.descontoPIS, f),
    descontoBH:     scale(REF.descontoBH, f),
  }
})
