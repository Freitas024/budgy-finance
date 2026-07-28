-- Tabelas base: profile, wallet, category.
-- Regras: dinheiro em centavos inteiros (ADR-003), datas financeiras sem hora (ADR-014).

create table public.profile (
  id uuid primary key references auth.users (id) on delete cascade,
  avatar_url text,
  alert_preference text not null default 'sempre'
    check (alert_preference in ('sempre', 'so_ao_estourar', 'nunca')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ADR-017: opening_balance_cents + opening_date sao imutaveis apos a criacao.
-- A trava esta no trigger de 20260728120300_triggers.sql.
create table public.wallet (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(btrim(name)) > 0),
  type text not null default 'conta' check (type in ('conta', 'vale_alimentacao')),
  restricted_use boolean not null default false,
  restriction_tag text,
  opening_balance_cents integer not null default 0 check (opening_balance_cents >= 0),
  opening_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- redundante com a PK, mas habilita as FKs compostas (user_id, wallet_id)
  -- que impedem lancar na carteira de outro usuario.
  unique (user_id, id)
);

create index wallet_user_id_idx on public.wallet (user_id);

-- ADR-006: lista controlada, nunca texto livre.
-- ADR-016: remover = desativar (active = false). Nunca apagar.
create table public.category (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(btrim(name)) > 0),
  flow_type text not null check (flow_type in ('entrada', 'despesa')),
  is_default boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, id)
);

create unique index category_user_flow_name_key
  on public.category (user_id, flow_type, lower(name));

create index category_user_id_idx on public.category (user_id);
