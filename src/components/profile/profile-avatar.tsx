import { useState } from 'react';
import { Image, Modal, Platform, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Button } from '@/components/ui/button';

interface ProfileAvatarProps {
  avatar?: string;
  name: string;
  surname: string;
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
  onUpdateAvatar,
  onRemoveAvatar,
}: ProfileAvatarProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const iniciais = `${name ? name[0] : 'U'}${surname ? surname[0] : ''}`.toUpperCase();

  const escolherDaGaleria = async () => {
    try {
      setCarregando(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        copyToCacheDirectory: true,
        base64: Platform.OS === 'web',
      });

      if (result.canceled || !result.assets || !result.assets[0]) return;

      const file = result.assets[0];
      const selectedUri =
        Platform.OS === 'web' && file.base64
          ? `data:${file.mimeType || 'image/jpeg'};base64,${file.base64}`
          : file.uri;

      onUpdateAvatar(selectedUri);
      setModalVisible(false);
    } catch {
      // Ignora cancelamento
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

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Alterar foto de perfil"
        className="relative self-center items-center justify-center active:opacity-85"
      >
        <View className="h-24 w-24 rounded-full border-2 border-indigo-500/30 dark:border-indigo-400/40 p-1 bg-white dark:bg-slate-900 shadow-md">
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              resizeMode="cover"
              className="h-full w-full rounded-full"
            />
          ) : (
            <View className="h-full w-full rounded-full bg-indigo-600 items-center justify-center shadow-inner">
              <Text className="text-2xl font-black tracking-wider text-white">
                {iniciais}
              </Text>
            </View>
          )}
        </View>

        {/* Badge flutuante de câmera */}
        <View className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 items-center justify-center shadow-md">
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

            {/* Opção 1: Escolher arquivo da galeria */}
            <Button
              title={carregando ? 'Carregando foto…' : 'Escolher foto do aparelho'}
              icon={<Ionicons name="images-outline" size={20} color="#fff" />}
              disabled={carregando}
              onPress={escolherDaGaleria}
            />

            {/* Opção 2: Avatares pré-definidos */}
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

            {/* Opção 3: Remover foto se já tiver uma */}
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
    </>
  );
}
