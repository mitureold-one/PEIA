import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '@/services/user-service';
import { User } from '@/data/user';

export interface EmpresaCadastrada {
  id: string;
  nome: string;
  email: string;
}

const STORAGE_KEY = 'peia:empresas_cache';
let empresas: EmpresaCadastrada[] = [];
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

const syncFromUserService = async () => {
  try {
    const allUsers = await userService.listAll();
    const companyUsers = allUsers.filter((u) => u.role === 'empresa');
    empresas = companyUsers.map((u) => ({
      id: u.id,
      nome: u.fullName || u.name,
      email: u.email,
    }));
    notify();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(empresas));
  } catch {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) {
        empresas = JSON.parse(cached);
        notify();
      }
    } catch {
      // Ignora erro de leitura de cache
    }
  }
};

// Hidratação segura compatível com native e web
if (Platform.OS !== 'web' || typeof window !== 'undefined') {
  void syncFromUserService();
}

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
  criar: async (dados: Omit<EmpresaCadastrada, 'id'>) => {
    // 1. Instanciação e persistência do usuário Empresa no SQLite via userService
    const newUser = User.create({
      name: dados.nome.trim(),
      surname: 'Empresa',
      email: dados.email.trim(),
      role: 'empresa',
      password: 'password123',
    });
    await userService.save(newUser);

    // 2. Atualização do store reativo
    empresas = [{ id: newUser.id, nome: dados.nome.trim(), email: dados.email.trim() }, ...empresas];
    notify();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(empresas));
  },
  recarregar: syncFromUserService,
};
