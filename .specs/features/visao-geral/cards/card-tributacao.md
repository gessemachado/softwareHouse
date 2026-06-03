# Spec — Card: Tributação de Produtos

**ID:** VG-08x  
**Arquivo:** `src/components/visao-geral/cards/CardTributacao.tsx`  
**Config IDs:** `c_tributacao`, `c_tributacao.tributado`, `c_tributacao.isento`  
**Fonte de dados:** `TRIBUTACAO[mesIdx]` de `dashboardData.ts`

---

## Dados

| Campo      | Fonte Mock                  | Tipo |
|------------|-----------------------------|------|
| tributado  | `TRIBUTACAO[i].tributado`   | R$   |
| isento     | `TRIBUTACAO[i].isento`      | R$   |
| total      | `tributado + isento`        | R$   |
| tribPct    | `(tributado / total) * 100` | %    |
| isentoPct  | `(isento / total) * 100`    | %    |

---

## Requisitos

**VG-080** — Cabeçalho: ícone laranja "T", título "Tributação de Produtos", subtítulo "Volume de vendas por regime tributário", botão "Histórico".

**VG-081** — Visualização (esquerda): 2 barras verticais comparativas.
- Barra 1: Tributado (laranja), altura proporcional ao % tributado
- Barra 2: Isento/ST (verde), altura proporcional ao % isento
- Rótulo percentual acima de cada barra

**VG-082** — Linha **Tributado** (visível se `c_tributacao.tributado = true`):
- Borda/background laranja
- Valor R$ do tributado
- Badge de variação vs período de comparação
- Sub-texto: "X% do total"

**VG-083** — Linha **Isento/ST** (visível se `c_tributacao.isento = true`):
- Borda/background verde
- Valor R$ do isento
- Badge de variação vs período de comparação
- Sub-texto: "X% do total"

**VG-084** — Botão "Histórico" abre `TributacaoHistoricoModal`.

---

## Modal: TributacaoHistoricoModal

**Arquivo:** `src/components/visao-geral/TributacaoHistoricoModal.tsx`

**VG-084a** — 3 KPI cards: Total Tributado (13m), Total Isento (13m), % Tributado médio.

**VG-084b** — Gráfico de barras agrupadas (2 barras por mês):
- Tributado (laranja)
- Isento/ST (verde)

**VG-084c** — Modal fecha ao clicar fora ou no botão X.
