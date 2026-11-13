import { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import type { Aluno, AlunoProps } from '@/data/user';

export interface ProfileStudentAcademicEditModalProps {
  visible: boolean;
  aluno: Aluno;
  onClose: () => void;
  onSave: (dados: Partial<AlunoProps>) => Promise<void>;
}

export function ProfileStudentAcademicEditModal({
  visible,
  aluno,
  onClose,
  onSave,
}: ProfileStudentAcademicEditModalProps) {
  const [cargo, setCargo] = useState(aluno.cargo);
  const [instituicao, setInstituicao] = useState(aluno.instituicao);
  const [curso, setCurso] = useState(aluno.curso);
  const [abertoOportunidades, setAbertoOportunidades] = useState(aluno.abertoOportunidades);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (visible) {
      setCargo(aluno.cargo);
      setInstituicao(aluno.instituicao);
      setCurso(aluno.curso);
      setAbertoOportunidades(aluno.abertoOportunidades);
    }
  }, [visible, aluno]);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await onSave({
        cargo: cargo.trim() || 'Estudante de Tecnologia',
        instituicao: instituicao.trim() || 'UNDB',
        curso: curso.trim() || 'Graduação',
        abertoOportunidades,
      });
      onClose();
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-black/60 backdrop-blur-md justify-center items-center p-4">
          <Pressable className="absolute inset-0" onPress={onClose} />

          <View className="w-full max-w-sm rounded-3xl bg-white p-6 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl gap-4">
          {/* Cabeçalho do Modal */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <View className="h-9 w-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 items-center justify-center">
                <Ionicons name="school" size={18} color="#6366f1" />
              </View>
              <View>
                <Text className="text-base font-bold text-slate-900 dark:text-white">
                  Dados Acadêmicos
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  CRUD da subclasse Aluno
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center active:scale-95"
            >
              <Ionicons name="close" size={16} color="#64748b" />
            </Pressable>
          </View>

          <ScrollView className="max-h-80 gap-3" showsVerticalScrollIndicator={false}>
            {/* Campo: Cargo / Ocupação */}
            <View className="gap-1.5">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Ocupação / Foco Profissional
              </Text>
              <TextInput
                value={cargo}
                onChangeText={setCargo}
                placeholder="Ex: Estudante de Tecnologia, Estagiário Frontend"
                placeholderTextColor="#94a3b8"
                className="h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </View>

            {/* Campo: Instituição */}
            <View className="gap-1.5 mt-2">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Instituição de Ensino
              </Text>
              <TextInput
                value={instituicao}
                onChangeText={setInstituicao}
                placeholder="Ex: UNDB"
                placeholderTextColor="#94a3b8"
                className="h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </View>

            {/* Campo: Curso */}
            <View className="gap-1.5 mt-2">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Curso / Nível
              </Text>
              <TextInput
                value={curso}
                onChangeText={setCurso}
                placeholder="Ex: Sistemas de Informação, Engenharia de Software"
                placeholderTextColor="#94a3b8"
                className="h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </View>

            {/* Status: Aberto a Oportunidades */}
            <View className="gap-1.5 mt-3">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Status no Mercado
              </Text>
              <Pressable
                onPress={() => setAbertoOportunidades(!abertoOportunidades)}
                className={`flex-row items-center justify-between p-3 rounded-xl border ${
                  abertoOportunidades
                    ? 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/40'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60'
                }`}
              >
                <View className="flex-row items-center gap-2">
                  <View
                    className={`h-2.5 w-2.5 rounded-full ${
                      abertoOportunidades ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  <Text
                    className={`text-xs font-bold ${
                      abertoOportunidades
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {abertoOportunidades ? 'Aberto a Oportunidades' : 'Indisponível no Momento'}
                  </Text>
                </View>

                <View
                  className={`px-2 py-0.5 rounded-full ${
                    abertoOportunidades ? 'bg-emerald-600' : 'bg-slate-400'
                  }`}
                >
                  <Text className="text-[10px] font-bold text-white">
                    {abertoOportunidades ? 'Ativo' : 'Pausado'}
                  </Text>
                </View>
              </Pressable>
            </View>
          </ScrollView>

          {/* Botões de Ação */}
          <View className="flex-row items-center gap-2.5 pt-2">
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={onClose}
              className="flex-1 py-2.5"
            />
            <Button
              title={salvando ? 'Salvando...' : 'Salvar Alterações'}
              variant="primary"
              onPress={handleSalvar}
              disabled={salvando}
              className="flex-1 py-2.5"
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
  );
}
