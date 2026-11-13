import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { curriculoActions, useCurriculoGeral } from '@/hooks/use-curriculo';
import { Button } from '@/components/ui/button';
import type { CategoriaHabilidade } from '@/data/curriculo';

/**
 * Seção "Competências & Idiomas" do estudante na main do perfil.
 */
export function ProfileStudentSkills() {
  const curriculo = useCurriculoGeral();

  // Estados locais para adicionar habilidade
  const [novaHabilidade, setNovaHabilidade] = useState('');
  const [categoria, setCategoria] = useState<CategoriaHabilidade>('tecnica');

  // Estados locais para adicionar idioma
  const [novoIdioma, setNovoIdioma] = useState('');
  const [nivelIdioma, setNivelIdioma] = useState<'Básico' | 'Intermediário' | 'Avançado' | 'Fluente'>('Intermediário');
  const [exibirFormIdioma, setExibirFormIdioma] = useState(false);

  const handleAdicionarHabilidade = () => {
    if (!novaHabilidade.trim()) return;
    curriculoActions.adicionarHabilidade({
      nome: novaHabilidade.trim(),
      categoria,
      nivel: 'intermediario',
    });
    setNovaHabilidade('');
  };

  const handleAdicionarIdioma = () => {
    if (!novoIdioma.trim()) return;
    curriculoActions.adicionarIdioma({
      nome: novoIdioma.trim(),
      nivel: nivelIdioma,
    });
    setNovoIdioma('');
    setExibirFormIdioma(false);
  };

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-4">
      {/* 1. Bloco de Competências e Habilidades */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <View className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-950/70 items-center justify-center">
              <Ionicons name="flash-outline" size={16} color="#f59e0b" />
            </View>
            <View>
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                Competências & Habilidades
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                Técnicas, ferramentas e soft skills
              </Text>
            </View>
          </View>
        </View>

        {/* Input para Adição Rápida */}
        <View className="flex-row gap-2">
          <TextInput
            value={novaHabilidade}
            onChangeText={setNovaHabilidade}
            placeholder="Ex: React Native, Git, Scrum..."
            placeholderTextColor="#94a3b8"
            className="flex-1 h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
          />
          <Button
            title="Adicionar"
            variant="primary"
            onPress={handleAdicionarHabilidade}
            className="px-4 py-2.5"
          />
        </View>

        {/* Seleção de Categoria */}
        <View className="flex-row gap-1.5">
          {(['tecnica', 'comportamental', 'ferramenta'] as CategoriaHabilidade[]).map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setCategoria(cat)}
              className={`px-3 py-1 rounded-xl border ${
                categoria === cat
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Text
                className={`text-[11px] font-semibold ${
                  categoria === cat ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat === 'tecnica' ? 'Técnica' : cat === 'comportamental' ? 'Soft Skill' : 'Ferramenta'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Chips de Habilidades */}
        <View className="flex-row flex-wrap gap-2 pt-1">
          {curriculo.habilidades.length === 0 ? (
            <Text className="text-xs text-slate-500 dark:text-slate-400 py-2">
              Nenhuma competência cadastrada ainda.
            </Text>
          ) : (
            curriculo.habilidades.map((h) => (
              <View
                key={h.id}
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <Text className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {h.nome}
                </Text>
                <Pressable
                  onPress={() => curriculoActions.removerHabilidade(h.id)}
                  hitSlop={8}
                  accessibilityLabel={`Remover habilidade ${h.nome}`}
                >
                  <Ionicons name="close-circle" size={14} color="#94a3b8" />
                </Pressable>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Divisor */}
      <View className="h-px w-full bg-slate-100 dark:bg-slate-800" />

      {/* 2. Bloco de Idiomas */}
      <View className="gap-2.5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="globe-outline" size={16} color="#6366f1" />
            <Text className="text-sm font-bold text-slate-900 dark:text-white">
              Idiomas
            </Text>
          </View>

          {!exibirFormIdioma && (
            <Pressable
              onPress={() => setExibirFormIdioma(true)}
              className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 active:scale-95"
            >
              <Ionicons name="add" size={13} color="#6366f1" />
              <Text className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                Adicionar Idioma
              </Text>
            </Pressable>
          )}
        </View>

        {/* Formulário de Adicionar Idioma */}
        {exibirFormIdioma && (
          <View className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 gap-2.5">
            <TextInput
              value={novoIdioma}
              onChangeText={setNovoIdioma}
              placeholder="Ex: Inglês, Espanhol..."
              placeholderTextColor="#94a3b8"
              className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />

            <View className="flex-row gap-1.5">
              {(['Básico', 'Intermediário', 'Avançado', 'Fluente'] as const).map((nivel) => (
                <Pressable
                  key={nivel}
                  onPress={() => setNivelIdioma(nivel)}
                  className={`px-2.5 py-1 rounded-lg border ${
                    nivelIdioma === nivel
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Text
                    className={`text-[10px] font-semibold ${
                      nivelIdioma === nivel ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {nivel}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View className="flex-row items-center gap-2 pt-1">
              <Button
                title="Cancelar"
                variant="secondary"
                onPress={() => setExibirFormIdioma(false)}
                className="flex-1 py-2"
              />
              <Button
                title="Salvar"
                variant="primary"
                onPress={handleAdicionarIdioma}
                className="flex-1 py-2"
              />
            </View>
          </View>
        )}

        {/* Lista de Idiomas */}
        <View className="flex-row flex-wrap gap-2">
          {curriculo.idiomas.length === 0 ? (
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Nenhum idioma cadastrado.
            </Text>
          ) : (
            curriculo.idiomas.map((i) => (
              <View
                key={i.id}
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <Text className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {i.nome} ({i.nivel})
                </Text>
                <Pressable
                  onPress={() => curriculoActions.removerIdioma(i.id)}
                  hitSlop={8}
                  accessibilityLabel={`Remover idioma ${i.nome}`}
                >
                  <Ionicons name="close-circle" size={14} color="#94a3b8" />
                </Pressable>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
}

