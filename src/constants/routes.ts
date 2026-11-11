/**
 * Catálogo e constantes de rotas do aplicativo PEIA.
 * No Expo Router (Native), cada rota corresponde diretamente a um arquivo/diretório em `src/app/`.
 */

export const ROUTES = {
  // Tela inicial: Login e Cadastro (src/app/index.tsx)
  AUTH: '/',

  // Navegador Home / Feed de Vagas (src/app/home/index.tsx via src/app/home/_layout.tsx)
  HOME: '/home',
  FEED: '/home',

  // Aba de Escaneamento de Currículo (src/app/home/scan.tsx)
  SCAN: '/home/scan',

  // Aba de Conversas e Feedbacks das Candidaturas (src/app/home/conversas.tsx)
  CONVERSAS: '/home/conversas',

  // Aba de Cadastro de Empresas Parceiras (src/app/home/companies.tsx)
  COMPANIES: '/home/companies',

  // Aba de Perfil do Usuário (src/app/home/profile.tsx)
  PROFILE: '/home/profile',

  // Configurações da Plataforma e CRUD da Conta User (src/app/configuracoes.tsx)
  CONFIGURACOES: '/configuracoes',

  // Formulário de Criação/Edição de Vaga (src/app/vaga/form.tsx)
  VAGA_FORM: '/vaga/form',

  // Detalhes da Vaga (src/app/vaga/[id].tsx)
  VAGA_DETALHE: '/vaga/[id]',

  // Painel Administrativo de Gestão de Usuários (src/app/admin/usuarios.tsx)
  GESTAO_USUARIOS: '/admin/usuarios',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
