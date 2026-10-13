import { useRef, useState } from 'react';
import { Image, Platform, ScrollView, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { readTextFromImage, readTextFromPdf } from '@/utils/ocr';

const RESUME_KEY = 'peia:resume';
const EMPTY_RESUME = { summary: '', experience: '', education: '', skills: '' };

export default function Scan() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [reading, setReading] = useState(false);
  const [error, setError] = useState('');

  const captureAndRead = async () => {
    if (!cameraRef.current || !cameraReady || reading) return;

    setReading(true);
    setError('');
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (!photo?.uri) throw new Error('A câmera não retornou uma imagem.');

      setPhotoUri(photo.uri);
      setFileName('');
      const text = await readTextFromImage(photo.uri);
      setRecognizedText(text);
      if (!text) setError('Não encontrei texto legível. Tente novamente com mais luz e foco.');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : '';
      setError(
        message.toLowerCase().includes('native') || message.toLowerCase().includes('module')
          ? 'A leitura por OCR precisa da versão de desenvolvimento do PEIA; ela não está disponível no Expo Go.'
          : 'Não foi possível ler esta imagem. Confira a iluminação e tente novamente.',
      );
    } finally {
      setReading(false);
    }
  };

  const chooseFile = async () => {
    if (reading) return;

    setError('');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        base64: Platform.OS === 'web',
      });
      if (result.canceled) return;

      const file = result.assets[0];
      const isPdf = file.mimeType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const selectedUri =
        Platform.OS === 'web' && file.base64
          ? `data:${file.mimeType || (isPdf ? 'application/pdf' : 'image/jpeg')};base64,${file.base64}`
          : file.uri;

      setPhotoUri(isPdf ? null : selectedUri);
      setFileName(file.name);
      setRecognizedText('');
      setReading(true);
      const text = isPdf ? await readTextFromPdf(selectedUri) : await readTextFromImage(selectedUri);
      setRecognizedText(text);
      if (!text) setError('Não encontrei texto legível nesse arquivo. Confira se o PDF tem texto ou imagens nítidas.');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : '';
      setError(
        message === 'PDF_NOT_SUPPORTED_NATIVE'
          ? 'A leitura de PDF está disponível no navegador. No app instalado, selecione uma imagem JPG ou PNG.'
          : message === 'PDF_TOO_MANY_PAGES'
            ? 'O limite para leitura é de 25 páginas por PDF.'
            : message.toLowerCase().includes('native') || message.toLowerCase().includes('module')
          ? 'A leitura por OCR precisa da versão de desenvolvimento do PEIA; ela não está disponível no Expo Go.'
          : 'Não foi possível ler esse arquivo. Confira se é uma imagem JPG/PNG ou um PDF válido.',
      );
    } finally {
      setReading(false);
    }
  };

  const importToProfile = async () => {
    const stored = await AsyncStorage.getItem(RESUME_KEY);
    const previous = stored ? JSON.parse(stored) : {};
    await AsyncStorage.setItem(
      RESUME_KEY,
      JSON.stringify({ ...EMPTY_RESUME, ...previous, summary: recognizedText }),
    );
    router.push('/home/profile');
  };

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <ScrollView contentContainerClassName="gap-4 p-6" keyboardShouldPersistTaps="handled">
        <View className="gap-1">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">Ler currículo</Text>
          <Text className="text-sm leading-5 text-slate-600 dark:text-slate-400">
            Use a câmera ou escolha uma imagem ou PDF do currículo. O texto reconhecido poderá ser revisado antes de ir para o seu perfil.
          </Text>
        </View>

        <View className="gap-3 rounded-2xl bg-slate-200 p-4 dark:bg-slate-950/60">
          <Text className="text-base font-semibold text-slate-900 dark:text-white">Opção 1: usar a câmera</Text>
          {!permission ? (
            <Text className="text-sm text-slate-600 dark:text-slate-300">Verificando acesso à câmera…</Text>
          ) : !permission.granted ? (
            <Button title="Permitir acesso à câmera" onPress={() => void requestPermission()} />
          ) : (
            <>
              <View className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-900">
                {photoUri ? (
                  <Image source={{ uri: photoUri }} resizeMode="contain" className="h-full w-full" />
                ) : (
                  <CameraView
                    ref={cameraRef}
                    facing="back"
                    style={{ width: '100%', height: '100%' }}
                    onCameraReady={() => setCameraReady(true)}
                    onMountError={(event) => setError(event.message)}
                  />
                )}
              </View>

              {!photoUri ? (
                <Button
                  title={reading ? 'Lendo currículo…' : 'Fotografar e ler'}
                  icon={<Ionicons name="camera" size={20} color="#fff" />}
                  disabled={!cameraReady || reading}
                  onPress={() => void captureAndRead()}
                />
              ) : (
                <Button
                  title="Escolher outra imagem"
                  variant="secondary"
                  icon={<Ionicons name="refresh" size={20} color="#fff" />}
                  disabled={reading}
                  onPress={() => {
                    setPhotoUri(null);
                    setFileName('');
                    setRecognizedText('');
                    setError('');
                    setCameraReady(false);
                  }}
                />
              )}
            </>
          )}
        </View>

        <View className="items-center">
          <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">ou</Text>
        </View>

        <View className="gap-3 rounded-2xl bg-slate-200 p-4 dark:bg-slate-950/60">
          <Text className="text-base font-semibold text-slate-900 dark:text-white">Opção 2: escolher um arquivo</Text>
          <Text className="text-sm text-slate-600 dark:text-slate-300">
            Selecione uma imagem JPG/PNG ou um PDF. No navegador, PDFs com texto e PDFs digitalizados são lidos página por página.
          </Text>
          <Button
            title={reading ? 'Lendo arquivo…' : 'Selecionar arquivo'}
            variant="secondary"
            icon={<Ionicons name="document-attach-outline" size={20} color="#fff" />}
            disabled={reading}
            onPress={() => void chooseFile()}
          />
          {!!fileName && <Text className="text-xs text-slate-500 dark:text-slate-400">Arquivo: {fileName}</Text>}
        </View>

        {reading && (
          <Text accessibilityLiveRegion="polite" className="text-center text-sm text-indigo-600 dark:text-indigo-300">
          Lendo o texto no aparelho…
          </Text>
        )}
        {!!error && <Text accessibilityRole="alert" className="text-sm text-rose-600 dark:text-rose-400">{error}</Text>}

        {!!recognizedText && (
          <View className="gap-3">
            <Text className="text-base font-semibold text-slate-900 dark:text-white">Revise o texto reconhecido</Text>
            <Input
              label="Texto do currículo"
              value={recognizedText}
              onChangeText={setRecognizedText}
              multiline
              textAlignVertical="top"
              className="min-h-[180px]"
            />
            <Button
              title="Usar no perfil"
              icon={<Ionicons name="person-outline" size={20} color="#fff" />}
              onPress={() => void importToProfile()}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
