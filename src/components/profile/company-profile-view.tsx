import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePerfil } from '@/hooks/use-perfil';
import { useVagas } from '@/hooks/use-vagas';
import { ROUTES } from '@/constants/routes';

/**
 * Montagem modular dos componentes exclusivos da subclasse Empresa Parceira.
 */
export function CompanyProfileView() {
  const router = useRouter();
  const perfil = usePerfil();
  const vagas = useVagas();

  const nomeEmpresa = perfil?.name || 'Empresa Parceira';
  const vagasPublicadas = vagas.filter((v) =>
    v.empresa.toLowerCase().includes(nomeEmpresa.toLowerCase())
  );

  return (
    <View className="gap-5">
      {/* Card Institucional */}
      <View className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-3">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 rounded-2xl bg-indigo-600 items-center justify-center shadow-md">
            <Ionicons name="business-outline" size={24} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">
              {nomeEmpresa}
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Perfil Corporativo & Recrutamento
            </Text>
          </View>
        </View>

        <Text className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
          Divulgue oportunidades de estágio, receba currículos direcionados de estudantes
          avaliados pela IA e interaja com candidatos qualificados.
        </Text>

        <Pressable
          onPress={() => router.push(ROUTES.VAGA_FORM as any)}
          className="flex-row items-center justify-center gap-2 p-3.5 rounded-2xl bg-indigo-600 active:bg-indigo-700 mt-2"
        >
          <Ionicons name="add-circle-outline" size={18} color="#ffffff" />
          <Text className="text-sm font-bold text-white">
            Publicar Nova Vaga de Estágio
          </Text>
        </Pressable>
      </View>

      {/* Vagas da Empresa */}
      <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-bold text-slate-900 dark:text-white">
            Vagas da Sua Empresa
          </Text>
          <Text className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {vagasPublicadas.length} ativas
          </Text>
        </View>

        {vagasPublicadas.length === 0 ? (
          <Text className="text-xs text-slate-400 py-3 text-center">
            Nenhuma vaga publicada recentemente. Clique acima para cadastrar.
          </Text>
        ) : (
          vagasPublicadas.map((v) => (
            <View
              key={v.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80"
            >
              <Text className="text-sm font-bold text-slate-900 dark:text-white">
                {v.titulo}
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {v.cidade} · {v.modalidade || 'Estágio'}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
