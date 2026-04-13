# State — BuyHelp SH

## Decisions

- Stack baseada no padrão BuyHelp: React + Vite + TypeScript + Tailwind (dark navy + laranja)
- Backend: **Supabase** (PostgreSQL + Auth + API REST)
- Design extraído do Figma: arquivo "Hub" (W9MVbxO1Du1vP7ERxvyAcc), canvas "Software house"

## Open Questions

- [x] Backend definido: **Supabase** (integração adiada para depois do front)
- [ ] O projeto é standalone (nova SPA) ou uma rota dentro de uma plataforma BuyHelp Desconto existente?
- [ ] Autenticação: reutiliza sessão existente ou tem login próprio?
- [ ] Relatório: exportação em CSV, PDF ou ambos?

## Decisions

- **Frontend first**: construir toda a UI com mock data; Supabase integrado em fase posterior
- Mock data substitui services — hooks retornam dados estáticos simulando API real

## Blockers

- Nenhum no momento

## Lessons Learned

- (nenhuma ainda)

## Deferred Ideas

- Notificação ao adicionar novo Representante/Finger
- Validação de CNPJ em tempo real via API Receita Federal
- Importação em lote de Credenciados
