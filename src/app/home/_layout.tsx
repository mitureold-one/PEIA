import { Text, View, type ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Button } from '@/components/ui/button';
import { HomeHeader } from '@/components/home/home-header';
import { ROUTES } from '@/constants/routes';
import { perfilActions } from '@/hooks/use-perfil';
import { useUserRole } from '@/hooks/use-user-role';

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-slate-50 dark:bg-[#03031b]">
      <View className="max-w-md w-full p-6 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-lg">
        <Text className="text-xl font-bold text-rose-600 dark:text-rose-400 mb-2">Erro ao carregar o Feed</Text>
        <Text className="text-sm text-slate-700 dark:text-slate-300 mb-4">{error?.message || 'Erro inesperado.'}</Text>
        <Button title="Tentar novamente" onPress={retry} />
      </View>
    </View>
  );
}

type IconName = keyof typeof Ionicons.glyphMap;

const icon = (name: IconName) =>
  function TabIcon({ color, size }: { color: any; size: number }) {
    return <Ionicons name={name} color={color} size={size} />;
  };

export default function HomeLayout() {
  const router = useRouter();
  const isDark = useColorScheme().colorScheme === 'dark';
  const role = useUserRole();

  return (
    <Tabs
      screenOptions={{
        header: () => <HomeHeader />,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
        tabBarStyle: {
          backgroundColor: isDark ? '#03031b' : '#f8fafc',
          borderTopColor: isDark ? '#1e1b4b' : '#e2e8f0',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: role === 'estudante' ? 'Estágios' : 'Vagas', tabBarIcon: icon('home') }} />
      <Tabs.Screen name="scan" options={{ title: 'Escanear', tabBarIcon: icon('scan'), href: role === 'estudante' ? undefined : null }} />
      <Tabs.Screen name="conversas" options={{ title: 'Conversas', tabBarIcon: icon('chatbubbles'), href: role === 'estudante' ? undefined : null }} />
      <Tabs.Screen name="companies" options={{ title: 'Empresas', tabBarIcon: icon('business'), href: role === 'coordenacao' ? undefined : null }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: role === 'estudante' ? 'Currículo' : 'Conta',
          tabBarIcon: icon(role === 'estudante' ? 'document-text-outline' : 'person-outline'),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{ title: 'Sair', tabBarIcon: icon('log-out-outline') }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            perfilActions.excluir();
            router.replace(ROUTES.AUTH);
          },
        }}
      />
    </Tabs>
  );
}
