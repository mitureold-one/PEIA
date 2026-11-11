import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePerfil } from '@/hooks/use-perfil';
import { ROUTES } from '@/constants/routes';

export function ProfileStudentHeader() {
  const router = useRouter();
  const perfil = usePerfil();

  const nome = perfil?.name || 'Estudante';

  return (
    <View className="rounded-3xl border border-indigo-100 bg-white p-5 dark:border-indigo-950/60 dark:bg-slate-950/60 shadow-sm gap-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          <View className="h-11 w-11 rounded-2xl bg-indigo-600 items-center justify-center shadow-md">
            <Ionicons name="school-outline" size={22} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              Olá, {nome}!
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Área do Estudante & Currículo Master
            </Text>
          </View>
        </View>

        <View className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800">
          <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            Estudante
          </Text>
        </View>
      </View>

      <Text className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        Aqui você gerencia suas candidaturas a estágio e mantém seu currículo geral
        sempre atualizado para gerar candidaturas com inteligência artificial.
      </Text>

      {/* Atalho informativo para o menu do Header / Configurações */}
      <Pressable
        onPress={() => router.push(ROUTES.CONFIGURACOES)}
        className="flex-row items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 active:opacity-75"
      >
        <View className="flex-row items-center gap-2 flex-1 mr-2">
          <Ionicons name="settings-outline" size={16} color="#6366f1" />
          <Text className="text-xs text-slate-600 dark:text-slate-300">
            Alterar foto de perfil e dados de login
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={15} color="#94a3b8" />
      </Pressable>
    </View>
  );
}
