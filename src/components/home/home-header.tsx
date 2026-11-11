import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePerfil } from '@/hooks/use-perfil';
import { ROUTES } from '@/constants/routes';

export function HomeHeader() {
  const router = useRouter();
  const perfil = usePerfil();

  const iniciais = (perfil?.name ? perfil.name[0] : 'U').toUpperCase();

  const irParaConfiguracoes = () => {
    router.push(ROUTES.CONFIGURACOES);
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <View className="flex-row items-center justify-between px-4 pb-3 pt-2">
        {/* Lado Esquerdo: Menu do Usuário com Avatar que leva às Configurações da Conta */}
        <Pressable
          onPress={irParaConfiguracoes}
          accessibilityRole="button"
          accessibilityLabel="Abrir configurações da conta e da plataforma"
          className="relative items-center justify-center p-1 active:scale-95"
        >
          <View className="h-10 w-10 rounded-full border-2 border-indigo-500/40 dark:border-indigo-400/50 p-0.5 bg-slate-50 dark:bg-slate-800 shadow-sm items-center justify-center">
            {perfil?.avatar ? (
              <Image
                source={{ uri: perfil.avatar }}
                resizeMode="cover"
                className="h-full w-full rounded-full"
              />
            ) : (
              <View className="h-full w-full rounded-full bg-indigo-600 items-center justify-center">
                <Text className="text-sm font-black text-white">
                  {iniciais}
                </Text>
              </View>
            )}
          </View>

          {/* Mini-badge de engrenagem / configurações */}
          <View className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-indigo-600 border border-white dark:border-slate-900 items-center justify-center shadow-xs">
            <Ionicons name="settings-sharp" size={9} color="#ffffff" />
          </View>
        </Pressable>

        {/* Centro: Logotipo Institucional */}
        <View className="flex-1 items-center px-2">
          <Text
            accessibilityRole="header"
            className="text-2xl font-black tracking-[0.2em] text-slate-900 dark:text-white"
          >
            PEIA
          </Text>
          <Text
            numberOfLines={1}
            className="text-[11px] font-medium text-slate-500 dark:text-slate-400 text-center"
          >
            Preparação, Empregabilidade & Inclusão
          </Text>
        </View>

        {/* Lado Direito: Espaçamento simétrico (reservado para o botão flutuante de tema) */}
        <View className="w-10 h-10 items-center justify-center" />
      </View>
    </SafeAreaView>
  );
}
