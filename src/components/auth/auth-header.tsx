import { Text, View } from 'react-native';

export function AuthHeader() {

  return (
    <View className="mb-6 items-center">
      {/* Container da Marca / Logo */}
      <View className="relative mb-4 items-center justify-center">
        {/* Glow de fundo focal */}
        <View
          pointerEvents="none"
          className="absolute h-28 w-60 rounded-full bg-indigo-500/20 blur-2xl dark:bg-indigo-500/30"
        />

        {/* Card / Badge da Marca PEIA */}
        <View className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-1 shadow-lg shadow-indigo-500/10 dark:border-indigo-400/25 dark:bg-indigo-950/20">
          <View className="flex-row items-center justify-center gap-3 rounded-[22px] border border-indigo-100/90 bg-white/95 px-6 py-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
            {/* Ícone de Corda / Laço estilizado */}


            {/* Tipografia PEIA */}
            <View className="flex-row items-center">
              <Text className="text-3xl font-black tracking-[0.18em] text-slate-900 dark:text-white">
                PEIA
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Subtítulo / Descrição */}
      <Text className="px-6 text-center text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
        Preparação, Empregabilidade, Inclusão e Aprendizagem
      </Text>
    </View>
  );
}
