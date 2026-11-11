import React from 'react';
import { Image, Text, View } from 'react-native';
import { CameraView, type PermissionResponse } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';

interface ScanCameraCardProps {
  cameraRef: React.RefObject<CameraView | null>;
  permission: PermissionResponse | null;
  onRequestPermission: () => void;
  cameraReady: boolean;
  onCameraReady: () => void;
  onMountError: (err: string) => void;
  photoUri: string | null;
  reading: boolean;
  onCaptureAndRead: () => void;
  onResetPhoto: () => void;
}

export function ScanCameraCard({
  cameraRef,
  permission,
  onRequestPermission,
  cameraReady,
  onCameraReady,
  onMountError,
  photoUri,
  reading,
  onCaptureAndRead,
  onResetPhoto,
}: ScanCameraCardProps) {
  return (
    <View className="gap-3 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4">
      <View className="flex-row items-center gap-2">
        <Ionicons name="camera-outline" size={20} color="#4f46e5" />
        <Text className="text-base font-semibold text-slate-900 dark:text-white">
          Opção 1: Usar a Câmera
        </Text>
      </View>

      {!permission ? (
        <Text className="text-sm text-slate-600 dark:text-slate-300">
          Verificando permissões de acesso à câmera…
        </Text>
      ) : !permission.granted ? (
        <View className="gap-2">
          <Text className="text-xs text-slate-500 dark:text-slate-400">
            O aplicativo precisa de autorização para abrir o sensor da câmera.
          </Text>
          <Button
            title="Permitir acesso à câmera"
            onPress={onRequestPermission}
          />
        </View>
      ) : (
        <>
          <View className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-inner">
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                resizeMode="contain"
                className="h-full w-full"
              />
            ) : (
              <CameraView
                ref={cameraRef as any}
                facing="back"
                style={{ width: '100%', height: '100%' }}
                onCameraReady={onCameraReady}
                onMountError={(e) => onMountError(e.message)}
              />
            )}
          </View>

          {!photoUri ? (
            <Button
              title={reading ? 'Lendo currículo…' : 'Fotografar e ler texto'}
              icon={<Ionicons name="camera" size={20} color="#fff" />}
              disabled={!cameraReady || reading}
              onPress={onCaptureAndRead}
            />
          ) : (
            <Button
              title="Tirar outra foto"
              variant="secondary"
              icon={<Ionicons name="refresh" size={20} color="#fff" />}
              disabled={reading}
              onPress={onResetPhoto}
            />
          )}
        </>
      )}
    </View>
  );
}

