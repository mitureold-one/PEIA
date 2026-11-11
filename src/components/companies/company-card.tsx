import { Text, View } from 'react-native';
import { type EmpresaCadastrada } from '@/hooks/use-empresas';

interface CompanyCardProps {
  empresa: EmpresaCadastrada;
}

export function CompanyCard({ empresa }: CompanyCardProps) {
  return (
    <View className="gap-1 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-slate-900 dark:text-white text-base">
          {empresa.nome}
        </Text>
        <View className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
          <Text className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
            Conveniada
          </Text>
        </View>
      </View>
      <Text className="text-xs text-slate-500 dark:text-slate-400">
        {empresa.email}
      </Text>
    </View>
  );
}
