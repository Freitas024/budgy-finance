-- Dado de DESENVOLVIMENTO. Roda automaticamente ao final de `supabase db reset`
-- (config.toml -> [db.seed]). NUNCA e aplicado em producao: `supabase db push`
-- envia apenas migrations, jamais este arquivo.
--
-- Cria a conta unica do app (ADR-015: sem tela de cadastro, conta semeada).
-- O trigger on_auth_user_created cuida do resto -- profile + as 9 categorias
-- padrao nascem sozinhos deste insert.
--
-- A carteira NAO e semeada de proposito: criar a primeira carteira e a tela de
-- primeiro uso (ux-e-telas §5.8), e semear uma aqui esconderia essa tela do
-- desenvolvimento.
--
-- pgcrypto vive no schema `extensions` no Supabase -- por isso a qualificacao.

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'dev@budgy.local',
  extensions.crypt('budgy123', extensions.gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{}'::jsonb,
  '',
  '',
  '',
  ''
)
on conflict (id) do nothing;

-- Identidade de e-mail. GoTrue autentica pela tabela users, mas mantem esta
-- linha para vinculo de provedor; sem ela, user.identities volta vazio.
insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '{"sub": "00000000-0000-0000-0000-000000000001", "email": "dev@budgy.local", "email_verified": true, "phone_verified": false}'::jsonb,
  'email',
  now(),
  now(),
  now()
)
on conflict (provider_id, provider) do nothing;
