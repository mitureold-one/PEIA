import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Vaga } from '@/data/vagas';
import { useCurriculoGeral, curriculoActions } from '@/hooks/use-curriculo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ModalCandidaturaVagaProps {
  visible: boolean;
  vaga: Vaga;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalCandidaturaVaga({
  visible,
  vaga,
  onClose,
  onSuccess,
}: ModalCandidaturaVagaProps) {
  const curriculoGeral = useCurriculoGeral();

  // Pitch customizado adaptado para os requisitos da vaga
  const [pitch, setPitch] = useState(curriculoGeral.resumoGeral);

  // Seleção de experiências e habilidades
  const [experienciasSelecionadas, setExperienciasSelecionadas] = useState<string[]>(
    curriculoGeral.experiencias.map((e) => e.id)
  );
  const [habilidadesSelecionadas, setHabilidadesSelecionadas] = useState<string[]>(
    curriculoGeral.habilidades.map((h) => h.id)
  );

  const toggleExperiencia = (id: string) => {
    setExperienciasSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleHabilidade = (id: string) => {
    setHabilidadesSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const submeterCandidatura = () => {
    curriculoActions.gerarECandidatar({
      curriculoGeral,
      vagaId: vaga.id,
      tituloVaga: vaga.titulo,
      empresaVaga: vaga.empresa,
      resumoCustomizado: pitch,
      idsExperiencias: experienciasSelecionadas,
      idsHabilidades: habilidadesSelecionadas,
      idsFormacoes: curriculoGeral.formacoes.map((f) => f.id),
      idsProjetos: curriculoGeral.projetos.map((p) => p.id),
    });

    onSuccess();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 bg-black/60 justify-end">
        <Pressable className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 max-h-[85%] border-t border-slate-200 dark:border-slate-800">
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <View>
              <Text className="text-lg font-bold text-slate-900 dark:text-white">
                Direcionar Currículo
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
            <Text className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Personalize o currículo que a empresa receberá. Ajuste seu resumo para destacar as exigências da vaga e marque as qualificações mais pertinentes.
            </Text>

            {/* Pitch / Resumo específico */}
            <View className="mb-5">
              <Input
                label="Resumo / Pitch para a vaga"
                value={pitch}
                onChangeText={setPitch}
                placeholder="Por que você é a pessoa ideal para esta oportunidade?"
                multiline
                textAlignVertical="top"
                className="min-h-[90px]"
              />
            </View>

            {/* Seleção de Habilidades */}
            <View className="gap-2 mb-5">
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Habilidades a Destacar ({habilidadesSelecionadas.length}/{curriculoGeral.habilidades.length})
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {curriculoGeral.habilidades.map((h) => {
                  const marcada = habilidadesSelecionadas.includes(h.id);
                  return (
                    <Pressable
                      key={h.id}
                      onPress={() => toggleHabilidade(h.id)}
                      className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                        marcada
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Ionicons
                        name={marcada ? 'checkbox' : 'square-outline'}
                        size={14}
                        color={marcada ? '#ffffff' : '#94a3b8'}
                      />
                      <Text
                        className={`text-xs font-medium ${
                          marcada ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {h.nome}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Seleção de Experiências */}
            <View className="gap-2 mb-4">
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Experiências a Incluir
              </Text>
              {curriculoGeral.experiencias.map((e) => {
                const marcada = experienciasSelecionadas.includes(e.id);
                return (
                  <Pressable
                    key={e.id}
                    onPress={() => toggleExperiencia(e.id)}
                    className={`p-3 rounded-xl border flex-row items-center gap-3 ${
                      marcada
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                    }`}
                  >
                    <Ionicons
                      name={marcada ? 'checkmark-circle' : 'ellipse-outline'}
                      size={20}
                      color={marcada ? '#4f46e5' : '#94a3b8'}
                    />
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-slate-900 dark:text-white">
                        {e.cargo}
                      </Text>
                      <Text className="text-xs text-slate-500 dark:text-slate-400">
                        {e.empresa} ({e.dataInicio} {e.atual ? '- Atual' : ''})
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View className="flex-row gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button title="Cancelar" variant="secondary" className="flex-1" onPress={onClose} />
            <Button title="Enviar Candidatura" className="flex-1" onPress={submeterCandidatura} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
