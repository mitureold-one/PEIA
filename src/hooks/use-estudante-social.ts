import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'peia:estudante_social';

export interface EstudanteSocialState {
  interesses: string[];
  seguindoEmpresas: string[];
  seguindoUsuarios: string[];
}

const DEFAULT_STATE: EstudanteSocialState = {
  interesses: [
    'Desenvolvimento Frontend',
    'Mobile (React Native)',
    'Inteligência Artificial',
    'UI/UX Design',
    'Node.js & APIs',
  ],
  seguindoEmpresas: ['empresa_1', 'empresa_2'],
  seguindoUsuarios: ['user_2', 'user_3', 'user_4'],
};

let currentState: EstudanteSocialState = { ...DEFAULT_STATE };
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

const persist = async (next: EstudanteSocialState) => {
  currentState = next;
  notify();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignora erro de gravação local
  }
};

// Hidratação segura
if (Platform.OS !== 'web' || typeof window !== 'undefined') {
  AsyncStorage.getItem(STORAGE_KEY)
    .then((val) => {
      if (val) {
        try {
          const parsed = JSON.parse(val);
          currentState = {
            interesses: Array.isArray(parsed.interesses) ? parsed.interesses : DEFAULT_STATE.interesses,
            seguindoEmpresas: Array.isArray(parsed.seguindoEmpresas) ? parsed.seguindoEmpresas : DEFAULT_STATE.seguindoEmpresas,
            seguindoUsuarios: Array.isArray(parsed.seguindoUsuarios) ? parsed.seguindoUsuarios : DEFAULT_STATE.seguindoUsuarios,
          };
          notify();
        } catch {
          // Mantém o estado padrão
        }
      }
    })
    .catch(() => {});
}

export function useEstudanteSocial() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => currentState
  );
}

export const estudanteSocialActions = {
  adicionarInteresse: (interesse: string) => {
    const limpo = interesse.trim();
    if (!limpo || currentState.interesses.includes(limpo)) return;
    persist({
      ...currentState,
      interesses: [...currentState.interesses, limpo],
    });
  },

  removerInteresse: (interesse: string) => {
    persist({
      ...currentState,
      interesses: currentState.interesses.filter((i) => i !== interesse),
    });
  },

  toggleSeguirEmpresa: (empresaId: string) => {
    const isFollowing = currentState.seguindoEmpresas.includes(empresaId);
    const updated = isFollowing
      ? currentState.seguindoEmpresas.filter((id) => id !== empresaId)
      : [...currentState.seguindoEmpresas, empresaId];
    persist({
      ...currentState,
      seguindoEmpresas: updated,
    });
  },

  toggleSeguirUsuario: (usuarioId: string) => {
    const isFollowing = currentState.seguindoUsuarios.includes(usuarioId);
    const updated = isFollowing
      ? currentState.seguindoUsuarios.filter((id) => id !== usuarioId)
      : [...currentState.seguindoUsuarios, usuarioId];
    persist({
      ...currentState,
      seguindoUsuarios: updated,
    });
  },
};

