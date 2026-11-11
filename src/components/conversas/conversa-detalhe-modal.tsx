import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type ConversaCandidatura } from '@/data/feedback';
import { conversasActions } from '@/hooks/use-conversas';

interface ConversaDetalheModalProps {
  visible: boolean;
  conversa: ConversaCandidatura | null;
  onClose: () => void;
}

export function ConversaDetalheModal({
  visible,
  conversa,
  onClose,
}: ConversaDetalheModalProps) {
  const [mensagemTexto, setMensagemTexto] = useState('');
  const [mostrarDiagnostico, setMostrarDiagnostico] = useState(true);

  if (!conversa) return null;

  const enviar = async () => {
    if (!mensagemTexto.trim()) return;
    const txt = mensagemTexto;
    setMensagemTexto('');
    await conversasActions.enviarMensagem(conversa.id, txt);
  };

  const { scoreMatch, nivelCompatibilidade, pontosFortes, pontosMelhoria, dicasEntrevista } =
    conversa.analise;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-black/60 justify-end"
      >
        <View className="bg-white dark:bg-slate-900 rounded-t-3xl max-h-[92%] h-[92%] border-t border-slate-200 dark:border-slate-800 flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <View className="flex-1 mr-2">
              <Text className="text-lg font-bold text-slate-900 dark:text-white">
                {conversa.tituloVaga}
              </Text>
              <Text className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                {conversa.empresa} · Canal de Feedback
              </Text>
            </View>
            <Pressable onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#94a3b8" />
            </Pressable>
          </View>

          <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
            {/* Toggle Card de Diagnóstico do Currículo */}
            <Pressable
              onPress={() => setMostrarDiagnostico(!mostrarDiagnostico)}
              className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 mb-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="sparkles" size={18} color="#4f46e5" />
                  <Text className="font-bold text-slate-900 dark:text-white text-sm">
                    Diagnóstico IA do Currículo
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="px-2 py-0.5 rounded-full bg-indigo-600">
                    <Text className="text-[11px] font-bold text-white">
                      {scoreMatch}% Match ({nivelCompatibilidade})
                    </Text>
                  </View>
                  <Ionicons
                    name={mostrarDiagnostico ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#6366f1"
                  />
                </View>
              </View>

              {mostrarDiagnostico && (
                <View className="mt-3 pt-3 border-t border-indigo-200/60 dark:border-indigo-900/60 gap-2.5">
                  <View className="gap-1">
                    <Text className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Pontos Fortes Identificados:
                    </Text>
                    {pontosFortes.map((ponto, i) => (
                      <Text key={i} className="text-xs text-slate-700 dark:text-slate-300">
                        • {ponto}
                      </Text>
                    ))}
                  </View>

                  <View className="gap-1">
                    <Text className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Oportunidades de Melhoria:
                    </Text>
                    {pontosMelhoria.map((ponto, i) => (
                      <Text key={i} className="text-xs text-slate-700 dark:text-slate-300">
                        • {ponto}
                      </Text>
                    ))}
                  </View>

                  {dicasEntrevista && (
                    <View className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 mt-1">
                      <Text className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-0.5">
                        Dica para a Entrevista:
                      </Text>
                      <Text className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {dicasEntrevista}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </Pressable>

            {/* Linha do tempo das mensagens */}
            <View className="gap-3 pb-6">
              {conversa.mensagens.map((msg) => {
                const ehAluno = msg.remetente === 'aluno';
                const ehIA = msg.remetente === 'ia_peia';

                return (
                  <View
                    key={msg.id}
                    className={`max-w-[85%] ${
                      ehAluno ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    <Text className="text-[10px] font-medium text-slate-400 mb-1 px-1">
                      {msg.nomeRemetente} ·{' '}
                      {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    <View
                      className={`p-3.5 rounded-2xl ${
                        ehAluno
                          ? 'bg-indigo-600 rounded-tr-none'
                          : ehIA
                          ? 'bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 rounded-tl-none'
                          : 'bg-slate-100 dark:bg-slate-800 rounded-tl-none border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Text
                        className={`text-xs leading-relaxed ${
                          ehAluno
                            ? 'text-white'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {msg.texto}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* Campo de envio de resposta */}
          <View className="p-4 border-t border-slate-100 dark:border-slate-800 flex-row items-center gap-2">
            <TextInput
              placeholder="Digite uma mensagem ou tire dúvidas..."
              placeholderTextColor="#94a3b8"
              value={mensagemTexto}
              onChangeText={setMensagemTexto}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 text-xs text-slate-900 dark:text-white"
            />
            <Pressable
              onPress={enviar}
              disabled={!mensagemTexto.trim()}
              className={`h-10 w-10 rounded-full items-center justify-center ${
                mensagemTexto.trim()
                  ? 'bg-indigo-600 active:bg-indigo-700'
                  : 'bg-slate-300 dark:bg-slate-800 opacity-60'
              }`}
            >
              <Ionicons name="send" size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

