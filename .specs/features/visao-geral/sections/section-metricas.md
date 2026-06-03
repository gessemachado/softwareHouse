# Spec — Seção: Métricas de Vendas

**ID:** VG-12x  
**Arquivo:** `src/components/visao-geral/MetricasSection.tsx`  
**Fonte de dados:** `METRICAS[mesIdx]` de `dashboardData.ts`

---

## VG-120 — Layout

Grid de 2 colunas (1 col mobile, 2 cols desktop):
- Coluna esquerda: Métricas de Vendas (4 cards)
- Coluna direita: Intermediações (3 cards)

---

## VG-121 — Coluna Esquerda: Métricas de Vendas

**VG-121a** — Cabeçalho da coluna: ícone azul TrendingUp, título "Métricas de Vendas", subtítulo "Principais indicadores de performance".

**VG-121b** — Grade 2×2 com 4 cards de métrica.

**VG-121c** — Cada card exibe:
- Label da métrica (topo esquerdo)
- Valor grande (2xl, bold)
- Botão "Histórico" (topo direito) → abre `MetricaChartModal` para aquela métrica
- Badge de variação: `+X.X%` verde / `-X.X%` vermelho vs período de comparação
- Texto: "vs {valorPrev} Ant." abaixo do badge

**VG-121d** — As 4 métricas exibidas:
1. **Qtd de Pedidos** — `METRICAS['Qtd Pedidos'][curIdx]`
2. **Total de Vendas** — `METRICAS['Total de Vendas'][curIdx]` (R$)
3. **Ticket Médio** — `METRICAS['Ticket Médio'][curIdx]` (R$)
4. **Clientes que Compraram** — `METRICAS['Qtd Pedidos'][curIdx]` (derivado)

---

## VG-122 — Coluna Direita: Intermediações

**VG-122a** — Cabeçalho: ícone roxo (setas de intermediação), título "Intermediações", subtítulo "Operações de intermediação".

**VG-122b** — Grade com 3 cards (terceiro ocupa 2 colunas):

| Card | Ícone | Métrica | Tipo |
|------|-------|---------|------|
| Qtd de Intermediações | Roxo | `METRICAS['Qtd Intermediações'][curIdx]` | Qtd |
| Total de Intermediações | Roxo | `METRICAS['Total de Intermediações'][curIdx]` | R$ |
| Desconto Usado (2 cols) | Vermelho % | `METRICAS['Desconto Usado'][curIdx]` | R$ |

**VG-122c** — Cada card de intermediação tem:
- Label da métrica
- Valor com formatação (R$ ou quantidade)
- Botão "Histórico" → abre `MetricaChartModal` para aquela métrica
- Badge de variação vs período de comparação

---

## VG-123 — Modal: MetricaChartModal

**VG-123a** — Abre ao clicar "Histórico" em qualquer card de métrica (tanto Vendas quanto Intermediações).

**VG-123b** — 3 KPI cards: Acumulado 2026 (ou Média), Média dos 13 Meses, Pico (mês com maior valor).

**VG-123c** — Gráfico de barras (13 meses):
- Barras laranjas sólidas: meses acima da média
- Barras laranjas 30%: meses abaixo da média
- Barra do mês `curIdx`: sempre laranja sólido e destacada
- Linha tracejada: média dos 13 meses

**VG-123d** — Legenda: Acima da média | Abaixo da média | Média (linha tracejada).

**VG-123e** — Modal fecha ao clicar fora ou no botão X.
