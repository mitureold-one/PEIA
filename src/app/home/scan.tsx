import React from 'react';
import { ScrollView, View } from 'react-native';
import { useCurriculoScanner } from '@/hooks/use-curriculo-scanner';
import { ScanHeader } from '@/components/scan/scan-header';
import { ScanModeTabs } from '@/components/scan/scan-mode-tabs';
import { ScanCameraCard } from '@/components/scan/scan-camera-card';
import { ScanFileCard } from '@/components/scan/scan-file-card';
import { ScanFeedback } from '@/components/scan/scan-feedback';
import { ScanPreviewCard } from '@/components/scan/scan-preview-card';

/**
 * Rota do Scanner OCR de Currículos (/home/scan).
 * Orquestra modularmente a captura de imagem por câmera ou seleção de arquivos (PDF/imagem),
 * com feedback de processamento e revisão prévia antes da importação para o perfil.
 */
export default function Scan() {
  const {
    mode,
    setMode,
    isFocused,
    cameraRef,
    permission,
    requestPermission,
    openAppSettings,
    cameraActive,
    startCamera,
    stopCamera,
    cameraReady,
    setCameraReady,
    photoUri,
    fileName,
    recognizedText,
    setRecognizedText,
    reading,
    error,
    setError,
    clearError,
    captureAndRead,
    takePhotoWithCamera,
    chooseFile,
    resetPhoto,
    retakePhoto,
    importToProfile,
  } = useCurriculoScanner();

  return (
    <View className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 p-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho explicativo */}
        <ScanHeader />

        {/* Seletor de Modo: Arquivo (Principal) ou Câmera (Secundário) */}
        <ScanModeTabs
          activeMode={mode}
          onSelectMode={setMode}
          disabled={reading}
        />

        {/* Método 1 (Principal): Arquivo Digital (PDF ou Imagem) */}
        {mode === 'arquivo' && (
          <ScanFileCard
            fileName={fileName}
            reading={reading}
            onChooseFile={() => void chooseFile()}
            onSwitchToCamera={() => setMode('camera')}
          />
        )}

        {/* Método 2 (Secundário): Câmera */}
        {mode === 'camera' && (
          <ScanCameraCard
            cameraRef={cameraRef}
            permission={permission}
            onRequestPermission={() => void requestPermission()}
            onOpenSettings={() => void openAppSettings()}
            cameraActive={cameraActive}
            isFocused={isFocused}
            onStartCamera={() => void startCamera()}
            onStopCamera={stopCamera}
            cameraReady={cameraReady}
            onCameraReady={() => setCameraReady(true)}
            onMountError={setError}
            photoUri={photoUri}
            reading={reading}
            onCaptureAndRead={() => void captureAndRead()}
            onTakePhotoWithCamera={() => void takePhotoWithCamera()}
            onResetPhoto={resetPhoto}
            onRetakePhoto={retakePhoto}
            onSwitchToArquivo={() => setMode('arquivo')}
          />
        )}

        {/* Feedback de processamento OCR e mensagens de alerta */}
        <ScanFeedback
          reading={reading}
          error={error}
          onDismissError={clearError}
        />

        {/* Textarea e ação de importação do texto extraído */}
        <ScanPreviewCard
          recognizedText={recognizedText}
          onChangeText={setRecognizedText}
          onImport={() => void importToProfile()}
          onClear={resetPhoto}
        />
      </ScrollView>
    </View>
  );
}
