import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { type Perfil } from '@/hooks/use-perfil';

interface ProfileAdminCardProps {
  perfil: Perfil | null;
}

export function ProfileAdminCard({ perfil }: ProfileAdminCardProps) {
  const router = useRouter();

  if (perfil?.role !== 'admin' && perfil?.role !== 'superadmin') {
    return null;
  }

  const isSuper = perfil.role === 'superadmin';

  return (
    <View className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900/60 my-1">
      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-base">🛡️</Text>
        <Text className="font-bold text-slate-900 dark:text-white">
          Painel de Gestão de Usuários
        </Text>
      </View>
      <Text className="text-xs text-slate-600 dark:text-slate-300 mb-3">
        Como {isSuper ? 'Super Administrador' : 'Administrador'}, você tem permissão para cadastrar novas empresas e gerenciar perfis no SQLite.
      </Text>
      <Button
        title="Acessar Cadastro Interno"
        onPress={() => router.push(ROUTES.GESTAO_USUARIOS as any)}
      />
    </View>
  );
}

