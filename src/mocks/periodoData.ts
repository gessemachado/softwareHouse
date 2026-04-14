import { mesIdx, METRICAS, AVALIACAO } from './dashboardData'

export interface AvaliacaoRow {
  label: string
  badge?: 'orange' | 'teal'
  indent: number
  bold: boolean
  antes: number | null
  antesDir: 'up' | 'down' | null
  antesP: string | null
  antesVarPct: string | null
  depois: number | null
  depoisDir: 'up' | 'down' | null
  depoisP: string | null
  depoisVarPct: string | null
  variacao: string | null
  variacaoCor: 'green' | null
  desconto: number | null
  descontoBadge: 'orange' | 'teal' | null
}

export interface MetricaCard {
  label: string
  value: string
  rawValue: number
  change: string
  vs: string
  positive: boolean
}

export interface PeriodData {
  metricas: MetricaCard[]
  avaliacao: AvaliacaoRow[]
}

function pctStr(curr: number, prev: number) {
  const p = ((curr - prev) / prev) * 100
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}

function fmtK(v: number) {
  return `R$ ${Math.round(v / 1000)}k`
}

export function getPeriodData(
  selMonth: number, selYear: number,
  cmpMonth: number, cmpYear: number,
): PeriodData {
  const i    = mesIdx(selMonth, selYear)
  const iCmp = mesIdx(cmpMonth, cmpYear)
  const cur  = AVALIACAO[i]
  const prev = AVALIACAO[iCmp]

  // ── Métricas cards ──────────────────────────────────────────────────────────
  const LABELS = ['Qtd de Pedidos','Total de Vendas','Clientes que Compraram','Ticket Médio'] as const

  const metricas: MetricaCard[] = LABELS.map(label => {
    const vals = METRICAS[label]
    const curV  = vals[i]
    const prevV = vals[iCmp]
    const isCurrency = label === 'Total de Vendas' || label === 'Ticket Médio'
    const isTicket   = label === 'Ticket Médio'

    const fmtVal = isTicket
      ? `R$ ${curV.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      : isCurrency
        ? fmtK(curV)
        : String(curV)

    const fmtPrev = isTicket
      ? `R$ ${prevV.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      : isCurrency
        ? fmtK(prevV)
        : String(prevV)

    return {
      label,
      value: fmtVal,
      rawValue: curV,
      change: pctStr(curV, prevV),
      vs: `vs ${fmtPrev} Ant.`,
      positive: curV >= prevV,
    }
  })

  // ── Avaliação de resultados ─────────────────────────────────────────────────
  function dir(curV: number, prevV: number): 'up' | 'down' {
    return curV >= prevV ? 'up' : 'down'
  }

  const avaliacao: AvaliacaoRow[] = [
    {
      label: 'Vendas +', badge: 'orange', indent: 0, bold: true,
      antes: cur.vendas.a,   antesDir: dir(cur.vendas.a, prev.vendas.a),   antesP: null,
      antesVarPct: pctStr(cur.vendas.a, prev.vendas.a),
      depois: cur.vendas.d,  depoisDir: dir(cur.vendas.d, prev.vendas.d),  depoisP: null,
      depoisVarPct: pctStr(cur.vendas.d, prev.vendas.d),
      variacao: `${Math.abs(((cur.vendas.d - cur.vendas.a) / cur.vendas.a) * 100).toFixed(2)} %`,
      variacaoCor: null, desconto: cur.descontoVendas, descontoBadge: 'orange',
    },
    {
      label: 'Base (ICMS - IBS)', indent: 1, bold: false,
      antes: cur.baseICMS.a, antesDir: dir(cur.baseICMS.a, prev.baseICMS.a), antesP: null,
      antesVarPct: pctStr(cur.baseICMS.a, prev.baseICMS.a),
      depois: cur.baseICMS.d, depoisDir: dir(cur.baseICMS.d, prev.baseICMS.d), depoisP: null,
      depoisVarPct: pctStr(cur.baseICMS.d, prev.baseICMS.d),
      variacao: null, variacaoCor: null, desconto: cur.descontoICMS, descontoBadge: null,
    },
    {
      label: 'Base (PIS/COFINS - CBS)', indent: 1, bold: false,
      antes: cur.basePIS.a, antesDir: dir(cur.basePIS.a, prev.basePIS.a), antesP: null,
      antesVarPct: pctStr(cur.basePIS.a, prev.basePIS.a),
      depois: cur.basePIS.d, depoisDir: dir(cur.basePIS.d, prev.basePIS.d), depoisP: null,
      depoisVarPct: pctStr(cur.basePIS.d, prev.basePIS.d),
      variacao: null, variacaoCor: null, desconto: cur.descontoPIS, descontoBadge: null,
    },
    {
      label: 'CMV', indent: 0, bold: true,
      antes: cur.cmv.a, antesDir: dir(cur.cmv.a, prev.cmv.a) === 'up' ? 'down' : 'up', antesP: cur.cmv.ap,
      antesVarPct: pctStr(cur.cmv.a, prev.cmv.a),
      depois: cur.cmv.d, depoisDir: dir(cur.cmv.d, prev.cmv.d), depoisP: cur.cmv.dp,
      depoisVarPct: pctStr(cur.cmv.d, prev.cmv.d),
      variacao: '0,00 %', variacaoCor: null, desconto: null, descontoBadge: null,
    },
    {
      label: 'Margem Bruta', indent: 0, bold: true,
      antes: cur.margem.a, antesDir: dir(cur.margem.a, prev.margem.a), antesP: null,
      antesVarPct: pctStr(cur.margem.a, prev.margem.a),
      depois: cur.margem.d, depoisDir: dir(cur.margem.d, prev.margem.d), depoisP: null,
      depoisVarPct: pctStr(cur.margem.d, prev.margem.d),
      variacao: null, variacaoCor: null, desconto: null, descontoBadge: null,
    },
    {
      label: 'Débito', indent: 0, bold: true,
      antes: cur.debito.a, antesDir: dir(cur.debito.a, prev.debito.a), antesP: cur.debito.ap,
      antesVarPct: pctStr(cur.debito.a, prev.debito.a),
      depois: cur.debito.d, depoisDir: dir(cur.debito.d, prev.debito.d), depoisP: cur.debito.dp,
      depoisVarPct: pctStr(cur.debito.d, prev.debito.d),
      variacao: cur.varDebitoLabel, variacaoCor: 'green',
      desconto: cur.descontoDebito, descontoBadge: 'teal',
    },
    {
      label: 'Desconto extra Finalizadora', indent: 0, bold: false,
      antes: cur.dExtra.a, antesDir: null, antesP: null, antesVarPct: null,
      depois: cur.dExtra.d, depoisDir: null, depoisP: null, depoisVarPct: null,
      variacao: null, variacaoCor: null, desconto: null, descontoBadge: null,
    },
    {
      label: 'Margem Líquida', indent: 0, bold: true,
      antes: cur.margemLiq.a, antesDir: dir(cur.margemLiq.a, prev.margemLiq.a), antesP: cur.margemLiq.ap,
      antesVarPct: pctStr(cur.margemLiq.a, prev.margemLiq.a),
      depois: cur.margemLiq.d, depoisDir: dir(cur.margemLiq.d, prev.margemLiq.d), depoisP: cur.margemLiq.dp,
      depoisVarPct: pctStr(cur.margemLiq.d, prev.margemLiq.d),
      variacao: '0,00 %', variacaoCor: null, desconto: null, descontoBadge: null,
    },
    {
      label: 'Taxa BuyHelp (i)', badge: 'teal', indent: 0, bold: false,
      antes: null, antesDir: null, antesP: null, antesVarPct: null,
      depois: cur.taxaBH.d, depoisDir: null, depoisP: null, depoisVarPct: null,
      variacao: cur.taxaBH.pct, variacaoCor: null,
      desconto: cur.descontoBH, descontoBadge: 'teal',
    },
    {
      label: 'Margem Líquida Final', indent: 0, bold: true,
      antes: cur.margemFinal.a, antesDir: null, antesP: cur.margemFinal.ap, antesVarPct: null,
      depois: cur.margemFinal.d, depoisDir: null, depoisP: cur.margemFinal.dp, depoisVarPct: null,
      variacao: '0,00 %', variacaoCor: null, desconto: null, descontoBadge: null,
    },
  ]

  return { metricas, avaliacao }
}
