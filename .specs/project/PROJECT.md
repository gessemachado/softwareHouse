# BuyHelp SH — Gestão de Software Houses

## Visão
Sistema web para a BuyHelp gerenciar seus parceiros (Software Houses), representantes comerciais (Fingers) e os credenciados vinculados, com análise financeira de comissões e dashboards de desempenho operacional.

## Objetivos
- Centralizar o cadastro e gestão de SHs, Fingers e Credenciados
- Oferecer visão analítica do desempenho de vendas, intermediações e cadastros
- Permitir configuração granular de quais cards/seções cada usuário quer visualizar
- Evidenciar o valor gerado pela BuyHelp via comparativo Antes × Depois

## Stack
- React 19 + TypeScript + Vite + Tailwind CSS
- Supabase (projeto: `juuwryshbnlzxpbkrffm`)
- Deploy: Vercel — https://desing-buyhelp.vercel.app/

## Módulos Principais
| Módulo                  | Rota(s)                    | Status   |
|-------------------------|----------------------------|----------|
| Visão Geral             | `/visao-geral`             | ✅ Ativo |
| Dashboard               | `/dashboard`               | ✅ Ativo |
| Inteligência Comercial  | `/inteligencia-comercial`  | ✅ Ativo |
| Software House          | `/software-house`          | ✅ Ativo |
| Finger                  | `/finger`                  | ✅ Ativo |

## Entidades Core
- `software_houses` — CNPJ, endereço, percentuais de participação
- `representantes` — vinculados à SH
- `fingers` — vinculados à SH (têm % de comissão)
- `credenciados` — lojas/clientes da BuyHelp
- `sh_credenciados` — vínculo SH ↔ credenciado ↔ representante ↔ finger
- `cobrancas` — cobranças mensais por vínculo
