import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

const KEY = 'peia:perfil';

export interface Perfil {
  name: string;
  surname: string;
  email: string;
  phone: string;
  excluidoEm?: string;
}

// Mesmo padrão de use-vagas: store global mínimo persistido.
let perfil: Perfil | null = null;
const listeners = new Set<() => void>();

const commit = (next: Perfil | null) => {
  perfil = next;
  listeners.forEach((l) => l());
  AsyncStorage.setItem(KEY, JSON.stringify(next));
};

// Expo Router renders routes on the server for web; AsyncStorage's web
// implementation needs `window`, so only hydrate when running in a client.
if (typeof window !== 'undefined') {
  AsyncStorage.getItem(KEY).then((v) => {
    perfil = v ? JSON.parse(v) : null;
    listeners.forEach((l) => l());
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const perfilActions = {
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
