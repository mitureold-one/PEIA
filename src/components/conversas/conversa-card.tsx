import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type ConversaCandidatura } from '@/data/feedback';

interface ConversaCardProps {
  conversa: ConversaCandidatura;
  onPress: () => void;
}

export function ConversaCard({ conversa, onPress }: ConversaCardProps) {
  const ultimaMensagem = conversa.mensagens[conversa.mensagens.length - 1];
  const { scoreMatch, nivelCompatibilidade } = conversa.analise;

  const scoreBadgeBg =
    scoreMatch >= 80
      ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800'
      : scoreMatch >= 65
      ? 'bg-indigo-100 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-800'
      : 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800';

  const scoreTextColor =
    scoreMatch >= 80
      ? 'text-emerald-700 dark:text-emerald-300'
      : scoreMatch >= 65
      ? 'text-indigo-700 dark:text-indigo-300'
      : 'text-amber-700 dark:text-amber-300';

  const horaFormatada = ultimaMensagem
    ? new Date(ultimaMensagem.timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-2.5 active:opacity-75 shadow-sm"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-2">
          <Text className="font-bold text-slate-900 dark:text-white text-base">
            {conversa.tituloVaga}
          </Text>
          <Text className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            {conversa.empresa}
          </Text>
        </View>

        {/* Badge de Match Score do Currículo */}
        <View className={`px-2.5 py-1 rounded-full border flex-row items-center gap-1 ${scoreBadgeBg}`}>
          <Ionicons name="sparkles" size={12} color={scoreMatch >= 80 ? '#10b981' : '#6366f1'} />
          <Text className={`text-xs font-bold ${scoreTextColor}`}>
            {scoreMatch}% Match
          </Text>
        </View>
      </View>

      {/* Prévia da última mensagem ou feedback */}
      {ultimaMensagem && (
        <View className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {ultimaMensagem.nomeRemetente}
            </Text>
            <Text className="text-[10px] text-slate-400">
              {horaFormatada}
            </Text>
          </View>
          <Text numberOfLines={2} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {ultimaMensagem.texto}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

