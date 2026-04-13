# Software House Management — Tasks

**Design**: `.specs/features/sh-management/design.md`
**Status**: In Progress
**Approach**: Frontend com mock data — Supabase integrado em fase posterior

---

## Execution Plan

```
Phase 1 — Scaffold (Sequential):
  T01 → T02 → T03 → T04

Phase 2 — Base Components (Parallel após T04):
  T04 complete, then:
    ├── T05 [P]  Layout (Header + Nav)
    ├── T06 [P]  SHStatusBadge
    ├── T07 [P]  WizardStepper
    ├── T08 [P]  Modal base reutilizável
    └── T09 [P]  Table + Pagination reutilizável

Phase 3 — Mock Data + Hooks (após T03):
  T03 complete, then:
    T10 [P] Mock data
    T11 [P] Hooks com mock data

Phase 4 — Pages (após Phase 2 + Phase 3):
  T12 [P]  SoftwareHouseList page
  T13 [P]  Step1DadosBasicos
  T14 [P]  Step2DadosOperacionais
  T15      ModalRepresentante → Step3Representantes
  T16      ModalFinger → Step4Fingers
  T17      ModalVincularCredenciado → Step5Credenciados

Phase 5 — Wizard + Relatório + Roteamento (Sequential):
  T18 → T19 → T20
```

---

## Task Breakdown

### T01: Scaffold Vite + dependências

**What**: Criar projeto React+Vite+TypeScript e instalar todas as dependências
**Where**: `buyhelp-SH/` (raiz)
**Depends on**: None
**Requirement**: Todos

**Comandos**:
```bash
npm create vite@latest . -- --template react-ts
npm install react-router-dom react-hook-form zod @hookform/resolvers
npm install @supabase/supabase-js axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Done when**:
- [ ] `npm run dev` sobe sem erros
- [ ] TypeScript configurado (strict mode)
- [ ] Estrutura de pastas `src/pages`, `src/components`, `src/hooks`, `src/services`, `src/types`, `src/mocks` criada

---

### T02: Configurar Tailwind com tema BuyHelp

**What**: `tailwind.config.ts` com cores dark navy + laranja do BuyHelp
**Where**: `tailwind.config.ts`, `src/index.css`
**Depends on**: T01
**Requirement**: Visual fidelity ao Figma

**Cores extraídas do Figma**:
- Background: `#0d1b2a` (navy escuro)
- Surface: `#1a2a3a` (cards/painéis)
- Border: `#2a3a4a`
- Primary/Orange: `#f97316` (orange-500)
- Primary Hover: `#ea6c10`
- Text primary: `#ffffff`
- Text secondary: `#94a3b8`
- Success (Ativa): `#22c55e`
- Muted (Inativa): `#64748b`

**Done when**:
- [ ] `tailwind.config.ts` com `extend.colors` definido
- [ ] `src/index.css` com `@tailwind base/components/utilities`
- [ ] Componente de teste renderiza com fundo navy e botão laranja

---

### T03: Criar tipos TypeScript

**What**: Arquivo `sh.types.ts` com todas as interfaces do design
**Where**: `src/types/sh.types.ts`
**Depends on**: T01
**Requirement**: SH-01~08

**Done when**:
- [ ] Interfaces: `SoftwareHouse`, `Representante`, `Finger`, `Credenciado`, `SHCredenciado`, `WizardState`
- [ ] Types: `SHStatus`, filtros, paginação
- [ ] Sem erros TypeScript (`tsc --noEmit`)

---

### T04: Criar mock data

**What**: Dados estáticos simulando respostas da API futura
**Where**: `src/mocks/`
**Depends on**: T03
**Requirement**: Todos (substitui Supabase no frontend first)

**Arquivos**:
- `src/mocks/softwareHouses.ts` — 4 SHs com status ativa/inativa, cnpj, endereço
- `src/mocks/representantes.ts` — representantes por SH
- `src/mocks/fingers.ts` — fingers por SH
- `src/mocks/credenciados.ts` — credenciados disponíveis + vinculados
- `src/mocks/relatorio.ts` — dados financeiros com totais

**Done when**:
- [ ] Cada arquivo exporta array tipado com ≥3 registros realistas
- [ ] Dados batem com os valores vistos no Figma (Tech Solutions, João Silva, etc.)

---

### T05: Layout — Header + Nav [P]

**What**: Componente de layout com header BuyHelp e breadcrumb "Software House"
**Where**: `src/components/layout/AppLayout.tsx`, `src/components/layout/Header.tsx`
**Depends on**: T02
**Requirement**: Visual base de todas as telas

**Elementos do Header (Figma)**:
- Logo BuyHelp (laranja) + texto "Desconto" (laranja) + "Produtos" + "Bhia · New"
- Direita: "Selecione lojas/grupos", sino, lupa, avatar + "Gessé · Administrador"
- Breadcrumb abaixo: `≡ Software House`
- Título da página: "BuyHelp Desconto" + subtítulo

**Done when**:
- [ ] Header renderiza com logo, nav items e área de usuário
- [ ] Breadcrumb funcional
- [ ] Responsive básico (sem quebrar em 1440px)

---

### T06: SHStatusBadge [P]

**What**: Badge pequeno Ativa (verde) / Inativa (cinza)
**Where**: `src/components/sh/SHStatusBadge.tsx`
**Depends on**: T02, T03
**Requirement**: SH-01

**Done when**:
- [ ] Props: `status: SHStatus`
- [ ] Verde com texto "Ativa" quando ativa; cinza com "Inativa" quando inativa
- [ ] Exportado e sem erros TypeScript

---

### T07: WizardStepper [P]

**What**: Barra de progresso com 5 steps numerados (check verde quando concluído, laranja quando ativo, cinza quando pendente)
**Where**: `src/components/sh/WizardStepper.tsx`
**Depends on**: T02
**Requirement**: SH-02~06

**Props**: `currentStep: 1|2|3|4|5`, `completedSteps: number[]`

**Done when**:
- [ ] 5 steps com label + sublabel (conforme Figma)
- [ ] Step ativo: círculo laranja com número
- [ ] Step concluído: círculo verde com ✓
- [ ] Step futuro: círculo cinza com número
- [ ] Linha de conexão entre steps

---

### T08: Modal base reutilizável [P]

**What**: Componente Modal genérico com overlay, título laranja, botão fechar
**Where**: `src/components/ui/Modal.tsx`
**Depends on**: T02
**Requirement**: SH-04, SH-05, SH-06

**Props**: `open: boolean`, `onClose: () => void`, `title: string`, `children: ReactNode`

**Done when**:
- [ ] Overlay escuro ao fundo
- [ ] Header laranja com título e X
- [ ] Fecha ao clicar no overlay ou no X
- [ ] Acessível (focus trap básico)

---

### T09: Table + Pagination reutilizável [P]

**What**: Componente de tabela estilizado + paginação "Anterior / Página X de Y / Próximo"
**Where**: `src/components/ui/DataTable.tsx`, `src/components/ui/Pagination.tsx`
**Depends on**: T02
**Requirement**: SH-01, SH-04, SH-05, SH-06

**Done when**:
- [ ] `DataTable`: header, rows, ações; estilo dark com borda sutil
- [ ] `Pagination`: botões Anterior/Próximo desabilitados nas extremidades, indicador de página
- [ ] Props genéricas com TypeScript (columns + data)

---

### T10: Hooks com mock data [P]

**What**: Custom hooks que retornam mock data com loading/error simulados
**Where**: `src/hooks/`
**Depends on**: T03, T04
**Requirement**: SH-01~08

**Hooks**:
- `useSoftwareHouses(filters?)` → `{ data, isLoading, filters, setFilters }`
- `useWizardState(shId?)` → estado completo do wizard + actions
- `useCredenciadosDisponiveis(shId?)` → credenciados não vinculados
- `useRelatorio(filters?)` → totais + registros financeiros

**Done when**:
- [ ] Cada hook retorna dados mockados tipados
- [ ] `useWizardState` gerencia os 5 steps em memória (add/remove/update para Rep, Finger, Credenciado)
- [ ] `useSoftwareHouses` filtra por nome/CNPJ no mock localmente

---

### T11: SoftwareHouseList page [P]

**What**: Tela de listagem completa (filtros + tabela + paginação + botão Nova SH)
**Where**: `src/pages/SoftwareHouseList.tsx`
**Depends on**: T05, T06, T09, T10
**Requirement**: SH-01

**Done when**:
- [ ] Exibe 4 SHs do mock com todas as colunas do Figma
- [ ] Campo de busca filtra por nome/CNPJ em tempo real (debounce 300ms)
- [ ] Botões "Pesquisar", "Limpar", "Relatórios" funcionais
- [ ] Botão "+ Nova Software House" navega para `/software-house/nova`
- [ ] Ícone de editar navega para `/software-house/:id/editar`
- [ ] Paginação renderiza corretamente

---

### T12: Step1DadosBasicos

**What**: Formulário passo 1 com validação zod e autocompletar CEP via ViaCEP
**Where**: `src/components/wizard-steps/Step1DadosBasicos.tsx`, `src/services/viacep.ts`
**Depends on**: T02, T03
**Requirement**: SH-02

**Validações (zod)**:
- CNPJ: máscara + validação dígitos verificadores
- E-mail: formato válido
- Telefone: máscara `(00) 00000-0000`
- CEP: máscara + busca ViaCEP no onBlur

**Done when**:
- [ ] Todos os campos do Figma presentes com labels e placeholders corretos
- [ ] CNPJ com máscara e validação real
- [ ] CEP busca ViaCEP e preenche logradouro/bairro/município/estado
- [ ] Botão "Próximo" só habilitado com form válido
- [ ] Botão "Cancelar" volta para lista
- [ ] Erros inline abaixo dos campos

---

### T13: Step2DadosOperacionais

**What**: Formulário passo 2 — prazo + percentuais de comissão
**Where**: `src/components/wizard-steps/Step2DadosOperacionais.tsx`
**Depends on**: T02, T03
**Requirement**: SH-03

**Done when**:
- [ ] Campos: Prazo Pagamento (int, default 30), % SH (decimal), % Representante (decimal)
- [ ] Validação: prazo > 0, percentuais 0–100
- [ ] Stepper mostra passo 1 com check verde
- [ ] Botões "Voltar" e "Próximo: Representantes"

---

### T14: ModalRepresentante + Step3Representantes

**What**: Modal de criar/editar representante e tela passo 3 com tabela de vinculados
**Where**: `src/components/modals/ModalRepresentante.tsx`, `src/components/wizard-steps/Step3Representantes.tsx`
**Depends on**: T08, T09, T10
**Requirement**: SH-04

**Done when**:
- [ ] Modal: campos Nome, E-mail, Telefone, CPF (com máscara), Cidade, Estado
- [ ] Modal: validação CPF real
- [ ] Tabela: colunas Nome, E-mail, Telefone, Data Vínculo, Ações (editar/excluir)
- [ ] Excluir abre confirm dialog antes de remover
- [ ] Filtro de busca por nome funcional
- [ ] Botões "Voltar" e "Próximo: Finger"

---

### T15: ModalFinger + Step4Fingers

**What**: Modal de criar/editar finger e tela passo 4 com tabela de vinculados
**Where**: `src/components/modals/ModalFinger.tsx`, `src/components/wizard-steps/Step4Fingers.tsx`
**Depends on**: T08, T09, T10
**Requirement**: SH-05

**Done when**:
- [ ] Modal: campos Nome, E-mail, Telefone, CPF, Porcentagem (%), Cidade, Estado
- [ ] Badge de porcentagem na tabela (ex: "15%")
- [ ] Mesma estrutura do Step3 com adaptações para Finger
- [ ] Botões "Voltar" e "Próximo: Credenciado"

---

### T16: ModalVincularCredenciado + Step5Credenciados

**What**: Tela passo 5 com listas disponíveis/vinculados + modal de vínculo com Rep+Finger
**Where**: `src/components/modals/ModalVincularCredenciado.tsx`, `src/components/wizard-steps/Step5Credenciados.tsx`
**Depends on**: T08, T09, T10, T14, T15
**Requirement**: SH-06

**Done when**:
- [ ] Lista "Credenciados Disponíveis" com busca e botão "+ Adicionar" por item
- [ ] Modal: mostra credenciado selecionado + cards de representantes + cards de fingers (seleção exclusiva)
- [ ] "Confirmar Vínculo" move credenciado para lista vinculados
- [ ] Lista "Credenciados Vinculados": colunas Nome, Representante, Finger, E-mail, Telefone, Ações
- [ ] Botão "Finalizar Criação" (laranja com ✓)
- [ ] Aviso se não há representantes ou fingers cadastrados

---

### T17: SoftwareHouseWizard container

**What**: Página container do wizard — gerencia step atual, chama `useWizardState`, persiste no final
**Where**: `src/pages/SoftwareHouseWizard.tsx`
**Depends on**: T07, T12, T13, T14, T15, T16
**Requirement**: SH-02~07

**Done when**:
- [ ] Renderiza `WizardStepper` + step correto baseado no estado
- [ ] Navegação entre passos preserva todos os dados
- [ ] Modo `edit`: carrega dados existentes do mock no estado inicial
- [ ] "Finalizar Criação": salva no mock (simula POST) e redireciona para lista com toast de sucesso
- [ ] Toast de erro em caso de falha simulada

---

### T18: RelatorioFinanceiro page [P]

**What**: Tela de relatório financeiro com totais, filtros e tabela exportável
**Where**: `src/pages/RelatorioFinanceiro.tsx`
**Depends on**: T05, T09, T10
**Requirement**: SH-08

**Done when**:
- [ ] 3 cards de totais: Valor taxa, Imposto, Valor SH (com variação % verde)
- [ ] Filtros: busca texto, Grupo Econômico, Mês/Ano
- [ ] Tabela: Software House, Credenciado, Representante, Período, Data
- [ ] Linha TOTAL ao final
- [ ] Botão "Exportar" gera CSV mock (download)
- [ ] Tabs "Software House" | "Finger" (Finger mostra "em breve" ou mesmos dados)

---

### T19: Configurar roteamento (App.tsx)

**What**: React Router DOM com todas as rotas do projeto
**Where**: `src/App.tsx`, `src/main.tsx`
**Depends on**: T11, T17, T18
**Requirement**: Navegação global

**Rotas**:
```
/software-house              → SoftwareHouseList
/software-house/nova         → SoftwareHouseWizard (mode=create)
/software-house/:id/editar   → SoftwareHouseWizard (mode=edit)
/software-house/relatorio    → RelatorioFinanceiro
/                            → redirect → /software-house
```

**Done when**:
- [ ] Todas as rotas funcionam sem erro 404
- [ ] Navegação entre páginas preserva o layout (Header)
- [ ] Rota raiz redireciona corretamente

---

## Parallel Execution Map

```
Phase 1 (Sequential):
  T01 → T02 → T03 → T04

Phase 2 (Parallel, após T02):
  T02 done:
    ├── T05 [P]  Layout/Header
    ├── T06 [P]  SHStatusBadge
    ├── T07 [P]  WizardStepper
    ├── T08 [P]  Modal base
    └── T09 [P]  Table + Pagination

Phase 3 (Parallel, após T03+T04):
  T03+T04 done:
    └── T10 [P]  Hooks mock

Phase 4 (Parallel, após Phase 2+3):
  T05+T06+T09+T10 done:
    └── T11 [P]  SoftwareHouseList

  T02+T03 done:
    ├── T12 [P]  Step1DadosBasicos
    └── T13 [P]  Step2DadosOperacionais

  T08+T09+T10 done:
    ├── T14      ModalRepresentante → Step3
    └── T15      ModalFinger → Step4

  T14+T15 done:
    └── T16      ModalVincularCredenciado → Step5

  T05+T09+T10 done:
    └── T18 [P]  RelatorioFinanceiro

Phase 5 (Sequential):
  T07+T12+T13+T14+T15+T16 done:
    └── T17  SoftwareHouseWizard container

  T11+T17+T18 done:
    └── T19  Roteamento final
```

---

## Task Granularity Check

| Task | Escopo | Status |
|------|--------|--------|
| T01: Scaffold | 1 setup | ✅ |
| T02: Tailwind tema | 1 config | ✅ |
| T03: Types | 1 arquivo | ✅ |
| T04: Mock data | 5 arquivos coesos | ✅ |
| T05: Layout/Header | 2 componentes layout | ✅ |
| T06: SHStatusBadge | 1 componente | ✅ |
| T07: WizardStepper | 1 componente | ✅ |
| T08: Modal base | 1 componente | ✅ |
| T09: Table+Pagination | 2 componentes ui | ✅ |
| T10: Hooks mock | 4 hooks coesos | ✅ |
| T11: SoftwareHouseList | 1 página | ✅ |
| T12: Step1 | 1 step + 1 service | ✅ |
| T13: Step2 | 1 step | ✅ |
| T14: Modal+Step3 | modal + step (par natural) | ✅ |
| T15: Modal+Step4 | modal + step (par natural) | ✅ |
| T16: Modal+Step5 | modal + step (par natural) | ✅ |
| T17: Wizard container | 1 página orquestradora | ✅ |
| T18: Relatorio | 1 página | ✅ |
| T19: Router | 1 arquivo | ✅ |
