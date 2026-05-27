import { useState, useEffect, useCallback } from 'react'
import { fetchBuyHelpIndex, CREDENCIADOS_MOCK, PILARES_DEF } from '../mocks/buyhelp-index.mock'
import type {
  BuyHelpIndexResponse,
  Insight,
  Recomendacao,
  PilarKey,
} from '../types/buyhelp-index.types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function gerarInsights(data: BuyHelpIndexResponse): Insight[] {
  const insights: Insight[] = []
  const pilares = data.pilares
  const pilaresArr = PILARES_DEF.map(p => ({ ...p, ...pilares[p.key] }))

  // Pilar com maior alta
  const maiorAlta = pilaresArr
    .filter(p => p.delta > 0 && p.score !== null)
    .sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0))[0]
  if (maiorAlta) {
    insights.push({
      tipo: 'positivo',
      titulo: `${maiorAlta.label} em alta`,
      descricao: `Crescimento de +${maiorAlta.delta} pontos em relação ao período anterior.`,
    })
  }

  // Pilares abaixo de 50
  pilaresArr
    .filter(p => p.score !== null && (p.score as number) < 50)
    .slice(0, 2)
    .forEach(p => {
      insights.push({
        tipo: 'atencao',
        titulo: `${p.label} abaixo do esperado`,
        descricao: `Score de ${p.score} pontos — requer atenção imediata para não comprometer o índice.`,
      })
    })

  // Tendência histórica (últimos 3 meses)
  const hist = data.historico_mensal
  if (hist.length >= 3) {
    const ultimos3 = hist.slice(-3)
    const crescente = ultimos3[0].score < ultimos3[1].score && ultimos3[1].score < ultimos3[2].score
    const decrescente = ultimos3[0].score > ultimos3[1].score && ultimos3[1].score > ultimos3[2].score
    if (crescente) {
      insights.push({
        tipo: 'tendencia',
        titulo: 'Tendência positiva nos últimos 3 meses',
        descricao: `O índice subiu de ${ultimos3[0].score} para ${ultimos3[2].score} pontos consecutivamente.`,
      })
    } else if (decrescente) {
      insights.push({
        tipo: 'atencao',
        titulo: 'Queda consecutiva nos últimos 3 meses',
        descricao: `O índice caiu de ${ultimos3[0].score} para ${ultimos3[2].score} pontos. Investigar causas.`,
      })
    }
  }

  return insights.slice(0, 4)
}

function gerarRecomendacoes(data: BuyHelpIndexResponse): Recomendacao[] {
  const recomendacoesMap: Record<PilarKey, Recomendacao> = {
    conversao: {
      pilar: 'conversao',
      titulo: 'Aumentar penetração BuyHelp',
      descricao: 'Oriente os operadores de caixa a oferecer o desconto BuyHelp em todas as transações elegíveis.',
    },
    desconto: {
      pilar: 'desconto',
      titulo: 'Revisar oferta de desconto',
      descricao: 'Avalie se o percentual de desconto é atrativo o suficiente para converter mais clientes.',
    },
    recorrencia: {
      pilar: 'recorrencia',
      titulo: 'Fidelizar clientes existentes',
      descricao: 'Implemente comunicações pós-compra para incentivar o retorno dos clientes à loja.',
    },
    cmv: {
      pilar: 'cmv',
      titulo: 'Reduzir CMV relativo às vendas',
      descricao: 'Revise o mix de produtos priorizando itens com menor custo de aquisição sem perda de margem.',
    },
    margem: {
      pilar: 'margem',
      titulo: 'Otimizar margem de contribuição',
      descricao: 'Revise o mix de produtos com desconto priorizando itens de maior margem gerencial.',
    },
  }

  const pilares = data.pilares
  return PILARES_DEF
    .filter(p => {
      const s = pilares[p.key].score
      return s !== null && s < 60
    })
    .sort((a, b) => (pilares[a.key].score ?? 100) - (pilares[b.key].score ?? 100))
    .slice(0, 3)
    .map(p => recomendacoesMap[p.key])
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseBuyHelpIndexReturn {
  data: BuyHelpIndexResponse | null
  loading: boolean
  insights: Insight[]
  recomendacoes: Recomendacao[]
  dataInicio: string
  dataFim: string
  setDataInicio: (d: string) => void
  setDataFim: (d: string) => void
  refetch: () => void
}

export function useBuyHelpIndex(credenciadoUuid: string): UseBuyHelpIndexReturn {
  const [dataInicio, setDataInicio] = useState('2026-05-01')
  const [dataFim, setDataFim] = useState('2026-05-20')
  const [data, setData] = useState<BuyHelpIndexResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<Insight[]>([])
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([])
  const [trigger, setTrigger] = useState(0)

  const refetch = useCallback(() => setTrigger(t => t + 1), [])

  useEffect(() => {
    setLoading(true)
    fetchBuyHelpIndex(credenciadoUuid, dataInicio, dataFim).then(res => {
      setData(res)
      setInsights(gerarInsights(res))
      setRecomendacoes(gerarRecomendacoes(res))
      setLoading(false)
    })
  }, [credenciadoUuid, dataInicio, dataFim, trigger])

  return {
    data, loading, insights, recomendacoes,
    dataInicio, setDataInicio,
    dataFim, setDataFim,
    refetch,
  }
}
