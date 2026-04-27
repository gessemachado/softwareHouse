-- Adiciona data de ativação e garante prazo_meses no fingers
alter table public.fingers
  add column if not exists data_ativacao date;
