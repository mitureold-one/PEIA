import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScanPreviewCardProps {
  recognizedText: string;
  onChangeText: (txt: string) => void;
  onImport: () => void;
  onClear?: () => void;
}

export function ScanPreviewCard({
  recognizedText,
  onChangeText,
  onImport,
  onClear,
}: ScanPreviewCardProps) {
  if (!recognizedText) return null;

  const charCount = recognizedText.length;

  return (
    <View className="gap-3.5 p-5 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Cabeçalho */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 items-center justify-center">
            <Ionicons name="checkmark-circle-outline" size={18} color="#10b981" />
          </View>
          <View>
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              Texto Reconhecido
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Revise e edite os dados extraídos
            </Text>
          </View>
        </View>

        <View className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <Text className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
            {charCount} caracteres
          </Text>
        </View>
      </View>

      <Text className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        Você pode ajustar e corrigir eventuais erros de pontuação ou ortografia do documento antes de salvar em seu perfil.
      </Text>

      <Input
        label="Conteúdo Extraído"
        value={recognizedText}
        onChangeText={onChangeText}
        multiline
        numberOfLines={8}
        textAlignVertical="top"
        className="min-h-[160px] text-xs leading-relaxed"
      />

      <View className="gap-2 pt-1">
        <Button
          title="Importar para o Perfil (Sobre Mim)"
          variant="primary"
          icon={<Ionicons name="checkmark-done" size={18} color="#fff" />}
          onPress={onImport}
        />

        {onClear && (
          <Button
            title="Limpar e Recomeçar"
            variant="secondary"
            icon={<Ionicons name="trash-outline" size={16} color="#fff" />}
            onPress={onClear}
          />
        )}
      </View>
    </View>
  );
}
