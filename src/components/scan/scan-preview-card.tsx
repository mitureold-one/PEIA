import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScanPreviewCardProps {
  recognizedText: string;
  onChangeText: (txt: string) => void;
  onImport: () => void;
}

export function ScanPreviewCard({
  recognizedText,
  onChangeText,
  onImport,
}: ScanPreviewCardProps) {
  if (!recognizedText) return null;

  return (
    <View className="gap-3 p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
      <View className="flex-row items-center gap-2">
        <Ionicons name="create-outline" size={20} color="#10b981" />
        <Text className="text-base font-semibold text-slate-900 dark:text-white">
          Revise o Texto Reconhecido
        </Text>
      </View>

      <Text className="text-xs text-slate-500 dark:text-slate-400">
        Você pode ajustar e corrigir eventuais erros de leitura antes de enviar para o seu currículo.
      </Text>

      <Input
        label="Conteúdo extraído via OCR"
        value={recognizedText}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
        className="min-h-[160px]"
      />

      <Button
        title="Importar para o Currículo Geral"
        icon={<Ionicons name="checkmark-done-outline" size={20} color="#fff" />}
        onPress={onImport}
      />
    </View>
  );
}

