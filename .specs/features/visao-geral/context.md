# Contexto Geral — Aba Visão Geral

## O que é esta aba

A aba **Visão Geral** é o painel principal de análise de desempenho da BuyHelp. Ela responde à pergunta central do negócio:

> "O processamento da BuyHelp está gerando resultado para o credenciado — e quanto?"

Toda a aba gira em torno de **dois períodos** escolhidos pelo usuário:
- **Período de Análise** — o mês/intervalo que o usuário quer analisar
- **Período de Comparação** — o mês/intervalo usado como referência para calcular crescimento ou queda

---

## Princípio fundamental: comparação relativa

**Nenhum número na aba existe sozinho.** Cada valor exibido em um card tem:
1. O **valor absoluto** do período de análise (ex: R$ 7k aproveitado)
2. O **badge de variação** vs o período de comparação (ex: `↑ +3.2%` vs R$ 6k)

Isso significa que os cards **não são estáticos** — eles mudam quando o usuário troca o período ou o modo de comparação.

---

## Estrutura da aba

```
Visão Geral
├── DashboardHeader
│   ├── Filtro: Período de Análise (seletor de intervalo de dias)
│   └── Filtro: Comparar Com (mês anterior | ano anterior | customizado)
│
├── [Seção] Cards Principais (carousel)
│   ├── Card: Desconto Disponibilizado     ← mostra aproveitamento do desconto
│   ├── Card: Total de Débitos             ← mostra redução de débitos c/ BuyHelp
│   └── Card: Operação | Pedidos           ← mostra taxa de conversão
│
├── [Seção] Indicadores Complementares (grid)
│   ├── Card: Não Aproveitado              ← mostra por que não intermediou
│   ├── Card: Operação | Produtos          ← mostra produtos fora da intermediação
│   └── Card: Tributação de Produtos       ← mostra split tributado × isento
│
├── [Seção] Análise de Vendas (13 meses)
│   ├── Seletor de métrica (7 opções)
│   ├── Card de valor atual + delta
│   ├── Gráfico de barras 13 meses + linha de média
│   └── Botão: "Avaliação de Resultado"
│       └── Inline: DRE Antes × Depois (comparativo item a item)
│
├── [Seção] Cadastros
│   ├── Card: Movimentação (novos, perdidos, recuperados)
│   └── Card: Composição dos clientes (faixas de recência)
│
└── [Seção] Métricas de Vendas
    ├── Grid: 4 métricas de vendas
    └── Grid: 3 métricas de intermediações
```

Cada seção pode ser **reordenada** ou **ocultada** via "Configurar dashboard".

---

## Fonte de dados

Atualmente todos os dados são **mock estáticos** em `src/mocks/dashboardData.ts`:
- Arrays de 13 posições indexados por `mesIdx(month, year)`
- Período coberto: Abril/2025 → Abril/2026
- Cada posição representa 1 mês

A função `mesIdx()` mapeia o par (mês, ano) selecionado pelo filtro para o índice correto no array de dados.

---

## Fluxo de interação do usuário

```
1. Usuário seleciona Período de Análise
   └── Todos os cards atualizam com dados daquele mês

2. Usuário seleciona Modo de Comparação
   └── Todos os badges de variação atualizam

3. Usuário clica "Histórico" em qualquer card
   └── Modal abre com gráfico dos 13 meses + KPIs acumulados

4. Usuário clica "Avaliação de Resultado"
   └── DRE inline aparece com comparativo Antes × Depois por linha

5. Usuário clica "Configurar dashboard"
   └── Modal de configuração: reordenar seções, ocultar cards/sub-itens
```

---

## Conceitos de negócio

| Termo | Significado |
|-------|-------------|
| **Aproveitado** | Desconto efetivamente intermediado pela BuyHelp |
| **Disponível** | Desconto que poderia ser intermediado mas não foi |
| **Taxa de Absorção** | `aproveitado / (aproveitado + disponível) * 100` |
| **Intermediação** | Pedido processado pela BuyHelp (vs pedido normal) |
| **Conversão** | `intermediações / pedidos * 100` |
| **Antes BuyHelp** | Valor dos débitos/impostos sem a intermediação |
| **Depois BuyHelp** | Valor dos débitos/impostos com a intermediação |
| **Economia** | `antes - depois` — valor gerado para o credenciado |
| **Não Aproveitado** | Pedidos onde BuyHelp não intermediou (e por quê) |
| **Recuperados** | Clientes que voltaram a comprar após >60 dias inativos |
