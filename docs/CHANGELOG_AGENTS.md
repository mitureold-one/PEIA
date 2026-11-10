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

### [2026-11-09] - Prioriza funções por tipo de usuário
- **Agente / Autor:** Codex
- **Motivação / Contexto:** Ajuste solicitado para destacar em cada perfil as tarefas próprias de estudante, empresa e coordenação.
- **Arquivos Alterados / Criados:**
  - `src/app/home/_layout.tsx` (Modificado)
  - `src/app/home/index.tsx` (Modificado)
  - `src/app/home/profile.tsx` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
  - `docs/ARCHITECTURE.md` (Modificado)
- **Principais Mudanças:**
  - O perfil estudante destaca busca de estágio, currículo e inscrições realizadas.
  - Conta de empresa e coordenação não exibe campos de currículo; empresa vê orientação de publicação e coordenação abre inicialmente o cadastro de empresas.
  - Abas e títulos do feed e da conta acompanham o papel selecionado.
- **Impactos & Observações:** Os fluxos continuam usando dados locais do protótipo.

### [2026-11-09] - Separa permissões por tipo de usuário
- **Agente / Autor:** Codex
- **Motivação / Contexto:** O fluxo de vagas precisava diferenciar empresa, estudante e coordenação na interface.
- **Arquivos Alterados / Criados:**
  - `src/hooks/use-user-role.ts` (Criado)
  - `src/hooks/use-empresas.ts` (Criado)
  - `src/hooks/use-inscricoes.ts` (Criado)
  - `src/components/auth/auth-form.tsx` (Modificado)
  - `src/hooks/use-auth-form.ts` (Modificado)
  - `src/app/home/_layout.tsx` (Modificado)
  - `src/app/home/index.tsx` (Modificado)
  - `src/app/home/companies.tsx` (Criado)
  - `src/app/vaga/[id].tsx` (Modificado)
  - `src/app/vaga/form.tsx` (Modificado)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Login e cadastro permitem selecionar o perfil de demonstração; a escolha fica salva localmente.
  - Empresas podem publicar novas vagas, sem controles para editar, arquivar ou excluir anúncios existentes; estudantes podem registrar inscrição local.
  - Coordenação recebe uma aba para cadastrar empresas, com nome e e-mail salvos no dispositivo.
- **Impactos & Observações:** A autorização e os cadastros são apenas de interface e persistência local. Não substituem autenticação ou autorização no servidor, que ainda não existe no projeto.

### [2026-11-09] - Limita empresa à publicação de vagas
- **Agente / Autor:** Codex
- **Motivação / Contexto:** Esclarecimento de que o perfil empresa pode somente anunciar vagas.
- **Arquivos Alterados / Criados:**
  - `src/app/vaga/[id].tsx` (Modificado)
  - `src/app/vaga/form.tsx` (Modificado)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Removidas as ações de edição, arquivamento e exclusão de vaga para empresas.
  - A rota do formulário aceita apenas novas publicações; tentativa de abrir edição mostra orientação.
- **Impactos & Observações:** Empresas seguem limitadas à publicação de novas vagas no protótipo.

### [2026-10-13] - Adiciona leitura de currículos em PDF na web
- **Agente / Autor:** Codex
- **Motivação / Contexto:** O usuário solicitou suporte a arquivos PDF no fluxo de leitura de currículo.
- **Arquivos Alterados / Criados:**
  - `src/app/home/scan.tsx` (Modificado)
  - `src/utils/ocr.ts` (Criado)
  - `src/utils/ocr.web.ts` (Modificado)
  - `src/utils/ocr.native.ts` (Modificado)
  - `package.json` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - O seletor aceita imagens e PDFs. Na web, PDFs com texto têm o conteúdo extraído e PDFs digitalizados passam por OCR página a página.
  - Adiciona um módulo de fallback para o TypeScript e ferramentas estáticas resolverem a importação de OCR específica por plataforma.
  - A leitura é limitada a 25 páginas e segue local no navegador.
- **Impactos & Observações:** PDF.js foi adicionado como dependência e seu worker é carregado do jsDelivr. A leitura de PDF no app nativo ainda não está disponível; imagens continuam suportadas. `npm install` instalou as dependências e atualizou o lockfile.

### [2026-10-13] - Adiciona importação de currículo por arquivo de imagem
- **Agente / Autor:** Codex
- **Motivação / Contexto:** A tela de leitura de currículo precisava oferecer escolha entre captura pela câmera e seleção de um arquivo no dispositivo.
- **Arquivos Alterados / Criados:**
  - `src/app/home/scan.tsx` (Modificado)
  - `src/utils/ocr.web.ts` (Modificado)
  - `package.json` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - A tela agora permite selecionar uma imagem do dispositivo e executar o mesmo OCR da captura da câmera.
  - A seleção de arquivo fica disponível mesmo sem conceder permissão de câmera.
  - O OCR web aceita URLs de dados e blobs, além das imagens em base64.
- **Impactos & Observações:** A seleção aceita imagens; PDF ainda não é suportado. A dependência `expo-document-picker` foi declarada, mas a instalação/atualização do lockfile precisa ser concluída com `npm install`, pois o registry npm não estava acessível neste ambiente.

### [2026-10-13] - Implementa captura e leitura de currículo
- **Agente / Autor:** Codex
- **Motivação / Contexto:** A solicitação foi implementar leitura de currículo pela câmera, com revisão do texto antes de importá-lo no perfil.
- **Arquivos Alterados / Criados:**
  - `src/app/home/scan.tsx` (Modificado)
  - `src/utils/ocr.native.ts` (Criado)
  - `src/utils/ocr.web.ts` (Criado)
  - `package.json` (Modificado)
  - `app.json` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - A câmera captura uma imagem, executa OCR local e apresenta o texto para revisão antes de enviá-lo ao resumo do perfil.
  - O app usa OCR nativo no Android/iOS e Tesseract.js na web; imagens não são enviadas a um servidor do PEIA.
- **Impactos & Observações:** OCR nativo requer um development build e não funciona no Expo Go. A instalação das novas dependências e atualização do lockfile ainda precisam ser concluídas com acesso ao npm.

### [2026-10-13] - Explicita estado da importação de currículo
- **Agente / Autor:** Codex
- **Motivação / Contexto:** A aba de escaneamento mostrava uma moldura de câmera e um botão sem ação, sugerindo uma leitura que ainda não existe.
- **Arquivos Alterados / Criados:**
  - `src/app/home/scan.tsx` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - A tela agora informa claramente que a importação está em breve e oferece um atalho para preencher o perfil.
- **Impactos & Observações:** Nenhuma dependência adicionada; leitura de currículo pela câmera continua pendente.

### [2026-10-13] - Corrige inicialização web com AsyncStorage
- **Agente / Autor:** Codex
- **Motivação / Contexto:** A renderização web do Expo Router falhava no servidor com `ReferenceError: window is not defined` ao carregar os stores persistidos.
- **Arquivos Alterados / Criados:**
  - `src/hooks/use-vagas.ts` (Modificado)
  - `src/hooks/use-perfil.ts` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - A hidratação inicial do AsyncStorage agora só roda no cliente, onde a implementação web tem acesso a `window`.
- **Impactos & Observações:** No SSR, os stores começam com dados padrão e carregam os dados persistidos após a inicialização do cliente.

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
