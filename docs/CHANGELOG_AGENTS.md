# Changelog de Agentes de IA e Contribuidores

Este documento é o **registro oficial e mandatório** de todas as mudanças implementadas por agentes autônomos de IA e desenvolvedores no repositório **PEIA**.

> **ATENÇÃO AGENTES DE IA:**  
> Sempre que você finalizar uma tarefa que altere ou crie código, você **DEVE** adicionar uma nova entrada no topo deste arquivo antes de concluir sua execução. Isso garante que outros agentes e membros da equipe saibam exatamente o que foi modificado e evitem conflitos no GitHub.

---

## Template de Registro (Copie e preencha no topo da lista)

```markdown
### [YYYY-MM-DD] - <Título Curto da Mudança>
- **Agente / Autor:** <Nome do Agente ou Desenvolvedor>
- **Motivação / Contexto:** <Breve descrição do problema ou funcionalidade solicitada>
- **Arquivos Alterados / Criados:**
  - `caminho/do/arquivo1.tsx` (Criado / Modificado)
  - `caminho/do/arquivo2.ts` (Modificado)
- **Principais Mudanças:**
  - Descrição técnica objetiva do que foi adicionado ou alterado.
  - Padrões adotados ou refatorações realizadas.
- **Impactos & Observações:** <Qualquer dependência adicionada, breaking change potencial ou pendência futura>
```

---

## Histórico de Mudanças

### [2026-10-13] - Criação da Documentação Básica e Governança para Agentes
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Solicitação do usuário para estruturar a documentação básica do projeto existente e definir instruções obrigatórias para que agentes registrem suas alterações, assegurando a sincronia de trabalho entre diferentes colaboradores no GitHub.
- **Arquivos Alterados / Criados:**
  - `docs/ARCHITECTURE.md` (Criado - visão técnica, stack, rotas, hooks e design system)
  - `docs/CHANGELOG_AGENTS.md` (Criado - este registro e template oficial)
  - `docs/GIT_COLLABORATION_GUIDE.md` (Criado - diretrizes de sincronia no Git/GitHub para múltiplos agentes)
  - `AGENTS.md` (Modificado - inclusão de regras mandatórias para agentes e referência às docs)
- **Principais Mudanças:**
  - Mapeamento completo da stack (Expo 57, React Native 0.86, NativeWind v4, useSyncExternalStore).
  - Instituição do protocolo de documentação de alterações obrigatório para qualquer agente.
  - Regras de prevenção de conflitos de merge e boas práticas no Git.
- **Impactos & Observações:** Nenhuma quebra de código. Todas as instruções passam a ser lidas automaticamente por agentes que abrirem o repositório.
