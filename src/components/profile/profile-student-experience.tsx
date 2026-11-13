import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { curriculoActions, useCurriculoGeral } from '@/hooks/use-curriculo';
import { Button } from '@/components/ui/button';
import type { ModalidadeTrabalho } from '@/data/curriculo';

/**
 * Seção "Experiência Profissional / Estágios" do estudante na main do perfil.
 */
export function ProfileStudentExperience() {
  const curriculo = useCurriculoGeral();
  const [modalVisible, setModalVisible] = useState(false);

  // Estados locais do formulário de experiência
  const [cargo, setNovoCargo] = useState('');
  const [empresa, setNovaEmpresa] = useState('');
  const [modalidade, setNovaModalidade] = useState<ModalidadeTrabalho>('Híbrido');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [ehAtual, setEhAtual] = useState(false);
  const [descricao, setDescricao] = useState('');

  const handleSalvar = () => {
    if (!cargo.trim() || !empresa.trim()) return;

    curriculoActions.adicionarExperiencia({
      cargo: cargo.trim(),
      empresa: empresa.trim(),
      modalidade,
      dataInicio: dataInicio.trim() || '2024',
      dataFim: ehAtual ? undefined : dataFim.trim(),
      atual: ehAtual,
      descricao: descricao.trim(),
      atividades: descricao.trim() ? [descricao.trim()] : [],
    });

    setNovoCargo('');
    setNovaEmpresa('');
    setDataInicio('');
    setDataFim('');
    setDescricao('');
    setEhAtual(false);
    setModalVisible(false);
  };

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-3">
      {/* Cabeçalho da Seção */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <View className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/70 items-center justify-center">
            <Ionicons name="briefcase-outline" size={16} color="#10b981" />
          </View>
          <View>
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              Experiência Profissional
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Estágios, monitorias, projetos e trabalhos
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => setModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Adicionar nova experiência profissional"
          className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 active:scale-95"
        >
          <Ionicons name="add" size={14} color="#6366f1" />
          <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            Adicionar
          </Text>
        </Pressable>
      </View>

      {/* Lista de Experiências */}
      <View className="gap-2.5 pt-1">
        {curriculo.experiencias.length === 0 ? (
          <Pressable
            onPress={() => setModalVisible(true)}
            className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 items-center justify-center"
          >
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Nenhuma experiência profissional cadastrada. Toque para adicionar.
            </Text>
          </Pressable>
        ) : (
          curriculo.experiencias.map((item) => (
            <View
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 gap-1.5"
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-slate-900 dark:text-white text-sm flex-1 pr-2">
                  {item.cargo}
                </Text>
                <Pressable
                  onPress={() => curriculoActions.removerExperiencia(item.id)}
                  hitSlop={8}
                  accessibilityLabel="Remover experiência"
                  className="p-1 rounded-lg active:bg-rose-100 dark:active:bg-rose-950"
                >
                  <Ionicons name="trash-outline" size={15} color="#ef4444" />
                </Pressable>
              </View>

              <Text className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {item.empresa} {item.modalidade ? `· ${item.modalidade}` : ''}
              </Text>

              <Text className="text-[11px] text-slate-500 dark:text-slate-400">
                {item.dataInicio} {item.atual ? '– Atual' : item.dataFim ? `– ${item.dataFim}` : ''}
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

      {/* Modal de Nova Experiência */}
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
                Nova Experiência
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
                  Cargo / Título
                </Text>
                <TextInput
                  value={cargo}
                  onChangeText={setNovoCargo}
                  placeholder="Ex: Estagiário de Desenvolvimento"
                  placeholderTextColor="#94a3b8"
                  className="h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </View>

              <View className="gap-1 mt-1.5">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Empresa / Organização
                </Text>
                <TextInput
                  value={empresa}
                  onChangeText={setNovaEmpresa}
                  placeholder="Ex: TechHub São Luís"
                  placeholderTextColor="#94a3b8"
                  className="h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </View>

              <View className="gap-1 mt-1.5">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Modalidade
                </Text>
                <View className="flex-row gap-2">
                  {(['Híbrido', 'Remoto', 'Presencial'] as ModalidadeTrabalho[]).map((m) => (
                    <Pressable
                      key={m}
                      onPress={() => setNovaModalidade(m)}
                      className={`flex-1 py-1.5 rounded-xl border items-center justify-center ${
                        modalidade === m
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          modalidade === m ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {m}
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
                    placeholder="2024"
                    placeholderTextColor="#94a3b8"
                    className="h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </View>

                {!ehAtual && (
                  <View className="flex-1 gap-1">
                    <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Ano Fim
                    </Text>
                    <TextInput
                      value={dataFim}
                      onChangeText={setDataFim}
                      placeholder="2025"
                      placeholderTextColor="#94a3b8"
                      className="h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </View>
                )}
              </View>

              <Pressable
                onPress={() => setEhAtual(!ehAtual)}
                className="flex-row items-center gap-2 mt-2"
              >
                <View
                  className={`h-5 w-5 rounded-lg border items-center justify-center ${
                    ehAtual
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {ehAtual && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                </View>
                <Text className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Trabalho / Estágio atual
                </Text>
              </Pressable>

              <View className="gap-1 mt-2">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Descrição das Atividades
                </Text>
                <TextInput
                  value={descricao}
                  onChangeText={setDescricao}
                  placeholder="Principais responsabilidades, tecnologias utilizadas..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="min-h-[70px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
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
                title="Salvar Experiência"
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

