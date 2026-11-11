import "../global.css";
import { Text, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-slate-50 dark:bg-[#03031b]">
      <View className="max-w-md w-full p-6 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-lg">
        <Text className="text-xl font-bold text-rose-600 dark:text-rose-400 mb-2">Erro ao carregar a tela</Text>
        <Text className="text-sm text-slate-700 dark:text-slate-300 mb-4">{error?.message || 'Erro inesperado.'}</Text>
        <Button title="Tentar novamente" onPress={retry} />
      </View>
    </View>
  );
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <StatusBar style={isDark ? "light" : "dark"} />
      <ThemeToggle />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDark ? "#03031b" : "#f8fafc",
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="vaga" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="configuracoes" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
