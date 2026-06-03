# Spec — Card: Não Aproveitado

**ID:** VG-06x  
**Arquivo:** `src/components/visao-geral/cards/CardNaoAproveitado.tsx`  
**Config IDs:** `c_nao_aprov`, `c_nao_aprov.total`, `c_nao_aprov.mesma_trib`, `c_nao_aprov.somente_item`, `c_nao_aprov.nao_aceitou`  
**Fonte de dados:** `OPERACAO[mesIdx]`

---

## Dados

| Campo | Cálculo | Tipo |
|-------|---------|------|
| pedido | `OPERACAO[curIdx].pedido` | Qtd |
| intermediacao | `OPERACAO[curIdx].intermediacao` | Qtd |
| mesmaTrib | `OPERACAO[curIdx].mesmaTrib` | Qtd |
| somenteItem | `OPERACAO[curIdx].somenteItem` | Qtd |
| naoAceitou | `OPERACAO[curIdx].naoAceitou` | Qtd |
| naoAprov | `mesmaTrib + somenteItem + naoAceitou` | Qtd |
| naoAprovPct | `(naoAprov / pedido) * 100` | % |

---

## Requisitos

**VG-060** — Cabeçalho: ícone laranja "%", título "Não Aproveitado", subtítulo de acompanhamento da operação, botão "Histórico".

**VG-061** — Donut (esquerda): segmento laranja = % aproveitado; segmento ciano = % não aproveitado. Centro: label "Não Aprov." + `naoAprovPct%`.

**VG-062** — Linha **NÃO APROV. (total)** (`c_nao_aprov.total`): quantidade total + badge variação.

**VG-063** — Linha **Mesma Tributação** (`c_nao_aprov.mesma_trib`): indicador rosa, quantidade + badge variação.

**VG-064** — Linha **Somente um Item** (`c_nao_aprov.somente_item`): indicador marrom, quantidade + badge variação.

**VG-065** — Linha **Cliente não aceitou** (`c_nao_aprov.nao_aceitou`): indicador vermelho escuro, quantidade + badge variação.

**VG-066** — Botão "Histórico" → abre `OperacaoHistoricoModal` (ver `historico-modal.md` VG-H06).
