import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/constants/routes';
import { type Vaga } from '@/data/vagas';

interface VagaCardProps {
  vaga: Vaga;
}

export function VagaCard({ vaga }: VagaCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: ROUTES.VAGA_DETALHE as any,
      params: { id: vaga.id },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      className={`gap-1.5 rounded-2xl border border-slate-200 bg-white p-4 active:opacity-80 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm ${
        vaga.arquivada ? 'opacity-60' : ''
      }`}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-slate-900 dark:text-white flex-1 mr-2">
          {vaga.titulo}
        </Text>
        {vaga.arquivada && (
          <Text className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            Arquivada
          </Text>
        )}
      </View>

      <Text className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
        {vaga.empresa} · {vaga.cidade}
      </Text>

      <Text numberOfLines={2} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {vaga.descricao}
      </Text>

      <View className="mt-1 flex-row items-center gap-2">
        <View className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
          <Text className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
            {vaga.area}
          </Text>
        </View>
        <View className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
          <Text className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
            {vaga.modalidade}
          </Text>
        </View>
        <Text className="text-xs font-semibold text-slate-700 dark:text-slate-200 ml-auto">
          R$ {vaga.bolsa.toLocaleString('pt-BR')}
        </Text>
      </View>
    </Pressable>
  );
}

