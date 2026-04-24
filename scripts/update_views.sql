drop view if exists public.vw_relatorio_fingers;
drop view if exists public.vw_relatorio_sh;

create view public.vw_relatorio_sh as
select
  shc.id,
  sh.nome_fantasia                                                      as software_house,
  sh.cnpj                                                               as cnpj_sh,
  c.nome                                                                as credenciado,
  c.cnpj                                                                as cnpj_credenciado,
  r.nome_completo                                                       as representante,
  cob.periodo,
  to_char(r.data_vinculo, 'DD/MM/YYYY')                                as data_vinculo,
  sh.prazo_pagamento::text || ' dias'                                   as prazo,
  cob.valor_taxa,
  round(cob.valor_taxa * 0.20, 2)                                       as imposto,
  round(cob.valor_taxa * 0.80 * sh.participacao_sh / 100, 2)           as valor_sh,
  lower(sh.nome_fantasia || ' ' || c.nome || ' ' || sh.cnpj || ' ' || c.cnpj || ' ' || coalesce(r.nome_completo,'')) as busca
from public.sh_credenciados shc
join public.software_houses sh  on sh.id  = shc.software_house_id
join public.credenciados     c   on c.id   = shc.credenciado_id
join public.representantes   r   on r.id   = shc.representante_id
join public.cobrancas        cob on cob.sh_credenciado_id = shc.id;

create view public.vw_relatorio_fingers as
select
  shc.id,
  f.nome_completo                                                       as finger,
  f.cpf                                                                 as cpf_finger,
  sh.nome_fantasia                                                      as software_house,
  sh.cnpj                                                               as cnpj_sh,
  c.nome                                                                as credenciado,
  c.cnpj                                                                as cnpj_credenciado,
  f.porcentagem,
  round(cob.valor_taxa * 0.80 * f.porcentagem / 100, 2)                as valor_finger,
  cob.periodo,
  to_char(cob.created_at, 'DD/MM/YYYY')                                as data,
  lower(f.nome_completo || ' ' || coalesce(f.cpf,'') || ' ' || sh.nome_fantasia || ' ' || c.nome || ' ' || sh.cnpj || ' ' || c.cnpj) as busca
from public.sh_credenciados shc
join public.software_houses sh  on sh.id  = shc.software_house_id
join public.credenciados     c   on c.id   = shc.credenciado_id
join public.fingers          f   on f.id   = shc.finger_id
join public.cobrancas        cob on cob.sh_credenciado_id = shc.id;
