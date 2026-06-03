# Spec — Seção: Análise de Vendas (13 Meses)

**ID:** VG-09x  
**Arquivo:** `src/components/visao-geral/SalesAnalysisSection.tsx`  
**Fonte de dados:** `METRICAS`, `TAXA_PARTS`, `MESES` de `dashboardData.ts`

---

## Dados disponíveis

| Métrica | Key no mock | Tipo |
|---------|-------------|------|
| Total de Vendas | `METRICAS['Total de Vendas']` | R$ |
| Qtd Pedidos | `METRICAS['Qtd Pedidos']` | Qtd |
| Qtd Intermediações | `METRICAS['Qtd Intermediações']` | Qtd |
| Total de Intermediações | `METRICAS['Total de Intermediações']` | R$ |
| Ticket Médio | `METRICAS['Ticket Médio']` | R$ |
| Desconto Usado | `METRICAS['Desconto Usado']` | R$ |
| Taxa | `TAXA_PARTS[i].taxa1 + taxa2` | R$ (empilhado) |

---

## Requisitos

**VG-090** — Cabeçalho: ícone laranja TrendingUp, título "Análise - Últimos 13 Meses", subtítulo com intervalo dos meses cobertos.

**VG-091** — Dropdown de métrica com 7 opções (listadas na tabela acima). A seleção determina qual dado é exibido no card e no gráfico.

**VG-092** — **Card esquerdo** (valor do período selecionado):
- Valor grande: valor da métrica selecionada para o `curIdx`
- Delta box: `((cur - prev) / prev * 100)` formatado como `+X.X% · +R$X` em verde, ou `-X.X% · -R$X` em vermelho
- Rótulo inferior: período de comparação + valor do `prevIdx`

**VG-093** — **Gráfico de barras direito** (13 meses):
- Barra do mês `curIdx`: laranja sólido (destacado)
- Barra do mês `prevIdx`: branco semi-transparente (comparação)
- Demais barras: laranja sólido se valor ≥ média, laranja 30% se valor < média
- Linha tracejada horizontal: média dos 13 meses com label do valor

**VG-094** — Para a métrica **Taxa**: barras empilhadas com Taxa1 (laranja) + Taxa2 (cinza escuro).

**VG-095** — **Legenda inferior**:
- Para métricas não-Taxa: quadrado laranja sólido "Acima da Média / Selecionado" | quadrado branco "Comparação" | quadrado laranja 30% "Abaixo da Média" | linha tracejada "Média (valor)" | valores de pico e mínimo
- Para Taxa: quadrado laranja "Taxa 1" | quadrado cinza "Taxa 2" | linha tracejada "Média" | pico/mínimo

**VG-096** — Botão no rodapé: "Avaliação de Resultado" / "Ocultar Avaliação de Resultado" — toggle do componente `AvaliacaoResultadosInline` (ver spec `avaliacao-resultado.md`).
