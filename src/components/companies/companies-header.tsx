import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

interface CompaniesHeaderProps {
  isAdmin: boolean;
}

export function CompaniesHeader({ isAdmin }: CompaniesHeaderProps) {
  const router = useRouter();

  return (
    <View className="gap-1.5">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">
          Empresas Parceiras
        </Text>
        {isAdmin && (
          <Button
            title="Painel Gestão"
            variant="secondary"
            className="py-2 px-3 text-xs"
            onPress={() => router.push(ROUTES.GESTAO_USUARIOS as any)}
          />
        )}
      </View>
      <Text className="text-sm text-slate-500 dark:text-slate-400">
        Cadastre e consulte as empresas conveniadas que publicam oportunidades no programa de estágios.
      </Text>
    </View>
  );
}

