import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

const KEY = 'peia:inscricoes';
let inscricoes: string[] = [];
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  AsyncStorage.getItem(KEY).then((value) => {
    if (value) inscricoes = JSON.parse(value);
    listeners.forEach((listener) => listener());
  });
}

export function useInscricoes() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => inscricoes,
  );
}

export const inscricoesActions = {
  inscrever: (vagaId: string) => {
    if (inscricoes.includes(vagaId)) return;
    inscricoes = [...inscricoes, vagaId];
    listeners.forEach((listener) => listener());
    void AsyncStorage.setItem(KEY, JSON.stringify(inscricoes));
  },
};
