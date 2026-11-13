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
  avatar?: string;
  cargo?: string;
  instituicao?: string;
  curso?: string;
  abertoOportunidades?: boolean;
  excluidoEm?: string;
}

const DEFAULT_PERFIL: Perfil = {
  name: 'John',
  surname: 'Doe',
  email: 'john.doe@aluno.undb.edu.br',
  phone: '(98) 98888-0001',
  role: 'aluno',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  cargo: 'Desenvolvedor Frontend Trainee',
  instituicao: 'Centro Universitário UNDB',
  curso: 'Engenharia de Software',
  abertoOportunidades: true,
};

// Mesmo padrão de use-vagas: store global mínimo persistido.
let perfil: Perfil | null = { ...DEFAULT_PERFIL };
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
          const parsed = JSON.parse(v);
          perfil = {
            ...DEFAULT_PERFIL,
            ...parsed,
          };
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
