import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
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
    <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <View className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-950/70 items-center justify-center">
            <Ionicons name="sparkles-outline" size={16} color="#8b5cf6" />
          </View>
          <View>
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              Áreas de Interesse
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Tags utilizadas pela IA para recomendar vagas compatíveis
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => setModalVisible(true)}
          className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 active:scale-95"
        >
          <Ionicons name="add" size={15} color="#6366f1" />
          <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            Adicionar
          </Text>
        </Pressable>
      </View>

      {/* Lista de chips de interesses */}
      <View className="flex-row flex-wrap gap-2 pt-1">
        {interesses.map((item) => (
          <View
            key={item}
            className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <Text className="text-xs font-medium text-slate-800 dark:text-slate-200">
              {item}
            </Text>
            <Pressable
              onPress={() => estudanteSocialActions.removerInteresse(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={`Remover interesse ${item}`}
            >
              <Ionicons name="close-circle" size={14} color="#94a3b8" />
            </Pressable>
          </View>
        ))}
      </View>

      {/* Modal para adicionar novos interesses */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/60 items-center justify-center p-6"
        >
          <Pressable className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 gap-4">
            <View className="flex-row items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                Adicionar Área de Interesse
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#94a3b8" />
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
                  className="px-4"
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
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
