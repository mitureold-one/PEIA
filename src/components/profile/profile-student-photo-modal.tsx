import { useState } from 'react';
import { Image, Modal, Platform, Pressable, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/ui/button';

export interface ProfileStudentPhotoModalProps {
  visible: boolean;
  avatar?: string;
  nomeCompleto: string;
  iniciais: string;
  abertoOportunidades?: boolean;
  onClose: () => void;
  onUpdateAvatar: (uri?: string) => Promise<void> | void;
}

export function ProfileStudentPhotoModal({
  visible,
  avatar,
  nomeCompleto,
  iniciais,
  abertoOportunidades = true,
  onClose,
  onUpdateAvatar,
}: ProfileStudentPhotoModalProps) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const escolherDaGaleria = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setErro('Permissão para acessar a galeria de fotos é necessária.');
        return;
      }

      const isMobile = Platform.OS !== 'web';
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: isMobile,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (result.canceled || !result.assets || !result.assets[0]) return;

      const file = result.assets[0];
      await onUpdateAvatar(file.uri);
      onClose();
    } catch {
      setErro('Não foi possível carregar a imagem da galeria.');
    } finally {
      setCarregando(false);
    }
  };

  const tirarFotoComCamera = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setErro('Permissão de acesso à câmera é necessária.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (result.canceled || !result.assets || !result.assets[0]) return;

      const file = result.assets[0];
      await onUpdateAvatar(file.uri);
      onClose();
    } catch {
      setErro('Não foi possível capturar a foto.');
    } finally {
      setCarregando(false);
    }
  };

  const removerFoto = async () => {
    setCarregando(true);
    try {
      await onUpdateAvatar(undefined);
      onClose();
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/75 backdrop-blur-md justify-center items-center p-4">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full max-w-sm rounded-3xl bg-white p-6 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl items-center gap-4">
          {/* Barra Superior do Modal */}
          <View className="w-full flex-row items-center justify-between">
            <View>
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                Foto de Perfil
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                Visualização e alteração direta
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Fechar modal de foto"
              className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center active:scale-95"
            >
              <Ionicons name="close" size={16} color="#64748b" />
            </Pressable>
          </View>

          {/* Foto Ampliada em Destaque com Círculos Concêntricos de Disponibilidade */}
          <View
            style={{ width: 200, height: 200, aspectRatio: 1 }}
            className={`w-[200px] h-[200px] rounded-full border-4 ${
              abertoOportunidades
                ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/30'
                : 'border-slate-300 dark:border-slate-700 bg-slate-100/40 dark:bg-slate-900/30'
            } p-1.5 shadow-2xl items-center justify-center`}
          >
            <View
              style={{ width: '100%', height: '100%', aspectRatio: 1 }}
              className={`w-full h-full rounded-full border ${
                abertoOportunidades
                  ? 'border-emerald-300 dark:border-emerald-800'
                  : 'border-slate-200 dark:border-slate-800'
              } p-0.5 bg-white dark:bg-slate-950 items-center justify-center overflow-hidden`}
            >
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  resizeMode="cover"
                  style={{ width: '100%', height: '100%', aspectRatio: 1 }}
                  className="h-full w-full rounded-full"
                />
              ) : (
                <View
                  className={`h-full w-full rounded-full ${
                    abertoOportunidades ? 'bg-emerald-600' : 'bg-slate-600'
                  } items-center justify-center`}
                >
                  <Text className="text-5xl font-black text-white">{iniciais}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Badge Indicativo de Disponibilidade do Aluno */}
          <View
            className={`px-3 py-1 rounded-full border flex-row items-center gap-1.5 ${
              abertoOportunidades
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
            }`}
          >
            <View
              className={`h-2 w-2 rounded-full ${
                abertoOportunidades ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <Text
              className={`text-xs font-semibold ${
                abertoOportunidades
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {abertoOportunidades ? '● Aberto a Oportunidades' : '● Indisponível no Momento'}
            </Text>
          </View>

          {/* Nome do Estudante */}
          <View className="items-center">
            <Text className="text-base font-bold text-slate-900 dark:text-white text-center">
              {nomeCompleto}
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400 text-center mt-0.5">
              Toque abaixo para escolher uma nova foto
            </Text>
          </View>

          {/* Mensagem de Erro se houver */}
          {erro && (
            <View className="w-full p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900">
              <Text className="text-xs text-rose-700 dark:text-rose-300 text-center">
                {erro}
              </Text>
            </View>
          )}

          {/* Indicador de Carregamento */}
          {carregando && (
            <View className="flex-row items-center gap-2 py-1">
              <ActivityIndicator size="small" color="#6366f1" />
              <Text className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                Processando imagem...
              </Text>
            </View>
          )}

          {/* Ações de Troca de Foto */}
          <View className="w-full gap-2.5 pt-1">
            <Button
              title="Escolher da Galeria"
              variant="primary"
              onPress={escolherDaGaleria}
              disabled={carregando}
              className="py-3"
              icon={<Ionicons name="images-outline" size={16} color="#ffffff" />}
            />

            <Button
              title="Tirar Foto com a Câmera"
              variant="secondary"
              onPress={tirarFotoComCamera}
              disabled={carregando}
              className="py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
              icon={<Ionicons name="camera-outline" size={16} color="#6366f1" />}
            />

            {Boolean(avatar) && (
              <Pressable
                onPress={removerFoto}
                disabled={carregando}
                accessibilityRole="button"
                accessibilityLabel="Remover foto de perfil"
                className="py-2.5 items-center justify-center active:opacity-75"
              >
                <Text className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  Remover Foto Atual
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

