import { Text, View } from 'react-native';

export function ScanHeader() {
  return (
    <View className="gap-1">
      <Text className="text-2xl font-bold text-slate-900 dark:text-white">
        Ler currículo via OCR
      </Text>
      <Text className="text-sm leading-5 text-slate-600 dark:text-slate-400">
        Use a câmera ou escolha uma imagem/PDF do seu currículo. O texto reconhecido poderá ser revisado antes de ser integrado ao seu currículo geral.
      </Text>
    </View>
  );
}

