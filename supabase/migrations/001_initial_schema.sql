-- ─────────────────────────────────────────────────────────────────────────────
-- BuyHelp SH — Migration 001: Schema inicial
-- Rodar no SQL Editor do Supabase: https://supabase.com/dashboard/project/juuwryshbnlzxpbkrffm/sql/new
-- ─────────────────────────────────────────────────────────────────────────────

-- Extensão UUID
create extension if not exists "pgcrypto";

-- ─── software_houses ─────────────────────────────────────────────────────────

create table if not exists public.software_houses (
  id               uuid primary key default gen_random_uuid(),
  cnpj             text not null unique,
  nome_fantasia    text not null,
  razao_social     text not null,
  email            text not null,
  telefone         text not null,
  cep              text not null,
  logradouro       text not null,
  numero           text not null,
  bairro           text not null,
  municipio        text not null,
  estado           char(2) not null,
  prazo_pagamento  integer not null default 30,
  participacao_sh  numeric(5,2) not null default 0,
  participacao_representante numeric(5,2) not null default 0,
  status           text not null default 'ativa' check (status in ('ativa','inativa')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─── representantes ──────────────────────────────────────────────────────────

create table if not exists public.representantes (
  id                 uuid primary key default gen_random_uuid(),
  software_house_id  uuid not null references public.software_houses(id) on delete cascade,
  nome_completo      text not null,
  email              text not null,
  telefone           text not null,
  cpf                text not null,
  cidade             text,
  estado             char(2),
  data_vinculo       date not null default current_date,
  created_at         timestamptz not null default now()
);

-- ─── fingers ─────────────────────────────────────────────────────────────────

create table if not exists public.fingers (
  id                 uuid primary key default gen_random_uuid(),
  software_house_id  uuid not null references public.software_houses(id) on delete cascade,
  nome_completo      text not null,
  email              text not null,
  telefone           text not null,
  cpf                text not null,
  porcentagem        numeric(5,2) not null default 0,
  prazo_meses        integer,
  cidade             text,
  estado             char(2),
  data_vinculo       date not null default current_date,
  created_at         timestamptz not null default now()
);

-- ─── credenciados ────────────────────────────────────────────────────────────

create table if not exists public.credenciados (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  cnpj        text not null unique,
  cidade      text,
  estado      char(2),
  created_at  timestamptz not null default now()
);

-- ─── sh_credenciados ─────────────────────────────────────────────────────────

create table if not exists public.sh_credenciados (
  id                 uuid primary key default gen_random_uuid(),
  software_house_id  uuid not null references public.software_houses(id) on delete cascade,
  credenciado_id     uuid not null references public.credenciados(id) on delete restrict,
  representante_id   uuid not null references public.representantes(id) on delete restrict,
  finger_id          uuid not null references public.fingers(id) on delete restrict,
  created_at         timestamptz not null default now(),
  unique (software_house_id, credenciado_id)
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index if not exists idx_sh_status         on public.software_houses(status);
create index if not exists idx_sh_nome_fantasia   on public.software_houses(nome_fantasia);
create index if not exists idx_rep_sh_id          on public.representantes(software_house_id);
create index if not exists idx_finger_sh_id       on public.fingers(software_house_id);
create index if not exists idx_shc_sh_id          on public.sh_credenciados(software_house_id);
create index if not exists idx_shc_credenciado_id on public.sh_credenciados(credenciado_id);

-- ─── updated_at automático ───────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_sh_updated_at
  before update on public.software_houses
  for each row execute function public.set_updated_at();

-- ─── Views de Relatório ──────────────────────────────────────────────────────

create or replace view public.vw_relatorio_sh as
select
  shc.id,
  sh.nome_fantasia                                        as software_house,
  sh.cnpj                                                 as cnpj_sh,
  c.nome                                                  as credenciado,
  c.cnpj                                                  as cnpj_credenciado,
  r.nome_completo                                         as representante,
  to_char(shc.created_at, 'MM/YYYY')                     as periodo,
  to_char(r.data_vinculo, 'DD/MM/YYYY')                  as data_vinculo,
  sh.prazo_pagamento::text || ' dias'                     as prazo,
  -- valores fictícios — substituir por tabela de cobranças quando existir
  0::numeric                                              as valor_taxa,
  0::numeric                                              as imposto,
  0::numeric                                              as valor_sh
from public.sh_credenciados shc
join public.software_houses  sh  on sh.id  = shc.software_house_id
join public.credenciados      c   on c.id   = shc.credenciado_id
join public.representantes    r   on r.id   = shc.representante_id;

create or replace view public.vw_relatorio_fingers as
select
  shc.id,
  f.nome_completo                       as finger,
  f.cpf                                 as cpf_finger,
  sh.nome_fantasia                      as software_house,
  sh.cnpj                               as cnpj_sh,
  c.nome                                as credenciado,
  c.cnpj                                as cnpj_credenciado,
  f.porcentagem,
  -- valor finger = valor_sh * porcentagem / 100  (sem tabela de cobranças ainda = 0)
  0::numeric                            as valor_finger,
  to_char(shc.created_at, 'MM/YYYY')   as periodo,
  to_char(shc.created_at, 'DD/MM/YYYY') as data
from public.sh_credenciados shc
join public.software_houses sh on sh.id = shc.software_house_id
join public.credenciados     c  on c.id  = shc.credenciado_id
join public.fingers          f  on f.id  = shc.finger_id;

-- ─── RLS (Row Level Security) ────────────────────────────────────────────────
-- Por enquanto: acesso público com anon key (sem auth de usuário)
-- Ative e restrinja quando adicionar autenticação

alter table public.software_houses  enable row level security;
alter table public.representantes   enable row level security;
alter table public.fingers          enable row level security;
alter table public.credenciados     enable row level security;
alter table public.sh_credenciados  enable row level security;

-- Políticas permissivas para anon (remover em produção com auth real)
create policy "anon full access" on public.software_houses  for all using (true) with check (true);
create policy "anon full access" on public.representantes   for all using (true) with check (true);
create policy "anon full access" on public.fingers          for all using (true) with check (true);
create policy "anon full access" on public.credenciados     for all using (true) with check (true);
create policy "anon full access" on public.sh_credenciados  for all using (true) with check (true);
