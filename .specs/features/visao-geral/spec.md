# Spec — Visão Geral

**Feature ID prefix:** `VG`  
**Arquivo principal:** `src/pages/VisaoGeral.tsx`  
**Contextos:** `DashboardFilterContext`, `DashboardConfigContext`

---

## Índice de Specs

| Arquivo | Conteúdo | IDs |
|---------|----------|-----|
| `context.md` | Contexto geral, conceitos de negócio, fluxo de interação | — |
| `filtros.md` | Sistema de filtros: Período Análise + Comparação | VG-01x |
| `cards/card-desconto.md` | Desconto Disponibilizado | VG-03x |
| `cards/card-gauge-operacao.md` | Operação \| Pedidos / Intermediações | VG-04x |
| `cards/card-debitos.md` | Total de Débitos | VG-05x |
| `cards/card-nao-aproveitado.md` | Não Aproveitado | VG-06x |
| `cards/card-op-produtos.md` | Operação \| Produtos | VG-07x |
| `cards/card-tributacao.md` | Tributação de Produtos | VG-08x |
| `sections/section-sales-analysis.md` | Análise de Vendas 13 meses | VG-09x |
| `avaliacao-resultado.md` | DRE Antes × Depois (Avaliação de Resultado) | VG-AV |
| `sections/section-cadastros.md` | Cadastros + Composição dos Clientes | VG-11x |
| `sections/section-metricas.md` | Métricas de Vendas + Intermediações | VG-12x |
| `sections/section-config-modal.md` | Modal Configurar Dashboard | VG-13x |
| `historico-modal.md` | Botão Histórico + todos os modais de histórico | VG-H |

---

## VG-00x — Layout & Configuração Geral

**VG-001** — A página renderiza seções na ordem definida em `DashboardConfigContext.sections`, ignorando seções com `visible: false`.

**VG-002** — Seções configuráveis: Cards Principais (carousel), Indicadores Complementares (cards grid), Análise de Vendas, Cadastros, Métricas de Vendas.

**VG-003** — O botão "Configurar dashboard" está sempre visível no topo e abre `DashboardConfigModal`.

**VG-004** — Configurações de visibilidade e ordem persistem em `localStorage` entre sessões.

**VG-005** — Todos os cards reagem reativamente a mudanças de período via `DashboardFilterContext`.

---

## VG-02x — Cards Grid (Indicadores Complementares)

**VG-020** — Label da seção: "INDICADORES COMPLEMENTARES".

**VG-021** — Grid responsivo: 1 coluna (mobile) → 3 colunas (desktop). Ordem definida por `cardOrder`.

**VG-022** — Cada card pode ser ocultado via `cardVis` no DashboardConfigContext.

**VG-023** — Os 3 cards disponíveis: Não Aproveitado (`c_nao_aprov`), Operação|Produtos (`c_op_prod`), Tributação (`c_tributacao`).

---

## Modais de Histórico — referência cruzada

| Modal | Abre de | Spec |
|-------|---------|------|
| `DescontoAbsorcaoModal` | card-desconto VG-036 | historico-modal.md VG-H03 |
| `OperacaoGaugeHistoricoModal` | card-gauge VG-045 | historico-modal.md VG-H04 |
| `DebitosHistoricoModal` | card-debitos VG-055 | historico-modal.md VG-H05 |
| `OperacaoHistoricoModal` | card-nao-aprov VG-066 | historico-modal.md VG-H06 |
| `OperacaoProdutosHistoricoModal` | card-op-prod VG-077 | historico-modal.md VG-H07 |
| `TributacaoHistoricoModal` | card-tributacao VG-084 | historico-modal.md VG-H08 |
| `MetricaChartModal` | section-metricas VG-123 | historico-modal.md VG-H09 |
| `CadastrosHistoricoModal` | section-cadastros VG-111g | historico-modal.md VG-H10 |
| `ComposicaoClientesModal` | section-cadastros VG-112d | historico-modal.md VG-H11 |
| `DREHistoricoModal` | avaliacao-resultado VG-AV06 | historico-modal.md VG-H12 |
