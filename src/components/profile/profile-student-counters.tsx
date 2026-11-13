import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ProfileStudentCountersProps {
  vagasCount: number;
  empresasCount: number;
  conexoesCount: number;
  layout?: 'row' | 'column';
  onOpenMetrica: (tipo: 'inscricoes' | 'empresas' | 'conexoes') => void;
}

export function ProfileStudentCounters({
  vagasCount,
  empresasCount,
  conexoesCount,
  layout = 'row',
  onOpenMetrica,
}: ProfileStudentCountersProps) {
  // Variante em Coluna Vertical (posicionamento lado a lado no Header)
  if (layout === 'column') {
    return (
      <View
        className="gap-2 w-32 sm:w-36 shrink-0"
        style={{ flexShrink: 0 }}
      >
        {/* 1. Inscrições */}
        <Pressable
          onPress={() => onOpenMetrica('inscricoes')}
          accessibilityRole="button"
          accessibilityLabel="Ver lista de inscrições"
          className="flex-row items-center justify-between px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 active:scale-95 shadow-2xs"
        >
          <View className="flex-row items-center gap-2">
            <View className="h-6 w-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 items-center justify-center">
              <Ionicons name="briefcase" size={12} color="#6366f1" />
            </View>
            <View>
              <Text className="text-xs font-black text-slate-900 dark:text-white">
                {vagasCount}
              </Text>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400">
                Inscrições
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={13} color="#94a3b8" />
        </Pressable>

        {/* 2. Empresas */}
        <Pressable
          onPress={() => onOpenMetrica('empresas')}
          accessibilityRole="button"
          accessibilityLabel="Ver lista de empresas que segue"
          className="flex-row items-center justify-between px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 active:scale-95 shadow-2xs"
        >
          <View className="flex-row items-center gap-2">
            <View className="h-6 w-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 items-center justify-center">
              <Ionicons name="business" size={12} color="#6366f1" />
            </View>
            <View>
              <Text className="text-xs font-black text-slate-900 dark:text-white">
                {empresasCount}
              </Text>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400">
                Empresas
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={13} color="#94a3b8" />
        </Pressable>

        {/* 3. Conexões */}
        <Pressable
          onPress={() => onOpenMetrica('conexoes')}
          accessibilityRole="button"
          accessibilityLabel="Ver lista de conexões e colegas"
          className="flex-row items-center justify-between px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 active:scale-95 shadow-2xs"
        >
          <View className="flex-row items-center gap-2">
            <View className="h-6 w-6 rounded-lg bg-violet-100 dark:bg-violet-950/70 items-center justify-center">
              <Ionicons name="people" size={12} color="#8b5cf6" />
            </View>
            <View>
              <Text className="text-xs font-black text-slate-900 dark:text-white">
                {conexoesCount}
              </Text>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400">
                Conexões
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={13} color="#94a3b8" />
        </Pressable>
      </View>
    );
  }

  // Variante padrão em Linha Horizontal
  return (
    <View className="flex-row items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
      {/* 1. Inscrições */}
      <Pressable
        onPress={() => onOpenMetrica('inscricoes')}
        accessibilityRole="button"
        accessibilityLabel="Ver lista de inscrições"
        className="flex-1 items-center py-1 active:opacity-70"
      >
        <Text className="text-lg font-black text-slate-900 dark:text-white">
          {vagasCount}
        </Text>
        <Text className="text-xs text-slate-500 dark:text-slate-400">
          Inscrições
        </Text>
      </Pressable>

      <View className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

      {/* 2. Empresas */}
      <Pressable
        onPress={() => onOpenMetrica('empresas')}
        accessibilityRole="button"
        accessibilityLabel="Ver lista de empresas que segue"
        className="flex-1 items-center py-1 active:opacity-70"
      >
        <Text className="text-lg font-black text-slate-900 dark:text-white">
          {empresasCount}
        </Text>
        <Text className="text-xs text-slate-500 dark:text-slate-400">
          Empresas
        </Text>
      </Pressable>

      <View className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

      {/* 3. Conexões */}
      <Pressable
        onPress={() => onOpenMetrica('conexoes')}
        accessibilityRole="button"
        accessibilityLabel="Ver lista de conexões e colegas"
        className="flex-1 items-center py-1 active:opacity-70"
      >
        <Text className="text-lg font-black text-slate-900 dark:text-white">
          {conexoesCount}
        </Text>
        <Text className="text-xs text-slate-500 dark:text-slate-400">
          Conexões
        </Text>
      </Pressable>
    </View>
  );
}
