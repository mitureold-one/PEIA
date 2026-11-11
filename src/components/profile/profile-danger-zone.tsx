import { Text, View } from 'react-native';
import { Button } from '@/components/ui/button';

interface ProfileDangerZoneProps {
  onExcluir: () => void;
}

export function ProfileDangerZone({ onExcluir }: ProfileDangerZoneProps) {
  return (
    <View className="gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 mt-2">
      <Text className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
        Zona de Risco
      </Text>
      <Button
        title="Excluir perfil"
        className="bg-rose-600 active:bg-rose-700"
        onPress={onExcluir}
      />
    </View>
  );
}

