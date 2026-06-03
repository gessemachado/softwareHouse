# Spec — Avaliação de Resultado (DRE Antes × Depois)

**ID:** VG-AV  
**Arquivo:** `src/components/visao-geral/AvaliacaoResultadosInline.tsx`  
**Modal:** `src/components/visao-geral/DREHistoricoModal.tsx`  
**Fonte de dados:** `AVALIACAO[mesIdx]` de `dashboardData.ts`

---

## O que é a Avaliação de Resultado

A Avaliação de Resultado responde à pergunta mais importante do negócio:

> "Linha a linha, o que melhorou e o que piorou depois da intermediação da BuyHelp?"

É um **DRE comparativo** (Demonstrativo de Resultado) que coloca lado a lado o desempenho **Antes** da BuyHelp e **Depois** da BuyHelp para o período selecionado, mostrando a variação de cada linha.

---

## VG-AV01 — Acesso à Avaliação de Resultado

**VG-AV01a** — O botão "Avaliação de Resultado" aparece no rodapé da seção Análise de Vendas.

**VG-AV01b** — Ao clicar, o componente `AvaliacaoResultadosInline` é exibido **inline** (logo abaixo), sem abrir modal.

**VG-AV01c** — O mesmo botão colapsa a avaliação quando clicado novamente (toggle). O label muda para "Ocultar Avaliação de Resultado" quando expandido.

**VG-AV01d** — O botão "Histórico" dentro da Avaliação de Resultado abre o `DREHistoricoModal`.

---

## VG-AV02 — Cabeçalho do componente

**VG-AV02a** — Ícone: BarChart2 laranja.

**VG-AV02b** — Título: "Avaliação de Resultados".

**VG-AV02c** — Subtítulo: "Análise comparativa de indicadores financeiros - Antes vs Depois da Intermediação".

**VG-AV02d** — Botão "Histórico" no cabeçalho → abre `DREHistoricoModal`.

---

## VG-AV03 — Tabela do DRE

### Colunas

| Coluna | Conteúdo |
|--------|----------|
| **Avaliação Resultado** | Nome do indicador (com recuo visual para sub-itens) |
| **Antes** | Valor absoluto no período **sem** a intermediação BuyHelp + badge de variação vs comparação |
| **%** | Percentual desse item em relação ao total de vendas (período Antes) |
| **Depois** | Valor absoluto no período **com** a intermediação BuyHelp + badge de variação vs comparação |
| **%** | Percentual desse item em relação ao total de vendas (período Depois) |
| **Variação** | Diferença percentual entre Depois e Antes. Verde se melhorou, vermelho se piorou |
| **Desconto** | Valor em R$ do desconto/economia aplicado nesse item |

### Tipos de linha

**VG-AV03a** — Linha **normal**: indicador padrão (ex: "Vendas Brutas", "Base ICMS").

**VG-AV03b** — Linha **margem**: exibida em itálico para destacar percentuais de margem.

**VG-AV03c** — Linha **ganho**: destacada com badge laranja ou teal — representa ganho direto do credenciado pela intermediação BuyHelp.

---

## VG-AV04 — Comportamento dos badges de variação nas colunas Antes/Depois

**VG-AV04a** — Cada célula de "Antes" mostra:
- Ícone de tendência (seta ↑ verde ou ↓ vermelho) comparando o valor Antes do período atual vs valor Antes do período de comparação
- Percentual de variação

**VG-AV04b** — Cada célula de "Depois" mostra:
- Ícone de tendência comparando o valor Depois do período atual vs valor Depois do período de comparação
- Percentual de variação

**VG-AV04c** — A coluna **Variação** (Depois vs Antes) usa regra semântica inversa para alguns itens:
- Para débitos/impostos: Variação negativa (queda) é **verde** (é bom que caiu)
- Para receitas/margem: Variação positiva (crescimento) é **verde**

---

## VG-AV05 — Linhas do DRE (indicadores exibidos)

Os indicadores são derivados de `AVALIACAO[curIdx]`:

| Linha | Campo mock | Semântica |
|-------|-----------|-----------|
| Vendas | `vendas` | Volume total de vendas no período |
| Base ICMS | `baseICMS` | Base de cálculo do ICMS |
| Base PIS/COFINS | `basePIS` | Base de cálculo do PIS/COFINS |
| CMV | `cmv` | Custo da mercadoria vendida |
| Margem Bruta | `margem` | Margem = Vendas − CMV |
| Débitos (antes/depois) | `debito.a` / `debito.d` | Total de débitos tributários |
| Margem Líquida | `margemLiq` | Margem após débitos |
| Ganho do Cliente | calculado | Economia gerada = antes − depois |

---

## VG-AV06 — Modal: Histórico DRE (DREHistoricoModal)

**VG-AV06a** — Abre ao clicar "Histórico" dentro da Avaliação de Resultado.

**VG-AV06b** — KPI cards por período: para cada período relevante (mês atual, mês de comparação):
- Valor base Antes
- Valor base Depois
- Ganho do Cliente (economia gerada pela BuyHelp)

**VG-AV06c** — Tabela histórica com colunas:
- Label | % Antes | % Depois | Val. Antes | Val. Depois | Redução % | Redução R$

**VG-AV06d** — Tipos de linha na tabela do modal: normal, margem (itálico), ganho (destacado com cor).

**VG-AV06e** — Modal fecha ao clicar fora ou no botão X.

---

## VG-AV07 — Regras de exibição da coluna Variação

**VG-AV07a** — Para cada linha, a variação é calculada como: `((depois - antes) / |antes|) * 100`

**VG-AV07b** — Exibição: `+X.X%` se cresceu, `-X.X%` se caiu.

**VG-AV07c** — Cor da variação:
- **Verde** se o resultado melhorou para o credenciado (ex: débito caiu, margem cresceu)
- **Vermelho** se o resultado piorou para o credenciado (ex: débito cresceu, margem caiu)
- **Cinza** se a variação é zero ou irrelevante (< 0.1%)

**VG-AV07d** — A linha "Ganho do Cliente" exibe sempre em verde quando o valor é positivo — representa o impacto direto e positivo da BuyHelp.
