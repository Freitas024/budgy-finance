-- Modelos recorrentes: sao o molde, nao a ocorrencia (ADR-001).
-- Materializacao preguicosa no caminho de leitura; sem cron.
-- ADR-002: editar o modelo nunca reescreve ocorrencia ja materializada.

create table public.recurring_expense (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  wallet_id uuid not null,
  category_id uuid not null,
  description text not null check (length(btrim(description)) > 0),
  amount_cents integer not null check (amount_cents > 0),
  due_day smallint not null check (due_day between 1 and 31),
  active boolean not null default true,
  start_month date not null check (extract(day from start_month) = 1),
  end_month date check (extract(day from end_month) = 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, id),
  constraint recurring_expense_vigencia_check
    check (end_month is null or end_month >= start_month),
  constraint recurring_expense_wallet_fkey
    foreign key (user_id, wallet_id) references public.wallet (user_id, id) on delete restrict,
  constraint recurring_expense_category_fkey
    foreign key (user_id, category_id) references public.category (user_id, id) on delete restrict
);

create index recurring_expense_user_active_idx
  on public.recurring_expense (user_id) where active;

-- ADR-018: competencia_offset_months desloca a competencia da ocorrencia gerada.
-- Salario de 25/07 com offset 1 -> date = 2026-07-25, competencia = 2026-08-01.
-- O offset vale SO para entradas; nao desloca o reset do teto.
create table public.recurring_income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  wallet_id uuid not null,
  category_id uuid,
  description text not null check (length(btrim(description)) > 0),
  amount_cents integer not null check (amount_cents > 0),
  expected_day smallint not null check (expected_day between 1 and 31),
  competencia_offset_months smallint not null default 0
    check (competencia_offset_months between 0 and 12),
  active boolean not null default true,
  start_month date not null check (extract(day from start_month) = 1),
  end_month date check (extract(day from end_month) = 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, id),
  constraint recurring_income_vigencia_check
    check (end_month is null or end_month >= start_month),
  constraint recurring_income_wallet_fkey
    foreign key (user_id, wallet_id) references public.wallet (user_id, id) on delete restrict,
  constraint recurring_income_category_fkey
    foreign key (user_id, category_id) references public.category (user_id, id) on delete restrict
);

create index recurring_income_user_active_idx
  on public.recurring_income (user_id) where active;
