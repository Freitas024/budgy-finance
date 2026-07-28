-- Ocorrencias: despesas e entradas. Guardam fatos, nunca agregados.
-- Saldo, total de fixas, gasto variavel, falta pagar e atraso sao derivados
-- em packages/domain -- jamais colunas.

-- ADR-019: competencia vem do vencimento (due_date), nunca do pagamento.
-- paid_date registra a saida de caixa e afeta apenas o saldo.
create table public.expense (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  wallet_id uuid not null,
  category_id uuid not null,
  recurring_expense_id uuid,
  kind text not null check (kind in ('fixa', 'variavel')),
  description text,
  amount_cents integer not null check (amount_cents > 0),
  due_date date not null,
  -- preenchida pelo trigger quando vier nula (ADR-004). Ajuste manual e permitido.
  competencia date not null check (extract(day from competencia) = 1),
  status text not null default 'pendente' check (status in ('pago', 'pendente')),
  paid_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- A constraint mais importante do schema: torna a materializacao preguicosa
  -- idempotente. NULLs sao distintos por padrao no Postgres, entao despesas
  -- variaveis (recurring_expense_id null) nao colidem entre si.
  -- NAO trocar por "nulls not distinct".
  constraint expense_recorrencia_competencia_key
    unique (recurring_expense_id, competencia),

  constraint expense_paid_date_check
    check ((status = 'pago') = (paid_date is not null)),
  constraint expense_variavel_sem_modelo_check
    check (kind = 'fixa' or recurring_expense_id is null),
  constraint expense_wallet_fkey
    foreign key (user_id, wallet_id) references public.wallet (user_id, id) on delete restrict,
  constraint expense_category_fkey
    foreign key (user_id, category_id) references public.category (user_id, id) on delete restrict,
  constraint expense_recurring_fkey
    foreign key (user_id, recurring_expense_id)
    references public.recurring_expense (user_id, id) on delete restrict
);

-- a query quente e "fatos do mes"
create index expense_user_competencia_idx on public.expense (user_id, competencia);
-- falta pagar + atrasados de meses anteriores
create index expense_user_pendente_idx
  on public.expense (user_id, due_date) where status = 'pendente';
create index expense_category_idx on public.expense (category_id);
create index expense_wallet_idx on public.expense (wallet_id);

-- ADR-008: entrada recorrente nasce 'previsto' e so conta no saldo apos confirmacao.
create table public.income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  wallet_id uuid not null,
  category_id uuid,
  recurring_income_id uuid,
  description text,
  amount_cents integer not null check (amount_cents > 0),
  date date not null,
  -- com offset, e a competencia JA deslocada que entra na chave de idempotencia
  competencia date not null check (extract(day from competencia) = 1),
  status text not null default 'previsto' check (status in ('previsto', 'recebido')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint income_recorrencia_competencia_key
    unique (recurring_income_id, competencia),
  constraint income_wallet_fkey
    foreign key (user_id, wallet_id) references public.wallet (user_id, id) on delete restrict,
  constraint income_category_fkey
    foreign key (user_id, category_id) references public.category (user_id, id) on delete restrict,
  constraint income_recurring_fkey
    foreign key (user_id, recurring_income_id)
    references public.recurring_income (user_id, id) on delete restrict
);

create index income_user_competencia_idx on public.income (user_id, competencia);
create index income_wallet_idx on public.income (wallet_id);

-- ADR-009: um teto por competencia, nunca um valor global.
create table public.monthly_ceiling (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  competencia date not null check (extract(day from competencia) = 1),
  amount_cents integer not null check (amount_cents > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, competencia)
);
