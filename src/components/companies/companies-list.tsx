import { Text, View } from 'react-native';
import { type EmpresaCadastrada } from '@/hooks/use-empresas';
import { CompanyCard } from '@/components/companies/company-card';

interface CompaniesListProps {
  empresas: EmpresaCadastrada[];
}

export function CompaniesList({ empresas }: CompaniesListProps) {
  return (
    <View className="gap-3 mt-1">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-slate-900 dark:text-white">
          Empresas Cadastradas
        </Text>
        <Text className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {empresas.length} {empresas.length === 1 ? 'empresa' : 'empresas'}
        </Text>
      </View>

      {empresas.length ? (
        empresas.map((empresa) => (
          <CompanyCard key={empresa.id} empresa={empresa} />
        ))
      ) : (
        <View className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 items-center justify-center">
          <Text className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Ainda não há empresas cadastradas no banco local.
          </Text>
        </View>
      )}
    </View>
  );
}
