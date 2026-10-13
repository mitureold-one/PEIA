/**
 * Configuração e constantes de rotas do aplicativo PEIA
 */

export const ROUTES = {
  AUTH: '/',
  // Rotas para expansão futura do aplicativo
  HOME: '/home',
  PROFILE: '/profile',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
