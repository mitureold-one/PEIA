import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ScanFeedbackProps {
  reading: boolean;
  error?: string | null;
  onDismissError?: () => void;
}

export function ScanFeedback({
  reading,
  error,
  onDismissError,
}: ScanFeedbackProps) {
  if (!reading && !error) return null;

  return (
    <View className="gap-2.5">
      {/* Feedback de Leitura / Processamento OCR */}
      {reading && (
        <View
          accessibilityLiveRegion="polite"
          className="flex-row items-center gap-3 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900"
        >
          <ActivityIndicator size="small" color="#6366f1" />
          <View className="flex-1">
            <Text className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
              Processando OCR...
            </Text>
            <Text className="text-[11px] text-indigo-700 dark:text-indigo-400">
              Lendo e extraindo o texto do currículo no aparelho. Aguarde um instante.
            </Text>
          </View>
        </View>
      )}

      {/* Alerta de Erro */}
      {!!error && (
        <View
          accessibilityRole="alert"
          className="flex-row items-start justify-between gap-3 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800"
        >
          <View className="flex-row items-start gap-2.5 flex-1">
            <Ionicons name="alert-circle" size={18} color="#e11d48" className="mt-0.5" />
            <Text className="text-xs leading-relaxed text-rose-700 dark:text-rose-300 flex-1">
              {error}
            </Text>
          </View>

          {onDismissError && (
            <Pressable
              onPress={onDismissError}
              accessibilityRole="button"
              accessibilityLabel="Fechar mensagem de erro"
              className="p-1 rounded-full active:bg-rose-200/60 dark:active:bg-rose-900/60"
            >
              <Ionicons name="close" size={16} color="#e11d48" />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

