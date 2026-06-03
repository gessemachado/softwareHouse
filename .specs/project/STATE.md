# State — BuyHelp SH

## Decisions
- Dados são mock/estáticos para Visão Geral (não conectados ao Supabase ainda)
- `mesIdx()` faz o mapeamento período → índice nos arrays de dados mock
- Cards da Visão Geral usam dois contextos: DashboardFilterContext (período) e DashboardConfigContext (visibilidade/ordem)
- Configuração de cards persiste em localStorage
- CardsCarousel: a faixa de navegação ("Cards de Análise · Aproveitado +1.5pp") foi removida; os 3 cards com donut foram mantidos
- Visão Geral renderiza seções em ordem configurável via DashboardConfigContext

## Specs Geradas — Visão Geral

### Contexto & Filtros
- [x] `context.md` — contexto geral da aba, conceitos de negócio, fluxo de interação
- [x] `filtros.md` — sistema de filtros (Período de Análise + Período de Comparação)
- [x] `historico-modal.md` — comportamento do botão Histórico e specs de todos os modais históricos
- [x] `avaliacao-resultado.md` — DRE Antes × Depois com badges de crescimento/queda por linha
- [x] `spec.md` — spec master com todos os IDs VG-xxx

### Cards
- [x] `cards/card-desconto.md` — Desconto Disponibilizado
- [x] `cards/card-gauge-operacao.md` — Operação | Pedidos / Intermediações
- [x] `cards/card-debitos.md` — Total de Débitos
- [x] `cards/card-nao-aproveitado.md` — Não Aproveitado
- [x] `cards/card-op-produtos.md` — Operação | Produtos
- [x] `cards/card-tributacao.md` — Tributação de Produtos

### Seções
- [x] `sections/section-sales-analysis.md` — Análise de Vendas (13 meses)
- [x] `sections/section-cadastros.md` — Cadastros (Ativos + Composição)
- [x] `sections/section-metricas.md` — Métricas de Vendas + Intermediações
- [x] `sections/section-config-modal.md` — Modal Configurar Dashboard

## Deferred
- Conexão dos cards da Visão Geral ao Supabase real (atualmente mock)
- Filtro por período por dia (DayPickerCalendar) — UI existe mas não filtra dados mock
- Export de dados (PDF/Excel) dos modais históricos
- Reordenação por drag-and-drop no modal de configuração (atualmente apenas ↑↓)

## Tech Debt
- `CadastrosSection.tsx` tinha encoding UTF-8 corrompido (corrigido em jun/2026)
- `CardsCarousel.tsx` ainda contém código de auto-rotation e paginação mesmo com 3 cards que cabem em 1 página — pode ser simplificado
