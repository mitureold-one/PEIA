# Guia de Colaboração e Sincronia no GitHub

Este guia define as boas práticas e regras operacionais para garantir que múltiplos desenvolvedores e agentes de IA trabalhem no repositório **PEIA** sem causar conflitos de merge, perda de código ou retrabalho.

---

## 1. Princípios Fundamentais para Agentes e Desenvolvedores

1. **Contexto Antes da Ação:**
   - Antes de começar a editar qualquer arquivo, leia `AGENTS.md` e verifique as últimas entradas de `docs/CHANGELOG_AGENTS.md`.
   - Inspecione se os arquivos que você planeja alterar já foram modificados recentemente por outra pessoa ou agente.

2. **Menor Diff Possível (Escopo Estrito):**
   - Modifique apenas os arquivos necessários para cumprir a tarefa solicitada.
   - Não refatore arquivos adjacentes sem solicitação explícita.
   - Não reordene imports ou reforce formatações em massa que gerem ruído no `git diff`.

3. **Não Sobrescrever Decisões Anteriores:**
   - Respeite as escolhas arquiteturais documentadas em `docs/ARCHITECTURE.md` (ex: padrão de estado reativo com `useSyncExternalStore` + `AsyncStorage`, uso de NativeWind ao invés de StyleSheet tradicional, etc.).

---

## 2. Convenção de Commits (Conventional Commits)

Utilize mensagens claras, objetivas e em português ou inglês padronizado:

- `feat(escopo): adiciona filtro de modalidade na tela de vagas`
- `fix(auth): corrige validação de formato de e-mail`
- `docs(arquitetura): documenta estrutura de rotas do expo-router`
- `refactor(vagas): simplifica store reativo de vagas`
- `style(ui): ajuste de espaçamento nos cards de vaga`
- `test: adiciona testes unitários para validadores`

---

## 3. Protocolo Mandatório para Finalização de Tarefas

Ao concluir qualquer alteração de código ou funcionalidade:

1. **Validação de Tipagem e Sintaxe:**
   - Certifique-se de que os arquivos alterados não contêm erros de TypeScript ou de importação.
2. **Atualização do Changelog:**
   - Abra `docs/CHANGELOG_AGENTS.md`.
   - Adicione uma nova entrada no topo da seção **Histórico de Mudanças** detalhando o que foi feito.
3. **Commit Limpo:**
   - Agrupe arquivos logicamente relacionados na mensagem de commit correspondente.
