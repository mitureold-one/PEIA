import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePerfil } from '@/hooks/use-perfil';
import { ProfileAdminCard } from '@/components/profile/profile-admin-card';

/**
 * Montagem modular dos componentes exclusivos da Coordenação / Administração.
 */
export function CoordinationProfileView() {
  const perfil = usePerfil();

  return (
    <View className="gap-5">
      {/* Card Institucional da Coordenação */}
      <View className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-3">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 rounded-2xl bg-indigo-600 items-center justify-center shadow-md">
            <Ionicons name="shield-checkmark-outline" size={24} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">
              Coordenação Institucional
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Painel de Supervisão & Governança PEIA
            </Text>
          </View>
        </View>

        <Text className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
          Supervisione as contas cadastradas, gerencie papéis de acesso e monitore as
          interações de estágio e inclusão no ecossistema acadêmico.
        </Text>
      </View>

      {/* Atalho ao Painel Administrativo de Usuários */}
      <ProfileAdminCard perfil={perfil} />
    </View>
  );
}
