import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import type { UserRole } from '@/data/user';

const KEY = 'peia:perfil';

export interface Perfil {
  name: string;
  surname: string;
  email: string;
  phone: string;
  role?: UserRole;
  excluidoEm?: string;
}

// Mesmo padrão de use-vagas: store global mínimo persistido.
let perfil: Perfil | null = null;
const listeners = new Set<() => void>();

const commit = (next: Perfil | null) => {
  perfil = next;
  listeners.forEach((l) => l());
  AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
};

// Evita execução durante SSR no Node (web) e hidrata no cliente e no app nativo.
if (Platform.OS !== 'web' || typeof window !== 'undefined') {
  AsyncStorage.getItem(KEY)
    .then((v) => {
      if (v) {
        try {
          perfil = JSON.parse(v);
          listeners.forEach((l) => l());
        } catch {
          // formato inválido ignorado
        }
      }
    })
    .catch(() => {});
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const perfilActions = {
  obter: () => (perfil && !perfil.excluidoEm ? perfil : null),
  criar: (dados: Omit<Perfil, 'excluidoEm'>) => commit(dados),
  editar: (dados: Omit<Perfil, 'excluidoEm'>) => commit({ ...dados }),
  // Soft delete: mantém o registro, só marca a data de exclusão.
  excluir: () => perfil && commit({ ...perfil, excluidoEm: new Date().toISOString() }),
};

/** Perfil ativo (null se não existe ou foi excluído). */
export const usePerfil = () => {
  const p = useSyncExternalStore(subscribe, () => perfil);
  return p && !p.excluidoEm ? p : null;
};
