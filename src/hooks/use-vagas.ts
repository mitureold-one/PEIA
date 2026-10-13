import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { VAGAS, type Vaga } from '@/data/vagas';

const KEY = 'peia:vagas';

// Store global mínimo: feed, detalhe e formulário compartilham a mesma lista.
let vagas: Vaga[] = VAGAS;
const listeners = new Set<() => void>();

const commit = (next: Vaga[]) => {
  vagas = next;
  listeners.forEach((l) => l());
  AsyncStorage.setItem(KEY, JSON.stringify(next));
};

// Expo Router renders routes on the server for web; AsyncStorage's web
// implementation needs `window`, so only hydrate when running in a client.
if (typeof window !== 'undefined') {
  AsyncStorage.getItem(KEY).then((v) => {
    if (v) {
      vagas = JSON.parse(v);
      listeners.forEach((l) => l());
    }
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const patch = (id: string, changes: Partial<Vaga>) =>
  commit(vagas.map((v) => (v.id === id ? { ...v, ...changes } : v)));

export const vagasActions = {
  criar: (dados: Omit<Vaga, 'id'>) => commit([{ ...dados, id: Date.now().toString() }, ...vagas]),
  editar: (id: string, dados: Omit<Vaga, 'id'>) => patch(id, dados),
  arquivar: (id: string, arquivada: boolean) => patch(id, { arquivada }),
  // Soft delete: mantém o registro, só marca a data de exclusão.
  excluir: (id: string) => patch(id, { excluidaEm: new Date().toISOString() }),
};

/** Vagas não excluídas (ativas e arquivadas). */
export const useVagas = () => useSyncExternalStore(subscribe, () => vagas).filter((v) => !v.excluidaEm);
