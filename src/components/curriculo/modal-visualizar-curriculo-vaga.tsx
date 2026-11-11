import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type CurriculoVaga } from '@/data/curriculo';
import { type Vaga } from '@/data/vagas';
import { curriculoActions } from '@/hooks/use-curriculo';
import { Button } from '@/components/ui/button';

interface ModalVisualizarCurriculoVagaProps {
  visible: boolean;
  vaga: Vaga;
  curriculoVaga: CurriculoVaga | null;
  onClose: () => void;
  onCancelSuccess: () => void;
}

export function ModalVisualizarCurriculoVaga({
  visible,
  vaga,
  curriculoVaga,
  onClose,
  onCancelSuccess,
}: ModalVisualizarCurriculoVagaProps) {
  if (!curriculoVaga) return null;

  const confirmarCancelamento = () => {
    Alert.alert(
      'Cancelar candidatura',
      'Tem certeza de que deseja retirar sua candidatura desta vaga?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: () => {
            curriculoActions.cancelarCandidaturaVaga(vaga.id, curriculoVaga.usuarioId);
            onClose();
            onCancelSuccess();
          },
        },
      ]
    );
  };

  const dataFormatada = curriculoVaga.dataEnvio
    ? new Date(curriculoVaga.dataEnvio).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 bg-black/60 justify-end">
        <Pressable className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 max-h-[85%] border-t border-slate-200 dark:border-slate-800">
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <View>
              <Text className="text-lg font-bold text-slate-900 dark:text-white">
                Currículo Enviado
              </Text>
              <Text className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                {vaga.titulo} · {vaga.empresa}
              </Text>
            </View>
            <Pressable onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#94a3b8" />
            </Pressable>
          </View>

          <ScrollView className="py-4" showsVerticalScrollIndicator={false}>
            {/* Status card */}
            <View className="flex-row items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 mb-4">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <View className="flex-1">
                <Text className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Candidatura enviada para a empresa
                </Text>
                {dataFormatada ? (
                  <Text className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    Enviado em {dataFormatada}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Resumo submetido */}
            {curriculoVaga.resumoCustomizado ? (
              <View className="gap-1 mb-4">
                <Text className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Resumo / Apresentação Enviada
                </Text>
                <View className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <Text className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {curriculoVaga.resumoCustomizado}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Habilidades enviadas */}
            {curriculoVaga.habilidadesDestacadas?.length > 0 && (
              <View className="gap-1.5 mb-4">
                <Text className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Habilidades Destacadas ({curriculoVaga.habilidadesDestacadas.length})
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {curriculoVaga.habilidadesDestacadas.map((h) => (
                    <View
                      key={h.id}
                      className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800"
                    >
                      <Text className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                        {h.nome}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Experiências enviadas */}
            {curriculoVaga.experiencias?.length > 0 && (
              <View className="gap-1.5 mb-4">
                <Text className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Experiências Enviadas ({curriculoVaga.experiencias.length})
                </Text>
                <View className="gap-2">
                  {curriculoVaga.experiencias.map((e) => (
                    <View
                      key={e.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-1"
                    >
                      <Text className="font-bold text-slate-900 dark:text-white text-xs">
                        {e.cargo}
                      </Text>
                      <Text className="text-[11px] text-slate-500 dark:text-slate-400">
                        {e.empresa} ({e.dataInicio} {e.atual ? '- Atual' : ''})
                      </Text>
                      {e.descricao ? (
                        <Text className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          {e.descricao}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Formações */}
            {curriculoVaga.formacoes?.length > 0 && (
              <View className="gap-1.5 mb-4">
                <Text className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Formações Acadêmicas ({curriculoVaga.formacoes.length})
                </Text>
                <View className="gap-2">
                  {curriculoVaga.formacoes.map((f) => (
                    <View
                      key={f.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
                    >
                      <Text className="font-bold text-slate-900 dark:text-white text-xs">
                        {f.curso}
                      </Text>
                      <Text className="text-[11px] text-slate-500 dark:text-slate-400">
                        {f.instituicao} · {f.status}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View className="gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button title="Fechar" onPress={onClose} />
            <Button
              title="Cancelar Candidatura"
              className="bg-rose-600 active:bg-rose-700"
              onPress={confirmarCancelamento}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

