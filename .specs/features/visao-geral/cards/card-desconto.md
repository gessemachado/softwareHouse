# Spec — Card: Desconto Disponibilizado

**ID:** VG-03x  
**Arquivo:** `src/components/visao-geral/cards/CardDesconto.tsx`  
**Config IDs:** `c_desconto`, `c_desconto.total`, `c_desconto.aproveitado`, `c_desconto.disponivel`  
**Fonte de dados:** `DESCONTO[mesIdx]`

---

## Dados

| Campo | Cálculo | Tipo |
|-------|---------|------|
| aproveitado | `DESCONTO[curIdx].aproveitado` | R$ |
| disponivel | `DESCONTO[curIdx].disponivel` | R$ |
| total | `aproveitado + disponivel` | R$ |
| absorcaoPct | `(aproveitado / total) * 100` | % |

---

## Requisitos

**VG-030** — Cabeçalho: ícone laranja "%", título "Desconto Disponibilizado", subtítulo "Acompanhamento do desconto disponibilizado", botão "Histórico".

**VG-031** — Donut (esquerda): segmento laranja = % aproveitado; segmento cinza = % disponível. Centro: label "Aproveitado" + `absorcaoPct%`.

**VG-032** — Linha **Total Disponibilizado** (`c_desconto.total`): R$ total + badge variação vs comparação.

**VG-033** — Linha **Aproveitado** (`c_desconto.aproveitado`): borda laranja, R$ aproveitado + badge variação + sub-texto "X% do total".

**VG-034** — Linha **Disponível** (`c_desconto.disponivel`): borda cinza, R$ disponível + badge variação + sub-texto "X% restante".

**VG-035** — Badge variação: `((cur - prev) / prev) * 100`. Verde `+X.X%` se cresceu, vermelho `-X.X%` se caiu. Texto lateral: "vs R$ {prev}".

**VG-036** — Botão "Histórico" → abre `DescontoAbsorcaoModal` (ver `historico-modal.md` VG-H03).
