import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function CompaniesRestrictedView() {
  return (
    <View className="p-8 items-center justify-center gap-3 bg-white dark:bg-slate-950/60 rounded-3xl border border-slate-200 dark:border-slate-800 my-4">
      <View className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-900 items-center justify-center">
        <Ionicons name="lock-closed-outline" size={26} color="#94a3b8" />
      </View>
      <Text className="text-base font-bold text-slate-800 dark:text-slate-200 text-center">
        Acesso Restrito à Coordenação
      </Text>
      <Text className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs leading-relaxed">
        O cadastro e homologação de empresas conveniadas é exclusivo para administradores e membros da coordenação.
      </Text>
    </View>
  );
}

