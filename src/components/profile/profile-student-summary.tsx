import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { curriculoActions, useCurriculoGeral } from '@/hooks/use-curriculo';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

/**
 * Seção "Sobre Mim / Resumo Profissional" do estudante na main do perfil.
 */
export function ProfileStudentSummary() {
  const router = useRouter();
  const curriculo = useCurriculoGeral();
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(curriculo.resumoGeral);
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = () => {
    setSalvando(true);
    curriculoActions.atualizarResumoGeral(texto.trim());
    setTimeout(() => {
      setSalvando(false);
      setEditando(false);
    }, 400);
  };

  const handleCancelar = () => {
    setTexto(curriculo.resumoGeral);
    setEditando(false);
  };

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-3">
      {/* Cabeçalho da Seção */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <View className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950/70 items-center justify-center">
            <Ionicons name="document-text-outline" size={16} color="#6366f1" />
          </View>
          <View>
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              Sobre Mim
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Resumo do perfil utilizado para match da IA
            </Text>
          </View>
        </View>

        {!editando && (
          <Pressable
            onPress={() => {
              setTexto(curriculo.resumoGeral);
              setEditando(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Editar resumo profissional"
            className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 active:scale-95"
          >
            <Ionicons name="create-outline" size={14} color="#6366f1" />
            <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Editar
            </Text>
          </Pressable>
        )}
      </View>

      {/* Conteúdo: Modo Edição ou Leitura */}
      {editando ? (
        <View className="gap-3 pt-1">
          <TextInput
            value={texto}
            onChangeText={setTexto}
            multiline
            numberOfLines={4}
            placeholder="Descreva sua trajetória, objetivos de carreira e principais competências..."
            placeholderTextColor="#94a3b8"
            textAlignVertical="top"
            className="min-h-[110px] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white leading-relaxed"
          />

          <View className="flex-row items-center justify-end gap-2">
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={handleCancelar}
              className="py-2 px-4"
            />
            <Button
              title={salvando ? 'Salvando...' : 'Salvar Resumo'}
              variant="primary"
              onPress={handleSalvar}
              disabled={salvando}
              className="py-2 px-5"
            />
          </View>
        </View>
      ) : (
        <View className="pt-1">
          {curriculo.resumoGeral?.trim() ? (
            <Text className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {curriculo.resumoGeral}
            </Text>
          ) : (
            <View className="gap-2">
              <Pressable
                onPress={() => setEditando(true)}
                className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 items-center justify-center"
              >
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  Toque aqui para digitar sua apresentação profissional.
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push(ROUTES.SCAN)}
                className="flex-row items-center justify-center gap-2 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 active:scale-98"
              >
                <Ionicons name="scan-outline" size={16} color="#6366f1" />
                <Text className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  Ou digitalize seu currículo impresso via Scanner OCR →
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

