import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ScanHeader() {
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-900">
        <Ionicons name="sparkles" size={13} color="#6366f1" />
        <Text className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
          OCR Inteligente
        </Text>
      </View>

      <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
        Digitalizar Currículo
      </Text>

      <Text className="text-sm leading-5 text-slate-600 dark:text-slate-400">
        Capture uma foto do seu currículo impresso ou selecione um arquivo (PDF ou imagem). O texto será extraído automaticamente para você revisar e enriquecer seu perfil.
      </Text>
    </View>
  );
}
