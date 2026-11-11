import { usePerfil, perfilActions } from '@/hooks/use-perfil';
import type { UserRole as DomainRole } from '@/data/user';

export type UserRole = 'empresa' | 'estudante' | 'coordenacao';

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'estudante', label: 'Estudante' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'coordenacao', label: 'Coordenação' },
];

/**
 * Converte a role de domínio (aluno, empresa, admin, superadmin) para o papel de interface do protótipo.
 */
export function mapDomainRoleToUserRole(role?: DomainRole): UserRole {
  if (role === 'empresa') return 'empresa';
  if (role === 'admin' || role === 'superadmin') return 'coordenacao';
  return 'estudante';
}

/**
 * Hook que retorna o papel de interface derivado diretamente da sessão ativa (usePerfil).
 * Garante fonte única da verdade sem duplicar estado no AsyncStorage.
 */
export function useUserRole(): UserRole {
  const perfil = usePerfil();
  return mapDomainRoleToUserRole(perfil?.role);
}

/**
 * Permissões detalhadas baseadas na persona autenticada no banco/sessão.
 */
export function usePermissions() {
  const perfil = usePerfil();
  const rawRole: DomainRole = perfil?.role ?? 'aluno';
  const role = mapDomainRoleToUserRole(rawRole);

  return {
    rawRole,
    role,
    isAluno: rawRole === 'aluno',
    isEmpresa: rawRole === 'empresa',
    isAdmin: rawRole === 'admin' || rawRole === 'superadmin',
    isSuperAdmin: rawRole === 'superadmin',
    canCreateVaga: rawRole === 'empresa' || rawRole === 'admin' || rawRole === 'superadmin',
    canManageVagas: rawRole === 'empresa' || rawRole === 'admin' || rawRole === 'superadmin',
    canApply: rawRole === 'aluno',
    canManageUsers: rawRole === 'admin' || rawRole === 'superadmin',
  };
}

export const userRoleActions = {
  definir: (next: UserRole) => {
    const active = perfilActions.obter();
    if (active) {
      const mappedRole: DomainRole =
        next === 'empresa' ? 'empresa' : next === 'coordenacao' ? 'admin' : 'aluno';
      perfilActions.editar({ ...active, role: mappedRole });
    }
  },
};
