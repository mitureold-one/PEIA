import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

export interface EmpresaCadastrada {
  id: string;
  nome: string;
  email: string;
}

const KEY = 'peia:empresas';
let empresas: EmpresaCadastrada[] = [];
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  AsyncStorage.getItem(KEY).then((value) => {
    if (value) empresas = JSON.parse(value);
    listeners.forEach((listener) => listener());
  });
}

const commit = (next: EmpresaCadastrada[]) => {
  empresas = next;
  listeners.forEach((listener) => listener());
  void AsyncStorage.setItem(KEY, JSON.stringify(next));
};

export function useEmpresas() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => empresas,
  );
}

export const empresasActions = {
  criar: (dados: Omit<EmpresaCadastrada, 'id'>) =>
    commit([{ ...dados, id: Date.now().toString() }, ...empresas]),
};
