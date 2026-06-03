# Spec — Card: Total de Débitos

**ID:** VG-05x  
**Arquivo:** `src/components/visao-geral/cards/CardDebitos.tsx`  
**Config IDs:** `c_debitos`, `c_debitos.antes`, `c_debitos.depois`, `c_debitos.economia`  
**Fonte de dados:** `AVALIACAO[mesIdx].debito`

---

## Dados

| Campo | Cálculo | Tipo |
|-------|---------|------|
| antes | `AVALIACAO[curIdx].debito.a` | R$ |
| depois | `AVALIACAO[curIdx].debito.d` | R$ |
| economia | `antes - depois` | R$ |
| reducaoPct | `(economia / antes) * 100` | % |

---

## Requisitos

**VG-050** — Cabeçalho: ícone vermelho "D", título "Total de Débitos", subtítulo "Antes e depois BuyHelp", botão "Histórico".

**VG-051** — Donut (esquerda): segmento verde = % de redução; segmento vermelho = % restante. Centro: label "Redução" + `reducaoPct%`.

**VG-052** — Linha **Antes** (`c_debitos.antes`): borda vermelha, R$ débito sem BuyHelp + badge variação + sub-texto "Sem BuyHelp".

**VG-053** — Linha **Depois** (`c_debitos.depois`): borda verde, R$ débito com BuyHelp + badge variação + sub-texto "Com BuyHelp".

**VG-054** — Linha **Economia** (`c_debitos.economia`): background cinza, valor R$ em verde. Sub-texto: "vs R${prevEconomia} anterior · {reducaoPct}% redução".

**VG-055** — Botão "Histórico" → abre `DebitosHistoricoModal` (ver `historico-modal.md` VG-H05).
