# Budgy Finance — Registro de Decisões de Arquitetura (ADR)

| | |
|---|---|
| **Fase** | Gerenciador manual pessoal + insight enxuto (Fase 1) |
| **Base** | Product Vision r5, Modelo de Dados (ERD), Camada de Domínio (Spec) |
| **Propósito** | Capturar *o que* foi decidido e, sobretudo, *por quê*. Impede que uma decisão com motivo seja "simplificada" no futuro por quem não viu o raciocínio. |

> Cada entrada é uma decisão fechada. "Consequências" registra também os custos aceitos — não só os ganhos. Uma decisão sem custo declarado costuma esconder o custo, não eliminá-lo.

---

## ADR-001 — Recorrência por materialização preguiçosa (não cron)

**Contexto.** Despesas fixas se repetem todo mês. Ocorrências precisam existir como linhas para carregar status pago/pendente individual.
**Decisão.** O modelo recorrente é a fonte. Ao abrir um mês, o sistema garante (upsert idempotente) as ocorrências daquele mês. Sem job agendado.
**Alternativas.** (a) Cron mensal materializando — rejeitado: agendador frágil num app pessoal; se falha num mês, as ocorrências somem silenciosamente (pior erro num app financeiro). (b) Geração puramente virtual — rejeitado: não há onde gravar pago/pendente de algo que não é linha.
**Consequências.** (+) Sem infra de agendador; sem falha silenciosa; sempre consistente. (−) Um pouco mais de lógica no caminho de leitura; exige a constraint de unicidade para não duplicar.

## ADR-002 — Edição de modelo não altera ocorrências passadas

**Contexto.** Mudar o valor de uma fixa (ex.: aluguel sobe) não deveria reescrever a história.
**Decisão.** Materialização é **insert-if-missing**, nunca update. Ocorrências já geradas são imutáveis pelo modelo; a mudança vale da competência seguinte em diante.
**Consequências.** (+) Histórico fiel ao que de fato ocorreu. (−) Para corrigir uma ocorrência específica, edita-se a ocorrência, não o modelo.

## ADR-003 — Dinheiro em centavos inteiros

**Contexto.** Ponto flutuante erra em soma de dinheiro (`0.1 + 0.2 ≠ 0.3`).
**Decisão.** Todo valor monetário é inteiro de centavos (`amount_cents`). Nunca float, nunca reais no domínio.
**Consequências.** (+) Exatidão — sustenta a "regra de ouro" (número errado apaga credibilidade). (−) Conversão para exibição (`R$ 12,34`) fica só na apresentação; ninguém pode vazar reais para dentro do domínio.

## ADR-004 — Competência derivada e armazenada (única denormalização)

**Contexto.** Todos os agregados são "do mês". Precisa de uma chave de mês estável.
**Decisão.** Cada lançamento guarda `competencia` = 1º dia do mês, derivada na escrita da data de referência. Nunca digitada.
**Alternativas.** Calcular o mês em toda query — rejeitado: `competencia` é também a chave de idempotência da materialização; precisa ser coluna.
**Consequências.** (+) Consultas por mês estáveis e rápidas; idempotência garantida. (−) É denormalização — aceita conscientemente, e a única do modelo.

## ADR-005 — Atraso derivado, não salvo

**Contexto.** Uma pendência vira atraso com o tempo. Salvar "atrasado" exigiria atualizar o banco todo dia.
**Decisão.** `isAtrasado` é derivado de `due_date` vs `hoje`: pendente que **virou o mês** OU **passou 5 dias do vencimento** — o que ocorrer primeiro. `hoje` entra como parâmetro.
**Consequências.** (+) Sem job diário; sempre correto no instante da leitura. (−) O cálculo depende de "hoje" ser injetado, não lido de dentro da função (necessário para testabilidade).

## ADR-006 — Categoria como lista controlada

**Contexto.** O gráfico por categoria (H1, hipótese central) depende de agrupamento consistente.
**Decisão.** Tabela de categorias semeada com padrões + usuário adiciona as próprias. Nunca texto livre.
**Alternativas.** Texto livre — rejeitado: "iFood"/"ifood"/"delivery" fragmentariam o gráfico e matariam o insight.
**Consequências.** (+) Gráfico coerente. (−) Um passo a mais de gestão de categorias; migração futura se uma categoria for renomeada.

## ADR-007 — VA como carteira separada, fora do teto de variáveis

**Contexto.** O vale-alimentação é dinheiro restrito (feira). Somá-lo ao saldo livre infla o "disponível" (R11); contá-lo no teto distorce o controle do gasto livre.
**Decisão.** VA é uma `wallet` do tipo `vale_alimentacao`, com saldo próprio, exibido à parte. Gasto no VA fica fora do teto por **filtro de carteira** (`wallet.type != 'vale_alimentacao'`), não por flag na despesa.
**Consequências.** (+) Saldo livre honesto; teto controla só o dinheiro livre. (−) Todo cálculo de teto precisa carregar a carteira para filtrar — por isso `wallet_id` é obrigatório na despesa.

## ADR-008 — Entrada recorrente nasce "previsto"

**Contexto.** Contar um salário que ainda não caiu infla o saldo (falsa sensação de controle, R9 ao contrário).
**Decisão.** Entrada recorrente materializa como `previsto`; o usuário confirma para `recebido`. Só `recebido` conta no saldo e na "entrada do mês".
**Consequências.** (+) Saldo reflete só dinheiro real. (−) Exige a ação de confirmar recebimento — pequeno atrito, aceito em nome da veracidade.

## ADR-009 — Teto por competência (não global)

**Contexto.** Comparação mês a mês honesta exige saber qual era o teto de cada mês.
**Decisão.** `MONTHLY_CEILING` guarda um teto por competência. Default: herda o último valor.
**Alternativas.** Um valor global único — rejeitado: comparar março (teto R$800) e abril (teto R$1.000) contra o mesmo número mentiria.
**Consequências.** (+) Comparação temporal fiel. (−) Uma linha de teto por mês; a herança do último valor é responsabilidade da camada de escrita.

## ADR-010 — Camada de domínio pura e isolada ("bot-ready")

**Contexto.** As consultas devem servir à Home hoje e a um bot/IA amanhã sem reescrita.
**Decisão.** Cálculos vivem em funções puras de TypeScript, sem I/O, React ou SQL. Repositório busca; serviço orquestra; domínio calcula.
**Consequências.** (+) Reuso total; testabilidade por tabela entrada→saída; um bot futuro é só uma casca fina. (−) Mais camadas que "calcular na tela" — custo de organização aceito por ser a espinha do sistema.

## ADR-011 — Saldo é caixa real (só recebido/pago)

**Contexto.** Saldo é estoque: quanto existe agora.
**Decisão.** `saldo = opening_balance + entradas recebidas − despesas pagas`. Previsto e pendente não entram.
**Consequências.** (+) Saldo nunca mente para mais nem para menos. (−) Diverge do número de controle (ver ADR-012); precisa ser comunicado na UX.

## ADR-012 — Assimetria proposital: entrada só recebido, gasto variável pago+pendente

**Contexto.** Entrada e gasto variável poderiam seguir a mesma regra, mas servem a propósitos diferentes (caixa vs controle).
**Decisão.** "Entrada do mês" conta só `recebido`. "Gasto variável do mês" conta todas as variáveis (pago **e** pendente).
**Racional.** Os dois vieses puxam para a prudência: subestima o que entra, superestima o que se gastou. A Home nunca fica otimista demais.
**Consequências.** (+) App a favor de frear o gasto (objetivo do produto). (−) O número do teto (comprometido) difere do saldo (liquidado) — sutileza que a UX do card do teto precisa explicitar, senão confunde ("estourei o teto mas ainda tenho dinheiro na conta").

## ADR-013 — Percentual do teto arredondado para baixo

**Contexto.** Sem regra fixa, dois pontos do app mostram 79% e 80% para o mesmo dado.
**Decisão.** `percentualUsado` = inteiro, arredondado para baixo (79,8% → 79%).
**Consequências.** (+) Consistência; conservador para um alerta. (−) Nenhum relevante.

## ADR-014 — Datas financeiras sem hora

**Contexto.** Timestamp com fuso causa o bug "dia 31 virou dia 30".
**Decisão.** Datas financeiras são data-calendário `'YYYY-MM-DD'`, sem componente de hora.
**Consequências.** (+) Elimina uma classe inteira de bug de fuso. (−) Nenhum para este domínio (não há necessidade de granularidade de hora).

## ADR-015 — Escopo desta fase: cartão, OFX, multi-banco e IA adormecidos

**Contexto.** A fase é validar hábito e valor com o próprio fundador (n=1), não construir o diferencial.
**Decisão.** Ficam **fora** deste modelo: import OFX, multi-banco, cartão de crédito, bot e IA. Auth é de usuário único (conta semeada, sem tela de cadastro), com RLS por `user_id` em todas as tabelas.
**Racional adicional.** O cartão do fundador (Mercado Pago) não exporta OFX — confirmado — o que reforça adiar o import estruturado para quando fizer sentido.
**Consequências.** (+) Escopo enxuto, foco no ponto de morte real (lançar e voltar a lançar). (−) O gasto por impulso depende de lançamento manual (R9); mitigação é o hábito semanal, não construção.

## ADR-016 — Categoria se desativa, nunca se apaga

**Contexto.** Apagar uma categoria que já tem lançamentos deixaria as despesas órfãs e quebraria o gráfico por categoria (que é a hipótese central, H1).
**Decisão.** "Remover" categoria = **desativar**. A categoria desativada some do seletor de novos lançamentos, mas os lançamentos antigos mantêm o vínculo. **Deve ser possível reativar.** Categorias semeadas (`is_default`) são protegidas: no máximo desativáveis, nunca apagáveis.
**Alternativas.** (a) Bloquear exclusão enquanto houver lançamentos — rejeitado: mais rígido e não resolve o caso de "não uso mais isso". (b) Apagar em cascata — rejeitado: destrói histórico.
**Consequências.** (+) Gráfico sempre íntegro; ação reversível. (−) A lista de categorias cresce com o tempo; precisa de uma visão de "desativadas" para reativar.

## ADR-017 — Saldo inicial imutável; carteira nova não migra histórico

**Contexto.** `opening_balance_cents` é a âncora do saldo. Editá-lo depois deslocaria **todo** o histórico de saldo retroativamente e em silêncio.
**Decisão.** O saldo inicial é definido **na criação** da carteira e **não pode ser alterado**. Criar uma carteira nova é permitido (é funcionalidade legítima — outra conta, outro VA), mas ela **nasce zerada e não recebe lançamentos de outra carteira**; a UI deve exibir aviso explícito antes de criar.
**Alternativas.** (a) Editável com aviso de recálculo — rejeitado pelo fundador: prefere rigidez. (b) Lançamento de ajuste como mecanismo oficial de correção — não adotado agora, fica como saída se a lacuna incomodar.
**Consequências.** (+) Histórico de saldo estável; nenhum número muda no passado sem rastro. (−) ⚠ **Lacuna aceita:** erro de digitação no saldo inicial não tem correção limpa — `wallet_id` prende cada lançamento à sua carteira, então criar outra deixa o histórico para trás. Mitigação futura: lançamento de "ajuste de saldo inicial".

## ADR-018 — Competência deslocável para entrada recorrente (salário antes da virada)

**Contexto.** O fundador recebe **dia 25** e considera esse dinheiro como sendo do **mês seguinte**. Com competência = mês do calendário, o card "entrada do mês" fica zerado do dia 1 ao 24 e o salário do mês aparece no mês errado no Histórico.
**Decisão.** `RECURRING_INCOME` ganha `competencia_offset_months` (default `0`). Com `1`, a ocorrência de 25/07 grava `date = 25/07` e `competencia = agosto`. Lançamentos avulsos aceitam ajuste manual de competência via controle **opcional e recolhido**.
**Alternativas.** **Mês fiscal customizado** (competência de 25 a 24) — rejeitado: tornaria `competencia` um cálculo com parâmetro em vez de "1º dia do mês", criaria ambiguidade de rótulo (o período 25/07–24/08 chama-se julho ou agosto?), quebraria a comparação mês a mês (compararia períodos que não são meses) e exigiria migração de toda linha já gravada.
**Racional.** É uma **exceção declarada**, não uma redefinição de tempo. Custo baixo, reversível, e mantém o mês-calendário como base de tudo.
**Consequências.** (+) "Entrada do mês" e a listagem no Histórico alinhadas ao ciclo real, sem ambiguidade de nomenclatura. (−) Saldo e "entrada do mês" divergem entre 25 e 31 (o dinheiro está na conta mas pertence ao mês seguinte) — correto, mas exige rótulo na UX. (−) ⚠ **Escopo limitado, registrado para evitar mal-entendido:** o offset afeta **apenas** entradas. Ele **não** desloca o reset do teto — o teto continua zerando no dia 1º do mês-calendário, porque `gastoVariavelDoMes` filtra despesas, não entradas. (−) ⚠ **Imperfeição residual aceita:** gasto variável entre 25 e 31 conta no teto do mês corrente, embora bancado pelo salário do mês seguinte. Sobreposição de ~6 dias. Se na prática o controle manual de competência for usado toda semana nesse período, é sinal de que o mês fiscal completo era necessário — reabrir com dado real, não por especulação.

## ADR-019 — Competência vem do vencimento, nunca do pagamento

**Contexto.** Quem recebe antes da virada do mês tende a **pagar contas do mês seguinte adiantado**. Se a competência viesse da data de pagamento, essas contas migrariam para o mês errado.
**Decisão.** `competencia` da despesa é derivada de `due_date`. `paid_date` registra a saída de caixa e afeta **apenas** o saldo. Pagar adiantado não move a despesa de mês.
**Consequências.** (+) Conta de agosto paga em julho continua em agosto, marcada como paga — comportamento correto sem nenhuma feature extra. (+) Já era o comportamento implícito do modelo; agora está explícito para não ser "simplificado". (−) Nenhum.

---

## Índice rápido

| ADR | Decisão |
|---|---|
| 001 | Recorrência por materialização preguiçosa (não cron) |
| 002 | Edição de modelo não altera ocorrências passadas |
| 003 | Dinheiro em centavos inteiros |
| 004 | Competência derivada e armazenada (única denormalização) |
| 005 | Atraso derivado, não salvo (virou o mês ou +5 dias) |
| 006 | Categoria como lista controlada |
| 007 | VA carteira separada, fora do teto (por filtro de carteira) |
| 008 | Entrada recorrente nasce "previsto" |
| 009 | Teto por competência (não global) |
| 010 | Camada de domínio pura e isolada ("bot-ready") |
| 011 | Saldo é caixa real (só recebido/pago) |
| 012 | Assimetria proposital: entrada só recebido, variável pago+pendente |
| 013 | Percentual do teto arredondado para baixo |
| 014 | Datas financeiras sem hora |
| 015 | Cartão, OFX, multi-banco e IA adormecidos; auth single-user + RLS |
| 016 | Categoria se desativa, nunca se apaga (reativável) |
| 017 | Saldo inicial imutável; carteira nova não migra histórico |
| 018 | Competência deslocável para entrada recorrente (salário do dia 25) |
| 019 | Competência vem do vencimento, nunca do pagamento |
