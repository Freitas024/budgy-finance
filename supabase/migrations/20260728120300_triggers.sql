-- Triggers: derivacao de chave e travas de integridade.
-- Nenhum deles calcula agregado -- calculo financeiro vive em packages/domain (ADR-010).

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profile_set_updated_at
  before update on public.profile
  for each row execute function public.set_updated_at();

create trigger wallet_set_updated_at
  before update on public.wallet
  for each row execute function public.set_updated_at();

create trigger category_set_updated_at
  before update on public.category
  for each row execute function public.set_updated_at();

create trigger recurring_expense_set_updated_at
  before update on public.recurring_expense
  for each row execute function public.set_updated_at();

create trigger recurring_income_set_updated_at
  before update on public.recurring_income
  for each row execute function public.set_updated_at();

create trigger expense_set_updated_at
  before update on public.expense
  for each row execute function public.set_updated_at();

create trigger income_set_updated_at
  before update on public.income
  for each row execute function public.set_updated_at();

create trigger monthly_ceiling_set_updated_at
  before update on public.monthly_ceiling
  for each row execute function public.set_updated_at();

-- ADR-004 / ADR-019: competencia = 1o dia do mes da data de referencia,
-- derivada na ESCRITA. Na despesa a referencia e due_date (nunca paid_date).
-- Nao sobrescreve valor explicito: o ajuste manual em lancamento avulso e o
-- offset do salario sao aplicados pelo servico.
create or replace function public.set_competencia_from_due_date()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.competencia is null then
    new.competencia := date_trunc('month', new.due_date)::date;
  end if;
  return new;
end;
$$;

create or replace function public.set_competencia_from_date()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.competencia is null then
    new.competencia := date_trunc('month', new.date)::date;
  end if;
  return new;
end;
$$;

create trigger expense_set_competencia
  before insert on public.expense
  for each row execute function public.set_competencia_from_due_date();

create trigger income_set_competencia
  before insert on public.income
  for each row execute function public.set_competencia_from_date();

-- ADR-017: saldo inicial e data de inicio sao definidos na criacao e nao podem
-- mudar. Editar depois deslocaria todo o historico de saldo em silencio.
-- A UI mostra cadeado; esta e a garantia real.
create or replace function public.guard_wallet_opening()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.opening_balance_cents is distinct from old.opening_balance_cents
     or new.opening_date is distinct from old.opening_date then
    raise exception
      'saldo inicial e data de inicio da carteira sao imutaveis apos a criacao (ADR-017)';
  end if;
  return new;
end;
$$;

create trigger wallet_guard_opening
  before update on public.wallet
  for each row execute function public.guard_wallet_opening();
