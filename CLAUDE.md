# Budgy Finance — Briefing para o Claude Code

> Leia este arquivo inteiro antes de qualquer ação. Ele é a fonte de verdade
> sobre o que este projeto é, o que não é, e as regras que não podem ser
> quebradas.

---

## O que é este projeto

App de **gestão financeira pessoal manual**, uso próprio (n=1, o fundador).
O objetivo declarado é **frear gasto** — não é planejar, não é investir.
Fase atual: Fase 1 (gerenciador manual + insight enxuto). Crescimento não é meta.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Estilo | Tailwind CSS (tokens em globals.css) |
| Backend | Supabase (Postgres + Auth + RLS + Storage) |
| Formulários | react-hook-form + Zod |
| Gráficos | Recharts |
| Domínio | TypeScript puro (zero dependência de framework) |

---

## Estrutura de pastas

```
budgy-finance/
├── packages/
│   └── domain/          ← funções puras de cálculo (zero I/O, zero React)
├── apps/
│   └── web/             ← o Next.js
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   └── lib/
│       │       ├── domain/     ← importa de packages/domain
│       │       └── supabase/   ← repositório (I/O)
│       └── ...
├── supabase/
│   ├── migrations/      ← schema versionado
│   └── functions/       ← Edge Functions (se precisar)
└── docs/                ← documentação (leia antes de codar)
```

---

## Documentação — leia antes de codar

Cada documento cobre uma camada. Consulte o relevante antes de agir:

| Documento | Quando consultar |
|---|---|
| `docs/product-vision.md` | Antes de qualquer decisão de produto ou escopo |
| `docs/adr.md` | Antes de qualquer decisão técnica — 19 decisões com motivo |
| `docs/modelo-de-dados.md` | Antes de mexer no schema ou criar migrations |
| `docs/camada-de-dominio.md` | Antes de implementar qualquer cálculo financeiro |
| `docs/ux-e-telas.md` | Antes de implementar qualquer tela ou componente |
| `docs/design-system.html` | Para tokens, componentes e medidas exatas |
| `design-reference/*.html` | Para o visual exato de cada tela — referência somente leitura |

> ⚠ Os arquivos em `design-reference/` são **referência visual somente leitura**.
> Não edite, não "melhore", não refatore esses HTMLs. Eles existem para você
> reproduzir em React, não para modificar.

---

## Regras inegociáveis (nunca quebre estas)

### 1. Dinheiro em centavos inteiros
```typescript
type Cents = number; // SEMPRE inteiro. Nunca float. Nunca reais.
```
`0.1 + 0.2 ≠ 0.3` em ponto flutuante. Um número errado num app financeiro
apaga a credibilidade num único deslize. A conversão para `R$ 12,34` é
responsabilidade **exclusiva da apresentação**, nunca do domínio.

### 2. Datas sem hora
```typescript
type IsoDate = string; // 'YYYY-MM-DD' — sem timestamp, sem timezone
```
Timestamp com fuso causa o bug "dia 31 virou dia 30". Datas financeiras são
sempre data-calendário. `hoje` entra como parâmetro nas funções puras —
nunca lido de `new Date()` dentro delas.

### 3. Cálculos financeiros somente em `packages/domain/`
Nenhum cálculo financeiro acontece dentro de componente React, query SQL ou
Server Action. O domínio recebe fatos e devolve números. A apresentação
apenas exibe. O repositório apenas busca. O serviço apenas orquestra.

```
Repositório → busca linhas cruas do Supabase
Serviço     → busca fatos, chama domínio, devolve resultado
Domínio     → recebe fatos, calcula, devolve números (zero I/O)
Componente  → exibe o que o serviço devolveu
```

### 4. RLS em todas as tabelas
Toda tabela carrega `user_id` e tem policy própria de RLS. Sem exceção.
Auth de usuário único — conta semeada no Supabase, sem tela de cadastro.

### 5. Competência derivada do vencimento
`competencia` = 1º dia do mês, derivada de `due_date` na **escrita**.
Nunca calculada na leitura. Nunca derivada da data de pagamento (`paid_date`).
Pagar adiantado não move a despesa de mês.

### 6. Nada de agregado salvo no banco
Saldo, total de fixas, gasto variável, falta pagar, status de atraso — são
todos **derivados em código**, nunca colunas. A única denormalização
deliberada é `competencia` (é a chave de idempotência da materialização).

### 7. Materialização preguiçosa, nunca cron
Despesas fixas recorrentes se materializam no caminho de leitura (upsert
idempotente), não por job agendado. A constraint
`UNIQUE(recurring_expense_id, competencia)` garante que abrir o mês duas
vezes não duplica nada.

---

## O que NÃO fazer

- **Não instalar bibliotecas novas** sem perguntar e justificar
- **Não criar colunas de agregado** — saldo, total, gasto são sempre derivados
- **Não remover o Pluggy SDK** — fica adormecido como sinalização da Fase 2
- **Não usar float para dinheiro** — sempre inteiro de centavos
- **Não calcular competência da data de pagamento** — sempre do vencimento
- **Não fazer cálculo financeiro em componente React ou SQL**
- **Não criar tela de cadastro** — auth é usuário único, conta semeada
- **Não adicionar campos ou telas** além do especificado em `docs/ux-e-telas.md`
- **Não simplificar** uma decisão do ADR sem antes ler o motivo registrado
- **Não usar `new Date()`** dentro de funções de domínio — `hoje` é parâmetro

---

## Decisões críticas para não esquecer

### Saldo tem `opening_date`
```
saldo = opening_balance
      + entradas recebidas (status = 'recebido')
      − despesas pagas (status = 'pago')
      onde data >= wallet.opening_date
```
Sem o filtro por `opening_date`, lançamentos anteriores ao início da
carteira seriam descontados duas vezes.

### VA fora do teto de variáveis
```
gasto_variavel = soma de EXPENSE
  where kind = 'variavel'
    and competencia = mes
    and wallet.type != 'vale_alimentacao'
```
O VA é carteira separada com saldo próprio. Nunca somado ao saldo livre.
Nunca contado no teto. Filtro por `wallet.type`, não flag na despesa.

### Atraso é derivado, nunca salvo
```typescript
function isAtrasado(expense: Expense, hoje: IsoDate): boolean
// pendente que virou o mês OU passou 5 dias do vencimento
```
Nunca vira coluna. Nunca precisa de job diário.

### Entrada recorrente nasce como 'previsto'
Só entra no saldo e na "entrada do mês" após confirmação (`status = 'recebido'`).

### Competência pode ser deslocada (só para entradas)
`RECURRING_INCOME` tem `competencia_offset_months` (default 0).
Com valor 1, o salário de 25/07 grava `date = 25/07` e
`competencia = 2026-08-01`. A chave de idempotência usa a competência
**já deslocada** — senão duplica ocorrências.

### Percentual do teto: arredondado para baixo
79,8% → 79%. Regra fixa no domínio, consistente em todo o app.

---

## Adormecido (não construir nesta fase)

| Item | Motivo |
|---|---|
| Import OFX | Fase 1.5 — Mercado Pago não exporta OFX |
| Multi-banco | Fase 1.5+ |
| Cartão de crédito | Adormecido junto com OFX |
| Bot Telegram | As consultas já são respondidas no app |
| IA (narrar/extrair) | Gatilho de reabertura documentado no Product Vision |
| Tela de cadastro | Auth de usuário único nesta fase |
| Push / e-mail de alerta | Alerta só in-app nesta fase |
| Orçamento por categoria | O teto de variáveis é a versão mínima |

---

## Sequência de implementação recomendada

Construir na ordem que destrava as camadas seguintes:

```
1. Schema + migrations (Supabase)
   → seed de usuário único + categorias padrão
   → RLS em todas as tabelas
   → constraint UNIQUE(recurring_expense_id, competencia)

2. Camada de domínio pura (packages/domain/)
   → tipos: Cents, IsoDate, Competencia, Expense, Income, Wallet...
   → funções: saldo, entradaDoMes, gastoVariavelDoMes, faltaPagar,
              isAtrasado, statusTeto, gastoPorCategoria, comparacaoMesAMes
   → testes unitários por tabela entrada→saída (sem I/O)

3. Repositório (lib/supabase/)
   → busca de fatos por mês (uma query, vários cálculos em memória)
   → upsert idempotente das recorrências

4. Auth + primeiro uso
   → login simples (e-mail + senha, sessão persistente)
   → tela de criação da primeira carteira (opening_balance + opening_date)

5. Home
   → consome domínio via serviço
   → card do teto com 3 estados de cor

6. Nova despesa (variável)
   → o gesto mais crítico, valida o ponto de morte nº 1

7. Histórico / Lançamentos

8. Nova despesa fixa (modelo recorrente + materialização)

9. Nova entrada

10. Configuração (perfil, categorias, carteiras, alertas)
```

---

## Design

O app é **dark mode** — não há modo claro.
Fonte: **Inter** com `font-variant-numeric: tabular-nums` global.
Tokens de cor estão em `docs/design-system.html` e em `globals.css`.
Referência visual de cada tela em `design-reference/`.

Plataforma primária: **desktop (1920px)**. Mobile é adaptação futura.

### Como ler o protótipo (`design-reference/Budgy_Finance_dc.html`)

O arquivo é um **protótipo interativo com estado** — não um showcase estático.
As telas são controladas por variáveis do tipo `{{ variavel }}` e blocos
`<sc-if value="{{ variavel }}">`. Para encontrar cada tela no HTML:

| Tela | Como identificar no HTML |
|---|---|
| Home | `<sc-if value="{{ telaHome }}">` |
| Lançamentos | bloco da tela de lançamentos/histórico |
| Configuração | comentários `<!-- ABA PERFIL -->` `<!-- ABA CATEGORIAS -->` `<!-- ABA CARTEIRAS -->` `<!-- ABA ALERTAS -->` |
| Primeiro uso | `Vamos começar pela sua conta` |
| Modal Nova despesa | `<span>Nova despesa</span>` no bloco de modal |
| Modal Nova entrada | bloco de modal de nova entrada |
| Modal Nova despesa fixa | `<span>Nova despesa fixa</span>` no bloco de modal |
| Mobile | `<sc-if value="{{ mostrarHomeMobile }}">` |

A lateral de navegação controla-se por `{{ lateralExpandida }}` /
`{{ lateralRecolhida }}` e o toggle em `{{ toggleLateral }}`.

**Como usar:** ao implementar uma tela, peça ao Claude Code para localizar
o bloco correspondente no protótipo usando os identificadores acima e
reproduzi-lo como componente React, consultando `docs/design-system.html`
para os tokens e medidas exatas.