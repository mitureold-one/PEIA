import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import { VAGAS, type Vaga } from '@/data/vagas';
import { vagasService } from '@/services/vagas-service';

const KEY = 'peia:vagas';

// Store global mínimo: feed, detalhe e formulário compartilham a mesma lista em memória.
let vagas: Vaga[] = VAGAS;
const listeners = new Set<() => void>();

const commit = (next: Vaga[]) => {
  vagas = next;
  listeners.forEach((l) => l());
  AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
};

// Evita execução durante SSR no Node (web) e hidrata no cliente e no app nativo a partir do SQLite.
if (Platform.OS !== 'web' || typeof window !== 'undefined') {
  vagasService
    .listAll()
    .then((loaded) => {
      if (loaded && loaded.length > 0) {
        vagas = loaded;
        listeners.forEach((l) => l());
      }
    })
    .catch(() => {
      // Fallback suave para AsyncStorage caso o SQLite ainda não tenha sido iniciado
      AsyncStorage.getItem(KEY)
        .then((v) => {
          if (v) {
            try {
              vagas = JSON.parse(v);
              listeners.forEach((l) => l());
            } catch {
              // formato inválido ignorado
            }
          }
        })
        .catch(() => {});
    });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const patch = (id: string, changes: Partial<Vaga>) => {
  commit(vagas.map((v) => (v.id === id ? { ...v, ...changes } : v)));
  vagasService.update(id, changes).catch(() => {});
};

export const vagasActions = {
  criar: (dados: Omit<Vaga, 'id'>) => {
    const novaVaga: Vaga = { ...dados, id: Date.now().toString() };
    commit([novaVaga, ...vagas]);
    vagasService.save(novaVaga).catch(() => {});
  },
  editar: (id: string, dados: Omit<Vaga, 'id'>) => patch(id, dados),
  arquivar: (id: string, arquivada: boolean) => patch(id, { arquivada }),
  // Soft delete: mantém o registro no SQLite, apenas preenche o timestamp excluidaEm.
  excluir: (id: string) => patch(id, { excluidaEm: new Date().toISOString() }),
};

/** Vagas não excluídas (ativas e arquivadas). */
export const useVagas = () => useSyncExternalStore(subscribe, () => vagas).filter((v) => !v.excluidaEm);
