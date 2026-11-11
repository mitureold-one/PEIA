import { Alert, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useVagas, vagasActions } from '@/hooks/use-vagas';
import { usePermissions } from '@/hooks/use-user-role';
import { inscricoesActions, useInscricoes } from '@/hooks/use-inscricoes';

export default function VagaDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const vaga = useVagas().find((v) => v.id === id);
  const { isAluno, canManageVagas } = usePermissions();
  const inscricoes = useInscricoes();

  if (!vaga) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-[#03031b]">
        <Text className="text-slate-500 dark:text-slate-400">Vaga não encontrada.</Text>
      </View>
    );
  }

  const confirmarExclusao = () =>
    Alert.alert('Excluir vaga', 'Deseja excluir esta vaga?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          vagasActions.excluir(vaga.id);
          router.back();
        },
      },
    ]);

  const info = [
    ['Área', vaga.area],
    ['Modalidade', vaga.modalidade],
    ['Bolsa', `R$ ${vaga.bolsa.toLocaleString('pt-BR')}`],
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-[#03031b]" contentContainerClassName="gap-4 p-6">
      {vaga.arquivada && (
        <Text className="self-start rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
          Arquivada
        </Text>
      )}
      <View className="gap-1">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">{vaga.titulo}</Text>
        <Text className="text-base text-indigo-600 dark:text-indigo-400">
          {vaga.empresa} · {vaga.cidade}
        </Text>
      </View>

      <View className="gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60">
        {info.map(([k, v]) => (
          <View key={k} className="flex-row justify-between">
            <Text className="text-sm text-slate-500 dark:text-slate-400">{k}</Text>
            <Text className="text-sm font-medium text-slate-900 dark:text-white">{v}</Text>
          </View>
        ))}
      </View>

      <View className="gap-1.5">
        <Text className="text-base font-semibold text-slate-900 dark:text-white">Descrição</Text>
        <Text className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{vaga.descricao}</Text>
      </View>

      {/* Ação do Estudante */}
      {isAluno && (
        <Button
          title={inscricoes.includes(vaga.id) ? 'Inscrição realizada' : 'Inscrever-se na vaga'}
          disabled={inscricoes.includes(vaga.id)}
          onPress={() => {
            inscricoesActions.inscrever(vaga.id);
            Alert.alert('Inscrição realizada', 'Sua inscrição foi salva com sucesso no seu perfil.');
          }}
        />
      )}

      {/* Ações de Gestão (Empresa e Administração) */}
      {canManageVagas && (
        <View className="gap-2.5 mt-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            title="Editar vaga"
            onPress={() => router.push({ pathname: ROUTES.VAGA_FORM as any, params: { id: vaga.id } })}
          />
          <Button
            title={vaga.arquivada ? 'Desarquivar vaga' : 'Arquivar vaga'}
            variant="secondary"
            onPress={() => vagasActions.arquivar(vaga.id, !vaga.arquivada)}
          />
          <Button
            title="Excluir vaga"
            className="bg-rose-600 active:bg-rose-700"
            onPress={confirmarExclusao}
          />
        </View>
      )}
    </ScrollView>
  );
}
