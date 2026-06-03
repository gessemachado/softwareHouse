# Spec — Card: Operação | Pedidos / Intermediações

**ID:** VG-04x  
**Arquivo:** `src/components/visao-geral/cards/CardGaugeOperacao.tsx`  
**Config IDs:** `c_gauge`, `c_gauge.pedidos`, `c_gauge.intermediacoes`, `c_gauge.conversao`  
**Fonte de dados:** `METRICAS[mesIdx]`

---

## Dados

| Campo | Cálculo | Tipo |
|-------|---------|------|
| pedidosVal | `METRICAS['Total de Vendas'][curIdx]` | R$ |
| pedidosQtd | `METRICAS['Qtd Pedidos'][curIdx]` | Qtd |
| intermedVal | `METRICAS['Total de Intermediações'][curIdx]` | R$ |
| intermedQtd | `METRICAS['Qtd Intermediações'][curIdx]` | Qtd |
| convPct | `(intermedVal / pedidosVal) * 100` | % |

---

## Requisitos

**VG-040** — Cabeçalho: ícone verde "%", título "Operação | Pedidos / Intermediações", subtítulo "Acompanhamento da taxa de conversão", botão "Histórico".

**VG-041** — Donut (esquerda): segmento verde = % conversão; segmento cinza = % não conversão. Centro: label "Conversão" + `convPct%`.

**VG-042** — Linha **Pedidos** (`c_gauge.pedidos`): R$ pedidos + sub-texto "Pedidos | {qtd}" + badge variação.

**VG-043** — Linha **Intermediações** (`c_gauge.intermediacoes`): borda verde, R$ intermediações + badge variação + sub-texto "X% do total".

**VG-044** — Linha **Conversão** (`c_gauge.conversao`): `convPct` formatado X.XX% + badge variação em pp (pontos percentuais).

**VG-045** — Botão "Histórico" → abre `OperacaoGaugeHistoricoModal` (ver `historico-modal.md` VG-H04).
