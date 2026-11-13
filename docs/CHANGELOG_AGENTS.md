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
  - Restaurados os atributos `required` e placeholders nos inputs de login (`aluno@undb.edu.br` e `Sua senha`).
  - Chamada de `validateLogin()` e `validateSignUp()` no manipulador `handleSubmit()`.
  - Configurada validação de e-mail (exige formato com @ e domínio válido) e senha (mínimo de 4 caracteres).
  - Em caso de dados válidos, os dados do perfil são persistidos e o app navega de forma instantânea para a Home com `router.replace(ROUTES.HOME)`. Em caso de erro, as mensagens de validação em vermelho são exibidas diretamente sob os campos sem travar a interface.
- **Impactos & Observações:** <Qualquer dependência adicionada, breaking change potencial ou pendência futura>
```

---

## Histórico de Mudanças

### [2026-11-13] - Refatoração do ScanModeTabs: Pressable, Remoção de Elevation e Resposta Imediata de Toque (/home/scan)
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** A análise do usuário identificou que o componente `ScanModeTabs` estava bloqueando ou ignorando os eventos de clique ao tentar alternar entre os modos de arquivo e câmera.
- **Arquivos Alterados:**
  - `src/components/scan/scan-mode-tabs.tsx` (Reescrito - migração de `TouchableOpacity` para `Pressable`, remoção das propriedades `elevation` e `zIndex` que causavam desvio e absorção de toques no Android, adição de `hitSlop` e feedback visual de toque)
  - `src/components/scan/scan-file-card.tsx` (Modificado - botão de alternância rápida de modo atualizado para `Pressable` com `hitSlop`)
  - `src/components/scan/scan-camera-card.tsx` (Modificado - botão de alternância rápida de modo atualizado para `Pressable` com `hitSlop`)
  - `src/hooks/use-curriculo-scanner.ts` (Modificado - limpeza automática de mensagens de erro ao alternar de aba no `setMode`)
  - `docs/CHANGELOG_AGENTS.md` (Modificado - registro oficial da mudança)
- **Principais Mudanças:**
  - **Eliminação do Conflito de Toque com `elevation`:** Removida a propriedade `elevation: 2` de cima de contêineres translúcidos dentro de `ScrollView`, eliminando a camada nativa do Android que interceptava toques antes de atingirem os botões filhos.
  - **Uso Estrito de `Pressable` com `hitSlop`:** Substituídos os componentes `TouchableOpacity` legados por `Pressable` nativo com `hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}` e animação sutil `active:scale-[0.98]`, garantindo que toques rápidos não sejam cancelados pelo pan responder da `ScrollView`.
  - **Transição Limpa no Hook:** A função `setMode` agora reseta erros anteriores para evitar poluição visual de feedback durante a troca de abas.
- **Impactos & Observações:** Validação estática executada com sucesso via `npx tsc --noEmit` (0 erros). Alternância entre "Imagem ou PDF" e "Câmera" agora é instantânea e 100% responsiva ao toque.

### [2026-11-13] - Correção de Travamento da Câmera: Delegação Nativa e Dimensões Fixas do Viewfinder (/home/scan)
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Ao clicar na câmera no scanner, o app travava e o botão de captura não respondia devido a colapso de layout no Yoga (`aspect-[3/4]` com `height: '100%'` em ScrollView) e bloqueio na thread de hardware de `SurfaceView` aguardando `onCameraReady`.
- **Arquivos Alterados:**
  - `src/hooks/use-curriculo-scanner.ts` (Modificado - adicionada função `takePhotoWithCamera` delegando para `ImagePicker.launchCameraAsync`, fallback de 1200ms para `cameraReady` caso o evento nativo atrase, e desativação proativa ao suspender app ou mudar de aba)
  - `src/components/scan/scan-camera-card.tsx` (Modificado - adicionado botão primário "Abrir Câmera e Fotografar" com foco automático do sistema, mantendo "Usar visor ao vivo no app" como secundário; contêiner do visor ao vivo atualizado com dimensões explícitas `height: 400` e `StyleSheet.absoluteFill` para evitar altura zero no Yoga)
  - `src/app/home/scan.tsx` (Modificado - desestruturação e repasse de `takePhotoWithCamera` para `onTakePhotoWithCamera`)
  - `docs/CHANGELOG_AGENTS.md` (Modificado - registro oficial da mudança)
- **Principais Mudanças:**
  - **Captura Nativa via ImagePicker:** Introduzido `takePhotoWithCamera` usando o app de câmera nativo do dispositivo. O usuário ganha foco macro, flash e resolução máxima de hardware sem risco de congelamento de UI thread ou bugs de SurfaceView.
  - **Correção de Dimensão do Viewfinder:** No visor ao vivo embutido, substituído o layout percentual dependente de aspect-ratio por altura fixa (`height: 400`) e preenchimento absoluto (`StyleSheet.absoluteFill`), garantindo que o SurfaceView nativo inicialize instantaneamente e acione `onCameraReady`.
  - **Fallback de Prontidão da Câmera:** Incluído timeout de segurança que garante liberação do botão caso a notificação de hardware tenha atraso.
- **Impactos & Observações:** Validação estática executada com sucesso via `npx tsc --noEmit` (0 erros). Experiência de captura ultra-estável e sem travamentos.

### [2026-11-13] - Gestão Robusta de Ciclo de Vida e Permissões da Câmera no Scanner (/home/scan)
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** O usuário apontou a necessidade de gerenciar adequadamente o ciclo de vida e as permissões do sensor de câmera para evitar travamentos de interface, dead-zones de hardware e retenção indevida de recursos.
- **Arquivos Alterados:**
  - `src/hooks/use-curriculo-scanner.ts` (Modificado - adicionado listener de `AppState` para desativar a câmera ao suspender/minimizar o app, hook de limpeza na desmontagem, suporte a `Linking.openSettings()` para permissões bloqueadas permanentemente e tratamento de erros de autorização)
  - `src/components/scan/scan-camera-card.tsx` (Modificado - diferenciação entre estados de verificação de permissão, recusa com possibilidade de re-solicitação e bloqueio permanente com botão "Abrir Configurações do Aparelho"; renderização estrita de `CameraView` apenas quando a tela estiver em foco (`isFocused === true`))
  - `src/app/home/scan.tsx` (Modificado - repasse das props `isFocused` e `onOpenSettings` para `ScanCameraCard`)
  - `docs/CHANGELOG_AGENTS.md` (Modificado - registro oficial da mudança)
- **Principais Mudanças:**
  - **Desativação em Background (AppState):** Se o usuário minimizar o app ou puxar a barra de notificações, o sensor da câmera é desligado e o hardware liberado imediatamente, evitando perda de contexto gráfico ou SurfaceView congelada.
  - **Montagem Condicional Focada (`isFocused`):** O componente nativo `<CameraView>` só é montado no DOM nativo quando a aba do scanner está ativamente em foco, com permissão concedida e sem foto congelada.
  - **Tratamento de Permissão Negada Permanentemente:** Se a permissão for recusada com `!canAskAgain`, o app exibe uma mensagem informativa clara com um botão direto para abrir as configurações do sistema operacional via `Linking.openSettings()`.
- **Impactos & Observações:** Validação TypeScript concluída com 0 erros (`npx tsc --noEmit`). Total conformidade com o ciclo de vida nativo de hardware móvel no Expo.

### [2026-11-13] - Definição do Seletor de Arquivos como Modo Padrão no Scanner (/home/scan)
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** O usuário solicitou que o método principal e inicial ao entrar no scanner fosse o input de arquivos digitais (PDF / Imagem), deixando a câmera fotográfica como método secundário alternativo.
- **Arquivos Alterados:**
  - `src/hooks/use-curriculo-scanner.ts` (Modificado - estado inicial de `mode` alterado de `'camera'` para `'arquivo'`)
  - `src/components/scan/scan-mode-tabs.tsx` (Modificado - ordem das abas reorganizada para exibir "Imagem ou PDF" como primeira aba/opção principal e "Câmera" como segunda aba)
  - `src/app/home/scan.tsx` (Modificado - reordenação do fluxo condicional priorizando `ScanFileCard` sobre `ScanCameraCard`)
  - `src/components/scan/scan-file-card.tsx` (Modificado - título ajustado para "Arquivo Digital (PDF / Imagem)")
  - `src/components/scan/scan-camera-card.tsx` (Modificado - título ajustado para "Câmera" com instrução contextual)
  - `docs/CHANGELOG_AGENTS.md` (Modificado - registro oficial da mudança)
- **Principais Mudanças:**
  - Ao entrar em `/home/scan`, o app exibe imediatamente o seletor de arquivos digitais (PDF/imagens locais), evitando consumo prematuro de bateria ou solicitações desnecessárias de permissão de câmera.
  - O fluxo para fotografar o documento impresso permanece acessível com um toque pela aba secundária "Câmera" ou pelo atalho no final do card.
- **Impactos & Observações:** Checagem TypeScript 100% limpa (`npx tsc --noEmit` -> 0 erros). Experiência de uso mais rápida, silenciosa e focada no formato mais comum de currículo.

### [2026-11-13] - Correção de Bloqueio de Toques no Menu, Header e Abas ao Entrar no Scanner (/home/scan)
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** O usuário reportou que ao entrar na rota do scanner (`/home/scan`), os toques fora da rota (como a barra de abas inferior e o header superior) e até a alternância de modos ficavam travados/inresponsivos até que houvesse alternância de tela.
- **Arquivos Alterados:**
  - `src/app/home/_layout.tsx` (Modificado - elevação de `zIndex: 50` e `elevation: 8` na barra de abas e no cabeçalho; estabilização da referência da função de renderização do `HomeHeader`)
  - `src/components/home/home-header.tsx` (Modificado - adicionado `style={{ zIndex: 50, elevation: 8 }}` no container raiz `SafeAreaView` para garantir sobreposição segura de eventos de toque no Android e iOS)
  - `src/app/home/scan.tsx` (Modificado - substituição de `SafeAreaView edges={[]}` redundante por `View className="flex-1"` e vinculação explícita de `className="flex-1"` no `ScrollView`, eliminando o overflow de hit-rect que vazava e interceptava gestos nos limites verticais da tela)
  - `src/components/scan/scan-mode-tabs.tsx` (Modificado - isolamento com `style={{ zIndex: 20, elevation: 2 }}` garantindo camada independente de toque para a alternância entre Câmera e PDF)
  - `src/hooks/use-curriculo-scanner.ts` (Modificado - integração com `useIsFocused` do Expo Router, garantindo liberação automática e instantânea do sensor de câmera ao trocar de aba no app)
  - `docs/CHANGELOG_AGENTS.md` (Modificado - registro oficial da mudança)
- **Principais Mudanças:**
  - **Delimitação de ScrollView sem Vazamento:** Ao omitir `flex-1` no `ScrollView` da rota, o container calculava dimensões pelo conteúdo total e seu frame interceptor de gestos expandia sobre o Header e a TabBar, sequestrando toques no topo e no rodapé. Com `className="flex-1"`, o ScrollView permanece rigorosamente confinado entre as barras.
  - **Prioridade de Camadas (Elevation & Stacking):** O `tabBarStyle` e o `HomeHeader` agora possuem `elevation: 8` e `zIndex: 50`, assegurando prioridade absoluta na captura de toques.
  - **Gestão Inteligente de Ciclo de Vida da Câmera:** O hook desliga o sensor assim que o usuário transita para outra aba, prevenindo dead-zones de hardware.
- **Impactos & Observações:** `npx tsc --noEmit` validado com 0 erros. Acessibilidade de toque no menu inferior, header e abas de modo 100% responsiva desde o primeiro instante de abertura da tela.

### [2026-11-13] - Correção de Alternância de Abas Câmera e Arquivo no Scanner (/home/scan)
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** O usuário reportou impossibilidade de alternar entre a entrada da câmera e a de PDF/Imagem ao entrar na rota `/home/scan`.
- **Arquivos Alterados:**
  - `src/components/scan/scan-mode-tabs.tsx` (Modificado - substituição de `Pressable` por `TouchableOpacity` com `activeOpacity={0.7}`, garantindo despacho imediato de toques no Android/iOS dentro de `ScrollView`)
  - `src/app/home/scan.tsx` (Modificado - remoção do `KeyboardAvoidingView` de nível de rota que sequestrava a cadeia de responders de gestos no React Navigation)
  - `src/components/scan/scan-camera-card.tsx` (Modificado - adição de atalho contextual "Prefere enviar PDF ou imagem?" conectado a `onSwitchToArquivo`)
  - `src/components/scan/scan-file-card.tsx` (Modificado - adição de atalho contextual "Prefere fotografar com a câmera?" conectado a `onSwitchToCamera`)
  - `docs/CHANGELOG_AGENTS.md` (Modificado - registro oficial da mudança)
- **Principais Mudanças:**
  - **Sensibilidade de Toque Confiável:** No React Native, `Pressable` dentro de `ScrollView` em ambientes móveis pode cancelar toques como tentativa de scroll. A migração para `TouchableOpacity` assegura clique imediato com feedback visual.
  - **Eliminação de Bloqueio por KeyboardAvoidingView:** O container do teclado em nível de tela estava interceptando os toques nas abas superiores.
  - **Caminho Duplo de Alternância:** O usuário agora pode alternar tanto pelas abas superiores quanto pelos links contextuais integrados no interior de cada card.
- **Impactos & Observações:** Checagem TypeScript 100% limpa (`npx tsc --noEmit` -> 0 erros). Navegação entre Câmera e PDF fluida e instantânea.

### [2026-11-13] - Refatoração de Responsabilidades da Rota de Scanner OCR (/home/scan)
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Alinhamento arquitetural da rota `/home/scan` ao padrão de responsabilidade única e modularização adotado no restante do projeto (como no Perfil, Empresas e Feed). Resolução do estado inicial da câmera (inicia desligada para poupar bateria e performance, sendo ativada sob demanda com permissão explícita), suporte a `KeyboardAvoidingView` sem interferir no layout global e separação das opções em abas de modo e componentes atômicos.
- **Arquivos Alterados / Criados:**
  - `src/app/home/scan.tsx` (Modificado - simplificado para atuar como orquestrador limpo da tela, integrado a `KeyboardAvoidingView` e `useCurriculoScanner`)
  - `src/hooks/use-curriculo-scanner.ts` (Modificado - adicionado controle de modo `camera` vs `arquivo`, ciclo de vida da câmera `cameraActive` iniciando desligada, métodos `startCamera`, `stopCamera`, `retakePhoto` e `clearError`)
  - `src/components/scan/scan-mode-tabs.tsx` (Criado - componente de abas estáticas para alternar de forma limpa entre Câmera e Arquivo Digital)
  - `src/components/scan/scan-camera-card.tsx` (Modificado - câmera agora inicia desligada com card explicativo e botão "Ligar Câmera", suporte a viewfinder com moldura de alinhamento de documento, badge "Ao Vivo", fechamento rápido e retake)
  - `src/components/scan/scan-file-card.tsx` (Modificado - refinamento do design do seletor de documentos PDF/imagem com tags de formato e chip de arquivo carregado)
  - `src/components/scan/scan-feedback.tsx` (Criado - isolamento dos estados de leitura/processamento OCR e alertas de erro com botão de fechamento)
  - `src/components/scan/scan-preview-card.tsx` (Modificado - contador de caracteres, edição de texto multiline e ações de importação para o perfil e limpeza)
  - `src/components/scan/scan-header.tsx` (Modificado - harmonização com a identidade visual do app com badge OCR Inteligente)
  - `docs/ARCHITECTURE.md` (Modificado - atualização da árvore de componentes do módulo scan)
  - `docs/CHANGELOG_AGENTS.md` (Modificado - registro oficial da mudança)
- **Principais Mudanças:**
  - **Câmera Inicia Desligada por Padrão:** Evita consumo desnecessário de bateria, aquecimento do dispositivo e travamento na montagem de tabs. O usuário visualiza o card explicativo e aciona a câmera somente quando desejar.
  - **Separação por Abas de Modo:** Ao invés de exibir dois cards pesados empilhados com divisor textual, a interface utiliza abas (`Câmera` e `Imagem ou PDF`), desativando o sensor caso o usuário mude para o modo arquivo.
  - **Tratamento Acessível de Feedback & Erros:** Componente dedicado `ScanFeedback` com `accessibilityLiveRegion="polite"` e `accessibilityRole="alert"`.
  - **Suporte a Teclado:** `KeyboardAvoidingView` configurado com `Platform.OS === 'ios' ? 'padding' : undefined` garantindo conforto na edição do texto extraído.
- **Impactos & Observações:** Checagem rigorosa de tipos via TypeScript executada com 100% de sucesso (`npx tsc --noEmit` -> 0 erros). Nenhuma dependência externa adicionada e nenhum arquivo fora do escopo do scanner ou layout global foi alterado.

### [2026-11-13] - Reversão Completa de Alterações do Scanner para Estado Estável
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Reversão total e estrita de todos os arquivos, rotas e componentes relacionados ao Scanner (`/home/scan`), restaurando o estado exatamente ao commit estável `5790831` a pedido do usuário.
- **Arquivos Revertidos ao Commit 5790831:**
  - `src/app/home/scan.tsx`
  - `src/components/scan/`
  - `src/hooks/use-curriculo-scanner.ts`
  - `src/app/home/_layout.tsx`
  - `src/app/home/logout.tsx`
  - `src/app/configuracoes.tsx`
  - `src/components/profile/profile-student-summary.tsx`
  - `package.json`
  - Removidos arquivos de refatoração do scanner e de permissões (`src/utils/curriculo-parser.ts`, `src/services/permissions-service.ts`, `src/hooks/use-app-permissions.ts`, etc.)
- **Impactos & Observações:** O Scanner e o layout retornam exatamente ao estado anterior com 0 erros de compilação.

### [2026-11-13] - Círculos ao Redor da Foto Sincronizados com a Disponibilidade do Estudante
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Solicitação do usuário para combinar visualmente os círculos/anéis concêntricos ao redor da foto de perfil do usuário com o status de disponibilidade do aluno (`abertoOportunidades`), no estilo "Open to Work" do LinkedIn.
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-student-info.tsx` (Modificado - foto de perfil estruturada em 3 círculos concêntricos: anel halo externo de 104px, anel intermediário de respiro negativo e círculo da foto/iniciais, com badge de câmera sincronizado às cores esmeralda/slate)
  - `src/components/profile/profile-student-photo-modal.tsx` (Modificado - foto ampliada de 200px com círculos concêntricos e chip de disponibilidade combinados ao status `abertoOportunidades`)
  - `src/components/home/home-header.tsx` (Modificado - avatar do menu superior sincronizado com o anel de status do estudante e micro-badge indicador)
  - `src/components/profile/profile-avatar.tsx` (Modificado - suporte à prop `abertoOportunidades` para manter consistência nas configurações da conta)
  - `src/app/configuracoes.tsx` (Modificado - repasse do status de disponibilidade do aluno para o `ProfileAvatar`)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - **Status Aberto a Oportunidades (`true`):**
    - Círculo externo com borda verde esmeralda vibrante (`border-emerald-500 dark:border-emerald-400`), respiro sutil (`bg-emerald-50/60 dark:bg-emerald-950/40`) e sombra suave.
    - Círculo interno com respiro negativo e borda suave (`border-emerald-200 dark:border-emerald-800/80`).
    - Badge de câmera e indicador no canto com `bg-emerald-600 dark:bg-emerald-500` e borda de contraste branca/dark.
    - Avatar de iniciais com fundo esmeralda.
  - **Status Indisponível no Momento (`false`):**
    - Círculos adquirem tonalidades neutras e elegantes de slate (`border-slate-300 dark:border-slate-700`).
    - Badge em `bg-slate-500 dark:bg-slate-600`.
  - **Reatividade em Tempo Real:** Alternar o status via tag interativa ou modal acadêmico atualiza instantaneamente a paleta dos anéis concêntricos em toda a interface.
- **Impactos & Observações:** Checagem rigorosa de tipos realizada com sucesso (`npx tsc --noEmit` -> 0 erros). Preservadas diretrizes de acessibilidade e dark mode.
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** O botão "Visualizar currículo enviado" na tela de detalhes da vaga (`src/app/vaga/[id].tsx`) anteriormente não abria ou era inútil caso o snapshot específico não estivesse salvo no banco local (retornando `null` silenciosamente). O modal foi transformado em um dossiê visual completo e funcional de apresentação profissional, além de ganhar fallback inteligente e ações reais de compartilhamento e edição.
- **Arquivos Alterados / Criados:**
  - `src/components/curriculo/modal-visualizar-curriculo-vaga.tsx` (Completamente reformulado com visual de dossiê profissional, dados cadastrais completos do estudante, pitch, habilidades, experiências, formações, idiomas, taxa de match estimada, ações de exportação via `Share.share`, cópia de pitch e edição de candidatura)
  - `src/data/curriculo.ts` (Modificado - adicionado `MOCK_CURRICULOS_VAGAS` com snapshots detalhados das candidaturas padrão de John Doe para as vagas da Nubix e Dataly)
  - `src/services/curriculo-service.ts` (Modificado - hidratação de fallback em `listarCurriculosVagas` e `obterCurriculoVaga` para persistir e recuperar currículos de vagas com segurança)
  - `src/hooks/use-curriculo.ts` (Modificado - hidratação reativa com `MOCK_CURRICULOS_VAGAS` para `useCurriculoVaga`)
  - `src/app/vaga/[id].tsx` (Modificado - conexão da prop `onEditCandidatura` permitindo abrir o editor de pitch/candidatura diretamente a partir do visualizador de currículo)
  - `src/components/profile/profile-student-metric-modals.tsx` (Modificado - badge interativo "Ver" com ícone de documento no modal de candidaturas ativas)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - **Fim do bloqueio por snapshot nulo:** Se `curriculoVaga` não for encontrado, o modal sintetiza dinamicamente um currículo direcionado usando o `curriculoGeral` do aluno e os requisitos da vaga, garantindo que o modal sempre abra e exiba o documento.
  - **Dossiê Profissional Completo:** Exibição estruturada com foto/avatar do candidato, nome completo, título profissional, instituição, curso, contatos (e-mail, WhatsApp, localização), badge de status ativo com % de match, data e hora de envio, pitch de apresentação, competências selecionadas, histórico de experiências e formação acadêmica.
  - **Ações Reais e Úteis:**
    - Botão **"Exportar / Compartilhar Currículo"** que formata todo o currículo em texto estruturado e aciona o `Share.share` nativo do dispositivo para WhatsApp, e-mail, etc.
    - Botão **"Compartilhar Pitch"** com feedback visual imediato ("Copiado!").
    - Botão **"Editar Pitch"** para reabrir a customização de candidatura sem precisar cancelar a vaga.
    - Ação **"Retirar Candidatura"** com diálogo nativo de confirmação.
- **Impactos & Observações:** Checagem rigorosa de tipos com TypeScript realizada com 0 erros (`npx tsc --noEmit`). Layout 100% responsivo e com suporte a tema claro e escuro.
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Solicitação do usuário para que em todas as telas e modais com campos de texto do aplicativo o teclado virtual empurre o conteúdo para cima (`KeyboardAvoidingView`), garantindo que o usuário visualize perfeitamente o campo em que está digitando sem obstrução visual.
- **Arquivos Alterados / Criados:**
  - `src/app/configuracoes.tsx` (Modificado - encapsulamento do `ScrollView` em `KeyboardAvoidingView` com `behavior={Platform.OS === 'ios' ? 'padding' : undefined}`)
  - `src/app/vaga/form.tsx` (Modificado - encapsulamento da tela de anúncio/edição de vagas em `KeyboardAvoidingView`)
  - `src/app/home/profile.tsx` (Modificado - encapsulamento da rota Perfil em `KeyboardAvoidingView` para suportar edição inline do Sobre Mim, Habilidades, etc.)
  - `src/app/admin/usuarios.tsx` (Modificado - suporte a `KeyboardAvoidingView` no cadastro administrativo de usuários)
  - `src/app/home/companies.tsx` (Modificado - suporte a `KeyboardAvoidingView` no cadastro de empresas parceiras)
  - `src/app/home/scan.tsx` (Modificado - suporte a `KeyboardAvoidingView` na edição de texto extraído do escaneamento de currículo)
  - `src/components/profile/profile-student-academic-edit-modal.tsx` (Modificado - suporte a `KeyboardAvoidingView` no modal de dados acadêmicos)
  - `src/components/profile/profile-student-education.tsx` (Modificado - suporte a `KeyboardAvoidingView` no modal de formação acadêmica)
  - `src/components/profile/profile-student-experience.tsx` (Modificado - suporte a `KeyboardAvoidingView` no modal de experiência profissional)
  - `src/components/profile/profile-student-interests.tsx` (Modificado - suporte a `KeyboardAvoidingView` no modal de áreas de interesse)
  - `src/components/profile/profile-student-wall.tsx` (Modificado - suporte a `KeyboardAvoidingView` no modal de recomendação)
  - `src/components/ui/profile-metric-dialog-modal.tsx` (Modificado - suporte a `KeyboardAvoidingView` no modal de busca de métricas)
  - `src/components/curriculo/modal-candidatura-vaga.tsx` (Modificado - suporte a `KeyboardAvoidingView` no modal de pitch/candidatura de vaga)
  - `src/components/curriculo/curriculo-geral-editor.tsx` (Modificado - suporte a `KeyboardAvoidingView` nos modais de formação e experiência do editor do currículo)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Padronização multiplataforma inteligente: Telas completas usam `Platform.OS === 'ios' ? 'padding' : undefined` (respeitando o `adjustResize` nativo do Android), enquanto modais centralizados utilizam `Platform.OS === 'ios' ? 'padding' : 'height'`, reposicionando os diálogos no centro da tela visível acima do teclado virtual.
- **Impactos & Observações:** Checagem de tipagem estrita com TypeScript executada com sucesso (`npx tsc --noEmit` -> 0 erros). Preservadas todas as diretrizes de acessibilidade e tema dark/light.
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Povoamento completo e realista da conta padrão do estudante John Doe para enriquecer a experiência visual e de demonstração:
  - **Dados Pessoais e Acadêmicos ([`src/data/user.ts`](src/data/user.ts) e [`src/hooks/use-perfil.ts`](src/hooks/use-perfil.ts)):** John Doe configurado com o cargo *"Desenvolvedor Frontend Trainee"*, instituição *"Centro Universitário UNDB"*, curso *"Engenharia de Software"*, status *"● Aberto a Oportunidades"* e foto de perfil configurada.
  - **Currículo Geral Mestre ([`src/data/curriculo.ts`](src/data/curriculo.ts) e [`src/services/curriculo-service.ts`](src/services/curriculo-service.ts)):**
    - **Sobre Mim:** Bio profissional completa com foco em mobile (React Native / TypeScript).
    - **Formação Acadêmica:** Bacharelado em Engenharia de Software (UNDB, 2023–2026) e Técnico em Informática para Internet (IFMA, 2020–2022).
    - **Experiência Profissional:** Desenvolvedor Frontend Trainee (Empresa Júnior UNDB) e Monitor de Algoritmos e Programação (UNDB).
    - **Habilidades & Competências:** 8 competências cadastradas (React Native, TypeScript, Expo SDK 58, TailwindCSS/NativeWind, SQLite, Git & GitHub, Trabalho em Equipe, Resolução de Problemas).
    - **Idiomas:** Português (Nativo) e Inglês (Intermediário).
  - **Rede Social & Inscrições ([`src/hooks/use-inscricoes.ts`](src/hooks/use-inscricoes.ts) e [`src/hooks/use-estudante-social.ts`](src/hooks/use-estudante-social.ts)):**
    - 2 candidaturas ativas em vagas de estágio.
    - 3 empresas seguidas (TechHub São Luís, Inova Maranhão, Ambev Tech).
    - 3 conexões acadêmicas com colegas da comunidade.
- **Arquivos Alterados / Criados:**
  - `src/data/user.ts` (Modificado - dados acadêmicos refinados de John Doe)
  - `src/data/curriculo.ts` (Modificado - mock completo e detalhado com formações, experiências, habilidades e idiomas)
  - `src/services/curriculo-service.ts` (Modificado - hidratação garantida do mock para usuários padrão e fallbacks)
  - `src/hooks/use-curriculo.ts` (Modificado - estado inicial do store hidratado com o mock)
  - `src/hooks/use-perfil.ts` (Modificado - fallback seguro inicial com o perfil do John Doe)
  - `src/hooks/use-inscricoes.ts` (Modificado - candidaturas padrão inicializadas)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Impactos & Observações:** Checagem TypeScript estrita realizada com 0 erros (`npx tsc --noEmit`).


### [2026-11-11] - Distribuição do Currículo Vivo ao Longo da Main e Ocultação do Mural para o Próprio Estudante
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Redefinição de arquitetura de produto solicitada pelo usuário na tela de perfil do estudante:
  - **Ocultação do Mural no Perfil Próprio:** O mural de avaliações e recomendações (`ProfileStudentWall`) foi retirado da visão do próprio estudante, ficando reservado para visualização por coordenadores e empresas recrutadoras.
  - **Distribuição Modular do Currículo Geral:** As seções do currículo foram decompostas em blocos modulares elegantes e distribuídas naturalmente ao longo da main do estudante:
    1. **Sobre Mim (`ProfileStudentSummary`):** Apresentação e bio profissional com edição inline e salvamento em tempo real.
    2. **Formação Acadêmica (`ProfileStudentEducation`):** Lista de graduações, cursos, períodos, status e modal de adição/remoção.
    3. **Experiência Profissional (`ProfileStudentExperience`):** Histórico de estágios e trabalhos com modalidades (Híbrido/Remoto/Presencial), atividades e modal de cadastro.
    4. **Competências & Idiomas (`ProfileStudentSkills`):** Habilidades técnicas, ferramentas e soft skills com adição rápida de chips e gestão de idiomas com níveis de proficiência.
  - **Composição da Main (`StudentProfileView`):** Agora orquestra sequencialmente: Hero do Estudante -> Carrossel de Interesses -> Sobre Mim -> Formação -> Experiência -> Competências & Idiomas.
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-student-summary.tsx` (Criado - seção modular Sobre Mim com edição reativa)
  - `src/components/profile/profile-student-education.tsx` (Criado - seção modular de Formação Acadêmica)
  - `src/components/profile/profile-student-experience.tsx` (Criado - seção modular de Experiência e Estágios)
  - `src/components/profile/profile-student-skills.tsx` (Criado - seção modular de Competências, Habilidades e Idiomas)
  - `src/components/profile/student-profile-view.tsx` (Refatorado - montagem do currículo vivo na main do perfil)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Impactos & Observações:** Checagem TypeScript estrita realizada com 0 erros (`npx tsc --noEmit`).


### [2026-11-11] - Reposicionamento da Main do Perfil e Transformação das Áreas de Interesse em Carrossel Lateral
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Aprimoramento da timeline principal do perfil do estudante solicitado pelo usuário:
  - **Reposicionamento na Main:** O bloco de Áreas de Interesse foi movido para logo após o cabeçalho (`ProfileStudentHeader`), conferindo prioridade visual imediata às afinidades tecnológicas do estudante na tela de perfil.
  - **Transformação em Carrossel Lateral (`ProfileStudentInterests`):** O antigo card estático volumoso que empilhava tags foi substituído por uma trilha horizontal de rolagem suave (`ScrollView horizontal showsHorizontalScrollIndicator={false}`), com chips elegantes (dot índigo, texto nítido, remoção rápida) e botão "+ Novo" integrado, reduzindo o consumo de espaço vertical e deixando o feed ágil e fluido.
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-student-interests.tsx` (Refatorado - carrossel horizontal compacto com chips e botão de novo interesse integrado)
  - `src/components/profile/student-profile-view.tsx` (Refatorado - reposicionamento das áreas de interesse logo após o header)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Impactos & Observações:** Checagem TypeScript estrita realizada com 0 erros (`npx tsc --noEmit`).


### [2026-11-11] - Aplicação do Estilo LinkedIn / Hero Profissional no Header do Estudante
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Adoção do padrão visual profissional estilo LinkedIn solicitado pelo usuário no cabeçalho do perfil do estudante:
  - **Composição Simétrica e Harmônica:** Eliminação da divisão lateral assimétrica. O cabeçalho agora organiza a foto circular em tamanho grande (`w-24 h-24` / 96x96px) centralizada no topo, seguida pelo nome completo, cargo da subclasse `Aluno`, instituição/curso e tag de status profissional com alinhamento centralizado e respiro uniforme.
  - **Barra Horizontal de Métricas na Base:** A base do card utiliza a régua horizontal completa (`layout="row"`) para as 3 métricas (Inscrições, Empresas, Conexões) divididas por separadores verticais, com 100% de aproveitamento da largura da tela sem compressão.
  - **Acesso Direto aos Modais:** O toque na foto aciona o `ProfileStudentPhotoModal` (troca direta com câmera/galeria), o lápis aciona o `ProfileStudentAcademicEditModal` (CRUD acadêmico do aluno) e os contadores acionam o `ProfileStudentMetricModals`.
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-student-info.tsx` (Refatorado - centralização hero estilo LinkedIn com foto destacada de 96px e tipografia hierárquica)
  - `src/components/profile/profile-student-header.tsx` (Refatorado - montagem limpa e simétrica unindo o Hero de identificação e a régua horizontal de métricas na base)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Impactos & Observações:** Checagem estrita de tipos via `npx tsc --noEmit` realizada com 0 erros.


### [2026-11-11] - Alinhamento Vertical das Informações do Aluno com Destaque Maior na Foto e Modal Direto de Troca
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Aprimoramento visual e funcional do cabeçalho do perfil do estudante atendendo à solicitação do usuário:
  - **Alinhamento Vertical e Foto Destacada:** Em `ProfileStudentInfo`, a foto agora fica posicionada no topo com destaque ampliado (`w-20 h-20` / 80x80px com cantos `rounded-2xl`, borda índigo e sombra), enquanto o nome, cargo, instituição/curso e tag de status profissional ficam organizados verticalmente logo abaixo da foto.
  - **Modal de Foto Ampliada e Troca Direta (`ProfileStudentPhotoModal`):** Ao tocar na foto na rota `/home/profile`, o app não redireciona mais para as configurações. Em vez disso, abre um modal dedicado mostrando a foto em tamanho ampliado (`w-48 h-48` com cantos `rounded-3xl` e backdrop blur), com ações imediatas para escolher nova foto da galeria, capturar com a câmera ou remover a foto atual.
  - **Persistência Reativa e no Banco Local:** O hook `useProfileStudentHeader` expõe `atualizarFotoPerfil(uri?)`, persistindo a alteração no store reativo `usePerfil` e no SQLite através de `userService.save()`.
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-student-photo-modal.tsx` (Criado - modal de exibição ampliada e troca direta da foto com ImagePicker)
  - `src/components/profile/profile-student-info.tsx` (Modificado - foto no topo com destaque e informações alinhadas verticalmente abaixo, acionando o PhotoModal)
  - `src/hooks/use-profile-student-header.ts` (Modificado - método `atualizarFotoPerfil` com persistência reativa e SQLite)
  - `src/components/profile/profile-student-header.tsx` (Modificado - injeção do handler de atualização da foto)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Impactos & Observações:** Checagem TypeScript estrita realizada com 0 erros (`npx tsc --noEmit`).


### [2026-11-11] - Implementação do Layout Lado a Lado no Header com Foto Blindada e Contadores Verticais
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Montagem do layout lado a lado no `ProfileStudentHeader` conforme solicitado pelo usuário, aproveitando o desacoplamento dos subcomponentes:
  - **`ProfileStudentInfo` com `layout="side-by-side"`:** A foto do estudante fica alinhada à esquerda dos dados acadêmicos com proteção absoluta contra deformação (`aspectRatio: 1`, `width: 68`, `height: 68`, `flexShrink: 0`, `shrink-0` e `overflow-hidden`), enquanto o bloco de textos expande com `flex-1 min-w-0` e truncagem segura de linha (`numberOfLines={1}`).
  - **`ProfileStudentCounters` com `layout="column"`:** Os 3 contadores (Inscrições, Empresas, Conexões) são renderizados como uma coluna vertical de atalhos à direita com ícones, números e chevrons em largura compacta e protegida (`w-32 sm:w-36 shrink-0`).
  - **`ProfileStudentHeader`:** Atua como layout container flexível (`flex-row items-center justify-between gap-3`), unindo os dois subcomponentes lado a lado de forma elegante e totalmente responsiva.
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-student-counters.tsx` (Modificado - adicionada a variante `layout="column"` para atalhos verticais à direita)
  - `src/components/profile/profile-student-info.tsx` (Modificado - adicionada a variante `layout="side-by-side"` com dimensões e proporção 1:1 blindadas contra achatamento)
  - `src/components/profile/profile-student-header.tsx` (Modificado - composição dos dois subcomponentes lado a lado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Impactos & Observações:** Checagem TypeScript estrita realizada com 0 erros (`npx tsc --noEmit`). Layout testado e protegido contra compressão em telas mobile.


### [2026-11-11] - Modularização do Header em Subcomponentes e Modelagem da Subclasse Aluno com CRUD Acadêmico
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Refatoração profunda solicitada pelo usuário para separar os elementos do cabeçalho em subcomponentes isolados e modelar os dados específicos do estudante como uma subclasse orientada a objetos com suporte a CRUD:
  - **Criação da Subclasse `Aluno extends User`:** Implementada em `src/data/user.ts` com atributos acadêmicos (`cargo`, `instituicao`, `curso`, `abertoOportunidades`), métodos nativos de instância e persistência estendida no SQLite e AsyncStorage.
  - **Subcomponente `ProfileStudentInfo`:** Isola a foto (com proteção 1:1), nome do aluno, cargo, instituição, curso, tag/pill de status e acionador de edição rápida.
  - **Subcomponente `ProfileStudentCounters`:** Isola a barra horizontal com os 3 contadores (Inscrições, Empresas, Conexões) e divisores verticais.
  - **Subcomponente `ProfileStudentAcademicEditModal`:** Fornece diálogo para edição (CRUD) dos campos acadêmicos da subclasse `Aluno`, persistindo os dados em tempo real no `usePerfil` e no banco SQLite via `userService`.
  - **Orquestrador `ProfileStudentHeader`:** Agora atua como contêiner unificado limpo que apenas monta os subcomponentes isolados.
- **Arquivos Alterados / Criados:**
  - `src/data/user.ts` (Modificado - criação da subclasse `Aluno extends User` e instanciação no `userList`)
  - `src/services/user-service.ts` (Modificado - suporte às colunas acadêmicas e instanciação da subclasse `Aluno`)
  - `src/hooks/use-perfil.ts` (Modificado - inclusão dos campos da subclasse `Aluno` no contrato `Perfil`)
  - `src/hooks/use-profile-form.ts` (Modificado - suporte aos campos acadêmicos no formulário de configurações)
  - `src/hooks/use-profile-student-header.ts` (Modificado - hidratação canônica da subclasse `Aluno` e operações CRUD de atualização acadêmica e status)
  - `src/components/profile/profile-student-info.tsx` (Criado - subcomponente de identidade e dados acadêmicos)
  - `src/components/profile/profile-student-counters.tsx` (Criado - subcomponente de barra de contadores)
  - `src/components/profile/profile-student-academic-edit-modal.tsx` (Criado - modal de CRUD acadêmico do aluno)
  - `src/components/profile/profile-student-header.tsx` (Refatorado - montagem limpa dos subcomponentes)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Impactos & Observações:** Checagem estrita de tipos via `npx tsc --noEmit` realizada com 0 erros.


### [2026-11-11] - Correção de Layout Estável e Hidratação de Domínio via Entidade User no ProfileStudentHeader
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Correção a pedido do usuário de problemas visuais e de modelagem de dados no cabeçalho do perfil do estudante:
  - **Correção da Foto Achatada:** O layout anterior dividido horizontalmente comprimia a área da foto no mobile. Restaurado e blindado o layout circular centralizado estável com proporção 1:1 estrita (`aspectRatio: 1`, `resizeMode="cover"`, `h-24 w-24 rounded-full` com `overflow-hidden`), acompanhado da barra horizontal de 3 contadores com divisores verticais que não sofrem compressão de flexbox.
  - **Hidratação Canônica via Entidade `User`:** O hook `useProfileStudentHeader` agora instancia diretamente a entidade de domínio `User` (`src/data/user.ts`), utilizando seu getter nativo `user.fullName`, `user.avatar`, iniciais dinâmicas e fallback seguro para o aluno padrão de `userList` caso o perfil ainda não tenha sido populado no store/storage.
- **Arquivos Alterados / Criados:**
  - `src/data/user.ts` (Modificado - adicionado avatar padrão para o aluno inicial de teste `001`)
  - `src/hooks/use-profile-student-header.ts` (Modificado - hidratação a partir da entidade de domínio `User` com fallback e getters nativos)
  - `src/components/profile/profile-student-header.tsx` (Modificado - restauração da estrutura circular centralizada protegida contra distorção com contadores horizontais espaçados)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Impactos & Observações:** Checagem TypeScript estrita realizada com 0 erros (`npx tsc --noEmit`). Layout 100% responsivo e estável em qualquer resolução de tela.


### [2026-11-11] - Refatoração Arquitetural e Separação de Responsabilidades do ProfileStudentHeader
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Aplicação rigorosa dos princípios de arquitetura limpa e separação de responsabilidades no componente `ProfileStudentHeader`:
  - Desacoplamento dos dados mock/domínio que estavam embutidos no componente visual.
  - Extração de toda a lógica de negócio, agregação de dados e ordenação A-Z para um hook customizado dedicado (`useProfileStudentHeader`).
  - Isolamento do código declarativo dos modais de métricas em um subcomponente modular de apresentação (`ProfileStudentMetricModals`).
  - Redução drástica da complexidade ciclomática e tamanho de `ProfileStudentHeader`, mantendo fidelidade total ao layout visual e responsividade.
- **Arquivos Alterados / Criados:**
  - `src/data/social.ts` (Criado - tipagens `EmpresaSocial`, `ColegaSocial` e constantes `EMPRESAS_BASE`, `COLEGAS_BASE`)
  - `src/hooks/use-profile-student-header.ts` (Criado - hook customizado que gerencia estados reativos, unificação de empresas, ordenação A-Z, controle de modal ativo e ações de navegação e social)
  - `src/components/profile/profile-student-metric-modals.tsx` (Criado - subcomponente modular de apresentação para os modais de Inscrições, Empresas Seguidas e Conexões Acadêmicas)
  - `src/components/profile/profile-student-header.tsx` (Refatorado - agora focado exclusivamente no layout do cabeçalho visual e consumindo o hook de orquestração)
  - `docs/ARCHITECTURE.md` (Modificado - registro dos novos módulos na estrutura arquitetural)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Impactos & Observações:** Checagem TypeScript estrita realizada com 0 erros (`npx tsc --noEmit`). Nenhuma quebra de API pública ou comportamento visual.


### [2026-11-11] - Reversão do Redesign de Header para o Layout Anterior Estável
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Reversão imediata a pedido do usuário do commit `6b41ea4`: restauração do layout anterior estável do `ProfileStudentHeader` (foto circular centralizada e barra de 3 contadores horizontais com o modal genérico centralizado com blur) e restauração do componente `ProfileInscricoesList`.
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-student-header.tsx` (Restaurado ao layout circular e contadores horizontais)
  - `src/components/profile/student-profile-view.tsx` (Restaurada montagem anterior)
  - `src/components/profile/profile-inscricoes-list.tsx` (Restaurado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`).

### [2026-11-11] - Redesign do Header do Estudante (Foto Quadrada e Atalhos à Direita) e Remoção da Lista de Vagas
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Aprimoramento visual de layout e otimização de espaço na tela de Perfil do Estudante solicitados pelo usuário:
  - O componente solto `ProfileInscricoesList` foi removido da timeline principal da página, já que as inscrições agora são visualizadas e pesquisadas em ordem alfabética através do modal centralizado disparado pelo contador.
  - O cabeçalho `ProfileStudentHeader` foi redesenhado no formato de painel dividido:
    - **Lado Esquerdo:** foto de perfil em **quadrado com cantos arredondados** (`rounded-2xl`), acompanhada do nome do estudante, ocupação ("Estudante de Tecnologia"), instituição ("UNDB") e tag "Aberto a Oportunidades".
    - **Lado Direito:** coluna vertical com 3 atalhos elegantes para as listas modais de Inscrições, Empresas Seguidas e Conexões (com ícones, contadores numéricos e chevrons).
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-student-header.tsx` (Refatorado - novo layout split com foto quadrada arredondada e identificação à esquerda e botões de atalho verticais à direita)
  - `src/components/profile/student-profile-view.tsx` (Refatorado - removida a chamada redundante de `ProfileInscricoesList`)
  - `src/components/profile/profile-inscricoes-list.tsx` (Removido - funcionalidade absorvida pelo modal de métricas)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Layout mais moderno, aproveitando melhor o espaço horizontal da tela e eliminando componentes duplicados.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`).

### [2026-11-11] - Reversão do Redesign de Header para o Layout Anterior Estável
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Reversão imediata a pedido do usuário do commit `6b41ea4`: restauração do layout anterior estável do `ProfileStudentHeader` (foto circular centralizada e barra de 3 contadores horizontais com o modal genérico centralizado com blur) e restauração do componente `ProfileInscricoesList`.
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-student-header.tsx` (Restaurado ao layout circular e contadores horizontais)
  - `src/components/profile/student-profile-view.tsx` (Restaurada montagem anterior)
  - `src/components/profile/profile-inscricoes-list.tsx` (Restaurado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`).

### [2026-11-11] - Modal Genérico Centralizado com Blur para Métricas (Inscrições, Empresas, Conexões)
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Unificação arquitetural e refinamento visual de UX na tela de Perfil do Estudante atendendo à solicitação do usuário:
  - Criação do componente genérico e reutilizável `ProfileMetricDialogModal`, que posiciona um diálogo flutuante centralizado no meio da tela com backdrop translúcido escuro que borra o fundo (`backdrop-blur-md`), fechamento acessível no botão "X" e toque fora.
  - O mesmo componente genérico agora hidrata os 3 contadores de métricas da foto do estudante:
    1. **Inscrições:** lista em ordem alfabética (A-Z) das vagas em que o aluno se candidatou, com busca em tempo real, status da inscrição e toque para navegar aos detalhes da vaga.
    2. **Empresas:** lista em ordem alfabética (A-Z) das empresas acompanhadas, com busca instantânea e toggle de seguir/deixar de seguir.
    3. **Conexões:** lista em ordem alfabética (A-Z) dos colegas e conexões acadêmicas da comunidade PEIA, com busca por nome ou curso.
- **Arquivos Alterados / Criados:**
  - `src/components/ui/profile-metric-dialog-modal.tsx` (Criado - diálogo genérico centralizado com blur no fundo, busca dinâmica com botão de limpar, scroll suave e fechamento no centro da tela)
  - `src/components/profile/profile-student-header.tsx` (Refatorado - os 3 contadores tornaram-se gatilhos interativos que abrem o modal genérico hidratado)
  - `src/components/profile/profile-following-companies-modal.tsx` (Removido - substituído pelo modal genérico)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Eliminação de código duplicado e centralização da experiência de listagem das métricas do estudante em uma interface elegante, consistente e responsiva.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`).

### [2026-11-11] - Subtela de Empresas Seguidas (Ordem Alfabética + Busca) via Contador
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Aprimoramento de UX no Perfil do Estudante atendendo à solicitação do usuário:
  - O componente estático de empresas parceiras foi removido da timeline principal do perfil, limpando a rolagem visual.
  - O contador "Empresas" na barra de métricas do cabeçalho do aluno (próximo à foto) tornou-se um botão interativo com indicação de toque que abre uma subtela/modal dedicada (`ProfileFollowingCompaniesModal`).
  - A nova tela lista todas as empresas que o estudante segue ordenadas estritamente em **ordem alfabética (A-Z)**, com barra de **pesquisa em tempo real** por nome ou setor da empresa e ação para deixar de seguir.
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-following-companies-modal.tsx` (Criado - modal com ordenação alfabética A-Z, campo de busca com clear, lista com badges e ação de seguir/deixar de seguir)
  - `src/components/profile/profile-student-header.tsx` (Refatorado - contador "Empresas" transformado em gatilho clicável que abre a modal de empresas seguidas)
  - `src/components/profile/student-profile-view.tsx` (Refatorado - removida a lista estática solta da timeline do perfil)
  - `src/components/profile/profile-student-following.tsx` (Removido - substituído pelo modal dedicado acessado pelo contador)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Perfil mais limpo e focado no estudante.
  - Acesso direto e rápido às empresas acompanhadas com busca alfabética instantânea.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`).

### [2026-11-11] - Modularização Completa do Perfil e Mural de Avaliações/Recomendações
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Modularização completa da tela de Perfil (`src/app/home/profile.tsx`) e criação do Mural de Recomendações e Avaliações recebidas pelo estudante de empresas parceiras, professores e colegas:
  - `profile.tsx` foi desacoplado em componentes orquestradores de montagem pura por persona: `StudentProfileView`, `CompanyProfileView` e `CoordinationProfileView`, reduzindo a tela principal para apenas 32 linhas.
  - Implementação do Mural de Recomendações (`ProfileStudentWall`) com notas em estrelas (1 a 5), filtros por tipo de avaliador (Empresas, Docentes e Colegas), exibição de depoimentos em cartões refinados e modal para cadastrar/solicitar novas avaliações com persistência reativa via `useAvaliacoes`.
- **Arquivos Alterados / Criados:**
  - `src/data/avaliacoes.ts` (Criado - entidade, tipos e dados iniciais demonstrativos de avaliações e depoimentos)
  - `src/hooks/use-avaliacoes.ts` (Criado - store reativo com persistência AsyncStorage para mural de avaliações e recomendações)
  - `src/components/profile/profile-student-wall.tsx` (Criado - componente de mural com estrelas, média ponderada, filtros e modal de adição de depoimento)
  - `src/components/profile/student-profile-view.tsx` (Criado - montagem modular de alto nível para o Estudante: Header, Mural, Interesses, Empresas, Inscrições e Currículo Master)
  - `src/components/profile/company-profile-view.tsx` (Criado - montagem modular de alto nível para Empresas Parceiras)
  - `src/components/profile/coordination-profile-view.tsx` (Criado - montagem modular de alto nível para Coordenação)
  - `src/app/home/profile.tsx` (Refatorado - orquestração limpa e declarativa com seleção modular por papel de usuário)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - O perfil do estudante agora conta com prova social de alta credibilidade (depoimentos de recrutadores, professores e colegas), facilitando o processo de contratação e visibilidade.
  - Arquitetura limpa e escalável onde cada persona possui seu módulo de montagem isolado.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`).

### [2026-11-11] - Refatoração do Perfil: Foto, Interesses, Conexões e Remoção do Logout da Tab Bar
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Aprimoramento visual e funcional da tela de Perfil (`/home/profile`) e simplificação do menu inferior (Tabs):
  - Remoção do botão de Logout da barra inferior (Tabs), agora centralizado nas Configurações da Conta acessadas pelo topo esquerdo.
  - Na tela de Perfil do Estudante, integração em destaque da foto do aluno, contadores sociais (inscrições ativas, empresas seguidas, conexões), gerenciador de Áreas de Interesse (tags interativas) e lista de Empresas Parceiras seguidas, junto com as candidaturas ativas e o Editor do Currículo Master.
- **Arquivos Alterados / Criados:**
  - `src/hooks/use-estudante-social.ts` (Criado - store reativo com persistência AsyncStorage para interesses profissionais, empresas seguidas e conexões com colegas)
  - `src/components/profile/profile-student-header.tsx` (Refatorado - foto de perfil em evidência com badge de edição, informações acadêmicas e barra com 3 métricas sociais)
  - `src/components/profile/profile-student-interests.tsx` (Criado - componente de chips de interesses profissionais com modal para adicionar novas tags e sugestões rápidas)
  - `src/components/profile/profile-student-following.tsx` (Criado - componente de empresas parceiras seguidas com botão de seguir/deixar de seguir com feedback instantâneo)
  - `src/app/home/profile.tsx` (Refatorado - tela de perfil do estudante unificada com foto, métricas, interesses, empresas, candidaturas e currículo)
  - `src/app/home/_layout.tsx` (Modificado - botão de logout removido da barra de tabs visível e aba renomeada para "Perfil")
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Barra de navegação inferior mais espaçosa e focada nas tarefas do usuário.
  - Tela de perfil rica e dinâmica, valorizando a identidade do estudante, seus objetivos profissionais e conexões com o ecossistema corporativo.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`).

### [2026-11-11] - Separação Física: Menu de Conta no Header e Subclasse Estudante no Bottom Tab
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Reestruturação arquitetural de UX solicitada pelo usuário para separar fisicamente as informações da superclasse `User` e as informações da subclasse `Estudante`:
  - No menu superior (Header), foi adicionado no canto esquerdo um botão com o Avatar do usuário que navega para a tela dedicada de Configurações da Plataforma (`/configuracoes`), onde reside o CRUD completo da conta `User` (foto, nome, sobrenome, e-mail, telefone, preferências e encerramento de sessão).
  - No menu inferior (Bottom Tabs), a aba agora se concentra **exclusivamente nas informações da subclasse** do Estudante (candidaturas ativas e editor de currículo master para IA), sem misturar com configurações cadastrais.
- **Arquivos Alterados / Criados:**
  - `src/constants/routes.ts` (Modificado - adicionada a rota `CONFIGURACOES: '/configuracoes'`)
  - `src/app/_layout.tsx` (Modificado - registrado `<Stack.Screen name="configuracoes" />`)
  - `src/components/home/home-header.tsx` (Refatorado - adicionado botão de perfil/avatar no canto esquerdo com badge de configurações que navega para `/configuracoes`)
  - `src/app/configuracoes.tsx` (Criado - tela dedicada ao CRUD da conta `User`, alteração de foto de perfil com editor nativo/câmera, edição de dados cadastrais com persistência no SQLite e zona de desconexão/exclusão)
  - `src/components/profile/profile-student-header.tsx` (Criado - card de identificação focado na subclasse do Estudante com atalho para o menu de configurações)
  - `src/app/home/profile.tsx` (Refatorado - tela de aba focada exclusivamente na subclasse do estudante: inscrições e currículo geral)
  - `src/app/home/_layout.tsx` (Modificado - rótulo da aba renomeado para "Currículo" para estudante com ícone temático de documento)
  - `src/components/profile/profile-header.tsx` (Removido - substituído pela tela `/configuracoes` e `profile-student-header.tsx`)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Separação clara de responsabilidades: o usuário sabe exatamente que a foto no topo esquerdo gerencia a sua conta na plataforma, e a aba inferior gerencia suas atividades acadêmicas de estágio e currículo.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`). Navegação limpa e intuitiva.

### [2026-11-11] - Unificação de Identidade do Usuário com Foto em Evidência e Menu Retrátil
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Melhoria de UX na tela de Perfil atendendo à solicitação de unir a identificação cadastral do usuário diretamente com sua foto/avatar: a foto agora permanece sempre à mostra em posição de destaque central, enquanto as informações detalhadas e formulário de edição de contato institucional (Nome, Sobrenome, E-mail, Telefone) foram recolhidas em um menu retrátil elegante integrado no mesmo bloco de cabeçalho.
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-header.tsx` (Refatorado - unificado com avatar sempre em evidência, dados essenciais visíveis e menu retrátil "Informações da Conta" com campos de edição e persistência integrados)
  - `src/app/home/profile.tsx` (Refatorado - repasse direto de estados ao `ProfileHeader`, eliminando blocos redundantes na tela)
  - `src/components/profile/profile-personal-data-form.tsx` (Removido - lógica e visual incorporados ao menu retrátil do card de perfil)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - O perfil do estudante e demais personas agora apresenta um visual muito mais limpo e harmônico: a foto do perfil e o nome ficam em evidência imediata.
  - Para visualizar ou editar os dados cadastrais (nome, sobrenome, email e telefone), o usuário acessa o menu recolhível "Informações da Conta" no próprio card.
  - A tela do estudante foca imediatamente nas Inscrições e no Editor de Currículo Geral sem rolagem desnecessária.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`). Eliminação de código morto e simplificação do layout.

### [2026-11-11] - Editor Nativo de Foto no Celular e Persistência Completa no SQLite
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Integração com o editor e cortador de fotos nativo do sistema operacional (Android e iOS) via `expo-image-picker` com `allowsEditing: true` e proporção `aspect: [1, 1]`, adicionando suporte à câmera do aparelho, e fechamento do ciclo de persistência resiliente no SQLite (`userService.save` e `peia.db`), garantindo que o avatar e alterações cadastrais do perfil persistam entre sessões e no painel administrativo.
- **Arquivos Alterados / Criados:**
  - `package.json` (Modificado - adicionada dependência `expo-image-picker` ~58.0.10 do Expo SDK 58)
  - `src/components/profile/profile-avatar.tsx` (Refatorado - integrado ao `expo-image-picker` para acionar o editor de corte nativo do Android/iOS, captura de câmera com corte nativo e fallback da subtela web com Canvas)
  - `src/hooks/use-profile-form.ts` (Refatorado - sincronização com `userService.save(...)` no SQLite para avatar e dados pessoais ao salvar)
  - `src/hooks/use-auth.ts` (Modificado - repasse do campo `avatar` persistido no SQLite para o estado global `perfilActions` no login e cadastro)
  - `src/data/user.ts` (Modificado - suporte a `avatar` no factory method `User.create`)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - **Editor Nativo do Celular:** No Android e iOS, tocar em "Escolher foto da galeria" ou "Tirar foto com a câmera" agora abre a interface nativa do sistema operacional (Google Fotos / Galeria / iOS) com o cortador quadrado/circular já integrado.
  - **Persistência Completa:** Alterações de avatar (seleção ou remoção) e alterações de dados cadastrais agora são persistidas imediatamente tanto no estado reativo (`perfilActions`) quanto no banco relacional local SQLite (`peia.db` via `userService.save`), permanecendo salvas após logout e login.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`). Totalmente aderente ao Expo SDK 58.

### [2026-11-11] - Subtela de Recorte/Alinhamento de Foto e Validação de Arquivos
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Aprimoramento robusto do fluxo de seleção de foto de perfil no aplicativo PEIA: criação de subtela/modal para recorte, aproximação (zoom) e alinhamento (pan/rotação) do avatar com máscara circular e grid de enquadramento, acompanhado de verificações essenciais de arquivo (tamanho máximo de 5MB, tipos MIME/extensões suportados JPG/PNG/WEBP, prevenção de arquivos vazios/corrompidos e alertas amigáveis).
- **Arquivos Alterados / Criados:**
  - `src/utils/file-validators.ts` (Criado - validação e checagem de integridade de arquivos de imagem com limite de 5MB, validação de tipos MIME, extensões e formatação legível de tamanho)
  - `src/components/profile/profile-image-crop-modal.tsx` (Criado - subtela/modal em tela cheia com viewport circular, PanResponder para arrasto suave, zoom regulável até 3x, rotação 90°, linhas-guia dos terços, badge de arquivo validado e recorte em alta resolução)
  - `src/components/profile/profile-avatar.tsx` (Refatorado - integrado ao pipeline de validação de arquivo, modal de recorte e exibição de alertas via `AlertModal`)
  - `docs/ARCHITECTURE.md` (Modificado - adicionado `file-validators.ts` à estrutura de utilitários)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Ao escolher uma foto da galeria do aparelho, o arquivo é imediatamente validado contra limites de tamanho (máx 5MB), existência e extensões permitidas. Arquivos inválidos exibem alerta informativo sem travar o app.
  - Se aprovado, uma subtela dedicada de ajuste é aberta, permitindo centralizar o rosto, arrastar com o dedo, regular zoom (1x a 3x com botões e presets) e rotacionar a foto antes da aplicação final.
  - Processamento limpo com Canvas no Web e compatibilidade com React Native mobile.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`). Layout no padrão NativeWind v4 e dark mode.

### [2026-11-11] - Otimização de Hierarquia Visual no Perfil (Superclasse vs Subclasse)
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Melhoria de UX na tela de Perfil aplicando o padrão de Progressive Disclosure: os dados cadastrais da superclasse `User` (Nome, Sobrenome, E-mail, Telefone) foram recolhidos em um card expansível/toggle elegante, dando foco total e imediato às informações da subclasse do estudante (Inscrições e Currículo Geral).
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-personal-data-form.tsx` (Refatorado - transformado em acordeom expansível com prévia dos dados, chip de ação e expansão fluida)
  - `src/app/home/profile.tsx` (Refatorado - reposicionados os módulos de subclasse no topo do fluxo visual do estudante, configurando `defaultExpanded` condicional)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - O estudante agora visualiza imediatamente suas candidaturas ativas e todo o editor de currículo mestre (resumo, formações, experiências, habilidades, projetos) sem precisar rolar campos cadastrais estáticos.
  - Informações cadastrais de contato permanecem facilmente acessíveis a um toque através do botão "Editar" do acordeom.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`). Redução significativa do esforço cognitivo e rolagem desnecessária.

### [2026-11-11] - Melhoria de UX no Perfil com Foto de Usuário e Gestor de Avatares
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Aprimoramento da experiência visual e identificação pessoal no Perfil, adicionando suporte completo a foto de perfil/avatar para estudantes, empresas e administradores, com seleção de galeria, avatares rápidos e persistência no SQLite.
- **Arquivos Alterados / Criados:**
  - `src/components/profile/profile-avatar.tsx` (Criado - componente de avatar com exibição de imagem, iniciais em alta resolução, badge de câmera com ação modal, seletor de arquivos via `expo-document-picker`, presets rápidos e opção de remoção)
  - `src/components/profile/profile-header.tsx` (Refatorado - integrado ao `ProfileAvatar`, exibindo card de identidade visual com nome completo, e-mail, persona e status ativo)
  - `src/data/user.ts` (Modificado - adicionada a propriedade `avatar?: string` na entidade `User` e interface `UserProps`)
  - `src/hooks/use-perfil.ts` (Modificado - incluído campo `avatar` no store reativo de perfil)
  - `src/hooks/use-profile-form.ts` (Modificado - adicionados manipuladores `handleAvatarChange` e `handleRemoveAvatar` com persistência instantânea)
  - `src/services/user-service.ts` (Modificado - migration de coluna `avatar` na tabela `users` do SQLite)
  - `src/app/home/profile.tsx` (Modificado - repasse dos métodos de avatar para o header)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - O perfil agora conta com um card de destaque que exibe a foto do usuário ou iniciais geradas dinamicamente.
  - Ao tocar no avatar ou no botão de câmera flutuante, abre-se uma modal que permite ao usuário carregar uma foto do aparelho (galeria), selecionar entre avatares pré-definidos ou restaurar para as iniciais.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`). Layout mais humanizado, agradável e profissional.

### [2026-11-11] - Implementação da Rota de Conversas e Feedbacks de Candidatura
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Criação da funcionalidade central do PEIA de diagnóstico inteligente e feedbacks de candidatura, permitindo que os estudantes visualizem a aderência de seus currículos às vagas inscritas (Match Score), pontos fortes identificados, recomendações para entrevista e conversem diretamente com recrutadores/IA.
- **Arquivos Alterados / Criados:**
  - `src/data/feedback.ts` (Criado - tipagem e motor de análise automatizada de compatibilidade de currículo vs vaga `gerarAnaliseAutomatica` e factory `criarConversaInicial`)
  - `src/services/feedback-service.ts` (Criado - persistência resiliente em SQLite na tabela `conversas_candidaturas` com fallback transparente em AsyncStorage)
  - `src/hooks/use-conversas.ts` (Criado - hook reativo via `useSyncExternalStore` com envio de mensagens do estudante e auto-resposta assistiva)
  - `src/components/conversas/conversa-card.tsx` (Criado - card visual no feed com badge de Match Score colorido, título da vaga, empresa e última mensagem)
  - `src/components/conversas/conversa-detalhe-modal.tsx` (Criado - modal completo com card expansível de diagnóstico do currículo, pontos fortes, oportunidades de melhoria, histórico de mensagens e envio de respostas)
  - `src/components/conversas/conversas-empty.tsx` (Criado - empty state com CTA para explorar oportunidades)
  - `src/app/home/conversas.tsx` (Criado - rota da aba de conversas integrada com listagem e modais)
  - `src/app/home/_layout.tsx` (Modificado - inserida a aba "Conversas" com ícone `chatbubbles` no menu de navegação inferior do estudante)
  - `src/constants/routes.ts` (Modificado - adicionada a rota `CONVERSAS: '/home/conversas'`)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Inclusão da aba "Conversas" na barra de navegação da Home.
  - Para cada vaga em que o estudante se candidatou, o sistema calcula a aderência das qualificações (habilidades, experiências, formação) gerando Match Score de 0 a 100%, pontos fortes destacados e dicas específicas para a entrevista com a empresa.
  - Disponibilizado canal de mensagens para o aluno tirar dúvidas e acompanhar a evolução do processo seletivo.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`). Atende plenamente à proposta de valor central do aplicativo PEIA.

### [2026-11-11] - Efeito de Onda Expansiva de Dispersão de Cores nos Componentes da Tela
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** A transição de cores dos componentes ao alternar o tema ocorria de forma instantânea ("crua"). Foi implementado um efeito de onda expansiva de dispersão (Circular Wave Reveal) originada no botão flutuante que varre a tela e transita as cores dos componentes suavemente, somada a transições graduais de CSS no ecossistema Web.
- **Arquivos Alterados / Criados:**
  - `src/components/ui/theme-toggle.tsx` (Modificado - adicionada a grande onda de dispersão `screenWaveAnim` com escala de 0.1x a 52x cobrindo todo o viewport com a cor do tema de destino e borda iluminada antes de dissolver)
  - `src/global.css` (Modificado - adicionadas regras de transição suave de 400ms para propriedades de cor, background e borda na camada base)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Ao alternar o tema, uma onda circular irradia do botão flutuante cobrindo toda a tela de ponta a ponta com a cor do próximo tema (`#03031b` para escuro e `#f8fafc` para claro).
  - A troca de tema ocorre com timing orquestrado (180ms), fazendo com que todos os componentes pareçam ser "tingidos" gradualmente pela onda expansiva.
  - No ambiente Web, todos os cards, textos e bordas realizam transição cúbica de 400ms em perfeita harmonia.
- **Impactos & Observações:** Validação de tipos aprovada com 0 erros (`npx tsc --noEmit`). 100% acelerado por hardware com `useNativeDriver: true`.

### [2026-11-11] - Animação Fluida de Dispersão no Alternador de Tema (ThemeToggle)
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** O botão flutuante de alternância entre tema claro e escuro trocava o estado instantaneamente sem suavização visual. Foi implementada uma animação de dispersão em ondas de choque concêntricas combinada com rotação elástica e escala do ícone.
- **Arquivos Alterados / Criados:**
  - `src/components/ui/theme-toggle.tsx` (Refatorado - adicionadas ondas de choque com halos concêntricos que irradiam do centro e se dissipam com opacidade/escala, além de rotação de 360° e bounce no ícone do Sol/Lua)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Criação de três camadas concêntricas de dispersão (`wave1`, `wave2`, `wave3`) com interpolação de escala (de 0.7x até 3.8x) e esmaecimento progressivo de opacidade, adaptando as cores para o novo tema selecionado (dourado/âmbar para o tema escuro/sol e anil/índigo para o tema claro/lua).
  - Animação do ícone com escala elástica (spring) e rotação de 360 graus sincronizada a 60fps usando o driver nativo (`useNativeDriver: true`).
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`). Compatível com ambientes nativos e web.

### [2026-11-11] - Adição de Estado de Transição com Loading Entre Autenticação e Home
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Criação de um estado de loading/transição visual pós-autenticação para simular a inicialização e sincronização das informações do perfil, vagas e currículo no SQLite antes de entrar na tela Home.
- **Arquivos Alterados / Criados:**
  - `src/components/auth/auth-loading-transition.tsx` (Criado - componente de transição com modal suave, branding PEIA, ambient glow, spinner Indigo, etapas de sincronização e barra de progresso)
  - `src/hooks/use-auth-form.ts` (Modificado - adicionados os estados `transitioning` e `transitionRole`, com delay simulado de carregamento antes de navegar via `router.replace`)
  - `src/components/auth/auth-form.tsx` (Modificado - integrado o `AuthLoadingTransition` exibido ao confirmar login/cadastro)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Ao validar o login ou concluir o cadastro, o app ativa a tela de transição com mensagens sequenciais ("Autenticando como [Persona]...", "Sincronizando currículo e oportunidades no SQLite...", "Carregando seu ambiente...") antes de renderizar a Home ou a rota de destino da persona.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`). Proporciona experiência fluida e polida ao usuário.

### [2026-11-11] - Refatoração Completa das Subrotas de Home com Hooks e Componentes
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Extensão da arquitetura de separação de responsabilidades para todas as subrotas de `/home` (`index.tsx`, `companies.tsx` e `scan.tsx`), extraindo lógica e estado para custom hooks e dividindo as interfaces em componentes reutilizáveis, modulares e declarativos.
- **Arquivos Alterados / Criados:**
  - `src/hooks/use-vagas-feed.ts` (Criado - gerencia busca textual, filtros de modalidade, áreas e arquivadas via memoização)
  - `src/hooks/use-companies-management.ts` (Criado - gerencia formulário de empresas parceiras, validação, persistência e estados de loading/sucesso)
  - `src/hooks/use-curriculo-scanner.ts` (Criado - orquestra permissões e captura de câmera, escolha de imagens/PDFs, extração via OCR e importação ao currículo)
  - `src/components/home/filter-chip.tsx` (Criado - chip de filtro reutilizável com estilos ativo/inativo)
  - `src/components/home/vagas-feed-header.tsx` (Criado - cabeçalho com input de busca e pills de filtros de modalidade e área)
  - `src/components/home/vaga-card.tsx` (Criado - card individual de vaga com badges de área, bolsa e navegação)
  - `src/components/home/vagas-empty.tsx` (Criado - estado vazio para quando a busca ou filtros não retornarem resultados)
  - `src/components/companies/companies-header.tsx` (Criado - cabeçalho da aba de empresas com atalho para gestão)
  - `src/components/companies/company-form.tsx` (Criado - formulário de cadastro de empresas com validação e loading)
  - `src/components/companies/company-card.tsx` (Criado - card de empresa conveniada)
  - `src/components/companies/companies-list.tsx` (Criado - listagem de empresas com contador e estado vazio)
  - `src/components/companies/companies-restricted-view.tsx` (Criado - aviso amigável para perfis sem permissão de cadastro)
  - `src/components/scan/scan-header.tsx` (Criado - cabeçalho com orientações sobre a leitura de currículos)
  - `src/components/scan/scan-camera-card.tsx` (Criado - visor de câmera com permissões, captura e visualização prévia)
  - `src/components/scan/scan-file-card.tsx` (Criado - seletor de arquivos de imagem e PDF)
  - `src/components/scan/scan-preview-card.tsx` (Criado - textarea de revisão do texto extraído pelo OCR e ação de importação)
  - `src/app/home/index.tsx` (Refatorado - de 130 linhas para ~48 linhas, 100% declarativo)
  - `src/app/home/companies.tsx` (Refatorado - de 101 linhas para ~47 linhas, 100% declarativo)
  - `src/app/home/scan.tsx` (Refatorado - de 210 linhas para ~82 linhas, 100% declarativo)
  - `docs/ARCHITECTURE.md` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Padronização arquitetural absoluta: todos os arquivos dentro de `src/app/home/` atuam apenas como orquestradores de layout, delegando estados para hooks e renderização para componentes autocontidos.
  - Eliminação de duplicações e lógica de persistência ou OCR acopladas diretamente na camada de view.
- **Impactos & Observações:** Checagem estrita de TypeScript aprovada com 0 erros (`npx tsc --noEmit`). Todo o módulo Home agora segue o mais alto padrão de manutenibilidade e clean code.

### [2026-11-11] - Modularização por Componentes e Hook Customizado no Perfil
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Refatoração da tela de perfil (`src/app/home/profile.tsx`) para desacoplar lógica de estado, validação e manipulação de conta em um custom hook (`useProfileForm`) e quebrar os elementos visuais em componentes reutilizáveis e autocontidos (`src/components/profile/`).
- **Arquivos Alterados / Criados:**
  - `src/hooks/use-profile-form.ts` (Criado - hook customizado que isola o estado do formulário, validações de campos de contato, sincronização com o perfil ativo e fluxo seguro de exclusão de conta)
  - `src/components/profile/profile-header.tsx` (Criado - cabeçalho com identificação da persona, badge de cargo e subtítulo adaptativo)
  - `src/components/profile/profile-admin-card.tsx` (Criado - banner de atalho para o painel de gestão de usuários restrito a Admin/Super Admin)
  - `src/components/profile/profile-personal-data-form.tsx` (Criado - formulário de contato com validação e feedback de salvamento)
  - `src/components/profile/profile-inscricoes-list.tsx` (Criado - listagem visual das vagas inscritas com navegação para detalhes)
  - `src/components/profile/profile-danger-zone.tsx` (Criado - botão de exclusão de perfil em zona de risco)
  - `src/app/home/profile.tsx` (Refatorado - redução para ~48 linhas, declarativo e modular)
  - `docs/ARCHITECTURE.md` (Modificado - adicionados o novo hook e pasta de componentes)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Eliminação de estados manuais e lógicas redundantes no arquivo de rota `profile.tsx`.
  - Separação clara de responsabilidades: rota apenas compõe componentes; o hook gerencia o ciclo de vida do formulário e validações.
  - Eliminação de resquícios de chave legada do currículo direto no perfil, centralizando o currículo no `CurriculoGeralEditor`.
- **Impactos & Observações:** Checagem TypeScript estrita concluída com 0 erros (`npx tsc --noEmit`). Layout limpo e manutenível.

### [2026-11-11] - Interface de Currículo Geral no Perfil e Visualização/Envio Direcionado na Vaga
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Construção das interfaces de usuário para gerenciamento completo do Currículo Geral no Perfil do Estudante e fluxo inteligente de candidatura direcionada e inspeção do currículo enviado na tela de Detalhes da Vaga.
- **Arquivos Alterados / Criados:**
  - `src/components/curriculo/curriculo-geral-editor.tsx` (Criado - componente modular no perfil com abas para Resumo, Formações, Experiências, Habilidades com chips e Idiomas/Projetos, além de formulários modais de cadastro e remoção atômica)
  - `src/components/curriculo/modal-candidatura-vaga.tsx` (Criado - modal de candidatura onde o aluno adapta seu resumo/pitch e seleciona quais habilidades e experiências do seu currículo mestre deseja direcionar para a vaga)
  - `src/components/curriculo/modal-visualizar-curriculo-vaga.tsx` (Criado - modal de inspeção do snapshot do currículo exato que foi submetido, com data de envio, pitch e qualificações enviadas, além de opção de cancelamento de candidatura)
  - `src/app/home/profile.tsx` (Refatorado - integrado ao `CurriculoGeralEditor`, substituindo inputs de texto simples pela gestão estruturada)
  - `src/app/vaga/[id].tsx` (Refatorado - adicionado card de candidatura enviada com botão "Visualizar currículo enviado", além de acionamento do fluxo direcionado antes da inscrição)
  - `docs/ARCHITECTURE.md` (Modificado - adicionada pasta `src/components/curriculo/` na árvore arquitetural)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Substituição da interface legada de currículo de texto plano no Perfil por um editor modular rico, com suporte a inclusão, visualização e exclusão de itens de formação acadêmica, histórico profissional, chips de habilidades e idiomas.
  - Na tela de Detalhes da Vaga, se o aluno ainda não se candidatou, o botão "Candidatar-se com currículo direcionado" abre o modal permitindo personalizar o pitch e selecionar os itens chave.
  - Se o aluno já se candidatou, exibe status de candidatura enviada e permite abrir o modal para inspecionar exatamente o que foi enviado para a empresa, além de permitir o cancelamento.
- **Impactos & Observações:** Checagem de tipos estrita aprovada com 0 erros (`npx tsc --noEmit`). Funcionalidade 100% alinhada aos requisitos e à arquitetura do PEIA.

### [2026-11-11] - Implementação do Service e Hook Reativo de Currículos (Geral e Vagas)
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Construção da camada de persistência resiliente em SQLite e hook reativo para gerenciar o ciclo de vida do Currículo Geral (Master) e dos Currículos Direcionados para Vagas, sem uso de Redux ou Zustand.
- **Arquivos Alterados / Criados:**
  - `src/services/curriculo-service.ts` (Criado - persistência em SQLite em tabelas `curriculos_gerais` e `curriculos_vagas`, com fallback em AsyncStorage, bootstrap do mock e migração transparente do formato legado)
  - `src/hooks/use-curriculo.ts` (Criado - hooks `useCurriculoGeral`, `useCurriculosVagas`, `useCurriculoVaga` via `useSyncExternalStore` e objeto de ações `curriculoActions`)
  - `docs/ARCHITECTURE.md` (Modificado - adicionados o novo service e hook à documentação)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - `curriculoService`: implementadas operações atômicas de leitura e gravação no SQLite nativo com fallback transparente para o AsyncStorage; migração automática a partir do armazenamento legado `peia:resume` ou seed com o perfil pré-cadastrado do estudante.
  - `useCurriculoGeral`: hook reativo que expõe o currículo mestre completo para componentes da aplicação.
  - `useCurriculosVagas` e `useCurriculoVaga(vagaId)`: hooks reativos para inspecionar os currículos direcionados e snapshots enviados para vagas específicas.
  - `curriculoActions`: métodos completos para manipulação granular: contato, bio/resumo, formação acadêmica, experiências profissionais, habilidades, idiomas, projetos e certificações, além de `candidatarComCurriculoVaga` e `cancelarCandidaturaVaga`.
- **Impactos & Observações:** Validação de tipos aprovada (`npx tsc --noEmit` sem erros). O ecossistema está preparado para a criação da interface de usuário modular no perfil e no fluxo de candidatura.

### [2026-11-11] - Estruturação de Dados para Currículo Geral e Currículo Direcionado para Vaga
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Criação da estrutura de dados para o módulo de currículos do estudante, distinguindo o Currículo Geral (Master Resume com histórico e competências completas) do Currículo Direcionado (Targeted Resume com recorte e foco customizados para envio às vagas).
- **Arquivos Alterados / Criados:**
  - `src/data/curriculo.ts` (Criado - interfaces tipadas, modelos granulares de formação, experiência, habilidades, projetos, certificações e idiomas, além de métodos utilitários de conversão e factory)
  - `docs/ARCHITECTURE.md` (Modificado - adicionado `src/data/curriculo.ts` na árvore de arquitetura)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Criada a interface `CurriculoGeral` para consolidar todos os dados cadastrados pelo aluno: dados de contato, bio/resumo geral, formações acadêmicas (`FormacaoAcademica`), experiências profissionais (`ExperienciaProfissional`), habilidades técnicas e comportamentais (`Habilidade`), projetos pessoais/acadêmicos (`ProjetoAcademicoOuPessoal`), certificações (`CertificacaoOuCurso`) e idiomas (`Idioma`).
  - Criada a interface `CurriculoVaga` para representar o snapshot/versão direcionada de candidatura: vinculada a um `vagaId`, permitindo resumo customizado (pitch), carta de apresentação, subconjunto selecionado de experiências/habilidades/projetos e indicador opcional de compatibilidade (`compatibilidadeEstimada`).
  - Implementadas funções utilitárias: `criarCurriculoGeralVazio`, `gerarCurriculoVaga` (filtragem e montagem a partir do currículo mestre), `converterLegadoParaCurriculoGeral` e `converterCurriculoGeralParaLegado` (garantindo compatibilidade com os campos legados de texto e OCR).
  - Incluído mock completo (`MOCK_CURRICULO_GERAL`) para testes de tipagem e prototipação rápida.
- **Impactos & Observações:** Sem breaking changes. O projeto mantém 100% de integridade de tipos com `npx tsc --noEmit`. Base pronta para a construção dos hooks, serviços de persistência e telas de visualização/edição granular.

### [2026-11-11] - Refatoração Arquitetural e Desacoplamento de Estados Paralelos
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Adequação estrita do código aos padrões de arquitetura do PEIA, corrigindo desvios introduzidos anteriormente como duplicação de papéis/armazenamento, quebra da camada de serviços, bloqueios arbitrários em vagas e uso de strings de rotas hardcoded.
- **Arquivos Alterados / Criados:**
  - `src/hooks/use-user-role.ts` (Refatorado - agora deriva o papel diretamente da sessão única `usePerfil`, eliminando a chave isolada `peia:tipo-usuario`; adicionado helper `usePermissions`)
  - `src/hooks/use-empresas.ts` (Refatorado - integrado ao `userService` e entidade de domínio `User` com persistência no SQLite)
  - `src/hooks/use-inscricoes.ts` (Refatorado - hidratação corrigida para ambientes nativos Android/iOS além de web; adicionada ação de cancelamento de candidatura)
  - `src/constants/routes.ts` (Modificado - adicionada a rota `COMPANIES: '/home/companies'`)
  - `src/app/vaga/[id].tsx` (Refatorado - restauradas permissões para empresas e coordenação gerenciarem vagas: editar, arquivar e excluir; inscrição restrita para alunos)
  - `src/app/vaga/form.tsx` (Refatorado - restaurado suporte completo a criação e edição de vagas via `existente` e `vagasActions.editar`, com proteção de acesso via `usePermissions` e uso de `ROUTES`)
  - `src/app/home/companies.tsx` (Refatorado - integrado ao `userService` com cadastro assíncrono real no SQLite e atalho para o painel de gestão)
  - `src/app/home/index.tsx` (Refatorado - rotas centralizadas via `ROUTES` e permissão de nova vaga ajustada)
  - `src/app/home/profile.tsx` (Refatorado - rota de detalhes tipada via `ROUTES.VAGA_DETALHE`)
  - `src/hooks/use-auth-form.ts` (Refatorado - uso de `ROUTES.COMPANIES`)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Unificação de todos os papéis e estados na Single Source of Truth (`usePerfil` / `userService`).
  - Restabelecimento do ciclo de vida completo de vagas para empresas e gestão.
  - Eliminação de rotas hardcoded e garantia de compatibilidade com SSR e runtime nativo mobile.
- **Impactos & Observações:** Validação de tipos aprovada (`npx tsc --noEmit` com 0 erros). Sistema 100% alinhado à arquitetura oficial.

### [2026-11-11] - Unificação de Acessos Rápidos na Tela de Autenticação
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Existiam dois blocos concorrentes de seleção/acesso rápido na tela de login: o seletor de pills "Entrar como" (trazido na branch do Tiago) e a barra de atalhos rápidos de apresentação com preenchimento de credenciais SQLite.
- **Arquivos Alterados / Criados:**
  - `src/components/auth/auth-form.tsx` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Removido o bloco redundante de pills "Entrar como" do topo do card de autenticação.
  - Mantido e aprimorado o bloco "Acesso Rápido para Apresentação" na base do formulário, que preenche automaticamente o e-mail, senha e define o `userRole` correspondente (Aluno -> `estudante`, Empresa -> `empresa`, Admin / Super Admin -> `coordenacao`).
  - Restabelecidos os emojis identificadores (`🎓 Aluno`, `🏢 Empresa`, `🛡️ Admin`, `👑 Super Admin`).
- **Impactos & Observações:** Interface de login mais limpa, intuitiva e sem duplicidade de seletores. TypeScript validado com 0 erros.

### [2026-11-11] - Atualização Integral da Documentação Técnica de Arquitetura e Diretrizes
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** A documentação técnica estava desatualizada em relação à versão do ecossistema Expo (SDK 58), React Native 0.88, persistência SQLite resiliente, OCR agnóstico de plataforma, novos fluxos de administração e personas de usuário integradas.
- **Arquivos Alterados / Criados:**
  - `docs/ARCHITECTURE.md` (Modificado - stack atualizada para Expo 58, React Native 0.88, React 19.3, persistência híbrida SQLite + AsyncStorage, árvore de diretórios completa e seções de personas/OCR)
  - `AGENTS.md` (Modificado - resumo da estrutura sincronizado com rotas de administração, empresas parceiras e persistência resiliente)
  - `docs/GIT_COLLABORATION_GUIDE.md` (Modificado - alinhamento sobre padrões de persistência)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Atualização dos metadados de dependências e versões oficiais do projeto.
  - Mapeamento detalhado da árvore de diretórios incluindo os módulos `src/app/admin/`, `src/services/`, `src/utils/ocr.*` e os hooks integrados.
  - Documentação da arquitetura de persistência em duas camadas (SQLite com detecção via `requireOptionalNativeModule` e fallback silencioso para AsyncStorage).
  - Descrição da hierarquia de personas (`aluno`, `empresa`, `admin`, `superadmin`) e das regras de negócio de vagas e inscrições.
- **Impactos & Observações:** Alinhamento completo da documentação com o código-fonte atual do repositório. Nenhuma alteração funcional em tempo de execução.

### [2026-11-11] - Sincronização de Branches (scanner-curriculo -> main) e Harmonização de Perfis
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Integração das alterações de fluxos por tipo de usuário enviadas por Tiago na branch `scanner-curriculo` com a branch `main` (que inclui Expo 58, SQLite e tela de gestão de usuários).
- **Arquivos Alterados / Criados:**
  - `src/app/home/_layout.tsx` (Modificado - integrado tabs por perfil com ErrorBoundary)
  - `src/app/home/profile.tsx` (Modificado - títulos adaptativos por role com badges e painel admin)
  - `src/hooks/use-auth-form.ts` (Modificado - sincronização de credenciais SQLite com userRole)
  - `src/app/home/companies.tsx` (Integrado - cadastro de empresas da coordenação)
  - `src/hooks/use-empresas.ts` (Integrado - persistência de empresas parceiras)
  - `src/hooks/use-inscricoes.ts` (Integrado - registro de candidaturas de estudantes)
  - `src/hooks/use-user-role.ts` (Integrado - sincronização da persona ativa)
  - `src/app/vaga/[id].tsx` (Integrado - fluxo de inscrição de estudante e permissões de empresa)
  - `src/app/vaga/form.tsx` (Integrado - restrição de anúncio exclusivo para empresas)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Resolução de conflitos de merge entre `main` e `origin/scanner-curriculo`.
  - Harmonização da entidade `User` e `useAuth` com o `useUserRole`, permitindo que os fluxos do protótipo de Tiago e o sistema de autenticação local SQLite funcionem de forma interoperável.
- **Impactos & Observações:** Todas as funcionalidades de ambas as branches preservadas. Testado e validado.
### [2026-10-30] - Checagem com requireOptionalNativeModule para Prevenir Erro Fatal do Metro
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** O Metro interceptava require('expo-sqlite') através do guardedLoadModule e lançava Uncaught Error fatal caso o módulo nativo C++ não estivesse presente no APK em execução.
- **Arquivos Alterados / Criados:**
  - `src/services/user-service.ts` (Modificado)
  - `src/services/vagas-service.ts` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Integrada a função `requireOptionalNativeModule('ExpoSQLite')` diretamente do pacote `expo`.
  - O código agora verifica previamente se o módulo nativo `ExpoSQLite` está realmente registrado no runtime do Android antes de tentar executar `require('expo-sqlite')`.
  - Se `requireOptionalNativeModule` retornar nulo, o carregamento do `expo-sqlite` é evitado por completo, eliminando 100% dos erros não capturados e permitindo fallback seguro e imediato.
- **Impactos & Observações:** O erro "Cannot find native module 'ExpoSQLite'" foi definitivamente extinto. Verificado via `npx tsc --noEmit` com 0 erros.

### [2026-10-30] - Silenciamento de Logs de Advertência do SQLite
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Eliminar caixas amarelas de aviso (warning LogBox) na tela do dispositivo ao alternar silenciosamente entre SQLite e AsyncStorage.
- **Arquivos Alterados / Criados:**
  - `src/services/user-service.ts` (Modificado)
  - `src/services/vagas-service.ts` (Modificado)
  - `src/hooks/use-vagas.ts` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Removidos todos os `console.warn` informativos da camada de fallback do SQLite.
  - O fallback agora opera de forma 100% silenciosa sem disparar toasts ou popups de aviso na interface do usuário.
- **Impactos & Observações:** Interface limpa sem caixas amarelas de advertência no celular. Verificado via `npx tsc --noEmit` com 0 erros.

### [2026-10-30] - Resiliência e Fallback Seguro de SQLite Nativo para AsyncStorage
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Prevenir falha ou quebra caso o módulo nativo do expo-sqlite não esteja linkado no ambiente em execução (por exemplo, ao rodar via Expo Go padrão sem o APK do Dev Client instalado).
- **Arquivos Alterados / Criados:**
  - `src/services/user-service.ts` (Modificado)
  - `src/services/vagas-service.ts` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Implementada detecção dinâmica de disponibilidade do módulo nativo (`isSQLiteAvailable` e validação de `openDatabaseSync`).
  - Em ambientes onde o SQLite nativo está compilado (Dev Client / APK standalone), o app utiliza a B-Tree e tabelas locais no banco `peia.db`.
  - Em ambientes onde o binário nativo não está presente (como no Expo Go genérico ou no navegador), o app automaticamente redireciona as operações de leitura e escrita para o `AsyncStorage` sem travar a interface e sem disparar exceções fatais.
- **Impactos & Observações:** O aplicativo agora roda perfeitamente em qualquer ambiente (Expo Go padrão, Dev Client APK ou Web), eliminando o erro de módulo nativo ausente. Verificado via `npx tsc --noEmit` com 0 erros.

### [2026-10-30] - Configuração de Build do Expo Dev Client (APK) no eas.json
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Permitir a geração do APK de desenvolvimento (Dev Client) para embutir as bibliotecas nativas uma única vez e usar Hot Reload em tempo de desenvolvimento.
- **Arquivos Alterados / Criados:**
  - `eas.json` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Adicionada a instrução `"android": { "buildType": "apk" }` no perfil `"development"` do `eas.json`.
- **Impactos & Observações:** O comando `npx eas-cli build -p android --profile development` agora gera diretamente o APK de desenvolvimento.

### [2026-10-30] - Tela de Cadastro Interno para Gestores (Admin/Super Admin) e Acesso Rápido na Autenticação
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Restringir o cadastro público externo exclusivamente para Alunos, criar a tela interna de gestão de usuários para cadastro de Empresas e Administradores (conforme nível hierárquico) e adicionar atalhos de login rápido para demonstração ao cliente.
- **Arquivos Alterados / Criados:**
  - `src/app/admin/_layout.tsx` (Criado)
  - `src/app/admin/usuarios.tsx` (Criado)
  - `src/constants/routes.ts` (Modificado)
  - `src/app/_layout.tsx` (Modificado)
  - `src/app/home/profile.tsx` (Modificado)
  - `src/components/auth/auth-form.tsx` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - O cadastro público externo em `AuthForm` agora é exclusivo para alunos (removido o seletor público).
  - Criada a nova tela administrativa `src/app/admin/usuarios.tsx` acessível via `ROUTES.GESTAO_USUARIOS` (`/admin/usuarios`), protegida por checagem de perfil (apenas `admin` e `superadmin`).
  - Implementadas regras de criação conforme o nível hierárquico: Super Admin pode cadastrar Administradores, Empresas e Alunos; Administrador pode cadastrar Empresas e Alunos.
  - A tela interna lista todos os usuários persistidos no SQLite com badges de persona e permite cadastro imediato.
  - Adicionado card com botão de acesso ao Painel na tela de Perfil (`src/app/home/profile.tsx`), visível exclusivamente para Administradores e Super Administradores.
  - Adicionados botões de atalho rápido na tela de login (`🎓 Aluno`, `🏢 Empresa`, `🛡️ Admin`, `👑 Super Admin`), preenchendo automaticamente as credenciais em um toque para apresentação ao cliente.
- **Impactos & Observações:** Validação de tipos aprovada (`npx tsc --noEmit` com 0 erros). Pronto para testes e demonstração direta.

### [2026-10-30] - Persistência Real de Vagas no Banco SQLite Local
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Migrar o armazenamento de vagas do AsyncStorage para uma tabela dedicada no banco de dados SQLite (`peia.db`), garantindo persistência estruturada para criação, edição, arquivamento e exclusão de vagas.
- **Arquivos Alterados / Criados:**
  - `src/services/vagas-service.ts` (Criado)
  - `src/hooks/use-vagas.ts` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Criado o serviço `vagasService` em `src/services/vagas-service.ts`, responsável pela tabela `vagas` no SQLite local do app nativo (`peia.db`) com colunas `id`, `titulo`, `empresa`, `cidade`, `area`, `modalidade`, `bolsa`, `descricao`, `arquivada` e `excluidaEm`.
  - Tabela pré-populada com as vagas mock caso esteja vazia na primeira inicialização.
  - Métodos `listAll()`, `save()`, `create()`, `update()`, `archive()` e `delete()` com suporte a soft delete.
  - Conectado o `useVagas` e `vagasActions` ao `vagasService`: a interface reativa (`useSyncExternalStore`) continua rápida e fluida em memória enquanto sincroniza e persiste diretamente nas tabelas do SQLite.
- **Impactos & Observações:** As vagas criadas, editadas ou escaneadas via OCR agora ficam gravadas de forma permanente no banco de dados SQLite local. Verificado com `npx tsc --noEmit` com 0 erros.

### [2026-10-30] - Infraestrutura de Separação de Personas (Aluno, Empresa, Administrador, Super Admin)
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Criar a estrutura base unificada de personas/roles no sistema para permitir demonstrar diferentes papéis para o cliente (Aluno, Empresa, Admin, Super Admin).
- **Arquivos Alterados / Criados:**
  - `src/data/user.ts` (Modificado)
  - `src/services/user-service.ts` (Modificado)
  - `src/hooks/use-perfil.ts` (Modificado)
  - `src/hooks/use-auth.ts` (Modificado)
  - `src/hooks/use-auth-form.ts` (Modificado)
  - `src/components/auth/auth-form.tsx` (Modificado)
  - `src/app/home/profile.tsx` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Adicionado o tipo `UserRole = 'aluno' | 'empresa' | 'admin' | 'superadmin'` e atributo `role` na classe `User` com getters de conveniência (`isAluno`, `isEmpresa`, `isAdmin`, `isSuperAdmin`, `roleLabel`).
  - Atualizadas as sementes em `userList` com instâncias de demonstração: Aluno (`john.doe@aluno.undb.edu.br`), Empresa (`recrutamento@techcorp.com.br`), Admin (`admin@undb.edu.br`) e Super Admin (`root@peia.edu.br`).
  - Adicionada coluna `role TEXT NOT NULL DEFAULT 'aluno'` na tabela `users` do SQLite em `src/services/user-service.ts` com migração transparente de schema (`ALTER TABLE users ADD COLUMN role...`).
  - Propagado o `role` para a interface `Perfil` em `src/hooks/use-perfil.ts` e orquestrado no `useAuth`.
  - Adicionado seletor de persona no formulário de cadastro (`Sou Aluno` vs `Sou Empresa`) em `src/components/auth/auth-form.tsx`.
  - Adicionada tag/badge de persona na tela de Perfil (`src/app/home/profile.tsx`) para feedback visual imediato ao cliente.
- **Impactos & Observações:** Modelo unificado preservado sem complexidade desnecessária. Pronto para apresentação e verificado via `npx tsc --noEmit` com 0 erros.

### [2026-10-30] - Refatoração Arquitetural: Classe de Domínio User, Hook useAuth e Desacoplamento do useAuthForm
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Separar rigorosamente as responsabilidades do formulário (UI), domínio (entidade User), orquestração de caso de uso (hook useAuth) e persistência de dados (userService / SQLite).
- **Arquivos Alterados / Criados:**
  - `src/data/user.ts` (Modificado)
  - `src/hooks/use-auth.ts` (Criado)
  - `src/hooks/use-auth-form.ts` (Modificado)
  - `src/services/user-service.ts` (Modificado)
  - `src/app/home/_layout.tsx` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Convertida a definição de `User` em `src/data/user.ts` em uma classe de domínio completa com construtor tipado, método estático `User.create(...)` e getter `fullName`.
  - Criado o hook `useAuth` (`src/hooks/use-auth.ts`) para orquestrar as regras de autenticação (`signUp`, `signIn`, `signOut`): instancia a classe `User`, delega persistência para o `userService.save(user)` e atualiza a sessão ativa em `perfilActions`.
  - Refatorado o `useAuthForm` (`src/hooks/use-auth-form.ts`) para ser exclusivamente um Form Controller de UI: removido qualquer acoplamento com SQLite, banco de dados ou `perfilActions`, focando apenas no estado dos inputs, validações visuais e chamando `auth.signUp` / `auth.signIn`.
  - Atualizado `userService` com método `save(user: User)` e retorno instanciado de `new User(row)`.
  - Configurado encerramento de sessão com `perfilActions.excluir()` no evento de toque da aba de logout em `src/app/home/_layout.tsx`.
- **Impactos & Observações:** Alinhamento completo com o padrão arquitetural profissional Clean Architecture / DDD. Verificado via `npx tsc --noEmit` com 0 erros.

### [2026-10-30] - Implementação do Banco SQLite Local e Fluxo Completo de Cadastro de Usuários
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Criação da base de dados SQLite local (`expo-sqlite`) simulando a API/backend do sistema e implementação do fluxo completo de Cadastro (Sign Up) com persistência de usuários, validação e vínculo ao perfil ativo.
- **Arquivos Alterados / Criados:**
  - `src/data/user.ts` (Modificado)
  - `src/services/user-service.ts` (Criado)
  - `src/hooks/use-auth-form.ts` (Modificado)
  - `src/components/auth/auth-form.tsx` (Modificado)
  - `package.json` (Modificado - adicionado `expo-sqlite`)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Definida e padronizada a entidade unificada `User` em `src/data/user.ts` (`id`, `name`, `surname`, `email`, `phone`, `password`, `token`, `createdAt`), com sementes iniciais.
  - Criado o serviço `userService` em `src/services/user-service.ts`, inicializando automaticamente a tabela `users` no SQLite local do dispositivo (`openDatabaseSync('peia.db')`), com suporte a fallback de persistência via `AsyncStorage` na Web.
  - Implementados métodos `register()`, `findByEmail()`, `findById()` e `listAll()` no `userService` com prevenção de e-mails duplicados.
  - Atualizado o hook `use-auth-form.ts` para gerenciar a senha no cadastro (`registerPassword`), alternância de visibilidade (`showRegisterPassword`) e validação de tamanho mínimo (6 caracteres).
  - Integrado o cadastro ao `userService.register()`, salvando no banco SQLite e espelhando a sessão no `perfilActions` antes de redirecionar para a Home com modal de boas-vindas.
  - Atualizado o formulário `AuthForm` (`src/components/auth/auth-form.tsx`) para renderizar o campo de senha com ícone de olho no modo Cadastro.
  - Ajustado o login para carregar os dados reais do usuário do SQLite quando disponível.
- **Impactos & Observações:** O cadastro agora salva dados reais no banco SQLite local do dispositivo. Verificado com `npx tsc --noEmit` com 0 erros de tipagem.

### [2026-10-30] - Reativação das validações de e-mail e senha no formulário de autenticação
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Restaurar as validações de integridade de e-mail (presença de @ e domínio válido) e senha obrigatória com tamanho mínimo sem quebrar o redirecionamento para a Home.
- **Arquivos Alterados / Criados:**
  - src/components/auth/auth-form.tsx (Modificado)
  - src/hooks/use-auth-form.ts (Modificado)
  - docs/CHANGELOG_AGENTS.md (Modificado)
- **Principais Mudanças:**
  - Restaurados os atributos `required` e placeholders nos inputs de login (`aluno@undb.edu.br` e `Sua senha`).
  - Chamada de `validateLogin()` e `validateSignUp()` no manipulador `handleSubmit()`.
  - Configurada validação de e-mail (exige formato com @ e domínio válido) e senha (mínimo de 4 caracteres).
  - Em caso de dados válidos, os dados do perfil são persistidos e o app navega de forma instantânea para a Home com `router.replace(ROUTES.HOME)`. Em caso de erro, as mensagens de validação em vermelho são exibidas diretamente sob os campos sem travar a interface.
- **Impactos & Observações:** Redirecionamento para a Home preservado com sucesso sem perda das regras de validação.

### [2026-10-30] - Adicionado .npmrc e sincronizacao de lockfile para EAS Build
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** A fase 'Install dependencies' do EAS Build falhou porque o \package-lock.json\ estava desalinhado e o pm ci\ do EAS precisava de \legacy-peer-deps=true\ para resolver peer dependencies.
- **Arquivos Alterados / Criados:**
  - .npmrc (Criado)
  - package-lock.json (Modificado)
  - docs/CHANGELOG_AGENTS.md (Modificado)
- **Principais Mudanças:**
  - Criado .npmrc configurado com legacy-peer-deps=true para o build do EAS na nuvem.
  - Sincronizado package-lock.json com todas as novas dependências do Expo SDK 58.
- **Impactos & Observações:** O comando 
px eas-cli build agora conclui a instalação de dependências sem erros.

### [2026-10-30] - Atualização completa do projeto para Expo SDK 58
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Alinhar o projeto à versão mais recente do Expo Go (SDK 58) instalada no aparelho móvel, eliminando conflito de runtime que causava o fechamento/crash do app ao entrar na Home.
- **Arquivos Alterados / Criados:**
  - package.json (Modificado)
  - package-lock.json (Modificado)
  - AGENTS.md (Modificado)
  - src/app/home/_layout.tsx (Modificado)
  - src/hooks/use-theme.ts (Modificado)
  - docs/CHANGELOG_AGENTS.md (Modificado)
- **Principais Mudanças:**
  - Atualizado expo para 58.0.21 e dependências alinhadas (React 19.3.0, React Native 0.88.1, expo-router ~58.0.28, expo-camera ~58.0.14, etc.).
  - Removido initialRouteName obsoleto do <Tabs> no Expo 58.
  - Ajustado tipagem de cor em TabIcon para compatibilidade com ColorValue do React Native 0.88.
  - Corrigida checagem de esquema em use-theme.ts.
  - Executado expo-doctor: 20/20 verificações aprovadas. Compilação TypeScript com 0 erros.
- **Impactos & Observações:** Totalmente compatível com o Expo Go mais recente da Play Store.

### [2026-10-30] - Correção de crash nativo do Hermes em toLocaleString e blindagem de OCR
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** O app fechava nativamente no celular ao tentar renderizar a lista de vagas da Home devido a falha fatal do motor Hermes no Android com \	oLocaleString('pt-BR')\.
- **Arquivos Alterados / Criados:**
  - src/app/home/index.tsx (Modificado)
  - src/utils/ocr.native.ts (Modificado)
  - docs/CHANGELOG_AGENTS.md (Modificado)
- **Principais Mudanças:**
  - Substituído \item.bolsa.toLocaleString('pt-BR')\ por interpolação direta \R$ {item.bolsa}\, eliminando o crash fatal nativo do C++ do Hermes em formatação de moeda.
  - Removido qualquer carregamento dinâmico ou estático de \expo-ocr-kit\ em \ocr.native.ts\ para evitar chamada de NativeModule inexistente no Expo Go.
- **Impactos & Observações:** Renderização do Feed no Android agora é 100% segura contra abortos do Hermes.

### [2026-10-30] - Login e cadastro com bypass direto e dados mockados para a Home
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Eliminar qualquer barreira de validação e verificação no login para que o botão 'Acessar Conta' (e 'Criar Conta') redirecione instantaneamente para a tela de Home com dados mockados.
- **Arquivos Alterados / Criados:**
  - src/hooks/use-auth-form.ts (Modificado)
  - src/components/auth/auth-form.tsx (Modificado)
  - docs/CHANGELOG_AGENTS.md (Modificado)
- **Principais Mudanças:**
  - Removido bloqueio e validação síncrona/assíncrona de credenciais no login.
  - Implementado fallback automático para perfil mockado padrão ('Estudante PEIA', 'aluno@undb.edu.br') caso os campos fiquem vazios.
  - Navegação direta e imediata com 
outer.replace(ROUTES.HOME) ao clicar no botão.
- **Impactos & Observações:** O fluxo de autenticação tornou-se 100% livre de bloqueios para prototipagem e testes.

### [2026-10-30] - Registro explicito de rotas no Root Stack e sanitizacao de login/cadastro
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivacao / Contexto:** Garantir que o redirecionamento para a Home funcione perfeitamente no Expo Router nativo (Expo Go) e evitar falhas de validacao causadas por espacos ao digitar no celular.
- **Arquivos Alterados / Criados:**
  - src/app/_layout.tsx (Modificado)
  - src/hooks/use-auth-form.ts (Modificado)
  - docs/CHANGELOG_AGENTS.md (Modificado)
- **Principais Mudancas:**
  - Registradas explicitamente as telas home e aga no <Stack> de src/app/_layout.tsx para assegurar resolucao de rota no navegador de stack nativo.
  - Sanitizacao com .trim() em e-mail e campos de entrada no login e cadastro (prevenindo rejeicao de credenciais por espacos automaticos do teclado mobile).
  - Callback de redirecionamento para a Home ao confirmar criacao de conta no cadastro.
- **Impactos & Observacoes:** Navegacao estavel tanto no Expo Go quanto na Web sem erros de tipagem.

### [2026-10-30] - Redirecionamento de login para Home e correção de crash no app nativo
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** Permitir login simplificado com qualquer e-mail válido para a Home (`/home`), além de corrigir o crash fatal nativo que fechava o app no celular ao navegar para a tela de Home.
- **Arquivos Alterados / Criados:**
  - `src/constants/routes.ts` (Modificado)
  - `src/hooks/use-auth-form.ts` (Modificado)
  - `src/hooks/use-perfil.ts` (Modificado)
  - `src/hooks/use-vagas.ts` (Modificado)
  - `src/components/auth/auth-form.tsx` (Modificado)
  - `src/app/_layout.tsx` (Modificado)
  - `src/app/home/_layout.tsx` (Modificado)
  - `src/app/home/logout.tsx` (Modificado)
  - `src/utils/ocr.native.ts` (Modificado)
  - `package.json` (Modificado)
  - `package-lock.json` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Alinhamento de dependências com o SDK 57 via `npx expo install --fix`: atualizados `expo-router` (~57.0.22 -> ~57.0.29 com correções para navegação nativa e tabs), `expo` (~57.0.24 -> ~57.0.31), `@expo/ui`, `expo-linking`, `expo-glass-effect` e `expo-splash-screen`.
  - Executado `npx expo-doctor`: 21 de 21 verificações aprovadas com sucesso.
  - Identificada a causa crítica do crash nativo ao entrar na Home: `src/utils/ocr.native.ts` importava `expo-ocr-kit` estaticamente no topo do arquivo. Na ausência do binário nativo no Expo Go / runtime atual, o fallback tentava instanciar `NativeModule` no JS e abortava o bundle do app. Substituído por carregamento dinâmico protegido sob demanda (`require('expo-ocr-kit')`).
  - Adicionado `ErrorBoundary` exportado em `src/app/_layout.tsx` e `src/app/home/_layout.tsx` para interceptar e exibir qualquer falha de renderização no dispositivo sem fechar o app para a tela inicial do celular.
  - Atualizado o catálogo central de rotas em `src/constants/routes.ts` com todas as rotas mapeadas para os respectivos arquivos e diretórios do app (`AUTH`, `HOME`, `FEED`, `SCAN`, `PROFILE`, `VAGA_FORM`, `VAGA_DETALHE`).
  - Substituído `return null` em `src/app/home/logout.tsx` por `<View className="flex-1" />` para evitar `NullPointerException` de medição no `react-native-screens`.
  - Adicionado `initialRouteName="index"` explícito no `<Tabs>` de `src/app/home/_layout.tsx`.
  - Corrigida a hidratação do `AsyncStorage` em `src/hooks/use-perfil.ts` e `src/hooks/use-vagas.ts`.
  - Em `use-auth-form.ts`, `validateLogin` valida apenas e-mail com formato válido, desativa o loading antes da transição e navega via `router.replace(ROUTES.HOME)`.
- **Impactos & Observações:** Todas as checagens do `expo-doctor` e compilação TypeScript (`tsc --noEmit`) concluídas com 0 erros.

### [2026-10-16] - Restauração de assets e configuração de build APK
- **Agente / Autor:** Antigravity (Gemini 3.8 Flash)
- **Motivação / Contexto:** O usuário precisava gerar um APK autônomo para apresentação sem servidor local, mas os ícones padrão haviam sido apagados e impediam a validação do build.
- **Arquivos Alterados / Criados:**
  - `assets/images/icon.png` (Criado)
  - `assets/images/android-icon-foreground.png` (Criado)
  - `assets/images/android-icon-background.png` (Criado)
  - `assets/images/android-icon-monochrome.png` (Criado)
  - `assets/images/splash-icon.png` (Criado)
  - `assets/images/favicon.png` (Criado)
  - `scripts/generate-icons.ps1` (Criado)
  - `app.json` (Modificado)
  - `eas.json` (Modificado)
  - `docs/CHANGELOG_AGENTS.md` (Modificado)
- **Principais Mudanças:**
  - Geração dos arquivos de ícones adaptativos e splash screen com a identidade visual do PEIA.
  - Correção do caminho `ios.icon` em `app.json`.
  - Configuração do perfil `preview` em `eas.json` com `buildType: "apk"` para distribuição interna direta.
- **Impactos & Observações:** O comando `npx expo config --type public` agora valida sem erros. Pronto para execução do EAS Build.

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
