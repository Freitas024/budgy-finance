-- ADR-015: RLS em TODAS as tabelas, sem excecao.
-- (select auth.uid()) entre parenteses e proposital: faz o Postgres avaliar
-- uma vez por query em vez de uma vez por linha.

alter table public.profile enable row level security;
alter table public.wallet enable row level security;
alter table public.category enable row level security;
alter table public.recurring_expense enable row level security;
alter table public.recurring_income enable row level security;
alter table public.expense enable row level security;
alter table public.income enable row level security;
alter table public.monthly_ceiling enable row level security;

-- profile: sem delete (a linha morre junto com auth.users, via cascade)
create policy profile_select on public.profile
  for select to authenticated using ((select auth.uid()) = id);
create policy profile_insert on public.profile
  for insert to authenticated with check ((select auth.uid()) = id);
create policy profile_update on public.profile
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy wallet_select on public.wallet
  for select to authenticated using ((select auth.uid()) = user_id);
create policy wallet_insert on public.wallet
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy wallet_update on public.wallet
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy wallet_delete on public.wallet
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ADR-016: categoria se desativa (active = false), nunca se apaga.
-- Nao existe policy de delete aqui -- a ausencia da policy e a proibicao.
create policy category_select on public.category
  for select to authenticated using ((select auth.uid()) = user_id);
create policy category_insert on public.category
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy category_update on public.category
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy recurring_expense_select on public.recurring_expense
  for select to authenticated using ((select auth.uid()) = user_id);
create policy recurring_expense_insert on public.recurring_expense
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy recurring_expense_update on public.recurring_expense
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy recurring_expense_delete on public.recurring_expense
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy recurring_income_select on public.recurring_income
  for select to authenticated using ((select auth.uid()) = user_id);
create policy recurring_income_insert on public.recurring_income
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy recurring_income_update on public.recurring_income
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy recurring_income_delete on public.recurring_income
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy expense_select on public.expense
  for select to authenticated using ((select auth.uid()) = user_id);
create policy expense_insert on public.expense
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy expense_update on public.expense
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy expense_delete on public.expense
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy income_select on public.income
  for select to authenticated using ((select auth.uid()) = user_id);
create policy income_insert on public.income
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy income_update on public.income
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy income_delete on public.income
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy monthly_ceiling_select on public.monthly_ceiling
  for select to authenticated using ((select auth.uid()) = user_id);
create policy monthly_ceiling_insert on public.monthly_ceiling
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy monthly_ceiling_update on public.monthly_ceiling
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy monthly_ceiling_delete on public.monthly_ceiling
  for delete to authenticated using ((select auth.uid()) = user_id);
