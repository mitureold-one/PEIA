import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { curriculoActions, useCurriculoGeral } from '@/hooks/use-curriculo';
import { Button } from '@/components/ui/button';
import type { GrauAcademico, StatusFormacao } from '@/data/curriculo';

/**
 * Seção "Formação Acadêmica" do estudante na main do perfil.
 */
export function ProfileStudentEducation() {
  const curriculo = useCurriculoGeral();
  const [modalVisible, setModalVisible] = useState(false);

  // Estados locais do formulário de formação
  const [instituicao, setInstituicao] = useState('');
  const [curso, setCurso] = useState('');
  const [grau, setGrau] = useState<GrauAcademico>('Graduação');
  const [status, setStatus] = useState<StatusFormacao>('Em andamento');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const handleSalvar = () => {
    if (!instituicao.trim() || !curso.trim()) return;

    curriculoActions.adicionarFormacao({
      instituicao: instituicao.trim(),
      curso: curso.trim(),
      grau,
      status,
      dataInicio: dataInicio.trim() || '2024',
      dataFim: dataFim.trim(),
    });

    setInstituicao('');
    setCurso('');
    setDataInicio('');
    setDataFim('');
    setModalVisible(false);
  };

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-3">
      {/* Cabeçalho da Seção */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <View className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/70 items-center justify-center">
            <Ionicons name="school-outline" size={16} color="#3b82f6" />
          </View>
          <View>
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              Formação Acadêmica
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Cursos, graduações e histórico educacional
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => setModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Adicionar nova formação acadêmica"
          className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 active:scale-95"
        >
          <Ionicons name="add" size={14} color="#6366f1" />
          <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            Adicionar
          </Text>
        </Pressable>
      </View>

      {/* Lista de Formações */}
      <View className="gap-2.5 pt-1">
        {curriculo.formacoes.length === 0 ? (
          <Pressable
            onPress={() => setModalVisible(true)}
            className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 items-center justify-center"
          >
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Nenhuma formação acadêmica cadastrada. Toque para adicionar.
            </Text>
          </Pressable>
        ) : (
          curriculo.formacoes.map((item) => (
            <View
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 gap-1.5"
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-slate-900 dark:text-white text-sm flex-1 pr-2">
                  {item.curso}
                </Text>
                <Pressable
                  onPress={() => curriculoActions.removerFormacao(item.id)}
                  hitSlop={8}
                  accessibilityLabel="Remover formação"
                  className="p-1 rounded-lg active:bg-rose-100 dark:active:bg-rose-950"
                >
                  <Ionicons name="trash-outline" size={15} color="#ef4444" />
                </Pressable>
              </View>

              <Text className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {item.instituicao} · {item.grau}
              </Text>

              <Text className="text-[11px] text-slate-500 dark:text-slate-400">
                {item.status} {item.dataInicio ? `(${item.dataInicio}${item.dataFim ? ` a ${item.dataFim}` : ''})` : ''}
              </Text>

              {item.descricao ? (
                <Text className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.descricao}
                </Text>
              ) : null}
            </View>
          ))
        )}
      </View>

      {/* Modal de Nova Formação */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 bg-black/60 backdrop-blur-md justify-center items-center p-4">
            <Pressable className="absolute inset-0" onPress={() => setModalVisible(false)} />

            <View className="w-full max-w-sm rounded-3xl bg-white p-6 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl gap-3.5">
            <View className="flex-row items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                Nova Formação Acadêmica
              </Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center active:scale-95"
              >
                <Ionicons name="close" size={16} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView className="max-h-80 gap-3" showsVerticalScrollIndicator={false}>
              <View className="gap-1">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Instituição de Ensino
                </Text>
                <TextInput
                  value={instituicao}
                  onChangeText={setInstituicao}
                  placeholder="Ex: UNDB"
                  placeholderTextColor="#94a3b8"
                  className="h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </View>

              <View className="gap-1 mt-1.5">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Curso
                </Text>
                <TextInput
                  value={curso}
                  onChangeText={setCurso}
                  placeholder="Ex: Engenharia de Software"
                  placeholderTextColor="#94a3b8"
                  className="h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </View>

              <View className="gap-1 mt-1.5">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Grau Acadêmico
                </Text>
                <View className="flex-row flex-wrap gap-1.5">
                  {(['Graduação', 'Técnico', 'Pós-graduação', 'Mestrado'] as GrauAcademico[]).map((g) => (
                    <Pressable
                      key={g}
                      onPress={() => setGrau(g)}
                      className={`px-3 py-1.5 rounded-xl border ${
                        grau === g
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          grau === g ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {g}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="gap-1 mt-1.5">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </Text>
                <View className="flex-row gap-2">
                  {(['Em andamento', 'Concluído', 'Trancado'] as StatusFormacao[]).map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => setStatus(s)}
                      className={`flex-1 py-1.5 rounded-xl border items-center justify-center ${
                        status === s
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          status === s ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {s}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="flex-row gap-2 mt-1.5">
                <View className="flex-1 gap-1">
                  <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Ano Início
                  </Text>
                  <TextInput
                    value={dataInicio}
                    onChangeText={setDataInicio}
                    placeholder="2023"
                    placeholderTextColor="#94a3b8"
                    className="h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Ano Fim (ou Previsto)
                  </Text>
                  <TextInput
                    value={dataFim}
                    onChangeText={setDataFim}
                    placeholder="2027"
                    placeholderTextColor="#94a3b8"
                    className="h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </View>
              </View>
            </ScrollView>

            <View className="flex-row items-center gap-2 pt-2">
              <Button
                title="Cancelar"
                variant="secondary"
                onPress={() => setModalVisible(false)}
                className="flex-1 py-2.5"
              />
              <Button
                title="Salvar Formação"
                variant="primary"
                onPress={handleSalvar}
                className="flex-1 py-2.5"
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
    </View>
  );
}

