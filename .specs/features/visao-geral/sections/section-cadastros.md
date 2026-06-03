# Spec — Seção: Cadastros

**ID:** VG-11x  
**Arquivo:** `src/components/visao-geral/CadastrosSection.tsx`  
**Fonte de dados:** `CADASTROS[mesIdx]` de `dashboardData.ts`

---

## Dados

| Campo        | Fonte Mock                  | Tipo |
|--------------|-----------------------------|------|
| novos        | `CADASTROS[i].novos`        | Qtd  |
| perdidos     | `CADASTROS[i].perdidos`     | Qtd  |
| recuperados  | `CADASTROS[i].recuperados`  | Qtd  |
| saldo        | `novos - perdidos + recuperados` | Qtd |

---

## VG-110 — Layout

Grid de 2 colunas (1 col mobile, 2 cols desktop):
- Coluna esquerda: Cadastros Ativos
- Coluna direita: Composição dos Clientes

---

## VG-111 — Coluna Esquerda: Cadastros Ativos

**VG-111a** — Cabeçalho: ícone verde TrendingUp, título "Cadastros Ativos", subtítulo "Movimentação do mês", botão "Histórico".

**VG-111b** — **Saldo do mês**: valor grande, verde se ≥ 0 (`+N`), vermelho se < 0 (`-N`). Fórmula: `novos − perdidos + recuperados`.

**VG-111c** — Ícone de tendência ao lado do saldo: TrendingUp verde ou TrendingDown vermelho.

**VG-111d** — Subgrid 2×2 com 3 cards:

| Card | Ícone | Valor exibido | Comparação |
|------|-------|---------------|------------|
| Cadastrados | TrendingUp laranja | `cur.novos` | Badge % vs `prev.novos` |
| Perdidos | TrendingDown vermelho | `cur.perdidos` | Badge % vs `prev.perdidos` |
| Recuperados (2 cols) | RefreshCw ciano | `cur.recuperados` | Badge % vs `prev.recuperados` |

**VG-111e** — "Perdidos" exibe tooltip: "Clientes que deixaram de comprar após 60 dias".

**VG-111f** — "Recuperados" exibe tooltip: "Clientes que não compravam há mais de 60 dias e voltaram a comprar".

**VG-111g** — Botão "Histórico" abre `CadastrosHistoricoModal` (ver `historico-modal.md` VG-H10).

---

## VG-112 — Coluna Direita: Composição dos Clientes

**VG-112a** — Cabeçalho: título "Composição dos clientes", subtítulo "Total: 5235 clientes Ativos", botão "Origem".

**VG-112b** — 9 faixas de recência exibidas como lista:

| Faixa | Cor | Descrição |
|-------|-----|-----------|
| Comprando hoje | Verde (#20bf55) | Clientes comprando hoje |
| 7 dias | Azul claro (#66cdf6) | 7 dias da última compra |
| 15 dias | Azul (#2499e4) | 15 dias da última compra |
| 15–30 dias | Roxo (#a78bfa) | Entre 15 e 30 dias da última compra |
| 30–60 dias | Amarelo (#f1d954) | Entre 30 e 60 dias da última compra |
| 60–90 dias | Laranja (#f97316) | Entre 60 e 90 dias da última compra |
| 90–120 dias | Vermelho (#ef4444) | Entre 90 e 120 dias da última compra |
| 120–180 dias | Vermelho escuro (#dc2626) | Entre 120 e 180 dias da última compra |
| > 180 dias | Vermelho muito escuro (#7f1d1d) | Mais de 180 dias da última compra |

**VG-112c** — Cada faixa exibe: quadrado colorido + label + descrição + barra horizontal (width = % de clientes) + quantidade + badge % colorido.

**VG-112d** — Botão "Origem" abre `ComposicaoClientesModal` (ver `historico-modal.md` VG-H11).
