import { Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePerfil } from '@/hooks/use-perfil';
import { useInscricoes } from '@/hooks/use-inscricoes';
import { useEstudanteSocial } from '@/hooks/use-estudante-social';
import { ROUTES } from '@/constants/routes';

export function ProfileStudentHeader() {
  const router = useRouter();
  const perfil = usePerfil();
  const inscricoes = useInscricoes();
  const { seguindoEmpresas, seguindoUsuarios } = useEstudanteSocial();

  const nomeCompleto = perfil?.name
    ? `${perfil.name} ${perfil.surname ?? ''}`.trim()
    : 'Estudante PEIA';

  const iniciais = `${perfil?.name ? perfil.name[0] : 'E'}${
    perfil?.surname ? perfil.surname[0] : ''
  }`.toUpperCase();

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-4">
      {/* 1. Foto do Estudante e Identificação */}
      <View className="items-center gap-3">
        <Pressable
          onPress={() => router.push(ROUTES.CONFIGURACOES)}
          accessibilityRole="button"
          accessibilityLabel="Editar foto e dados cadastrais"
          className="relative active:opacity-85"
        >
          <View className="h-24 w-24 rounded-full border-2 border-indigo-500/40 dark:border-indigo-400/50 p-1 bg-white dark:bg-slate-900 shadow-md">
            {perfil?.avatar ? (
              <Image
                source={{ uri: perfil.avatar }}
                resizeMode="cover"
                className="h-full w-full rounded-full"
              />
            ) : (
              <View className="h-full w-full rounded-full bg-indigo-600 items-center justify-center">
                <Text className="text-2xl font-black text-white">
                  {iniciais}
                </Text>
              </View>
            )}
          </View>

          {/* Badge flutuante de edição rápida */}
          <View className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 items-center justify-center shadow-sm">
            <Ionicons name="create-outline" size={13} color="#ffffff" />
          </View>
        </Pressable>

        <View className="items-center gap-1">
          <Text className="text-xl font-bold text-slate-900 dark:text-white text-center">
            {nomeCompleto}
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Estudante de Tecnologia · UNDB
          </Text>

          <View className="flex-row items-center gap-2 mt-1">
            <View className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              <Text className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                ● Aberto a Oportunidades
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Métricas Sociais & Acadêmicas do Estudante */}
      <View className="flex-row items-center justify-around py-3 px-2 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
        <View className="items-center flex-1">
          <Text className="text-base font-black text-indigo-600 dark:text-indigo-400">
            {inscricoes.length}
          </Text>
          <Text className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Inscrições
          </Text>
        </View>

        <View className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

        <View className="items-center flex-1">
          <Text className="text-base font-black text-slate-900 dark:text-white">
            {seguindoEmpresas.length}
          </Text>
          <Text className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Empresas
          </Text>
        </View>

        <View className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

        <View className="items-center flex-1">
          <Text className="text-base font-black text-slate-900 dark:text-white">
            {seguindoUsuarios.length}
          </Text>
          <Text className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Conexões
          </Text>
        </View>
      </View>
    </View>
  );
}
