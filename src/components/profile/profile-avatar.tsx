import { useState } from 'react';
import { Image, Modal, Platform, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/ui/button';
import { AlertModal, AlertState } from '@/components/ui/alert-modal';
import { validateImageFile } from '@/utils/file-validators';
import { ProfileImageCropModal } from './profile-image-crop-modal';

interface ProfileAvatarProps {
  avatar?: string;
  name: string;
  surname: string;
  abertoOportunidades?: boolean;
  onUpdateAvatar: (uri: string) => void;
  onRemoveAvatar: () => void;
}

const AVATAR_PRESETS = [
  {
    id: 'preset_1',
    label: 'Dev 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: 'preset_2',
    label: 'Dev 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: 'preset_3',
    label: 'Dev 3',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: 'preset_4',
    label: 'Dev 4',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
  },
];

export function ProfileAvatar({
  avatar,
  name,
  surname,
  abertoOportunidades,
  onUpdateAvatar,
  onRemoveAvatar,
}: ProfileAvatarProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Estado para subtela de corte e alinhamento (Web ou fallback)
  const [cropData, setCropData] = useState<{
    uri: string;
    fileName?: string;
    fileSizeFormatted?: string;
  } | null>(null);

  // Estado para alertas e feedback de validação de arquivo
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    variant: 'error',
    title: '',
    message: '',
  });

  const iniciais = `${name ? name[0] : 'U'}${surname ? surname[0] : ''}`.toUpperCase();

  const escolherDaGaleria = async () => {
    try {
      setCarregando(true);

      // Pede permissão para acessar fotos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setAlert({
          visible: true,
          variant: 'error',
          title: 'Permissão Necessária',
          message: 'Conceda acesso à galeria para selecionar uma foto de perfil.',
        });
        return;
      }

      // No mobile nativo, allowsEditing aciona o editor de corte nativo do sistema operacional (Android/iOS)
      const isMobile = Platform.OS !== 'web';
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: isMobile, // Editor nativo do celular
        aspect: [1, 1], // Proporção quadrada para avatar
        quality: 0.85,
        base64: Platform.OS === 'web',
      });

      if (result.canceled || !result.assets || !result.assets[0]) return;

      const file = result.assets[0];

      // Verificações e validações de integridade do arquivo
      const validation = validateImageFile({
        name: file.fileName || 'foto_perfil.jpg',
        size: file.fileSize,
        mimeType: file.mimeType || 'image/jpeg',
        uri: file.uri,
      });

      if (!validation.valid) {
        setAlert({
          visible: true,
          variant: 'error',
          title: 'Arquivo Não Aceito',
          message: validation.error || 'O arquivo selecionado não é válido.',
        });
        return;
      }

      setModalVisible(false);

      if (isMobile) {
        // No celular nativo, o corte já foi realizado pelo editor nativo do aparelho
        onUpdateAvatar(file.uri);
      } else {
        // Na Web (onde o navegador não possui crop nativo do OS), abre a subtela dedicada de corte
        const selectedUri = file.base64
          ? `data:${file.mimeType || 'image/jpeg'};base64,${file.base64}`
          : file.uri;

        setCropData({
          uri: selectedUri,
          fileName: file.fileName || 'foto_perfil.jpg',
          fileSizeFormatted: validation.formattedSize,
        });
      }
    } catch {
      setAlert({
        visible: true,
        variant: 'error',
        title: 'Erro ao Abrir Foto',
        message: 'Não foi possível carregar a imagem da galeria. Tente novamente.',
      });
    } finally {
      setCarregando(false);
    }
  };

  const tirarFotoComCamera = async () => {
    try {
      setCarregando(true);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setAlert({
          visible: true,
          variant: 'error',
          title: 'Permissão da Câmera',
          message: 'Conceda permissão de câmera para tirar uma nova foto de perfil.',
        });
        return;
      }

      // Abre câmera do aparelho com editor nativo de corte integrado
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true, // Editor nativo do celular
        aspect: [1, 1],
        quality: 0.85,
      });

      if (result.canceled || !result.assets || !result.assets[0]) return;

      const file = result.assets[0];
      const validation = validateImageFile({
        name: file.fileName || 'foto_camera.jpg',
        size: file.fileSize,
        mimeType: file.mimeType || 'image/jpeg',
        uri: file.uri,
      });

      if (!validation.valid) {
        setAlert({
          visible: true,
          variant: 'error',
          title: 'Arquivo Não Aceito',
          message: validation.error || 'A foto capturada não é válida.',
        });
        return;
      }

      setModalVisible(false);
      onUpdateAvatar(file.uri);
    } catch {
      setAlert({
        visible: true,
        variant: 'error',
        title: 'Erro na Câmera',
        message: 'Não foi possível capturar a foto. Verifique as permissões do dispositivo.',
      });
    } finally {
      setCarregando(false);
    }
  };

  const selecionarPreset = (url: string) => {
    onUpdateAvatar(url);
    setModalVisible(false);
  };

  const removerFoto = () => {
    onRemoveAvatar();
    setModalVisible(false);
  };

  const confirmarRecorte = (croppedUri: string) => {
    onUpdateAvatar(croppedUri);
    setCropData(null);
  };

  const cancelarRecorte = () => {
    setCropData(null);
  };

  const hasStatus = abertoOportunidades !== undefined;
  const ringBorder = hasStatus
    ? abertoOportunidades
      ? 'border-emerald-500 dark:border-emerald-400'
      : 'border-slate-300 dark:border-slate-700'
    : 'border-indigo-500/30 dark:border-indigo-400/40';

  const badgeBg = hasStatus
    ? abertoOportunidades
      ? 'bg-emerald-600 dark:bg-emerald-500'
      : 'bg-slate-500 dark:bg-slate-600'
    : 'bg-indigo-600';

  const fallbackBg = hasStatus
    ? abertoOportunidades
      ? 'bg-emerald-600'
      : 'bg-slate-600'
    : 'bg-indigo-600';

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Alterar foto de perfil"
        className="relative self-center items-center justify-center active:opacity-85"
      >
        <View className={`h-24 w-24 rounded-full border-2 ${ringBorder} p-1 bg-white dark:bg-slate-900 shadow-md`}>
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              resizeMode="cover"
              className="h-full w-full rounded-full"
            />
          ) : (
            <View className={`h-full w-full rounded-full ${fallbackBg} items-center justify-center shadow-inner`}>
              <Text className="text-2xl font-black tracking-wider text-white">
                {iniciais}
              </Text>
            </View>
          )}
        </View>

        {/* Badge flutuante de câmera */}
        <View className={`absolute bottom-0 right-0 h-8 w-8 rounded-full ${badgeBg} border-2 border-white dark:border-slate-900 items-center justify-center shadow-md`}>
          <Ionicons name="camera" size={15} color="#ffffff" />
        </View>
      </Pressable>

      {/* Modal de Escolha de Foto */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/60 justify-end"
        >
          <Pressable className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800 gap-4">
            <View className="flex-row items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <Text className="text-lg font-bold text-slate-900 dark:text-white">
                Foto de Perfil
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94a3b8" />
              </Pressable>
            </View>

            {/* Opção 1: Escolher da galeria com editor nativo */}
            <Button
              title={carregando ? 'Abrindo galeria…' : 'Escolher foto da galeria'}
              icon={<Ionicons name="images-outline" size={20} color="#fff" />}
              disabled={carregando}
              onPress={escolherDaGaleria}
            />

            {/* Opção 2: Tirar foto na hora com a câmera */}
            <Button
              title="Tirar foto com a câmera"
              variant="secondary"
              icon={<Ionicons name="camera-outline" size={20} color="#6366f1" />}
              disabled={carregando}
              onPress={tirarFotoComCamera}
            />

            {/* Opção 3: Avatares pré-definidos */}
            <View className="gap-2">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Ou escolha um avatar:
              </Text>
              <View className="flex-row justify-between gap-3">
                {AVATAR_PRESETS.map((preset) => (
                  <Pressable
                    key={preset.id}
                    onPress={() => selecionarPreset(preset.url)}
                    className="h-14 w-14 rounded-full border-2 border-indigo-200 dark:border-indigo-800 overflow-hidden active:scale-95 shadow-sm"
                  >
                    <Image
                      source={{ uri: preset.url }}
                      resizeMode="cover"
                      className="h-full w-full"
                    />
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Opção 4: Remover foto se já tiver uma */}
            {!!avatar && (
              <Button
                title="Remover foto atual"
                variant="secondary"
                className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 active:bg-rose-100"
                icon={<Ionicons name="trash-outline" size={18} color="#ef4444" />}
                onPress={removerFoto}
              />
            )}

            <Button
              title="Cancelar"
              variant="secondary"
              onPress={() => setModalVisible(false)}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Subtela / Modal de Recorte e Alinhamento (Web / Fallback) */}
      <ProfileImageCropModal
        visible={!!cropData}
        imageUri={cropData?.uri || null}
        fileName={cropData?.fileName}
        fileSizeFormatted={cropData?.fileSizeFormatted}
        onCancel={cancelarRecorte}
        onConfirm={confirmarRecorte}
      />

      {/* Alerta de Erro de Validação de Arquivo */}
      <AlertModal
        visible={alert.visible}
        variant={alert.variant}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
}
