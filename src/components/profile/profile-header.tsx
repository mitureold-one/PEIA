import { Text, View } from 'react-native';
import { type Perfil } from '@/hooks/use-perfil';
import { type UserRole } from '@/data/user';
import { ProfileAvatar } from '@/components/profile/profile-avatar';

interface ProfileHeaderProps {
  perfil: Perfil | null;
  role: 'estudante' | 'empresa' | 'coordenacao';
  onUpdateAvatar?: (uri: string) => void;
  onRemoveAvatar?: () => void;
}

export function ProfileHeader({
  perfil,
  role,
  onUpdateAvatar = () => {},
  onRemoveAvatar = () => {},
}: ProfileHeaderProps) {
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

  const getSubtitle = () => {
    switch (role) {
      case 'estudante':
        return 'Atualize sua foto, dados de contato e monte seu currículo geral.';
      case 'empresa':
        return 'Atualize o logotipo institucional e as informações da empresa.';
      case 'coordenacao':
      default:
        return 'Gerencie seus dados e controle de acesso institucional.';
    }
  };

  const nomeExibicao =
    perfil?.name || perfil?.surname
      ? `${perfil.name ?? ''} ${perfil.surname ?? ''}`.trim()
      : 'Usuário PEIA';

  return (
    <View className="gap-4">
      {/* Card do Perfil com Avatar */}
      <View className="items-center p-6 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm gap-3">
        <ProfileAvatar
          avatar={perfil?.avatar}
          name={perfil?.name || ''}
          surname={perfil?.surname || ''}
          onUpdateAvatar={onUpdateAvatar}
          onRemoveAvatar={onRemoveAvatar}
        />

        <View className="items-center gap-1">
          <Text className="text-xl font-bold text-slate-900 dark:text-white text-center">
            {nomeExibicao}
          </Text>
          {perfil?.email && (
            <Text className="text-xs text-slate-500 dark:text-slate-400 text-center">
              {perfil.email}
            </Text>
          )}

          <View className="flex-row items-center gap-2 mt-1">
            <View className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800">
              <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                {getRoleLabel(perfil?.role)}
              </Text>
            </View>
            <View className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              <Text className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                ✓ Ativo
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs mt-1">
          {getSubtitle()}
        </Text>
      </View>
    </View>
  );
}
