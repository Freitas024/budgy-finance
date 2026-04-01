# Budgy Finance — Contexto para Agentes

## Stack
- Next.js 14 com App Router
- Tailwind CSS v4 (tokens em app/globals.css no @theme)
- TypeScript strict
- Dados mockados em src/lib/mock/ (sem Supabase por agora)

## Estrutura de rotas
- (auth): login, register, connect-banks — sem sidebar
- (dashboard): dashboard, transactions, accounts, insights, settings — com sidebar

## Convenções
- Componentes UI genéricos em src/components/ui/
- Componentes de feature em src/components/features/
- Nunca importar dados diretamente no componente — sempre via hook em src/hooks/
- Interfaces globais em src/types/index.ts

## Cores principais (Tailwind)
- Fundo: bg-bg-base, bg-bg-card, bg-bg-elevated
- Marca: bg-brand, hover:bg-brand-hover
- Texto: text-text-primary, text-text-secondary
- Status: text-success, text-danger, text-warning

## Regras de output
- Nunca instalar dependências não listadas
- Nunca modificar globals.css ou tailwind
- Código sem comentários explicativos
- Sem markdown, só o código
```