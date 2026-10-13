import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function VagaLayout() {
  const isDark = useColorScheme().colorScheme === 'dark';
  return (
    <Stack
      screenOptions={{
        headerTintColor: isDark ? '#ffffff' : '#0f172a',
        headerStyle: { backgroundColor: isDark ? '#0f172a' : '#ffffff' },
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen name="[id]" options={{ title: 'Detalhes da vaga' }} />
      <Stack.Screen name="form" options={{ title: 'Vaga' }} />
    </Stack>
  );
}
