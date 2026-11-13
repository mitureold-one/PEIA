import { Button } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, type PermissionResponse } from 'expo-camera';
import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface ScanCameraCardProps {
  cameraRef: React.RefObject<CameraView | null>;
  permission: PermissionResponse | null;
  onRequestPermission: () => void;
  onOpenSettings?: () => void;
  cameraActive: boolean;
  isFocused?: boolean;
  onStartCamera: () => void;
  onStopCamera: () => void;
  cameraReady: boolean;
  onCameraReady: () => void;
  onMountError: (err: string) => void;
  photoUri: string | null;
  reading: boolean;
  onCaptureAndRead: () => void;
  onTakePhotoWithCamera: () => void;
  onResetPhoto: () => void;
  onRetakePhoto?: () => void;
  onSwitchToArquivo?: () => void;
}

export function ScanCameraCard({
  cameraRef,
  permission,
  onRequestPermission,
  onOpenSettings,
  cameraActive,
  isFocused = true,
  onStartCamera,
  onStopCamera,
  cameraReady,
  onCameraReady,
  onMountError,
  photoUri,
  reading,
  onCaptureAndRead,
  onTakePhotoWithCamera,
  onResetPhoto,
  onRetakePhoto,
  onSwitchToArquivo,
}: ScanCameraCardProps) {
  return (
    <View className="gap-3 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      {/* Cabeçalho do Card */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 items-center justify-center">
            <Ionicons name="camera-outline" size={18} color="#6366f1" />
          </View>
          <View>
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              Câmera
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Fotografe páginas do documento impresso com boa iluminação
            </Text>
          </View>
        </View>

        {cameraActive && !photoUri && (
          <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
            <View className="h-2 w-2 rounded-full bg-emerald-500" />
            <Text className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
              Ao Vivo
            </Text>
          </View>
        )}
      </View>

      {/* Área da Imagem / Sensor de Câmera */}
      {photoUri ? (
        // Estado 1: Foto Capturada
        <View className="gap-3">
          <View className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Image
              source={{ uri: photoUri }}
              resizeMode="contain"
              className="h-full w-full"
            />
          </View>

          <View className="flex-row items-center gap-2">
            <Button
              title="Tirar outra foto"
              variant="secondary"
              icon={<Ionicons name="refresh" size={18} color="#fff" />}
              disabled={reading}
              onPress={onRetakePhoto || onResetPhoto}
              className="flex-1"
            />
            <Button
              title="Descartar"
              variant="secondary"
              disabled={reading}
              onPress={onResetPhoto}
            />
          </View>
        </View>
      ) : !cameraActive ? (
        // Estado 2: Opções de Captura por Câmera (Sensor desligado até clique)
        <View className="rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-dashed border-slate-300 dark:border-slate-800 items-center justify-center p-6 gap-3">
          <View className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-950/70 items-center justify-center border border-indigo-200 dark:border-indigo-800">
            <Ionicons name="camera" size={32} color="#6366f1" />
          </View>

          <View className="items-center gap-1">
            <Text className="text-sm font-bold text-slate-800 dark:text-slate-200 text-center">
              Fotografar Documento
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              Capture o currículo impresso diretamente com a câmera do seu celular com foco automático.
            </Text>
          </View>

          <View className="w-full gap-2 mt-2">
            <Button
              title="Abrir Câmera e Fotografar"
              icon={<Ionicons name="camera" size={18} color="#fff" />}
              onPress={onTakePhotoWithCamera}
              disabled={reading}
            />

            <Button
              title="Usar visor ao vivo no app"
              variant="secondary"
              icon={<Ionicons name="videocam-outline" size={18} color="#fff" />}
              onPress={onStartCamera}
              disabled={reading}
            />
          </View>
        </View>
      ) : !permission ? (
        // Estado 3A: Carregando/verificando status de permissão
        <View className="aspect-[3/4] w-full rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 items-center justify-center p-6 gap-3">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Verificando permissões de acesso à câmera…
          </Text>
        </View>
      ) : !permission.granted ? (
        // Estado 3B: Sem permissão concedida
        <View className="aspect-[3/4] w-full rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 items-center justify-center p-6 gap-3">
          <View className="h-14 w-14 rounded-full bg-amber-50 dark:bg-amber-950/70 items-center justify-center border border-amber-200 dark:border-amber-800">
            <Ionicons name="lock-closed-outline" size={26} color="#d97706" />
          </View>

          <View className="items-center gap-1">
            <Text className="text-sm font-bold text-slate-800 dark:text-slate-200 text-center">
              Acesso à Câmera Necessário
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              {!permission.canAskAgain
                ? 'A permissão da câmera foi negada no sistema. Abra as configurações do aparelho para conceder o acesso e poder fotografar documentos.'
                : 'O aplicativo precisa de autorização para abrir o sensor da câmera e capturar a foto do seu currículo.'}
            </Text>
          </View>

          <View className="w-full gap-2 mt-2">
            {!permission.canAskAgain && onOpenSettings ? (
              <Button
                title="Abrir Configurações do Aparelho"
                icon={<Ionicons name="settings-outline" size={18} color="#fff" />}
                onPress={onOpenSettings}
              />
            ) : (
              <Button
                title="Permitir acesso à câmera"
                icon={<Ionicons name="camera-outline" size={18} color="#fff" />}
                onPress={onRequestPermission}
              />
            )}
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={onStopCamera}
            />
          </View>
        </View>
      ) : (
        // Estado 4: Câmera Ativa, com Permissão Concedida e Tela em Foco
        <View className="gap-3">
          <View
            style={{ height: 400, width: '100%' }}
            className="overflow-hidden rounded-2xl bg-slate-950 relative border border-slate-800 shadow-inner"
          >
            {isFocused ? (
              <CameraView
                ref={cameraRef as any}
                facing="back"
                style={StyleSheet.absoluteFill}
                onCameraReady={onCameraReady}
                onMountError={(e) => onMountError(e.message)}
              />
            ) : (
              <View className="h-full w-full bg-slate-950 items-center justify-center">
                <Text className="text-xs text-slate-500">Câmera em pausa</Text>
              </View>
            )}

            {/* Botão de Fechar Câmera flutuante */}
            <Pressable
              onPress={onStopCamera}
              accessibilityRole="button"
              accessibilityLabel="Fechar câmera"
              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/60 items-center justify-center active:scale-95 border border-white/20"
            >
              <Ionicons name="close" size={20} color="#fff" />
            </Pressable>

            {/* Guia visual do documento (Moldura / Viewfinder) */}
            <View className="absolute inset-x-8 inset-y-10 border-2 border-dashed border-white/40 rounded-xl pointer-events-none items-center justify-center">
              <Text className="text-[11px] font-medium text-white/70 bg-black/50 px-2.5 py-1 rounded-md">
                Enquadre o documento aqui
              </Text>
            </View>
          </View>

          <View className="gap-2">
            <Button
              title={reading ? 'Lendo currículo…' : 'Fotografar e ler texto'}
              icon={<Ionicons name="camera" size={20} color="#fff" />}
              disabled={!cameraReady || reading}
              onPress={onCaptureAndRead}
            />

            <Button
              title="Fechar câmera"
              variant="secondary"
              disabled={reading}
              onPress={onStopCamera}
            />
          </View>
        </View>
      )}
    </View>
  );
}
