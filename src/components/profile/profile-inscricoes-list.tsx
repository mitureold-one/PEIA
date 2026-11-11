import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '@/constants/routes';
import { useInscricoes } from '@/hooks/use-inscricoes';
import { useVagas } from '@/hooks/use-vagas';

export function ProfileInscricoesList() {
  const router = useRouter();
  const inscricoes = useInscricoes();
  const vagas = useVagas();

  const vagasInscritas = vagas.filter((vaga) => inscricoes.includes(vaga.id));

  return (
    <View className="gap-2.5 mt-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-slate-900 dark:text-white">
          Minhas Inscrições
        </Text>
        <Text className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {vagasInscritas.length} {vagasInscritas.length === 1 ? 'vaga' : 'vagas'}
        </Text>
      </View>

      {vagasInscritas.length === 0 ? (
        <View className="p-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 items-center justify-center">
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            Você ainda não se inscreveu em vagas.
          </Text>
        </View>
      ) : (
        vagasInscritas.map((vaga) => (
          <Pressable
            key={vaga.id}
            onPress={() =>
              router.push({
                pathname: ROUTES.VAGA_DETALHE as any,
                params: { id: vaga.id },
              })
            }
            accessibilityRole="button"
            className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60 active:opacity-75"
          >
            <View className="gap-1 flex-1 pr-3">
              <Text className="font-semibold text-slate-900 dark:text-white text-sm">
                {vaga.titulo}
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {vaga.empresa} · {vaga.cidade} · Inscrição ativa
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </Pressable>
        ))
      )}
    </View>
  );
}

