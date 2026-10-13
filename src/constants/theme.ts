/**
 * Definições e padrões de cores do aplicativo PEIA para temas claro e escuro.
 */

export const Colors = {
  light: {
    text: '#0f172a',
    textSecondary: '#64748b',
    background: '#f8fafc',
    card: '#ffffff',
    cardBorder: '#e2e8f0',
    primary: '#6366f1',
    primaryText: '#ffffff',
    inputBg: '#ffffff',
    inputBorder: '#cbd5e1',
  },
  dark: {
    text: '#ffffff',
    textSecondary: '#94a3b8',
    background: '#03031b',
    card: '#0b0f24',
    cardBorder: '#1e293b',
    primary: '#6366f1',
    primaryText: '#ffffff',
    inputBg: '#020617',
    inputBorder: '#1e293b',
  },
} as const;

export type ThemeType = 'light' | 'dark';
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
