# Arquitetura e Estrutura Básica do Projeto PEIA

Este documento descreve a arquitetura técnica, convenções de código e a organização do projeto **PEIA**, servindo como referência fundamental para desenvolvedores e agentes autônomos de IA.

---

## 1. Visão Geral do Projeto

O **PEIA** é um aplicativo mobile focado na gestão, busca e publicação de vagas de estágio para estudantes universitários, além de fluxos de autenticação, escaneamento/validação e perfil de usuário.

### Stack Tecnológica
- **Framework Mobile:** [Expo](https://expo.dev) `~57.0.24` (SDK 57)
- **Runtime:** [React Native](https://reactnative.dev) `0.86.3` / [React](https://react.dev) `19.2.3`
- **Roteamento:** [Expo Router](https://docs.expo.dev/router/introduction/) `~57.0.22` (Roteamento baseado no sistema de arquivos)
- **Estilização:** [NativeWind](https://www.nativewind.dev/) `^4.2.7` + [TailwindCSS](https://tailwindcss.com/) `^3.4.17`
- **Persistência Local:** `@react-native-async-storage/async-storage` `2.2.0`
- **Ícones:** `@expo/vector-icons` (Ionicons)
- **Linguagem:** TypeScript `~6.0.3` com checagem estrita

---

## 2. Estrutura de Diretórios

```text
PEIA/
├── assets/                    # Imagens estáticas, fontes e ícones do app
├── docs/                      # Documentação de arquitetura, guias e changelog de agentes
│   ├── ARCHITECTURE.md        # Este documento (estrutura e arquitetura)
│   ├── CHANGELOG_AGENTS.md    # Registro mandatório de mudanças realizadas por agentes
│   └── GIT_COLLABORATION_GUIDE.md # Normas de sincronia no Git/GitHub
├── scripts/                   # Scripts utilitários de suporte ao desenvolvimento
├── src/
│   ├── app/                   # Rotas e telas do Expo Router (File-based Routing)
│   │   ├── _layout.tsx        # Layout raiz com tema escuro/claro e Stack principal
│   │   ├── index.tsx          # Tela de login e cadastro (Auth inicial)
│   │   ├── home/              # Área logada (Tabs)
│   │   │   ├── _layout.tsx    # Configuração da barra inferior de navegação (Tabs)
│   │   │   ├── index.tsx      # Feed principal com busca e filtros de vagas
│   │   │   ├── scan.tsx       # Tela de escaneamento de credencial / QR code
│   │   │   ├── profile.tsx    # Tela de visualização e edição de perfil
│   │   │   └── logout.tsx     # Handler de saída de sessão
│   │   └── vaga/              # Rotas dinâmicas e formulários de vagas
│   │       ├── _layout.tsx    # Stack de navegação de vagas
│   │       ├── [id].tsx       # Detalhes, arquivamento e exclusão de vaga específica
│   │       └── form.tsx       # Criação e edição de vagas
│   ├── components/            # Componentes visuais modulares e reutilizáveis
│   │   ├── auth/              # Componentes de autenticação (Header, Form, Footer)
│   │   ├── home/              # Componentes específicos da Home (Header, etc.)
│   │   └── ui/                # Primitivos de UI (Button, Input, AlertModal, ThemeToggle)
│   ├── constants/             # Constantes globais
│   │   ├── routes.ts          # Nomes e caminhos tipados de rotas (`ROUTES`)
│   │   └── theme.ts           # Definições de cores e tokens de tema
│   ├── data/                  # Schemas, tipos e mocks de dados
│   │   └── vagas.ts           # Interface Vaga, constantes de áreas e modalidades, mock inicial
│   ├── hooks/                 # Custom hooks e stores de estado
│   │   ├── use-vagas.ts       # Store global reativo de vagas com persistência no AsyncStorage
│   │   ├── use-perfil.ts      # Store global reativo de perfil com persistência no AsyncStorage
│   │   ├── use-auth-form.ts   # Lógica e validação do formulário de autenticação
│   │   ├── use-theme.ts       # Acesso e controle de tema
│   │   └── use-color-scheme.ts# Wrapper para detecção de tema do sistema
│   ├── utils/                 # Funções auxiliares puras
│   │   └── validators.ts      # Validadores de e-mail, senha, telefone, etc.
│   └── global.css             # Importação de diretivas Tailwind do NativeWind
├── AGENTS.md                  # Instruções operacionais para Agentes de IA
├── app.json                   # Configurações do Expo
├── package.json               # Dependências e scripts npm
├── tailwind.config.js         # Configurações do TailwindCSS
└── tsconfig.json              # Configurações do TypeScript e alias `@/*` -> `./src/*`
```

---

## 3. Padrões de Arquitetura e Engenharia

### 3.1. Roteamento (Expo Router v4 / SDK 57)
- Toda rota é definida pelo nome do arquivo dentro de `src/app/`.
- Rotas dinâmicas utilizam colchetes, como `src/app/vaga/[id].tsx`.
- Para navegação imperativa, utilize `useRouter()` de `expo-router` ou valores constantes definidos em `src/constants/routes.ts`.
- **Atenção:** Leia sempre a documentação oficial da versão `v57.0.0` do Expo antes de introduzir novas APIs de roteamento.

### 3.2. Gerenciamento de Estado Minimalista (Sem Redux / Zustand)
- O projeto adota o padrão `useSyncExternalStore` combinado com `@react-native-async-storage/async-storage`:
  - **Single Source of Truth:** Uma variável em memória compartilhada com um `Set` de ouvintes reativos (`listeners`).
  - **Sincronia Automática:** Mudanças são persistidas de forma assíncrona no AsyncStorage através de uma função `commit()`.
  - **Soft Delete:** A remoção de itens (como vagas e perfis) prioriza o arquivamento ou a marcação de timestamp `excluidaEm` / `excluidoEm`, preservando o histórico e integridade dos dados.
  - **Regra:** Não adicione bibliotecas pesadas de estado global (Redux, MobX) a menos que explicitamente solicitado. Reutilize o padrão existente em `src/hooks/use-vagas.ts` e `src/hooks/use-perfil.ts`.

### 3.3. Estilização com NativeWind v4 e Suporte a Tema Escuro
- Utilize classes utilitárias via `className="..."`.
- O tema escuro é configurado nativamente com classes prefixadas por `dark:` (ex: `bg-slate-50 dark:bg-[#03031b]`).
- O estado de tema pode ser alternado via `useColorScheme()` do NativeWind e o componente `ThemeToggle` (`src/components/ui/theme-toggle.tsx`).

### 3.4. Acessibilidade e Boas Práticas
- Todos os botões e áreas interativas devem incluir `accessibilityRole="button"` e, caso não possuam texto explícito visível, `accessibilityLabel`.
- Inputs devem possuir rótulos acessíveis e comportamentos previsíveis com `KeyboardAvoidingView` e `keyboardShouldPersistTaps="handled"`.

---

## 4. Importações e Aliases

O projeto está configurado com path mapping em `tsconfig.json`:
- `@/*` aponta diretamente para `./src/*`
- Exemplo: `import { Button } from '@/components/ui/button';`
