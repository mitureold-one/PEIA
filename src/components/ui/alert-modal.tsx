import { Button } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';

export interface AlertState {
  visible: boolean;
  variant: 'success' | 'error';
  title: string;
  message: string;
}

export interface AlertModalProps extends AlertState {
  onClose: () => void;
}

export function AlertModal({ visible, variant, title, message, onClose }: AlertModalProps) {
  const isSuccess = variant === 'success';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop: toque fora fecha */}
      <Pressable
        onPress={onClose}
        accessibilityLabel="Fechar alerta"
        className="flex-1 items-center justify-center bg-black/50 px-8"
      >
        {/* Pressable interno impede que o toque no card feche o modal */}
        <Pressable
          accessibilityRole="alert"
          className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <View
            className={`mb-4 h-14 w-14 items-center justify-center self-center rounded-full ${
              isSuccess ? 'bg-emerald-500/15' : 'bg-rose-500/15'
            }`}
          >
            <Ionicons
              name={isSuccess ? 'checkmark-circle-outline' : 'alert-circle-outline'}
              size={30}
              color={isSuccess ? '#10b981' : '#f43f5e'}
            />
          </View>
          <Text className="mb-2 text-center text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </Text>
          <Text className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {message}
          </Text>
          <Button title="OK" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
