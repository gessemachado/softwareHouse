# Spec — Modal: Configurar Dashboard

**ID:** VG-13x  
**Arquivo:** `src/components/visao-geral/DashboardConfigModal.tsx`  
**Contexto:** `DashboardConfigContext`

---

## Acesso

**VG-130a** — Botão "Configurar dashboard" fica no topo da área de conteúdo da Visão Geral.

**VG-130b** — Ícone: Settings2 cinza, muda para laranja no hover.

**VG-130c** — Ao clicar, abre `DashboardConfigModal` sobreposto (overlay escuro, z-50).

---

## Estrutura do Modal

**VG-131** — Modal com altura fixa (~580px) e layout dividido em 2 painéis: esquerdo (lista de seções) e direito (configuração da seção selecionada).

**VG-132** — Cabeçalho: título "Configurar Dashboard", subtítulo "Reordene e configure visibilidade dos cards", botão X para fechar.

---

## Painel Esquerdo — Lista de Seções

**VG-133a** — Lista todas as seções configuráveis com:
- Ícone da seção
- Label da seção
- Botões ↑ / ↓ para reordenar (desabilitados no topo/fim)
- Toggle ON/OFF para visibilidade

**VG-133b** — Seções disponíveis:

| ID | Label | Ícone |
|----|-------|-------|
| `carousel` | Cards Principais | cards |
| `cards` | Cards de Análise | grid |
| `vendas` | Análise de Vendas | gráfico |
| `cadastros` | Cadastros | lápis |
| `metricas` | Métricas de Vendas | play |

**VG-133c** — Clicar em uma seção seleciona-a e exibe suas opções no painel direito.

**VG-133d** — Reordenar: ao clicar ↑ ou ↓, a seção troca de posição e a ordem de renderização da Visão Geral é atualizada em tempo real.

**VG-133e** — Toggle OFF: a seção some da Visão Geral imediatamente. Toggle ON: a seção volta a aparecer.

---

## Painel Direito — Configuração da Seção

### Para seção `cards` (Indicadores Complementares)

**VG-134a** — Lista os 3 cards configuráveis (`c_nao_aprov`, `c_op_prod`, `c_tributacao`) em ordem.

**VG-134b** — Cada card na lista mostra:
- Número de posição
- Handle de drag (para reordenar)
- Botão expandir/recolher (ChevronRight → gira 90° quando expandido)
- Label do card
- Botões ↑ / ↓
- Contagem de sub-itens ("X itens")
- Toggle ON/OFF de visibilidade do card inteiro

**VG-134c** — Quando expandido, exibe os sub-itens internos do card:
- Cada sub-item: indicador colorido + label + toggle ON/OFF
- Toggle OFF em um sub-item oculta apenas aquela linha de dado dentro do card

**VG-134d** — Sub-itens por card:

| Card | Sub-itens |
|------|-----------|
| Não Aproveitado | total, mesma_trib, somente_item, nao_aceitou |
| Operação Produtos | nao_atuou, m_negativa, custo_zero, exclusao_loja, blacklist |
| Tributação | tributado, isento |

### Para demais seções

**VG-134e** — Exibe: "Sem cards configuráveis" (as seções carousel, vendas, cadastros, metricas não têm configuração de sub-itens).

---

## Rodapé do Modal

**VG-135a** — Botão "Restaurar padrão": remove todas as chaves de configuração do `localStorage`, volta aos valores default do contexto, fecha o modal.

**VG-135b** — Botão "Cancelar": fecha o modal **sem** salvar mudanças feitas durante a sessão atual do modal.

**VG-135c** — Botão "Salvar": persiste as mudanças (visibilidade, ordem) no `localStorage` via `DashboardConfigContext` e fecha o modal.

**VG-135d** — As mudanças de visibilidade e ordem são **aplicadas imediatamente** na Visão Geral (reatividade) ao clicar Salvar.
