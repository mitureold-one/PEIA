import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

export type UserRole = 'empresa' | 'estudante' | 'coordenacao';
export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'estudante', label: 'Estudante' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'coordenacao', label: 'Coordenação' },
];

const KEY = 'peia:tipo-usuario';
let role: UserRole = 'estudante';
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  AsyncStorage.getItem(KEY).then((value) => {
    if (value === 'empresa' || value === 'estudante' || value === 'coordenacao') {
      role = value;
      listeners.forEach((listener) => listener());
    }
  });
}

export const userRoleActions = {
  definir: (next: UserRole) => {
    role = next;
    listeners.forEach((listener) => listener());
    void AsyncStorage.setItem(KEY, next);
  },
};

export function useUserRole() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => role,
  );
}
