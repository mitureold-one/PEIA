import { Text, TouchableOpacity, View } from 'react-native';

export interface AuthFooterProps {
  isSignUp: boolean;
  onToggle: () => void;
}

export function AuthFooter({ isSignUp, onToggle }: AuthFooterProps) {
  return (
    <View className="mt-8 mb-4 items-center px-2">
      <TouchableOpacity
        onPress={onToggle}
        className="rounded-2xl border border-slate-200/60 bg-white/50 px-5 py-3 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/40"
        activeOpacity={0.7}
      >
        <Text className="text-xs text-slate-600 dark:text-slate-400 text-center leading-relaxed">
          {isSignUp
            ? 'Já tem uma conta PEIA? '
            : 'Ainda não levou uma PEIA do mercado de trabalho? '}

          <Text className="font-bold text-indigo-600 underline dark:text-indigo-400">
            {isSignUp ? 'Faça login' : 'Cadastre-se'}
          </Text>

          {isSignUp
            ? ' e descubra como se preparar ainda mais para o mercado de trabalho.'
            : ' e descubra o que falta para chegar preparado.'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
