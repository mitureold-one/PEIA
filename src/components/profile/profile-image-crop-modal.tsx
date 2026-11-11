import { useRef, useState } from 'react';
import {
  Image,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';

export interface ProfileImageCropModalProps {
  visible: boolean;
  imageUri: string | null;
  fileName?: string;
  fileSizeFormatted?: string;
  onCancel: () => void;
  onConfirm: (croppedUri: string) => void;
}

const CROP_SIZE = 260; // Diâmetro do círculo de recorte em pixels

export function ProfileImageCropModal({
  visible,
  imageUri,
  fileName,
  fileSizeFormatted,
  onCancel,
  onConfirm,
}: ProfileImageCropModalProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [salvando, setSalvando] = useState(false);

  // Armazenamento da posição acumulada para o PanResponder
  const panRef = useRef({ x: 0, y: 0 });
  panRef.current = offset;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        setOffset({
          x: panRef.current.x + gestureState.dx,
          y: panRef.current.y + gestureState.dy,
        });
      },
      onPanResponderRelease: () => {
        // Posição final já mantida no estado offset
      },
    })
  ).current;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(3, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(1, +(prev - 0.25).toFixed(2)));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  const handleConfirmar = async () => {
    if (!imageUri) return;
    try {
      setSalvando(true);

      // Na Web, processamos o recorte preciso via HTML5 Canvas
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const cropped = await cropImageWeb(
          imageUri,
          scale,
          offset,
          rotation,
          CROP_SIZE
        );
        onConfirm(cropped);
      } else {
        // No Mobile / Fallback, retorna o URI da imagem selecionada
        onConfirm(imageUri);
      }
    } catch {
      // Fallback seguro em caso de exceção no canvas
      onConfirm(imageUri);
    } finally {
      setSalvando(false);
    }
  };

  if (!visible || !imageUri) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-slate-950 px-4 py-8 justify-between">
        {/* Cabeçalho */}
        <View className="pt-4 items-center">
          <View className="w-full flex-row items-center justify-between mb-2">
            <Pressable
              onPress={onCancel}
              className="h-10 w-10 items-center justify-center rounded-full bg-slate-800/80 active:bg-slate-700"
              accessibilityLabel="Cancelar recorte"
            >
              <Ionicons name="close" size={22} color="#ffffff" />
            </Pressable>

            <Text className="text-lg font-bold text-white">
              Ajustar Foto de Perfil
            </Text>

            <Pressable
              onPress={handleReset}
              className="h-10 w-10 items-center justify-center rounded-full bg-slate-800/80 active:bg-slate-700"
              accessibilityLabel="Resetar alinhamento"
            >
              <Ionicons name="refresh" size={20} color="#94a3b8" />
            </Pressable>
          </View>

          <Text className="text-xs text-slate-400 text-center max-w-xs">
            Arraste com o dedo para alinhar seu rosto e use os controles de zoom
            para o melhor enquadramento.
          </Text>

          {/* Badge de Verificação de Arquivo */}
          {(fileName || fileSizeFormatted) && (
            <View className="mt-3 flex-row items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1">
              <Ionicons name="checkmark-circle" size={14} color="#10b981" />
              <Text className="text-xs text-slate-300 font-medium" numberOfLines={1}>
                {fileName ? `${fileName} • ` : ''}
                {fileSizeFormatted}
              </Text>
            </View>
          )}
        </View>

        {/* Viewport Central de Enquadramento */}
        <View className="items-center justify-center my-auto">
          <View
            style={{ width: CROP_SIZE, height: CROP_SIZE }}
            className="rounded-full overflow-hidden border-2 border-indigo-400 relative items-center justify-center bg-slate-900 shadow-2xl shadow-indigo-500/20"
            {...panResponder.panHandlers}
          >
            {/* Imagem transformável */}
            <Image
              source={{ uri: imageUri }}
              resizeMode="contain"
              style={{
                width: CROP_SIZE * 1.5,
                height: CROP_SIZE * 1.5,
                transform: [
                  { translateX: offset.x },
                  { translateY: offset.y },
                  { scale },
                  { rotate: `${rotation}deg` },
                ],
              }}
            />

            {/* Linhas-guia dos terços (overlay sutil para alinhar olhos e nariz) */}
            <View
              pointerEvents="none"
              className="absolute inset-0 rounded-full border border-white/20"
            >
              <View className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/15" />
              <View className="absolute top-2/3 left-0 right-0 h-[1px] bg-white/15" />
              <View className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-white/15" />
              <View className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-white/15" />
            </View>
          </View>

          {/* Indicador de Zoom & Rotação atual */}
          <View className="flex-row items-center gap-3 mt-4">
            <View className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
              <Text className="text-xs text-slate-400 font-semibold">
                Zoom: {scale.toFixed(2)}x
              </Text>
            </View>
            {rotation > 0 && (
              <View className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                <Text className="text-xs text-indigo-400 font-semibold">
                  Giro: {rotation}°
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Controles de Ferramentas (Zoom, Girar, Presets) */}
        <View className="gap-4">
          <View className="flex-row items-center justify-center gap-3">
            {/* Botão Diminuir Zoom */}
            <Pressable
              onPress={handleZoomOut}
              disabled={scale <= 1}
              className={`h-11 w-11 rounded-2xl items-center justify-center border border-slate-800 ${
                scale <= 1 ? 'bg-slate-900/40 opacity-40' : 'bg-slate-900 active:bg-slate-800'
              }`}
              accessibilityLabel="Diminuir zoom"
            >
              <Ionicons name="remove" size={22} color="#ffffff" />
            </Pressable>

            {/* Presets Rápidos de Zoom */}
            {[1, 1.5, 2].map((val) => (
              <Pressable
                key={val}
                onPress={() => setScale(val)}
                className={`px-3 py-2 rounded-xl border ${
                  scale === val
                    ? 'bg-indigo-600 border-indigo-500'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    scale === val ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {val}x
                </Text>
              </Pressable>
            ))}

            {/* Botão Aumentar Zoom */}
            <Pressable
              onPress={handleZoomIn}
              disabled={scale >= 3}
              className={`h-11 w-11 rounded-2xl items-center justify-center border border-slate-800 ${
                scale >= 3 ? 'bg-slate-900/40 opacity-40' : 'bg-slate-900 active:bg-slate-800'
              }`}
              accessibilityLabel="Aumentar zoom"
            >
              <Ionicons name="add" size={22} color="#ffffff" />
            </Pressable>

            {/* Botão Girar 90° */}
            <Pressable
              onPress={handleRotate}
              className="h-11 w-11 rounded-2xl bg-slate-900 border border-slate-800 items-center justify-center active:bg-slate-800 ml-1"
              accessibilityLabel="Girar 90 graus"
            >
              <Ionicons name="scan-outline" size={20} color="#818cf8" />
            </Pressable>
          </View>

          {/* Botões de Ação Principal */}
          <View className="flex-row gap-3 pt-2">
            <View className="flex-1">
              <Button
                title="Cancelar"
                variant="secondary"
                onPress={onCancel}
              />
            </View>
            <View className="flex-1">
              <Button
                title={salvando ? 'Processando…' : 'Aplicar Foto'}
                disabled={salvando}
                icon={<Ionicons name="checkmark-sharp" size={18} color="#fff" />}
                onPress={handleConfirmar}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Recorta a imagem na Web usando HTML5 Canvas com alta resolução.
 */
async function cropImageWeb(
  src: string,
  scale: number,
  offset: { x: number; y: number },
  rotation: number,
  viewSize: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const outputSize = 400; // Tamanho nítido de saída
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(src);
        return;
      }

      // Máscara circular
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Centro do canvas
      ctx.translate(outputSize / 2, outputSize / 2);

      // Rotação
      if (rotation !== 0) {
        ctx.rotate((rotation * Math.PI) / 180);
      }

      // Escala e Deslocamento proporcional à proporção entre o viewSize e o outputSize
      const ratio = outputSize / viewSize;
      ctx.translate(offset.x * ratio, offset.y * ratio);
      ctx.scale(scale, scale);

      // Desenhar a imagem centralizada no canvas
      const drawWidth = outputSize * 1.5;
      const drawHeight = (img.height / img.width) * drawWidth;
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      resolve(croppedDataUrl);
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

