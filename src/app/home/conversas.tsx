import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type ConversaCandidatura } from '@/data/feedback';
import { useConversas } from '@/hooks/use-conversas';
import { ConversaCard } from '@/components/conversas/conversa-card';
import { ConversaDetalheModal } from '@/components/conversas/conversa-detalhe-modal';
import { ConversasEmpty } from '@/components/conversas/conversas-empty';

export default function Conversas() {
  const conversas = useConversas();
  const [conversaSelecionada, setConversaSelecionada] = useState<ConversaCandidatura | null>(null);

  // Mantém a conversa ativa sincronizada com novas mensagens
  const conversaAtualizada =
    conversaSelecionada
      ? conversas.find((c) => c.id === conversaSelecionada.id) || conversaSelecionada
      : null;

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <FlatList
        data={conversas}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-3 p-6"
        ListHeaderComponent={
          <View className="mb-2 gap-1">
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">
              Feedbacks & Conversas
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              Acompanhe o diagnóstico do seu currículo em cada vaga e interaja com os recrutadores.
            </Text>
          </View>
        }
        ListEmptyComponent={<ConversasEmpty />}
        renderItem={({ item }) => (
          <ConversaCard
            conversa={item}
            onPress={() => setConversaSelecionada(item)}
          />
        )}
      />

      <ConversaDetalheModal
        visible={!!conversaSelecionada}
        conversa={conversaAtualizada}
        onClose={() => setConversaSelecionada(null)}
      />
    </SafeAreaView>
  );
}

