# Software House Management — Specification

## Problem Statement

A plataforma BuyHelp Desconto precisa de um módulo centralizado para cadastrar e gerenciar Software Houses parceiras. Hoje não existe forma estruturada de rastrear quais SHs operam na plataforma, quem são seus representantes e fingers de campo, quais credenciados estão vinculados a cada SH e quais são os percentuais de comissão acordados.

## Goals

- [ ] Administrador consegue cadastrar uma SH completa em uma única sessão (wizard guiado)
- [ ] Administrador consegue localizar qualquer SH em menos de 5 segundos via busca/filtro
- [ ] Relatório financeiro exportável gerado em menos de 3 segundos

## Out of Scope

| Feature | Reason |
|---------|--------|
| Portal self-service da SH | v2 — requer autenticação separada |
| Dashboard de gráficos por SH | Tela não especificada no Figma v1 |
| Gestão de campanhas da SH | Módulo separado |
| Faturamento / pagamentos | Fora do escopo BuyHelp SH |
| Relatório por Finger | v2 — tab existe no Figma mas idêntica |

---

## Entidades Principais

### Software House
- CNPJ (único), Nome Fantasia, Razão Social, E-mail, Telefone
- Endereço: CEP, Logradouro, Número, Bairro, Estado, Município
- Dados operacionais: Prazo Pagamento (dias), % Participação SH, % Participação Representante
- Status: Ativa | Inativa
- Qtd. Lojas Vinculadas (calculado via Credenciados)
- Qtd. Representantes (calculado)

### Representante
- Nome Completo, E-mail, Telefone, CPF, Cidade, Estado
- Data de Vínculo com a SH
- Relacionamento: N representantes por SH

### Finger
- Nome Completo, E-mail, Telefone, CPF, Porcentagem (%), Prazo (meses), Cidade, Estado
- Data de Vínculo com a SH
- Relacionamento: N fingers por SH

### Credenciado (entidade existente na plataforma)
- Vinculado à SH com um Representante + um Finger específicos
- Relacionamento: N credenciados por SH; cada vínculo tem 1 Representante + 1 Finger

---

## User Stories

### SH-01: Listar Software Houses ⭐ MVP

**User Story**: Como administrador, quero ver todas as SHs cadastradas com status e métricas, para ter visão geral da rede de parceiros.

**Why P1**: Ponto de entrada de todo o módulo; sem isso nada funciona.

**Acceptance Criteria**:

1. WHEN o administrador acessa `/software-house` THEN sistema SHALL exibir tabela com colunas: Nome/CNPJ/Cidade, Qtd. Lojas Vinculadas, Qtd. Representante, Status, Ações
2. WHEN administrador digita no campo de busca THEN sistema SHALL filtrar por nome, CNPJ ou cidade em tempo real (debounce 300ms)
3. WHEN administrador clica em "Pesquisar" THEN sistema SHALL aplicar todos os filtros ativos simultaneamente
4. WHEN administrador clica em "Limpar" THEN sistema SHALL resetar todos os filtros e recarregar lista completa
5. WHEN não há resultados THEN sistema SHALL exibir mensagem "Nenhuma software house encontrada"
6. WHEN há mais de N itens THEN sistema SHALL paginar com controles Anterior/Próximo e indicador "Página X de Y"
7. WHEN status é "Ativa" THEN sistema SHALL exibir badge verde; WHEN "Inativa" SHALL exibir badge cinza

**Independent Test**: Acessar a rota, ver lista com 4 SHs mockadas, filtrar por "Tech", ver só "Tech Solutions" aparecer.

---

### SH-02: Cadastrar Nova Software House — Passo 1: Dados Básicos ⭐ MVP

**User Story**: Como administrador, quero preencher os dados básicos de uma nova SH, para iniciar o cadastro com informações obrigatórias validadas.

**Why P1**: Primeiro passo do wizard; sem ele o cadastro não existe.

**Acceptance Criteria**:

1. WHEN administrador clica em "+ Nova Software House" THEN sistema SHALL navegar para wizard com stepper de 5 passos, iniciando no passo 1
2. WHEN administrador preenche CNPJ THEN sistema SHALL aplicar máscara `00.000.000/0000-00`
3. WHEN CNPJ inválido (dígito verificador errado) THEN sistema SHALL exibir erro inline no campo
4. WHEN CNPJ já cadastrado THEN sistema SHALL exibir erro "CNPJ já está em uso"
5. WHEN administrador preenche CEP THEN sistema SHALL buscar endereço automaticamente (ViaCEP) e preencher Logradouro, Bairro, Município, Estado
6. WHEN todos os campos obrigatórios estão válidos THEN sistema SHALL habilitar botão "Próximo: Dados Operacionais"
7. WHEN campo obrigatório está vazio e usuário tenta avançar THEN sistema SHALL exibir erro "Campo obrigatório" abaixo do campo
8. WHEN administrador clica em "Cancelar" THEN sistema SHALL retornar para lista sem salvar

**Campos obrigatórios**: CNPJ, Nome Fantasia, Razão Social, E-mail, Telefone, CEP, Logradouro, Número, Bairro, Estado, Município

**Independent Test**: Preencher todos os campos, CNPJ válido, CEP autocompletar, avançar para passo 2.

---

### SH-03: Cadastrar Nova SH — Passo 2: Dados Operacionais ⭐ MVP

**User Story**: Como administrador, quero configurar os dados financeiros da SH, para definir prazos e percentuais de comissão.

**Why P1**: Define o modelo de negócio da SH na plataforma.

**Acceptance Criteria**:

1. WHEN administrador chega no passo 2 THEN sistema SHALL exibir passo 1 com check verde no stepper
2. WHEN administrador preenche Prazo para Pagamento THEN sistema SHALL aceitar apenas números inteiros positivos (padrão: 30 dias)
3. WHEN administrador preenche % Participação SH THEN sistema SHALL aceitar valores decimais de 0,00 a 100,00
4. WHEN administrador preenche % Participação Representante THEN sistema SHALL aceitar valores decimais de 0,00 a 100,00
5. WHEN administrador clica "Voltar" THEN sistema SHALL retornar ao passo 1 com dados já preenchidos preservados
6. WHEN dados válidos e clica "Próximo: Representantes" THEN sistema SHALL avançar para passo 3

**Campos obrigatórios**: Prazo para Pagamento
**Campos opcionais**: % Participação SH, % Participação Representante

**Independent Test**: Preencher prazo 30, % SH 10, % Rep 5, avançar para passo 3.

---

### SH-04: Cadastrar Nova SH — Passo 3: Representantes ⭐ MVP

**User Story**: Como administrador, quero adicionar representantes à SH durante o cadastro, para definir quem vende para esta SH.

**Why P1**: Representantes são necessários para vincular credenciados no passo 5.

**Acceptance Criteria**:

1. WHEN administrador chega no passo 3 THEN sistema SHALL exibir tabela "Representantes Vinculados" (pode estar vazia)
2. WHEN administrador clica "+ Adicionar Novo" THEN sistema SHALL abrir modal com campos: Nome Completo*, E-mail*, Telefone*, CPF*, Cidade, Estado
3. WHEN CPF inválido THEN sistema SHALL exibir erro de validação inline
4. WHEN formulário do modal é válido e clica "Salvar Representante" THEN sistema SHALL fechar modal e exibir representante na tabela
5. WHEN administrador clica no ícone de editar na tabela THEN sistema SHALL abrir modal preenchido com dados do representante
6. WHEN administrador clica no ícone de excluir THEN sistema SHALL exibir confirmação e remover após confirmação
7. WHEN filtro de busca é aplicado THEN sistema SHALL filtrar representantes listados pelo nome
8. WHEN clica "Próximo: Finger" THEN sistema SHALL avançar (representantes são opcionais neste passo)

**Independent Test**: Adicionar 2 representantes, editar um, excluir outro, avançar para passo 4.

---

### SH-05: Cadastrar Nova SH — Passo 4: Fingers ⭐ MVP

**User Story**: Como administrador, quero adicionar fingers à SH, para definir os agentes de campo e suas comissões.

**Why P1**: Fingers são necessários para vincular credenciados no passo 5.

**Acceptance Criteria**:

1. WHEN administrador chega no passo 4 THEN sistema SHALL exibir tabela "Fingers Vinculados" (pode estar vazia)
2. WHEN administrador clica "+ Adicionar Novo" THEN sistema SHALL abrir modal com campos: Nome Completo*, E-mail*, Telefone*, CPF*, Porcentagem*, Cidade, Estado
3. WHEN Porcentagem for fora de 0-100 THEN sistema SHALL exibir erro de validação
4. WHEN formulário válido e clica "Salvar" THEN sistema SHALL fechar modal e exibir finger na tabela com porcentagem e prazo
5. WHEN administrador edita um finger THEN sistema SHALL preservar os dados no modal
6. WHEN administrador remove um finger que está vinculado a credenciados no passo 5 THEN sistema SHALL alertar sobre impacto nos vínculos
7. WHEN clica "Próximo: Credenciado" THEN sistema SHALL avançar

**Independent Test**: Adicionar finger com 15%, ver na tabela com badge de %, avançar para passo 5.

---

### SH-06: Cadastrar Nova SH — Passo 5: Credenciados ⭐ MVP

**User Story**: Como administrador, quero vincular credenciados à SH com um representante e finger específicos, para completar o cadastro da rede.

**Why P1**: É o passo final e o que efetiva o relacionamento SH ↔ Credenciado.

**Acceptance Criteria**:

1. WHEN administrador chega no passo 5 THEN sistema SHALL exibir lista "Credenciados Disponíveis" (não vinculados) e "Credenciados Vinculados"
2. WHEN administrador busca um credenciado THEN sistema SHALL filtrar a lista de disponíveis por nome ou CNPJ
3. WHEN administrador clica "+ Adicionar" em um credenciado disponível THEN sistema SHALL abrir modal "Vincular Credenciado"
4. WHEN modal abre THEN sistema SHALL exibir credenciado selecionado + cards de Representantes disponíveis + cards de Fingers disponíveis
5. WHEN administrador seleciona 1 representante e 1 finger e clica "Confirmar Vínculo" THEN sistema SHALL mover credenciado para "Credenciados Vinculados" com Rep+Finger associados
6. WHEN credenciado está vinculado THEN sistema SHALL exibir nome do representante e finger na tabela de vinculados
7. WHEN administrador clica no ícone de desvincular THEN sistema SHALL confirmar e retornar credenciado para lista de disponíveis
8. WHEN administrador clica "Finalizar Criação" THEN sistema SHALL salvar toda a SH com todos os dados dos 5 passos e redirecionar para lista com mensagem de sucesso
9. WHEN ocorre erro na criação THEN sistema SHALL exibir mensagem de erro e manter usuário no wizard

**Independent Test**: Adicionar 2 credenciados vinculados, cada um com Rep+Finger diferente, finalizar criação, ver SH na lista.

---

### SH-07: Editar Software House ⭐ MVP

**User Story**: Como administrador, quero editar os dados de uma SH existente, para manter as informações atualizadas.

**Why P1**: Dados mudam — CNPJ, endereço, comissões precisam ser editáveis.

**Acceptance Criteria**:

1. WHEN administrador clica no ícone de editar na tabela THEN sistema SHALL abrir o wizard preenchido com dados atuais da SH
2. WHEN administrador edita qualquer passo THEN sistema SHALL validar da mesma forma que no cadastro
3. WHEN clica "Salvar" (ou equivalente ao Finalizar) THEN sistema SHALL atualizar os dados e exibir confirmação
4. WHEN edição afeta vínculos existentes (ex: remover finger com credenciados) THEN sistema SHALL alertar sobre o impacto

**Independent Test**: Editar % comissão de uma SH, salvar, ver novo valor refletido na listagem.

---

### SH-08: Relatório Financeiro P2

**User Story**: Como administrador, quero visualizar o relatório financeiro consolidado de todas as SHs, para acompanhar taxas, impostos e valores a pagar.

**Why P2**: Importante para gestão financeira, mas não bloqueia o uso operacional do módulo.

**Acceptance Criteria**:

1. WHEN administrador clica em "Relatórios" na tela de listagem THEN sistema SHALL navegar para `/software-house/relatorio`
2. WHEN a tela carrega THEN sistema SHALL exibir 3 cards de totais: Valor taxa R$, Imposto R$, Valor Software House R$, cada um com variação % vs mês anterior
3. WHEN administrador aplica filtro de Mês/Ano THEN sistema SHALL recarregar tabela e totais para o período selecionado
4. WHEN administrador filtra por Grupo Econômico THEN sistema SHALL filtrar registros correspondentes
5. WHEN tabela tem dados THEN sistema SHALL exibir colunas: Software House, Credenciado, Representante, Período, Data, com linha de TOTAL
6. WHEN administrador clica "Exportar" THEN sistema SHALL baixar o relatório em formato CSV ou XLSX

**Independent Test**: Selecionar Mês=Jan/2024, ver 5 registros filtrados, exportar CSV.

---

## Edge Cases

- WHEN CNPJ já cadastrado no sistema THEN sistema SHALL bloquear criação com mensagem clara
- WHEN CEP não encontrado na ViaCEP THEN sistema SHALL permitir preenchimento manual do endereço
- WHEN não há representantes no passo 3 ao chegar no passo 5 THEN modal de vínculo SHALL avisar que é necessário ter ao menos 1 representante
- WHEN não há fingers no passo 4 ao chegar no passo 5 THEN modal de vínculo SHALL avisar que é necessário ter ao menos 1 finger
- WHEN perda de conexão durante wizard THEN sistema SHALL preservar dados já preenchidos no estado local
- WHEN lista de credenciados disponíveis está vazia THEN sistema SHALL exibir mensagem orientando que não há credenciados para vincular

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|----------------|-------|-------|--------|
| SH-01 | Listar SHs | Design | Pending |
| SH-02 | Wizard Passo 1 — Dados Básicos | Design | Pending |
| SH-03 | Wizard Passo 2 — Dados Operacionais | Design | Pending |
| SH-04 | Wizard Passo 3 — Representantes | Design | Pending |
| SH-05 | Wizard Passo 4 — Fingers | Design | Pending |
| SH-06 | Wizard Passo 5 — Credenciados | Design | Pending |
| SH-07 | Editar SH | Design | Pending |
| SH-08 | Relatório Financeiro | — | Pending |

**Coverage:** 8 requisitos, 0 mapeados para tasks, 8 pendentes

---

## Success Criteria

- [ ] Administrador consegue cadastrar uma SH completa do início ao fim sem erros
- [ ] Busca retorna resultados em < 500ms
- [ ] Wizard não perde dados ao navegar entre passos
- [ ] Vínculo Credenciado ↔ Representante + Finger funciona corretamente no passo 5
- [ ] Relatório financeiro exibe totais corretos por período
