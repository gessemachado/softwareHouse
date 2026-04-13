-- Migration 002: Tabela de cobranças e atualização das views
-- Rodar em: https://supabase.com/dashboard/project/juuwryshbnlzxpbkrffm/sql/new

-- ─── Tabela de cobranças ─────────────────────────────────────────────────────

create table if not exists public.cobrancas (
  id                 uuid primary key default gen_random_uuid(),
  sh_credenciado_id  uuid not null references public.sh_credenciados(id) on delete cascade,
  periodo            text not null,        -- formato MM/YYYY
  valor_taxa         numeric(10,2) not null default 0,
  created_at         timestamptz not null default now(),
  unique (sh_credenciado_id, periodo)
);

create index if not exists idx_cobrancas_shc_id  on public.cobrancas(sh_credenciado_id);
create index if not exists idx_cobrancas_periodo on public.cobrancas(periodo);

alter table public.cobrancas enable row level security;
create policy "anon full access" on public.cobrancas for all using (true) with check (true);

-- ─── Atualiza view vw_relatorio_sh ───────────────────────────────────────────

drop view if exists public.vw_relatorio_sh;
drop view if exists public.vw_relatorio_fingers;

create or replace view public.vw_relatorio_sh as
select
  shc.id,
  sh.nome_fantasia                                         as software_house,
  sh.cnpj                                                  as cnpj_sh,
  c.nome                                                   as credenciado,
  c.cnpj                                                   as cnpj_credenciado,
  r.nome_completo                                          as representante,
  cob.periodo,
  to_char(r.data_vinculo, 'DD/MM/YYYY')                   as data_vinculo,
  sh.prazo_pagamento::text || ' dias'                      as prazo,
  cob.valor_taxa,
  round(cob.valor_taxa * 0.20, 2)                          as imposto,
  round(cob.valor_taxa * 0.80 * sh.participacao_sh / 100, 2) as valor_sh
from public.sh_credenciados shc
join public.software_houses sh  on sh.id  = shc.software_house_id
join public.credenciados     c   on c.id   = shc.credenciado_id
join public.representantes   r   on r.id   = shc.representante_id
join public.cobrancas        cob on cob.sh_credenciado_id = shc.id;

-- ─── Atualiza view vw_relatorio_fingers ──────────────────────────────────────

create view public.vw_relatorio_fingers as
select
  shc.id,
  f.nome_completo                                                      as finger,
  f.cpf                                                                as cpf_finger,
  sh.nome_fantasia                                                     as software_house,
  sh.cnpj                                                              as cnpj_sh,
  c.nome                                                               as credenciado,
  c.cnpj                                                               as cnpj_credenciado,
  f.porcentagem,
  round(cob.valor_taxa * 0.80 * f.porcentagem / 100, 2)               as valor_finger,
  cob.periodo,
  to_char(cob.created_at, 'DD/MM/YYYY')                               as data
from public.sh_credenciados shc
join public.software_houses sh  on sh.id  = shc.software_house_id
join public.credenciados     c   on c.id   = shc.credenciado_id
join public.fingers          f   on f.id   = shc.finger_id
join public.cobrancas        cob on cob.sh_credenciado_id = shc.id;
