import type { ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { HomeHeader } from '@/components/home/home-header';
import { ROUTES } from '@/constants/routes';
import { useUserRole } from '@/hooks/use-user-role';

type IconName = keyof typeof Ionicons.glyphMap;

const icon = (name: IconName) =>
  function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={name} color={color} size={size} />;
  };

export default function HomeLayout() {
  const router = useRouter();
  const isDark = useColorScheme().colorScheme === 'dark';
  const role = useUserRole();

  return (
    <Tabs
      initialRouteName={role === 'coordenacao' ? 'companies' : 'index'}
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
      <Tabs.Screen name="companies" options={{ title: 'Empresas', tabBarIcon: icon('business'), href: role === 'coordenacao' ? undefined : null }} />
      <Tabs.Screen name="profile" options={{ title: role === 'estudante' ? 'Perfil' : 'Conta', tabBarIcon: icon('person') }} />
      <Tabs.Screen
        name="logout"
        options={{ title: 'Sair', tabBarIcon: icon('log-out-outline') }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.replace(ROUTES.AUTH);
          },
        }}
      />
    </Tabs>
  );
}
