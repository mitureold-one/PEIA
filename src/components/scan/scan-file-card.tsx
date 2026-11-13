import { Button } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface ScanFileCardProps {
  fileName: string;
  reading: boolean;
  onChooseFile: () => void;
  onSwitchToCamera?: () => void;
}

export function ScanFileCard({
  fileName,
  reading,
  onChooseFile,
}: ScanFileCardProps) {
  return (
    <View className="gap-4 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      {/* Cabeçalho */}
      <View className="flex-row items-center gap-2.5">
        <View className="h-8 w-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 items-center justify-center">
          <Ionicons name="folder-open-outline" size={18} color="#6366f1" />
        </View>
        <View>
          <Text className="text-base font-bold text-slate-900 dark:text-white">
            Arquivo Digital (PDF / Imagem)
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400">
            Importe seu currículo direto da memória do aparelho
          </Text>
        </View>
      </View>

      <View className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 gap-2">
        <Text className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Selecione uma imagem (<Text className="font-semibold">JPG, PNG</Text>) ou um arquivo <Text className="font-semibold">PDF</Text>. O motor OCR do PEIA processará e converterá o conteúdo para texto editável.
        </Text>
        <Text className="text-[11px] text-slate-400 dark:text-slate-500">
          • Limite máximo recomendado: 5 MB e até 25 páginas.
        </Text>
      </View>

      <Button
        title={reading ? 'Lendo arquivo…' : 'Selecionar imagem ou PDF'}
        variant="primary"
        icon={<Ionicons name="cloud-upload-outline" size={18} color="#fff" />}
        disabled={reading}
        onPress={onChooseFile}
      />

      {!!fileName && (
        <View className="flex-row items-center justify-between p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900">
          <View className="flex-row items-center gap-2 flex-1 mr-2">
            <Ionicons name="document-text" size={18} color="#6366f1" />
            <Text
              numberOfLines={1}
              className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex-1"
            >
              {fileName}
            </Text>
          </View>
          <View className="h-5 w-5 rounded-full bg-emerald-500 items-center justify-center">
            <Ionicons name="checkmark" size={12} color="#fff" />
          </View>
        </View>
      )}

    </View>
  );
}
