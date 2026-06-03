# Spec — Botão Histórico & Modais de Histórico

**ID:** VG-HX  
**Aplicável a:** todos os cards e seções da Visão Geral

---

## Visão Geral

Cada card da Visão Geral tem um botão **"Histórico"** no seu cabeçalho. Ao ser clicado, abre um modal que apresenta os **últimos 13 meses** de dados daquele card — permitindo ao usuário entender a evolução temporal da métrica, não apenas o snapshot do período selecionado.

---

## VG-H01 — Comportamento do botão Histórico

**VG-H01a** — O botão "Histórico" fica no canto superior direito do cabeçalho de cada card.

**VG-H01b** — Ao clicar, abre um modal sobreposto (overlay escuro, z-50).

**VG-H01c** — O modal fecha ao clicar fora da área do modal (overlay) ou no botão X do cabeçalho.

**VG-H01d** — O modal exibe dados dos 13 meses disponíveis (Abr/2025 → Abr/2026), **independente** do período selecionado nos filtros.

---

## VG-H02 — Estrutura padrão dos modais de Histórico

Todos os modais de histórico seguem a mesma estrutura:

```
┌─────────────────────────────────────────────┐
│ [Ícone] Título do Card                   [X] │
│ Subtítulo descritivo                         │
├─────────────────────────────────────────────┤
│  [KPI 1]   [KPI 2]   [KPI 3]   [KPI 4]      │  ← Cards de totais/médias
├─────────────────────────────────────────────┤
│                                             │
│  [Gráfico: 13 barras mensais]               │  ← Visualização temporal
│                                             │
└─────────────────────────────────────────────┘
```

**VG-H02a** — KPI cards no topo: mostram **acumulados**, **médias** ou **picos** dos 13 meses.

**VG-H02b** — Gráfico mostra todos os 13 meses no eixo X, valores no eixo Y.

**VG-H02c** — O mês atualmente selecionado nos filtros é destacado visualmente no gráfico.

---

## VG-H03 — Modal: Desconto Disponibilizado (DescontoAbsorcaoModal)

**VG-H03a** — KPIs: Total Aproveitado (13m), Total Disponível (13m), Taxa de Absorção média.

**VG-H03b** — Gráfico de barras empilhadas por mês:
- Barra inferior: Volume Disponível (cinza)
- Barra superior: Volume Aproveitado (laranja)

**VG-H03c** — Linha adicional: Taxa de Absorção (%) com:
- Linha de referência: média da loja (tracejada)
- Linha de referência: média BuyHelp (tracejada diferenciada)

---

## VG-H04 — Modal: Operação | Pedidos / Intermediações (OperacaoGaugeHistoricoModal)

**VG-H04a** — KPIs: Total Pedidos (13m), Total Intermediações (13m), Conversão Média (%), Melhor Mês.

**VG-H04b** — Gráfico de barras agrupadas por mês:
- Barra 1: Volume Pedidos (cinza)
- Barra 2: Volume Intermediações (verde)

**VG-H04c** — Linha secundária: Taxa de Conversão (%) mês a mês.

---

## VG-H05 — Modal: Total de Débitos (DebitosHistoricoModal)

**VG-H05a** — KPIs: Total Antes (13m), Total Depois (13m), Economia Total, Redução Média (%).

**VG-H05b** — Gráfico de barras agrupadas por mês (3 barras):
- Barra 1: Antes (vermelho)
- Barra 2: Depois (verde)
- Barra 3: Economia (azul/cinza)

---

## VG-H06 — Modal: Não Aproveitado (OperacaoHistoricoModal)

**VG-H06a** — KPIs: Total Pedidos (13m), Intermediações, Não Aproveitados total, Conversão %.

**VG-H06b** — Detalhamento: Mesma Tributação, Somente um Item, Cliente não aceitou (quantidades).

**VG-H06c** — Gráfico de barras empilhadas (5 categorias por mês):
- Pedido | Intermediação | Mesma Trib. | Somente Item | Não Aceitou

---

## VG-H07 — Modal: Operação | Produtos (OperacaoProdutosHistoricoModal)

**VG-H07a** — KPIs: Aproveitado %, Não Atuou (R$ total), Maior Sub-Categoria.

**VG-H07b** — Gráfico misto por mês:
- Barra independente: Aproveitado (laranja)
- Barras empilhadas: M. Negativa + Custo Zero + Exclusão Loja + Blacklist

---

## VG-H08 — Modal: Tributação de Produtos (TributacaoHistoricoModal)

**VG-H08a** — KPIs: Total Tributado (13m), Total Isento (13m), % Tributado médio.

**VG-H08b** — Gráfico de barras agrupadas (2 barras por mês):
- Barra 1: Tributado (laranja)
- Barra 2: Isento/ST (verde)

---

## VG-H09 — Modal: Métricas (MetricaChartModal)

Compartilhado por todos os cards da seção Métricas de Vendas.

**VG-H09a** — KPIs: Acumulado 2026 (ou Média), Média 13 Meses, Pico (mês com maior valor).

**VG-H09b** — Gráfico de barras mensais com linha de referência de média.

**VG-H09c** — Legenda: Acima da média (laranja sólido), Abaixo da média (laranja transparente), Média (linha tracejada).

---

## VG-H10 — Modal: Cadastros (CadastrosHistoricoModal)

**VG-H10a** — KPIs: Novos Cadastros (acumulado 2026), Clientes Perdidos, Clientes Recuperados.

**VG-H10b** — Gráfico de barras agrupadas (3 barras por mês):
- Novos (laranja/verde)
- Perdidos (vermelho)
- Recuperados (ciano)

---

## VG-H11 — Modal: Composição dos Clientes (ComposicaoClientesModal)

**VG-H11a** — KPIs: Cadastro Externo/CRM (total + %), Loja (total + %), Afiliados (total + %).

**VG-H11b** — Gráfico de barras empilhadas por mês: CRM + Loja + Afiliados.

**VG-H11c** — Tabela: Origem | Novos (13m) | % do Total | Último mês.

---

## VG-H12 — Modal: Avaliação DRE (DREHistoricoModal)

**VG-H12a** — KPI cards por período com: valor base antes, valor base depois, ganho do cliente.

**VG-H12b** — Tabela com colunas: Label | % Antes | % Depois | Val. Antes | Val. Depois | Redução % | Redução R$.

**VG-H12c** — Tipos de linha: normal, margem (itálico), ganho (destacado).
