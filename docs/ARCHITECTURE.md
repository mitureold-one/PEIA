# Arquitetura e Estrutura Básica do Projeto PEIA

Este documento descreve a arquitetura técnica, convenções de código e a organização do projeto **PEIA**, servindo como referência fundamental para desenvolvedores e agentes autônomos de IA.

---

## 1. Visão Geral do Projeto

O **PEIA** é um aplicativo mobile focado na gestão, busca e publicação de vagas de estágio para estudantes universitários, além de fluxos de autenticação com separação de personas, escaneamento/leitura de currículo via OCR, cadastro de empresas parceiras e painel de gestão de usuários.

### Stack Tecnológica
- **Framework Mobile:** [Expo](https://expo.dev) `~58.0.21` (SDK 58)
- **Runtime:** [React Native](https://reactnative.dev) `0.88.1` / [React](https://react.dev) `19.3.0`
- **Roteamento:** [Expo Router](https://docs.expo.dev/router/introduction/) `~58.0.28` (Roteamento baseado no sistema de arquivos)
- **Estilização:** [NativeWind](https://www.nativewind.dev/) `^4.2.7` + [TailwindCSS](https://tailwindcss.com/) `^3.4.17`
- **Persistência Local Primária:** [Expo SQLite](https://docs.expo.dev/versions/v58.0.0/sdk/sqlite/) `~58.0.15` (Banco relacional local `peia.db`)
- **Persistência Local Secundária (Fallback):** `@react-native-async-storage/async-storage` `2.2.0`
- **Processamento de Currículo & OCR:** `expo-ocr-kit` `0.1.4` (Nativo) e `tesseract.js` `^7.0.0` + `pdfjs-dist` `^5.4.624` (Web)
- **Ícones:** `@expo/vector-icons` (Ionicons)
- **Linguagem:** TypeScript `~6.0.3` com tipagem e checagem estritas

---

## 2. Estrutura de Diretórios

```text
PEIA/
├── assets/                    # Imagens estáticas, fontes e ícones adaptativos do app
├── docs/                      # Documentação de arquitetura, guias e governança de agentes
│   ├── ARCHITECTURE.md        # Este documento (visão arquitetural e estrutural)
│   ├── CHANGELOG_AGENTS.md    # Registro mandatório de mudanças realizadas por agentes
│   └── GIT_COLLABORATION_GUIDE.md # Normas de sincronia no Git/GitHub
├── scripts/                   # Scripts utilitários de build e automação
├── src/
│   ├── app/                   # Rotas e telas do Expo Router (File-based Routing)
│   │   ├── _layout.tsx        # Layout raiz com tema escuro/claro e Stack principal
│   │   ├── index.tsx          # Tela pública de login e cadastro (Auth com atalhos de demo)
│   │   ├── admin/             # Módulo Administrativo (Restrito a Admin e Super Admin)
│   │   │   ├── _layout.tsx    # Stack de navegação do módulo de administração
│   │   │   └── usuarios.tsx   # Painel de gestão e cadastro interno hierárquico
│   │   ├── configuracoes.tsx  # CRUD de dados cadastrais, alteração de foto de perfil e encerramento de conta
│   │   ├── home/              # Área logada principal (Tabs adaptativas por perfil)
│   │   │   ├── _layout.tsx    # Configuração das Tabs com exibição dinâmica por persona
│   │   │   ├── index.tsx      # Feed principal com busca e filtros de vagas
│   │   │   ├── scan.tsx       # Leitura e extração de currículos (Câmera, Imagem ou PDF)
│   │   │   ├── conversas.tsx  # Central de feedback de candidaturas, diagnóstico IA e chat
│   │   │   ├── companies.tsx  # Cadastro local de empresas parceiras (Coordenação/Admin)
│   │   │   └── profile.tsx    # Perfil modular das subclasses (Estudante, Empresa, Coordenação)
│   │   └── vaga/              # Rotas dinâmicas e formulários de vagas
│   │       ├── _layout.tsx    # Stack de navegação de vagas
│   │       ├── [id].tsx       # Detalhes da vaga, candidatura do aluno e restrições
│   │       └── form.tsx       # Anúncio de novas vagas (exclusivo para perfil Empresa)
│   ├── components/            # Componentes visuais modulares e reutilizáveis
│   │   ├── auth/              # Formulários, atalhos rápidos, transição de loading e cabeçalhos de autenticação
│   │   ├── companies/         # Componentes modulares da tela de empresas (Form, List, Card, Header)
│   │   ├── conversas/         # Cards de feedback, diagnóstico de currículo e chat de candidaturas
│   │   ├── curriculo/         # Gestão de currículo geral e modais de candidatura direcionada
│   │   ├── home/              # Header, filtros, cards e empty state do feed de vagas
│   │   ├── profile/           # Componentes modulares da tela de perfil (Views por persona, Header, Info, Counters, PhotoModal, AcademicEditModal, MetricModals, Summary, Education, Experience, Skills, Wall, Interests, Admin)
│   │   ├── scan/              # Componentes modulares de leitura de currículo (Header, Tabs de modo, Câmera, Arquivo, Feedback, Preview)
│   │   └── ui/                # Primitivos de UI acessíveis (Button, Input, AlertModal, ThemeToggle, ProfileMetricDialogModal)
│   ├── constants/             # Constantes globais
│   │   ├── routes.ts          # Nomes e caminhos tipados de rotas (`ROUTES`)
│   │   └── theme.ts           # Definições de cores e tokens de tema
│   ├── data/                  # Entidades de domínio, schemas e mocks
│   │   ├── avaliacoes.ts      # Modelagem de Avaliações, Recomendações e depoimentos
│   │   ├── curriculo.ts       # Modelagem de Currículo Geral (Master) e Currículo Direcionado para Vaga
│   │   ├── feedback.ts        # Modelagem de Diagnóstico IA, Match Score e Mensagens de Candidatura
│   │   ├── social.ts          # Entidades e listas base de empresas recomendadas e conexões de estudantes
│   │   ├── user.ts            # Entidade de domínio User e personas (Aluno, Empresa, Admin, Super Admin)
│   │   └── vagas.ts           # Interface Vaga, constantes de áreas, modalidades e mocks
│   ├── hooks/                 # Custom hooks e stores de estado reativos
│   │   ├── use-auth.ts        # Caso de uso de autenticação e orquestração de usuário
│   │   ├── use-auth-form.ts   # Lógica e validação da interface de autenticação
│   │   ├── use-conversas.ts   # Store reativo de conversas e diagnósticos de candidatura
│   │   ├── use-profile-form.ts# Orquestração de estado e validação do formulário de perfil
│   │   ├── use-profile-student-header.ts # Orquestração de dados, filtros A-Z e modais do cabeçalho do estudante
│   │   ├── use-vagas-feed.ts  # Orquestração de busca e filtros do feed de vagas
│   │   ├── use-companies-management.ts # Lógica e formulário de empresas conveniadas
│   │   ├── use-curriculo-scanner.ts    # Orquestração de câmera, arquivo e OCR
│   │   ├── use-user-role.ts   # Papel ativo no protótipo (estudante, empresa, coordenacao)
│   │   ├── use-vagas.ts       # Store global reativo de vagas integrado ao vagasService
│   │   ├── use-curriculo.ts   # Store global reativo do currículo geral e currículos direcionados de vagas
│   │   ├── use-avaliacoes.ts  # Store reativo do mural de recomendações e feedbacks de empresas e docentes
│   │   ├── use-estudante-social.ts # Store de interesses, empresas seguidas e conexões sociais do estudante
│   │   ├── use-perfil.ts      # Store global reativo do perfil da sessão ativa
│   │   ├── use-empresas.ts    # Store de empresas parceiras cadastradas
│   │   ├── use-inscricoes.ts  # Store de candidaturas dos estudantes nas vagas
│   │   ├── use-theme.ts       # Acesso e controle do tema claro/escuro
│   │   └── use-color-scheme.ts# Wrapper para detecção de tema do sistema
│   ├── services/              # Camada de serviços e persistência
│   │   ├── curriculo-service.ts # Persistência de currículos no SQLite com fallback transparente
│   │   ├── feedback-service.ts  # Persistência de conversas e feedbacks de candidatura no SQLite
│   │   ├── user-service.ts    # Persistência de usuários (SQLite com fallback transparente)
│   │   └── vagas-service.ts   # Persistência de vagas (SQLite com fallback transparente)
│   ├── utils/                 # Funções auxiliares puras e OCR agnóstico de plataforma
│   │   ├── ocr.ts             # Interface unificada de extração de texto de currículos
│   │   ├── ocr.native.ts      # Extração nativa em Android/iOS usando expo-ocr-kit
│   │   ├── ocr.web.ts         # Extração web usando Tesseract.js e PDF.js
│   │   ├── file-validators.ts # Validação de arquivos (MIME types, tamanho máx 5MB, extensão)
│   │   └── validators.ts      # Validadores de e-mail institucional, senha, telefone, etc.
│   └── global.css             # Importação de diretivas Tailwind do NativeWind
├── AGENTS.md                  # Instruções e regras mandatórias para Agentes de IA
├── app.json                   # Configurações do Expo SDK 58 e EAS Build
├── eas.json                   # Perfis de build para Android APK e Dev Client
├── package.json               # Dependências do ecossistema Expo 58
├── tailwind.config.js         # Configurações do TailwindCSS
└── tsconfig.json              # Configurações do TypeScript e alias `@/*` -> `./src/*`
```

---

## 3. Padrões de Arquitetura e Engenharia

### 3.1. Roteamento (Expo Router v4 / SDK 58)
- Toda rota é mapeada a partir de arquivos dentro de `src/app/`.
- **Rotas Públicas:** `/` (Autenticação e cadastro com atalhos para teste).
- **Rotas Autenticadas (Tabs):** `/home` (`index.tsx`, `scan.tsx`, `conversas.tsx`, `companies.tsx`, `profile.tsx`).
  - As abas da barra inferior adaptam-se dinamicamente conforme o papel (`role`):
    - **Estudante:** Vê "Estágios", "Escanear", "Conversas" e "Perfil".
    - **Empresa:** Vê "Vagas" e "Perfil" (abas de escanear currículo e conversas são ocultas).
    - **Coordenação:** Vê "Oportunidades", "Empresas" e "Perfil".
    - O logout foi desacoplado da barra de abas e agora é acionado nas Configurações da Conta (`/configuracoes`).
- **Rotas Administrativas:** `/admin/usuarios` (Protegida por checagem de perfil: apenas `admin` e `superadmin`).
- **Rotas de Configuração da Conta:** `/configuracoes` (Acessível pelo Avatar do usuário no Header; gerencia o CRUD da conta `User`, foto de perfil e encerramento de sessão).
- **Rotas de Vagas:** `/vaga/[id]` (Detalhes e inscrição) e `/vaga/form` (Criação de novas vagas).
- **Atenção:** Consulte sempre a documentação oficial da versão `v58.0.0` do Expo: https://docs.expo.dev/versions/v58.0.0/

### 3.2. Persistência Resiliente (SQLite Nativo + Fallback Automático para AsyncStorage)
Para garantir alta performance em produção sem quebrar o ambiente de desenvolvimento (Expo Go, web ou ambientes onde o módulo nativo C++ não está compilado), o projeto adota uma arquitetura em duas camadas:
1. **Detecção e Proteção:** Os serviços (`user-service.ts` e `vagas-service.ts`) utilizam `requireOptionalNativeModule('ExpoSQLite')` para verificar previamente se o módulo binário do SQLite está linkado.
2. **Ambiente com SQLite compilado (Dev Client / APK standalone):**
   - Cria tabelas relacionais no banco `peia.db` (`users` com suporte a `role` e `avatar`, e `vagas`).
   - Executa consultas SQL estruturadas com transações seguras e sincronização via `userService.save()`.
3. **Ambiente sem SQLite compilado (Expo Go genérico / Web):**
   - Redireciona as operações de leitura e escrita silenciosamente para o `@react-native-async-storage/async-storage` sem disparar logs de advertência ou erros não capturados.
4. **Reatividade na Interface:** O gerenciamento do estado na UI utiliza o hook nativo `useSyncExternalStore`, garantindo atualizações instantâneas de tela sem overhead de bibliotecas pesadas de estado global.

### 3.3. Separação de Perfis (Personas) e Regras de Negócio
O sistema adota a entidade de domínio `User` (`src/data/user.ts`) com hierarquia clara:
- **Aluno (Estudante - Subclasse `Aluno extends User`):**
  - Cadastro público permitido e modelagem orientada a objetos com a subclasse `Aluno`.
  - Encapsula campos acadêmicos próprios (`cargo`, `instituicao`, `curso`, `abertoOportunidades`) com operações CRUD e persistência no SQLite e store reativo.
  - Pode buscar e filtrar vagas no feed.
  - Pode escanear ou carregar currículo para preenchimento automático.
  - Pode se candidatar a vagas de estágio (inscrições salvas localmente).
- **Empresa:**
  - Cadastro realizado via administração/coordenação ou seleção de persona.
  - Pode publicar novas vagas de estágio pelo formulário.
  - **Restrição:** Não tem permissão para editar, arquivar ou excluir anúncios existentes.
- **Administrador (Coordenação):**
  - Acesso à aba de cadastro de empresas parceiras.
  - Acesso ao Painel de Gestão de Usuários (`/admin/usuarios`).
  - Pode cadastrar novas Empresas e novos Alunos.
- **Super Administrador:**
  - Nível mais alto da hierarquia.
  - Pode cadastrar Administradores, Empresas e Alunos.

### 3.4. Extração de Currículo por OCR
A funcionalidade de leitura de currículo suporta múltiplos formatos de forma agnóstica de plataforma:
- **Mobile Nativo:** Captura via câmera do dispositivo ou galeria com OCR local em alta velocidade através do `expo-ocr-kit`.
- **Web:** Extração de texto de arquivos PDF (via `pdfjs-dist`) e imagens (via `tesseract.js`) diretamente no navegador, sem tráfego de imagens para servidores externos.

### 3.5. Estilização com NativeWind v4 e Suporte a Tema Escuro
- Estilização utilitária declarativa com TailwindCSS v3 (`className="..."`).
- Tema escuro completo em todas as telas com classes prefixadas por `dark:` (ex: `bg-slate-50 dark:bg-[#03031b]`).
- Alternância de tema via `useColorScheme()` e componente `ThemeToggle` (`src/components/ui/theme-toggle.tsx`).

### 3.6. Acessibilidade e Boas Práticas
- Todos os botões e áreas interativas possuem `accessibilityRole="button"` e rótulos acessíveis (`accessibilityLabel`).
- Formulários utilizam `KeyboardAvoidingView` e `keyboardShouldPersistTaps="handled"` para digitação confortável em qualquer dispositivo.

---

## 4. Importações e Aliases

O projeto está configurado com path mapping em `tsconfig.json`:
- `@/*` aponta diretamente para `./src/*`
- Exemplo: `import { Button } from '@/components/ui/button';`
