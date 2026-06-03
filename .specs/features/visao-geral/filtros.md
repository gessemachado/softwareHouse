# Spec — Sistema de Filtros

**ID:** VG-01x  
**Arquivo:** `src/components/visao-geral/DashboardHeader.tsx`  
**Contexto:** `DashboardFilterContext`

---

## Visão Geral do Sistema de Filtros

O sistema de filtros define **dois períodos** que controlam TODA a aba:

| Filtro | Propósito | Variáveis no contexto |
|--------|-----------|----------------------|
| Período de Análise | O mês/intervalo que o usuário quer ver | `selectedMonth`, `selectedYear`, `dayRangeStart`, `dayRangeEnd` |
| Período de Comparação | O mês/intervalo usado como baseline para calcular variação | `compareMonth`, `compareYear`, `compareMode` |

**Impacto:** Qualquer mudança em qualquer filtro faz todos os cards, badges e gráficos re-renderizarem com os novos dados.

---

## VG-011 — Filtro: Período de Análise

**VG-011a** — O filtro exibe o intervalo selecionado no formato `DD/MM/ANO → DD/MM/ANO`.

**VG-011b** — Ao clicar, abre um calendário (DayPickerCalendar) com:
- Navegação de mês/ano (botões Anterior/Próximo)
- Grade de 7 colunas (dias da semana)
- Seleção de intervalo: primeiro clique define início, segundo clique define fim
- Preview visual do intervalo ao passar o mouse (hover)
- Destaque visual do intervalo confirmado
- Botão **Limpar** — remove a seleção
- Botão **Confirmar** — aplica o intervalo e fecha o calendário

**VG-011c** — O intervalo selecionado é armazenado como `dayRangeStart` e `dayRangeEnd` no contexto.

**VG-011d** — O mês/ano exibido nos cards é derivado do `dayRangeStart` (mês de início do intervalo).

---

## VG-012 — Filtro: Período de Comparação

**VG-012a** — O filtro exibe o modo atual selecionado e o período de comparação calculado.

**VG-012b** — Dropdown com 3 modos:

| Modo | Label | Comportamento |
|------|-------|---------------|
| 0 | "Mês anterior" | Período = mês imediatamente anterior ao período de análise |
| 1 | "Mesmo mês ano anterior" | Período = mesmo mês do ano anterior |
| 2 | "Customizado" | Usuário escolhe manualmente mês/ano |

**VG-012c** — Nos modos 0 e 1, o período de comparação é **calculado automaticamente** e exibido abaixo do dropdown (ex: "Comparando com Jan/2026").

**VG-012d** — No modo 2 ("Customizado"), exibe campos adicionais para o usuário selecionar mês e ano manualmente.

**VG-012e** — O período de comparação é armazenado como `compareMonth` e `compareYear` no contexto.

---

## VG-013 — Como os filtros afetam os cards

**VG-013a** — Cada card usa `mesIdx(selectedMonth, selectedYear)` para obter o índice `curIdx` no array de dados mock.

**VG-013b** — Cada card usa `mesIdx(compareMonth, compareYear)` para obter o índice `prevIdx` no array de dados mock.

**VG-013c** — Os **badges de variação** são calculados como:
```
variação = ((valorCur - valorPrev) / valorPrev) * 100
badge = `+X.X%` se cresceu (fundo verde, ícone ↑)
badge = `-X.X%` se caiu (fundo vermelho, ícone ↓)
```

**VG-013d** — O texto de comparação ao lado do badge exibe o valor do período anterior no formato "vs R$ X" ou "vs X anterior".

**VG-013e** — Se `valorPrev === 0`, o badge exibe "+0.0%" sem erro.

---

## VG-014 — Comportamento esperado por card

| Card | Valor principal | Badge mostra |
|------|----------------|--------------|
| Desconto — Total | R$ total disponibilizado no mês selecionado | % variação vs período de comparação |
| Desconto — Aproveitado | R$ aproveitado no mês selecionado | % variação + "vs R$ X" |
| Desconto — Disponível | R$ disponível no mês selecionado | % variação + "vs R$ X" |
| Débitos — Antes | R$ de débitos sem BuyHelp no mês selecionado | % variação vs comparação |
| Débitos — Depois | R$ de débitos com BuyHelp no mês selecionado | % variação vs comparação |
| Débitos — Economia | R$ economizado no mês selecionado | % variação + "vs X anterior" |
| Gauge — Pedidos | R$ de pedidos no mês selecionado | % variação |
| Gauge — Intermediações | R$ de intermediações no mês selecionado | % variação + "X% do total" |
| Gauge — Conversão | % de conversão no mês selecionado | pp variação (diferença em pontos percentuais) |
