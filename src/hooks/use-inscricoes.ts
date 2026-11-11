import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

const KEY = 'peia:inscricoes';
let inscricoes: string[] = [];
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

// Hidratação segura no mobile nativo e na web
if (Platform.OS !== 'web' || typeof window !== 'undefined') {
  AsyncStorage.getItem(KEY)
    .then((value) => {
      if (value) {
        try {
          inscricoes = JSON.parse(value);
          notify();
        } catch {
          // Formato inválido ignorado
        }
      }
    })
    .catch(() => {});
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
    notify();
    void AsyncStorage.setItem(KEY, JSON.stringify(inscricoes)).catch(() => {});
  },
  cancelar: (vagaId: string) => {
    inscricoes = inscricoes.filter((id) => id !== vagaId);
    notify();
    void AsyncStorage.setItem(KEY, JSON.stringify(inscricoes)).catch(() => {});
  },
};
