import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';

export interface ProfileMetricDialogModalProps<T> {
  visible: boolean;
  title: string;
  countLabel: string;
  iconName: keyof typeof Ionicons.glyphMap;
  searchPlaceholder: string;
  items: T[];
  filterFn: (item: T, query: string) => boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  onClose: () => void;
}

/**
 * Modal genérico centralizado com fundo escurecido e borrado,
 * suporte a busca em tempo real, lista rolável e fechamento limpo no centro da tela.
 */
export function ProfileMetricDialogModal<T>({
  visible,
  title,
  countLabel,
  iconName,
  searchPlaceholder,
  items,
  filterFn,
  renderItem,
  emptyMessage = 'Nenhum resultado encontrado.',
  onClose,
}: ProfileMetricDialogModalProps<T>) {
  const [busca, setBusca] = useState('');

  const itemsFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return items;
    return items.filter((item) => filterFn(item, termo));
  }, [items, busca, filterFn]);

  const handleClose = () => {
    setBusca('');
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop com fundo escuro translúcido - toque fora fecha */}
      <Pressable
        onPress={handleClose}
        className="flex-1 bg-black/70 backdrop-blur-md items-center justify-center p-4 sm:p-6"
      >
        {/* Card do Modal Centralizado */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full max-w-lg max-h-[82vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex-col"
        >
          {/* Cabeçalho */}
          <View className="flex-row items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">
            <View className="flex-row items-center gap-3 flex-1 mr-2">
              <View className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 items-center justify-center border border-indigo-100 dark:border-indigo-900/60">
                <Ionicons name={iconName} size={20} color="#6366f1" />
              </View>
              <View className="flex-1">
                <Text numberOfLines={1} className="text-base font-bold text-slate-900 dark:text-white">
                  {title}
                </Text>
                <Text numberOfLines={1} className="text-xs text-slate-500 dark:text-slate-400">
                  {countLabel}
                </Text>
              </View>
            </View>

            {/* Botão de Fechar no Topo Direito */}
            <Pressable
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Fechar janela"
              className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center active:bg-slate-200 dark:active:bg-slate-700"
            >
              <Ionicons name="close" size={20} color="#64748b" />
            </Pressable>
          </View>

          {/* Campo de Busca em Tempo Real */}
          <View className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/40">
            <View className="flex-row items-center px-3.5 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Ionicons name="search-outline" size={17} color="#94a3b8" />
              <TextInput
                value={busca}
                onChangeText={setBusca}
                placeholder={searchPlaceholder}
                placeholderTextColor="#94a3b8"
                className="flex-1 ml-2 text-xs text-slate-900 dark:text-white"
                clearButtonMode="while-editing"
              />
              {busca.length > 0 && (
                <Pressable onPress={() => setBusca('')}>
                  <Ionicons name="close-circle" size={16} color="#94a3b8" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Lista com Rolagem Suave */}
          <ScrollView
            contentContainerClassName="p-5 gap-3"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
            {itemsFiltrados.length === 0 ? (
              <View className="py-10 items-center justify-center">
                <View className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-2.5">
                  <Ionicons name="search-outline" size={22} color="#94a3b8" />
                </View>
                <Text className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-center">
                  {emptyMessage}
                </Text>
                {busca.length > 0 && (
                  <Text className="text-xs text-slate-400 text-center mt-1">
                    Nenhum resultado corresponde a "{busca}".
                  </Text>
                )}
              </View>
            ) : (
              itemsFiltrados.map((item, index) => (
                <View key={index}>{renderItem(item, index)}</View>
              ))
            )}
          </ScrollView>

          {/* Rodapé do Modal */}
          <View className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <Button
              title="Fechar"
              variant="secondary"
              onPress={handleClose}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
