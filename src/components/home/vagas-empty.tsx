import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';

interface VagasEmptyProps {
  onLimparFiltros?: () => void;
}

export function VagasEmpty({ onLimparFiltros }: VagasEmptyProps) {
  return (
    <View className="items-center justify-center p-8 gap-3 my-6">
      <View className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
        <Ionicons name="search-outline" size={26} color="#94a3b8" />
      </View>
      <Text className="text-base font-bold text-slate-800 dark:text-slate-200 text-center">
        Nenhuma vaga encontrada
      </Text>
      <Text className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs">
        Tente ajustar sua busca ou selecionar outros filtros de modalidade e área.
      </Text>
      {onLimparFiltros && (
        <Button
          title="Limpar todos os filtros"
          variant="secondary"
          className="mt-2 py-2 px-4 text-xs"
          onPress={onLimparFiltros}
        />
      )}
    </View>
  );
}

