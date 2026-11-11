import { useRef, useState } from 'react';
import { Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { readTextFromImage, readTextFromPdf } from '@/utils/ocr';
import { curriculoActions } from '@/hooks/use-curriculo';
import { ROUTES } from '@/constants/routes';

const RESUME_KEY = 'peia:resume';
const EMPTY_RESUME = { summary: '', experience: '', education: '', skills: '' };

export function useCurriculoScanner() {
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

      if (!text) {
        setError('Não encontrei texto legível. Tente novamente com mais luz e foco.');
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : '';
      setError(
        message.toLowerCase().includes('native') || message.toLowerCase().includes('module')
          ? 'A leitura por OCR precisa da versão de desenvolvimento do PEIA; ela não está disponível no Expo Go.'
          : 'Não foi possível ler esta imagem. Confira a iluminação e tente novamente.'
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

      if (!text) {
        setError('Não encontrei texto legível nesse arquivo. Confira se o PDF tem texto ou imagens nítidas.');
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : '';
      setError(
        message === 'PDF_NOT_SUPPORTED_NATIVE'
          ? 'A leitura de PDF está disponível no navegador. No app instalado, selecione uma imagem JPG ou PNG.'
          : message === 'PDF_TOO_MANY_PAGES'
          ? 'O limite para leitura é de 25 páginas por PDF.'
          : message.toLowerCase().includes('native') || message.toLowerCase().includes('module')
          ? 'A leitura por OCR precisa da versão de desenvolvimento do PEIA; ela não está disponível no Expo Go.'
          : 'Não foi possível ler esse arquivo. Confira se é uma imagem JPG/PNG ou um PDF válido.'
      );
    } finally {
      setReading(false);
    }
  };

  const resetPhoto = () => {
    setPhotoUri(null);
    setFileName('');
    setRecognizedText('');
    setError('');
    setCameraReady(false);
  };

  const importToProfile = async () => {
    if (!recognizedText.trim()) return;

    // Atualiza o resumo geral no novo modelo estruturado
    curriculoActions.atualizarResumoGeral(recognizedText.trim());

    // Mantém compatibilidade com a chave legada
    try {
      const stored = await AsyncStorage.getItem(RESUME_KEY);
      const previous = stored ? JSON.parse(stored) : {};
      await AsyncStorage.setItem(
        RESUME_KEY,
        JSON.stringify({ ...EMPTY_RESUME, ...previous, summary: recognizedText.trim() })
      );
    } catch {
      // Ignora falha de legado
    }

    router.push(ROUTES.PROFILE as any);
  };

  return {
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
  };
}
