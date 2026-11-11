import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Text, View } from 'react-native';

interface AuthLoadingTransitionProps {
  visible: boolean;
  role?: 'estudante' | 'empresa' | 'coordenacao';
}

export function AuthLoadingTransition({ visible, role }: AuthLoadingTransitionProps) {
  const [etapa, setEtapa] = useState(0);

  const roleText =
    role === 'empresa'
      ? 'Empresa'
      : role === 'coordenacao'
      ? 'Coordenação'
      : 'Estudante';

  const etapas = [
    `Autenticando como ${roleText}...`,
    'Sincronizando currículo e oportunidades no SQLite...',
    'Carregando seu ambiente...',
  ];

  useEffect(() => {
    if (!visible) {
      setEtapa(0);
      return;
    }

    const t1 = setTimeout(() => setEtapa(1), 450);
    const t2 = setTimeout(() => setEtapa(2), 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 items-center justify-center bg-slate-50/95 dark:bg-[#03031b]/95 px-8">
        {/* Glow focal decorativo */}
        <View
          pointerEvents="none"
          className="absolute h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl dark:bg-indigo-600/20"
        />

        {/* Card central de carregamento */}
        <View className="items-center gap-6 p-8 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-2xl max-w-sm w-full">
          {/* Logo da Marca */}
          <View className="flex-row items-center justify-center px-6 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
            <Text className="text-2xl font-black tracking-[0.2em] text-slate-900 dark:text-white">
              PEIA
            </Text>
          </View>

          {/* Spinner de progresso */}
          <View className="items-center justify-center h-12">
            <ActivityIndicator size="large" color="#4f46e5" />
          </View>

          {/* Mensagem dinâmica de sincronização */}
          <View className="items-center gap-1.5 px-2">
            <Text className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-center">
              {etapas[etapa] || etapas[0]}
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Aguarde enquanto preparamos seus dados
            </Text>
          </View>

          {/* Barra de progresso animada */}
          <View className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <View
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: etapa === 0 ? '35%' : etapa === 1 ? '75%' : '100%' }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

