# BuyHelp SH — Gestão de Software Houses

**Vision:** Módulo do ecossistema BuyHelp Desconto para cadastro, gestão e análise financeira de Software Houses parceiras e toda a sua rede (representantes, fingers e credenciados).

**For:** Administradores da plataforma BuyHelp Desconto

**Solves:** Centralizar o cadastro e controle das SHs intermediadoras, suas equipes (representantes e fingers) e os credenciados vinculados, com rastreamento de comissões e relatórios financeiros consolidados.

---

## Goals

- Permitir o cadastro completo de uma Software House em wizard de 5 passos com 100% dos dados validados
- Listar e filtrar SHs com status, quantidade de lojas e representantes vinculados
- Gerar relatório financeiro (taxa, imposto, valor SH) por período e grupo econômico com exportação

## Tech Stack

**Core:**

- Framework: React + Vite
- Language: TypeScript
- Styling: Tailwind CSS (dark navy + laranja, padrão BuyHelp)
- State: React Query + Context API

**Key dependencies:**

- react-hook-form + zod (validação dos formulários do wizard)
- shadcn/ui ou componentes próprios (padrão BuyHelp existente)
- Supabase (banco de dados + auth + API)
- @supabase/supabase-js
- react-router-dom (navegação)

## Scope

**v1 includes:**

- Listagem de Software Houses com filtros (busca, status) e paginação
- Wizard de cadastro de 5 passos: Dados Básicos → Dados Operacionais → Representantes → Fingers → Credenciados
- Gerenciamento de Representantes vinculados à SH (adicionar, editar, remover)
- Gerenciamento de Fingers vinculados à SH (adicionar, editar, remover, % comissão)
- Vinculação de Credenciados à SH (busca, vincular com Representante + Finger, desvincular)
- Relatório Financeiro consolidado (taxa, imposto, valor SH) com filtros e exportação

**Explicitly out of scope:**

- Portal de acesso da própria Software House (self-service)
- Gestão de campanhas/produtos vinculados à SH
- Módulo de pagamentos ou faturamento
- Dashboard com gráficos analíticos (ícone de gráfico existe na lista, mas tela não foi desenhada)
- Relatório Finger (tab existe no Figma mas é idêntico ao de SH — v2)
