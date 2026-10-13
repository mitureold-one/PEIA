import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/input';
import { AREAS, MODALIDADES } from '@/data/vagas';
import { useVagas } from '@/hooks/use-vagas';

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={`rounded-full border px-3.5 py-1.5 ${
        active ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 dark:border-slate-700'
      }`}
    >
      <Text className={`text-xs font-medium ${active ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function Feed() {
  const router = useRouter();
  const todas = useVagas();
  const [query, setQuery] = useState('');
  const [area, setArea] = useState<string | null>(null);
  const [modalidade, setModalidade] = useState<string | null>(null);
  const [arquivadas, setArquivadas] = useState(false);

  const vagas = useMemo(() => {
    const q = query.trim().toLowerCase();
    return todas.filter(
      (v) =>
        !!v.arquivada === arquivadas &&
        (!area || v.area === area) &&
        (!modalidade || v.modalidade === modalidade) &&
        (!q || `${v.titulo} ${v.empresa} ${v.cidade}`.toLowerCase().includes(q)),
    );
  }, [todas, query, area, modalidade, arquivadas]);

  // Toque no chip ativo desmarca o filtro.
  const toggle = (cur: string | null, set: (v: string | null) => void) => (v: string) =>
    set(cur === v ? null : v);

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <FlatList
        data={vagas}
        keyExtractor={(v) => v.id}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-3 p-6"
        ListHeaderComponent={
          <View className="mb-2 gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-slate-900 dark:text-white">Vagas de estágio</Text>
              <Pressable
                onPress={() => router.push('/vaga/form')}
                accessibilityRole="button"
                accessibilityLabel="Nova vaga"
                className="h-10 w-10 items-center justify-center rounded-full bg-indigo-600 active:bg-indigo-700"
              >
                <Ionicons name="add" size={24} color="#fff" />
              </Pressable>
            </View>
            <Input
              label="Pesquisar"
              placeholder="Cargo, empresa ou cidade"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              leftIcon={<Ionicons name="search" size={18} color="#94a3b8" />}
            />
            <View className="flex-row flex-wrap gap-2">
              {MODALIDADES.map((m) => (
                <Chip key={m} label={m} active={modalidade === m} onPress={() => toggle(modalidade, setModalidade)(m)} />
              ))}
              <Chip label="Arquivadas" active={arquivadas} onPress={() => setArquivadas(!arquivadas)} />
            </View>
            <View className="flex-row flex-wrap gap-2">
              {AREAS.map((a) => (
                <Chip key={a} label={a} active={area === a} onPress={() => toggle(area, setArea)(a)} />
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text className="mt-8 text-center text-slate-500 dark:text-slate-400">Nenhuma vaga encontrada.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/vaga/[id]', params: { id: item.id } })}
            accessibilityRole="button"
            className={`gap-1.5 rounded-2xl border border-slate-200 bg-white p-4 active:opacity-80 dark:border-slate-800 dark:bg-slate-950/60 ${
              item.arquivada ? 'opacity-60' : ''
            }`}
          >
            <Text className="text-base font-semibold text-slate-900 dark:text-white">{item.titulo}</Text>
            <Text className="text-sm text-indigo-600 dark:text-indigo-400">
              {item.empresa} · {item.cidade}
            </Text>
            <Text numberOfLines={2} className="text-sm text-slate-600 dark:text-slate-400">{item.descricao}</Text>
            <Text className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {item.area} · {item.modalidade} · R$ {item.bolsa.toLocaleString('pt-BR')}
              {item.arquivada ? ' · Arquivada' : ''}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
