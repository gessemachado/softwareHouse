# Spec — Card: Operação | Produtos

**ID:** VG-07x  
**Arquivo:** `src/components/visao-geral/cards/CardOpProdutos.tsx`  
**Config IDs:** `c_op_prod`, `c_op_prod.nao_atuou`, `c_op_prod.m_negativa`, `c_op_prod.custo_zero`, `c_op_prod.exclusao_loja`, `c_op_prod.blacklist`  
**Fonte de dados:** `OPERACAO_PRODUTOS[mesIdx]`

---

## Dados

| Campo | Cálculo | Tipo |
|-------|---------|------|
| aproveitado | `OPERACAO_PRODUTOS[curIdx].aproveitado` | R$ |
| naoAtuou | `OPERACAO_PRODUTOS[curIdx].naoAtuou` | R$ |
| mNegativa | `OPERACAO_PRODUTOS[curIdx].mNegativa` | R$ |
| custoZero | `OPERACAO_PRODUTOS[curIdx].custoZero` | R$ |
| exclusaoLoja | `OPERACAO_PRODUTOS[curIdx].exclusaoLoja` | R$ |
| blacklist | `OPERACAO_PRODUTOS[curIdx].blacklist` | R$ |
| total | `aproveitado + naoAtuou` | R$ |
| naoAtuouPct | `(naoAtuou / total) * 100` | % |

---

## Requisitos

**VG-070** — Cabeçalho: ícone laranja "%", título "Operação | Produtos", subtítulo "Acompanhamento dos produtos que não atuamos", botão "Histórico".

**VG-071** — Donut (esquerda): segmento laranja = % aproveitado; segmento cinza = % não atuou. Centro: label "Não Atuou" + `naoAtuouPct%`.

**VG-072** — Linha **NÃO ATUOU** (`c_op_prod.nao_atuou`): R$ total não atuado + badge variação.

**VG-073** — Linha **M. Negativa** (`c_op_prod.m_negativa`): indicador vermelho, R$ + badge variação.

**VG-074** — Linha **Custo Zero** (`c_op_prod.custo_zero`): indicador âmbar, R$ + badge variação.

**VG-075** — Linha **Exclusão Loja** (`c_op_prod.exclusao_loja`): indicador roxo, R$ + badge variação.

**VG-076** — Linha **Blacklist** (`c_op_prod.blacklist`): indicador cinza, R$ + badge variação.

**VG-077** — Botão "Histórico" → abre `OperacaoProdutosHistoricoModal` (ver `historico-modal.md` VG-H07).
