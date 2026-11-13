import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { estudanteSocialActions, useEstudanteSocial } from '@/hooks/use-estudante-social';
import { Button } from '@/components/ui/button';

const SUGESTOES_INTERESSES = [
  'Desenvolvimento Frontend',
  'Mobile (React Native)',
  'Backend com Python',
  'Inteligência Artificial',
  'UI/UX Design',
  'Ciência de Dados',
  'Cloud & DevOps',
  'Segurança da Informação',
  'Gestão Ágil (Scrum)',
];

/**
 * Carrossel lateral compacto de Áreas de Interesse do Estudante.
 * Ocupa mínimo espaço vertical e permite deslizar e gerenciar tags de compatibilidade IA.
 */
export function ProfileStudentInterests() {
  const { interesses } = useEstudanteSocial();
  const [modalVisible, setModalVisible] = useState(false);
  const [novoInteresse, setNovoInteresse] = useState('');

  const handleAdicionar = (tag: string) => {
    estudanteSocialActions.adicionarInteresse(tag);
    setNovoInteresse('');
  };

  const handleSalvarManual = () => {
    if (novoInteresse.trim()) {
      handleAdicionar(novoInteresse.trim());
      setModalVisible(false);
    }
  };

  return (
    <View className="gap-2.5">
      {/* Cabeçalho Compacto do Carrossel */}
      <View className="flex-row items-center justify-between px-1">
        <View className="flex-row items-center gap-2">
          <View className="h-6 w-6 rounded-lg bg-violet-100 dark:bg-violet-950/70 items-center justify-center">
            <Ionicons name="sparkles" size={13} color="#8b5cf6" />
          </View>
          <Text className="text-sm font-bold text-slate-900 dark:text-white">
            Áreas de Interesse
          </Text>
          <View className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Text className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
              {interesses.length}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => setModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Adicionar nova área de interesse"
          className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 active:scale-95"
        >
          <Ionicons name="add" size={14} color="#6366f1" />
          <Text className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
            Adicionar
          </Text>
        </Pressable>
      </View>

      {/* Carrossel Horizontal de Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row items-center gap-2 px-1 py-0.5"
      >
        {/* Botão de Atalho Rápido para Adicionar dentro do Carrossel */}
        <Pressable
          onPress={() => setModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Adicionar novo interesse"
          className="flex-row items-center gap-1.5 px-3 py-2 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 active:scale-95"
        >
          <Ionicons name="add-circle" size={15} color="#6366f1" />
          <Text className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Novo
          </Text>
        </Pressable>

        {/* Chips de Interesses com Deslize Lateral */}
        {interesses.map((item) => (
          <View
            key={item}
            className="flex-row items-center gap-2 px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
          >
            <View className="h-2 w-2 rounded-full bg-indigo-500" />
            <Text className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {item}
            </Text>
            <Pressable
              onPress={() => estudanteSocialActions.removerInteresse(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={`Remover interesse ${item}`}
              className="p-0.5 active:opacity-60"
            >
              <Ionicons name="close-circle" size={15} color="#94a3b8" />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Modal para adicionar novos interesses */}
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
          <Pressable
            onPress={() => setModalVisible(false)}
            className="flex-1 bg-black/60 backdrop-blur-md items-center justify-center p-6"
          >
            <Pressable className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 gap-4 shadow-2xl">
              <View className="flex-row items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="sparkles" size={18} color="#8b5cf6" />
                  <Text className="text-base font-bold text-slate-900 dark:text-white">
                    Adicionar Interesse
                  </Text>
                </View>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center active:scale-95"
                >
                  <Ionicons name="close" size={18} color="#94a3b8" />
                </Pressable>
              </View>

              <View className="gap-2">
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  Digite um interesse ou selecione uma sugestão:
                </Text>
                <View className="flex-row gap-2">
                  <TextInput
                    value={novoInteresse}
                    onChangeText={setNovoInteresse}
                    placeholder="Ex: Inteligência Artificial"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white"
                  />
                  <Button
                    title="OK"
                    onPress={handleSalvarManual}
                    className="px-4 py-2.5"
                  />
                </View>
              </View>

              <View className="gap-2 pt-1">
                <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Sugestões rápidas:
                </Text>
                <View className="flex-row flex-wrap gap-1.5 max-h-40">
                  {SUGESTOES_INTERESSES.filter((s) => !interesses.includes(s)).map((sugestao) => (
                    <Pressable
                      key={sugestao}
                      onPress={() => handleAdicionar(sugestao)}
                      className="flex-row items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 active:bg-indigo-100"
                    >
                      <Ionicons name="add" size={13} color="#6366f1" />
                      <Text className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                        {sugestao}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Button
                title="Fechar"
                variant="secondary"
                onPress={() => setModalVisible(false)}
                className="py-2.5"
              />
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
