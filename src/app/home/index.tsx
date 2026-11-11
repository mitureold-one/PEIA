import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVagasFeed } from '@/hooks/use-vagas-feed';
import { VagasFeedHeader } from '@/components/home/vagas-feed-header';
import { VagaCard } from '@/components/home/vaga-card';
import { VagasEmpty } from '@/components/home/vagas-empty';

export default function Feed() {
  const {
    vagas,
    role,
    canCreateVaga,
    query,
    setQuery,
    area,
    modalidade,
    arquivadas,
    toggleArea,
    toggleModalidade,
    toggleArquivadas,
    limparFiltros,
  } = useVagasFeed();

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <FlatList
        data={vagas}
        keyExtractor={(v) => v.id}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-3 p-6"
        ListHeaderComponent={
          <VagasFeedHeader
            role={role}
            canCreateVaga={canCreateVaga}
            query={query}
            onChangeQuery={setQuery}
            area={area}
            onToggleArea={toggleArea}
            modalidade={modalidade}
            onToggleModalidade={toggleModalidade}
            arquivadas={arquivadas}
            onToggleArquivadas={toggleArquivadas}
          />
        }
        ListEmptyComponent={<VagasEmpty onLimparFiltros={limparFiltros} />}
        renderItem={({ item }) => <VagaCard vaga={item} />}
      />
    </SafeAreaView>
  );
}
