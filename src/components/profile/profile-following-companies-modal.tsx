import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEmpresas } from '@/hooks/use-empresas';
import { estudanteSocialActions, useEstudanteSocial } from '@/hooks/use-estudante-social';
import { ROUTES } from '@/constants/routes';

interface ProfileFollowingCompaniesModalProps {
  visible: boolean;
  onClose: () => void;
}

const EMPRESAS_BASE = [
  { id: 'empresa_1', nome: 'TechHub São Luís', setor: 'Tecnologia & Inovação' },
  { id: 'empresa_2', nome: 'Inova Maranhão', setor: 'Startups & P&D' },
  { id: 'empresa_3', nome: 'Vale Lab', setor: 'Engenharia & Mineração' },
  { id: 'empresa_4', nome: 'Ambev Tech', setor: 'Desenvolvimento & Cloud' },
  { id: 'empresa_5', nome: 'Alura & FIAP Hub', setor: 'Educação & EdTech' },
  { id: 'empresa_6', nome: 'Nubank Tech', setor: 'Fintech & Mobile' },
  { id: 'empresa_7', nome: 'Banco do Brasil DITEC', setor: 'Setor Bancário & IA' },
];

export function ProfileFollowingCompaniesModal({
  visible,
  onClose,
}: ProfileFollowingCompaniesModalProps) {
  const router = useRouter();
  const empresasCadastradas = useEmpresas();
  const { seguindoEmpresas } = useEstudanteSocial();
  const [busca, setBusca] = useState('');

  // 1. Unifica empresas cadastradas com base demo garantindo nomes únicos
  const todasEmpresas = useMemo(() => {
    const map = new Map<string, { id: string; nome: string; setor: string }>();

    EMPRESAS_BASE.forEach((e) => map.set(e.id, e));
    empresasCadastradas.forEach((e) =>
      map.set(e.id, { id: e.id, nome: e.nome, setor: 'Empresa Parceira' })
    );

    return Array.from(map.values());
  }, [empresasCadastradas]);

  // 2. Filtra apenas as empresas que o estudante segue, ordenadas em ordem alfabética (A-Z)
  const empresasSeguidasOrdenadas = useMemo(() => {
    return todasEmpresas
      .filter((e) => seguindoEmpresas.includes(e.id))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
  }, [todasEmpresas, seguindoEmpresas]);

  // 3. Aplica filtro de pesquisa em tempo real
  const empresasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return empresasSeguidasOrdenadas;
    return empresasSeguidasOrdenadas.filter((e) =>
      e.nome.toLowerCase().includes(termo) || e.setor.toLowerCase().includes(termo)
    );
  }, [empresasSeguidasOrdenadas, busca]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-slate-50 dark:bg-[#03031b]">
        {/* Cabeçalho da Subtela */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 items-center justify-center">
              <Ionicons name="business" size={20} color="#6366f1" />
            </View>
            <View>
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                Empresas que Você Segue
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {empresasSeguidasOrdenadas.length} {empresasSeguidasOrdenadas.length === 1 ? 'empresa conectada' : 'empresas conectadas'} (A-Z)
              </Text>
            </View>
          </View>

          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Fechar empresas seguidas"
            className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center active:bg-slate-200"
          >
            <Ionicons name="close" size={20} color="#64748b" />
          </Pressable>
        </View>

        {/* Barra de Pesquisa */}
        <View className="p-4 bg-white dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
          <View className="flex-row items-center px-3.5 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
            <Ionicons name="search-outline" size={18} color="#94a3b8" />
            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder="Pesquisar por nome ou setor da empresa..."
              placeholderTextColor="#94a3b8"
              className="flex-1 ml-2.5 text-sm text-slate-900 dark:text-white"
              clearButtonMode="while-editing"
            />
            {busca.length > 0 && (
              <Pressable onPress={() => setBusca('')}>
                <Ionicons name="close-circle" size={16} color="#94a3b8" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Lista de Empresas Seguidas (Ordem Alfabética) */}
        <ScrollView
          contentContainerClassName="p-5 gap-3"
          keyboardShouldPersistTaps="handled"
        >
          {empresasFiltradas.length === 0 ? (
            <View className="p-10 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 items-center justify-center my-6">
              <View className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-900 items-center justify-center mb-3">
                <Ionicons name="search-outline" size={24} color="#94a3b8" />
              </View>
              <Text className="text-sm font-bold text-slate-800 dark:text-slate-200 text-center">
                {busca ? 'Nenhuma empresa encontrada' : 'Você ainda não segue empresas'}
              </Text>
              <Text className="text-xs text-slate-400 text-center max-w-xs mt-1">
                {busca
                  ? `Nenhum resultado para "${busca}". Verifique a digitação ou limpe a busca.`
                  : 'Acompanhe empresas para receber vagas prioritárias no seu feed.'}
              </Text>
            </View>
          ) : (
            empresasFiltradas.map((empresa) => {
              const primeiraLetra = (empresa.nome[0] || 'E').toUpperCase();

              return (
                <View
                  key={empresa.id}
                  className="flex-row items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 shadow-xs"
                >
                  <View className="flex-row items-center gap-3.5 flex-1 mr-2">
                    <View className="h-11 w-11 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 items-center justify-center border border-indigo-200 dark:border-indigo-800">
                      <Text className="text-base font-black text-indigo-600 dark:text-indigo-400">
                        {primeiraLetra}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text
                        numberOfLines={1}
                        className="text-sm font-bold text-slate-900 dark:text-white"
                      >
                        {empresa.nome}
                      </Text>
                      <Text
                        numberOfLines={1}
                        className="text-xs text-slate-500 dark:text-slate-400 mt-0.5"
                      >
                        {empresa.setor}
                      </Text>
                    </View>
                  </View>

                  {/* Ação de Deixar de Seguir */}
                  <Pressable
                    onPress={() => estudanteSocialActions.toggleSeguirEmpresa(empresa.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Deixar de seguir ${empresa.nome}`}
                    className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 active:scale-95"
                  >
                    <Ionicons name="checkmark" size={13} color="#10b981" />
                    <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Seguindo
                    </Text>
                  </Pressable>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
