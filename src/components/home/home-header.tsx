import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeHeader() {
  return (
    <SafeAreaView
      edges={['top']}
      className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <View className="items-center px-6 pb-4 pt-3">
        <Text accessibilityRole="header" className="text-3xl font-black tracking-[0.2em] text-slate-900 dark:text-white">
          PEIA
        </Text>
        <Text className="mt-1 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
          Preparação, Empregabilidade, Inclusão e Aprendizagem
        </Text>
      </View>
    </SafeAreaView>
  );
}
