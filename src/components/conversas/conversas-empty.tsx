import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export function ConversasEmpty() {
  const router = useRouter();

  return (
    <View className="items-center justify-center p-8 gap-3 my-8">
      <View className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 items-center justify-center">
        <Ionicons name="chatbubbles-outline" size={30} color="#6366f1" />
      </View>
      <Text className="text-base font-bold text-slate-800 dark:text-slate-200 text-center">
        Nenhum feedback de candidatura ainda
      </Text>
      <Text className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs leading-relaxed">
        Quando você se candidatar a uma vaga, o PEIA analisará a compatibilidade do seu currículo e abrirá um canal direto com feedback e dicas aqui.
      </Text>
      <Button
        title="Explorar vagas disponíveis"
        className="mt-2 py-2.5 px-5 text-xs"
        onPress={() => router.push(ROUTES.HOME as any)}
      />
    </View>
  );
}

