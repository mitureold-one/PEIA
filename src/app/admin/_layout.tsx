import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function AdminLayout() {
  const isDark = useColorScheme().colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerTintColor: isDark ? '#ffffff' : '#0f172a',
        headerStyle: { backgroundColor: isDark ? '#03031b' : '#ffffff' },
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen
        name="usuarios"
        options={{
          title: 'Gestão de Usuários',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack>
  );
}

