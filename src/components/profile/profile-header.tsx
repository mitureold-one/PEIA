import { Text, View } from 'react-native';
import { type Perfil } from '@/hooks/use-perfil';
import { type UserRole } from '@/data/user';

interface ProfileHeaderProps {
  perfil: Perfil | null;
  role: 'estudante' | 'empresa' | 'coordenacao';
}

export function ProfileHeader({ perfil, role }: ProfileHeaderProps) {
  const getRoleLabel = (r?: UserRole) => {
    switch (r) {
      case 'superadmin':
        return 'Super Admin';
      case 'admin':
        return 'Administrador';
      case 'empresa':
        return 'Empresa';
      case 'aluno':
      default:
        return 'Aluno';
    }
  };

  const getTitle = () => {
    switch (role) {
      case 'empresa':
        return 'Conta da empresa';
      case 'coordenacao':
        return 'Conta da coordenação';
      case 'estudante':
      default:
        return 'Meu perfil de estudante';
    }
  };

  const getSubtitle = () => {
    switch (role) {
      case 'estudante':
        return 'Atualize seus dados, gerencie seu currículo geral e acompanhe suas inscrições.';
      case 'empresa':
        return 'Atualize os dados institucionais e informações de contato da empresa.';
      case 'coordenacao':
      default:
        return 'Gerencie seus dados administrativos e controle de acesso institucional.';
    }
  };

  return (
    <View className="gap-1.5">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white flex-1 mr-2">
          {getTitle()}
        </Text>
        {perfil?.role && (
          <View className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800">
            <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              {getRoleLabel(perfil.role)}
            </Text>
          </View>
        )}
      </View>
      <Text className="text-sm text-slate-500 dark:text-slate-400">
        {getSubtitle()} Tudo fica salvo neste aparelho.
      </Text>
    </View>
  );
}

