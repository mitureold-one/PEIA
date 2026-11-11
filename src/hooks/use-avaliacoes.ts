import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type AvaliacaoEstudante, AVALIACOES_INICIAIS } from '@/data/avaliacoes';

const STORAGE_KEY = 'peia:avaliacoes_estudante';

let avaliacoes: AvaliacaoEstudante[] = [...AVALIACOES_INICIAIS];
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

const persist = async (lista: AvaliacaoEstudante[]) => {
  avaliacoes = lista;
  notify();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch {
    // Ignora erro de gravação local
  }
};

// Hidratação segura
if (Platform.OS !== 'web' || typeof window !== 'undefined') {
  AsyncStorage.getItem(STORAGE_KEY)
    .then((stored) => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            avaliacoes = parsed;
            notify();
          }
        } catch {
          // Mantém as iniciais
        }
      }
    })
    .catch(() => {});
}

export function useAvaliacoes() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => avaliacoes
  );
}

export const avaliacoesActions = {
  adicionar: (dados: Omit<AvaliacaoEstudante, 'id' | 'data'>) => {
    const nova: AvaliacaoEstudante = {
      ...dados,
      id: `av_${Date.now()}`,
      data: new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date()),
    };
    persist([nova, ...avaliacoes]);
    return nova;
  },

  remover: (id: string) => {
    persist(avaliacoes.filter((a) => a.id !== id));
  },
};
