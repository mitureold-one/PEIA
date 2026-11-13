import { useEffect, useRef, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused, useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { readTextFromImage, readTextFromPdf } from '@/utils/ocr';
import { curriculoActions } from '@/hooks/use-curriculo';
import { ROUTES } from '@/constants/routes';

const RESUME_KEY = 'peia:resume';
const EMPTY_RESUME = { summary: '', experience: '', education: '', skills: '' };

export type ScanMode = 'camera' | 'arquivo';

export function useCurriculoScanner() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [mode, setModeState] = useState<ScanMode>('arquivo');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [reading, setReading] = useState(false);
  const [error, setError] = useState('');

  // 1. Desativa e libera o sensor da câmera ao trocar de aba no aplicativo
  useEffect(() => {
    if (!isFocused && cameraActive) {
      setCameraActive(false);
      setCameraReady(false);
    }
  }, [isFocused, cameraActive]);

  // 2. Libera o sensor da câmera ao minimizar ou suspender o app (background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState !== 'active' && cameraActive) {
        setCameraActive(false);
        setCameraReady(false);
      }
    });
    return () => subscription.remove();
  }, [cameraActive]);

  // 3. Limpeza total de recursos de câmera ao desmontar a rota
  useEffect(() => {
    return () => {
      setCameraActive(false);
      setCameraReady(false);
    };
  }, []);

  // 4. Fallback de prontidão da câmera: se o evento nativo atrasar ou não disparar, libera o botão em 1s
  useEffect(() => {
    if (cameraActive && isFocused) {
      const timer = setTimeout(() => {
        setCameraReady(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cameraActive, isFocused]);

  const openAppSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      setError('Não foi possível abrir as configurações do aparelho.');
    }
  };

  const setMode = (newMode: ScanMode) => {
    setError('');
    if (newMode !== 'camera') {
      setCameraActive(false);
      setCameraReady(false);
    }
    setModeState(newMode);
  };

  const handleRequestPermission = async () => {
    setError('');
    try {
      const res = await requestPermission();
      if (res.granted) {
        setCameraActive(true);
      } else if (!res.canAskAgain) {
        setError('A permissão da câmera foi negada. Abra as configurações para permitir.');
      } else {
        setError('O PEIA precisa de permissão de câmera para fotografar o currículo.');
      }
      return res;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Falha ao solicitar permissão de câmera.';
      setError(message);
      return null;
    }
  };

  const startCamera = async () => {
    setError('');
    // Se ainda não concedeu permissão
    if (!permission?.granted) {
      if (permission && !permission.canAskAgain) {
        // Bloqueada permanentemente: abre o estado que orienta a ir nas configurações
        setCameraActive(true);
        return;
      }
      const res = await handleRequestPermission();
      if (!res?.granted) {
        // Ativa o card informativo de permissão
        setCameraActive(true);
        return;
      }
    }
    setCameraActive(true);
  };

  const stopCamera = () => {
    setCameraActive(false);
    setCameraReady(false);
  };

  /**
   * Captura foto utilizando a câmera nativa do aparelho (ImagePicker).
   * Método ultra-confiável com foco automático de hardware, sem conflito de threads ou SurfaceView.
   */
  const takePhotoWithCamera = async () => {
    if (reading) return;
    setError('');

    try {
      const permissionRes = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionRes.granted) {
        if (!permissionRes.canAskAgain) {
          setError('A permissão da câmera foi negada. Abra as configurações do aparelho para autorizar.');
        } else {
          setError('O PEIA precisa de permissão de câmera para fotografar o currículo.');
        }
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.9,
        allowsEditing: false,
      });

      if (result.canceled || !result.assets || !result.assets[0]) return;

      const photo = result.assets[0];
      setPhotoUri(photo.uri);
      setFileName(photo.fileName || 'foto_curriculo.jpg');
      setRecognizedText('');
      setReading(true);

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
          : 'Não foi possível capturar a foto. Tente novamente.'
      );
    } finally {
      setReading(false);
    }
  };

  const captureAndRead = async () => {
    if (!cameraRef.current || !cameraReady || reading) return;

    setReading(true);
    setError('');

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (!photo?.uri) throw new Error('A câmera não retornou uma imagem.');

      setPhotoUri(photo.uri);
      setCameraActive(false);
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
    setCameraActive(false);
  };

  const retakePhoto = () => {
    setPhotoUri(null);
    setCameraReady(false);
    setCameraActive(true);
  };

  const clearError = () => {
    setError('');
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
    mode,
    setMode,
    isFocused,
    cameraRef,
    permission,
    requestPermission: handleRequestPermission,
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
  };
}
