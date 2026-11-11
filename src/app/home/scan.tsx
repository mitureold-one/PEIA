import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurriculoScanner } from '@/hooks/use-curriculo-scanner';
import { ScanHeader } from '@/components/scan/scan-header';
import { ScanCameraCard } from '@/components/scan/scan-camera-card';
import { ScanFileCard } from '@/components/scan/scan-file-card';
import { ScanPreviewCard } from '@/components/scan/scan-preview-card';

export default function Scan() {
  const {
    cameraRef,
    permission,
    requestPermission,
    cameraReady,
    setCameraReady,
    photoUri,
    fileName,
    recognizedText,
    setRecognizedText,
    reading,
    error,
    setError,
    captureAndRead,
    chooseFile,
    resetPhoto,
    importToProfile,
  } = useCurriculoScanner();

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <ScrollView contentContainerClassName="gap-4 p-6" keyboardShouldPersistTaps="handled">
        {/* Cabeçalho explicativo */}
        <ScanHeader />

        {/* Captura direta por Câmera */}
        <ScanCameraCard
          cameraRef={cameraRef}
          permission={permission}
          onRequestPermission={() => void requestPermission()}
          cameraReady={cameraReady}
          onCameraReady={() => setCameraReady(true)}
          onMountError={setError}
          photoUri={photoUri}
          reading={reading}
          onCaptureAndRead={() => void captureAndRead()}
          onResetPhoto={resetPhoto}
        />

        <View className="items-center my-1">
          <Text className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            ou
          </Text>
        </View>

        {/* Seleção de arquivo de imagem ou PDF */}
        <ScanFileCard
          fileName={fileName}
          reading={reading}
          onChooseFile={() => void chooseFile()}
        />

        {/* Feedback de processamento OCR */}
        {reading && (
          <Text
            accessibilityLiveRegion="polite"
            className="text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 py-2"
          >
            Lendo e processando o texto no aparelho…
          </Text>
        )}

        {/* Exibição de alertas de erro */}
        {!!error && (
          <View className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
            <Text accessibilityRole="alert" className="text-xs text-rose-600 dark:text-rose-400">
              {error}
            </Text>
          </View>
        )}

        {/* Textarea e ação de importação do texto extraído */}
        <ScanPreviewCard
          recognizedText={recognizedText}
          onChangeText={setRecognizedText}
          onImport={() => void importToProfile()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
