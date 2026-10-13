import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';

// Visual apenas: ainda sem câmera nem leitura real do currículo.
const corner = 'absolute h-10 w-10 border-indigo-500';

export default function Scan() {
  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <View className="flex-1 items-center justify-center gap-6 p-6">
        <View className="items-center gap-1.5">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">Escanear currículo</Text>
          <Text className="text-center text-sm text-slate-500 dark:text-slate-400">
            Posicione o documento dentro da moldura para importar seus dados.
          </Text>
        </View>

        <View
          accessibilityLabel="Área de leitura da câmera"
          className="aspect-[3/4] w-full max-w-sm items-center justify-center rounded-2xl bg-slate-200 dark:bg-slate-950/60"
        >
          <View className={`${corner} left-3 top-3 rounded-tl-2xl border-l-4 border-t-4`} />
          <View className={`${corner} right-3 top-3 rounded-tr-2xl border-r-4 border-t-4`} />
          <View className={`${corner} bottom-3 left-3 rounded-bl-2xl border-b-4 border-l-4`} />
          <View className={`${corner} bottom-3 right-3 rounded-br-2xl border-b-4 border-r-4`} />
          <Ionicons name="document-text-outline" size={64} color="#94a3b8" />
        </View>

        <Button
          title="Escanear"
          className="w-full max-w-sm"
          icon={<Ionicons name="camera" size={20} color="#fff" />}
        />
      </View>
    </SafeAreaView>
  );
}
