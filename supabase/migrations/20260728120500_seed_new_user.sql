-- Todo usuario criado nasce com profile e com as categorias padrao.
-- O usuario unico NAO e criado aqui: a conta e semeada via dashboard ou
-- `supabase auth admin`, para a migration nao carregar credencial nem
-- depender de estado externo.
-- ADR-006: categorias sao lista controlada; as padrao (is_default) sao
-- protegidas -- no maximo desativaveis (ADR-016).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profile (id) values (new.id);

  insert into public.category (user_id, name, flow_type, is_default)
  values
    (new.id, 'Alimentação', 'despesa', true),
    (new.id, 'Mercado',     'despesa', true),
    (new.id, 'Transporte',  'despesa', true),
    (new.id, 'Lazer',       'despesa', true),
    (new.id, 'Saúde',       'despesa', true),
    (new.id, 'Casa',        'despesa', true),
    (new.id, 'Contas',      'despesa', true),
    (new.id, 'Salário',     'entrada', true),
    (new.id, 'Outros',      'entrada', true);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
