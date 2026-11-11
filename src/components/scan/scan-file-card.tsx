import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';

interface ScanFileCardProps {
  fileName: string;
  reading: boolean;
  onChooseFile: () => void;
}

export function ScanFileCard({
  fileName,
  reading,
  onChooseFile,
}: ScanFileCardProps) {
  return (
    <View className="gap-3 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4">
      <View className="flex-row items-center gap-2">
        <Ionicons name="document-attach-outline" size={20} color="#4f46e5" />
        <Text className="text-base font-semibold text-slate-900 dark:text-white">
          Opção 2: Escolher um Arquivo
        </Text>
      </View>

      <Text className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        Selecione uma imagem JPG/PNG ou um arquivo PDF. O motor extrairá o conteúdo textual do arquivo.
      </Text>

      <Button
        title={reading ? 'Lendo arquivo…' : 'Selecionar imagem ou PDF'}
        variant="secondary"
        icon={<Ionicons name="folder-open-outline" size={18} color="#fff" />}
        disabled={reading}
        onPress={onChooseFile}
      />

      {!!fileName && (
        <View className="flex-row items-center gap-1.5 p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Ionicons name="document-text-outline" size={14} color="#64748b" />
          <Text className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Arquivo: {fileName}
          </Text>
        </View>
      )}
    </View>
  );
}

