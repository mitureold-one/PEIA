# Diretrizes para Agentes de IA - Projeto PEIA

## 1. Expo 58 Obrigatório
> **Expo HAS CHANGED:** Leia a documentação exata da versão antes de escrever qualquer código:  
> https://docs.expo.dev/versions/v58.0.0/

---

## 2. Regra Mandatória: Documentação de Mudanças (Sincronia no GitHub)
Diferentes pessoas e agentes trabalham simultaneamente neste repositório. Para evitar conflitos de merge, perda de contexto e retrabalho:

1. **Antes de codificar:**
   - Leia a arquitetura e estrutura básica em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
   - Inspecione as últimas alterações registradas em [docs/CHANGELOG_AGENTS.md](docs/CHANGELOG_AGENTS.md) para entender o estado mais recente do código.
2. **Após qualquer alteração de código ou funcionalidade:**
   - **OBRIGATÓRIO:** Registre suas mudanças no topo do arquivo [docs/CHANGELOG_AGENTS.md](docs/CHANGELOG_AGENTS.md) utilizando o template padrão contido nele.
   - Detalhe: contexto, arquivos criados/modificados, lógica implementada e observações técnicas.
3. **Mantenha o menor diff possível:**
   - Não refatore arquivos fora do escopo da sua tarefa.
   - Siga as boas práticas de sincronização detalhadas em [docs/GIT_COLLABORATION_GUIDE.md](docs/GIT_COLLABORATION_GUIDE.md).

---

## 3. Resumo da Estrutura Básica Existente
- **Roteamento:** Expo Router v4 baseado em arquivos dentro de `src/app/`.
  - Telas existentes: Auth/Login (`/`), Feed de Vagas (`/home`), Escanear (`/home/scan`), Empresas Parceiras (`/home/companies`), Perfil (`/home/profile`), Detalhes de Vaga (`/vaga/[id]`), Formulário de Vaga (`/vaga/form`), Painel de Gestão de Usuários (`/admin/usuarios`).
- **Estado Global & Persistência:** Não use Redux ou Zustand. O repositório utiliza persistência resiliente em SQLite (`expo-sqlite` ~58) com fallback transparente para `@react-native-async-storage/async-storage` e padrão reativo `useSyncExternalStore` (veja `src/services/` e `src/hooks/`).
- **Perfis de Usuário:** Suporte a personas (Aluno/Estudante, Empresa, Administrador/Coordenação, Super Administrador) com controle de exibição de abas e ações.
- **Estilização:** NativeWind v4 (TailwindCSS) com suporte completo a tema escuro (`dark:`), paleta Indigo/Slate e componente `ThemeToggle`.
- **Componentes:** Primitivos reutilizáveis em `src/components/ui/` (`Button`, `Input`, `AlertModal`, `ThemeToggle`).
