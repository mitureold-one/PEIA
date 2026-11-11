import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { AREAS, MODALIDADES } from '@/data/vagas';
import { FilterChip } from '@/components/home/filter-chip';

interface VagasFeedHeaderProps {
  role: 'estudante' | 'empresa' | 'coordenacao';
  canCreateVaga: boolean;
  query: string;
  onChangeQuery: (q: string) => void;
  area: string | null;
  onToggleArea: (a: string) => void;
  modalidade: string | null;
  onToggleModalidade: (m: string) => void;
  arquivadas: boolean;
  onToggleArquivadas: () => void;
}

export function VagasFeedHeader({
  role,
  canCreateVaga,
  query,
  onChangeQuery,
  area,
  onToggleArea,
  modalidade,
  onToggleModalidade,
  arquivadas,
  onToggleArquivadas,
}: VagasFeedHeaderProps) {
  const router = useRouter();

  const getTitle = () => {
    switch (role) {
      case 'empresa':
        return 'Vagas anunciadas';
      case 'coordenacao':
        return 'Oportunidades';
      case 'estudante':
      default:
        return 'Encontre seu estágio';
    }
  };

  const getSubtitle = () => {
    switch (role) {
      case 'empresa':
        return 'Publique novas oportunidades para estudantes.';
      case 'coordenacao':
        return 'Acompanhe as vagas e cadastre empresas parceiras na aba Empresas.';
      case 'estudante':
      default:
        return 'Explore as vagas e acompanhe suas candidaturas pelo perfil.';
    }
  };

  return (
    <View className="mb-2 gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">
          {getTitle()}
        </Text>
        {canCreateVaga && (
          <Pressable
            onPress={() => router.push(ROUTES.VAGA_FORM as any)}
            accessibilityRole="button"
            accessibilityLabel="Nova vaga"
            className="h-10 w-10 items-center justify-center rounded-full bg-indigo-600 active:bg-indigo-700 shadow-sm"
          >
            <Ionicons name="add" size={24} color="#fff" />
          </Pressable>
        )}
      </View>

      <Text className="text-sm text-slate-500 dark:text-slate-400">
        {getSubtitle()}
      </Text>

      <Input
        label="Pesquisar oportunidades"
        placeholder="Cargo, empresa ou cidade..."
        value={query}
        onChangeText={onChangeQuery}
        returnKeyType="search"
        leftIcon={<Ionicons name="search" size={18} color="#94a3b8" />}
      />

      {/* Filtros de Modalidade e Arquivadas */}
      <View className="flex-row flex-wrap gap-2 pt-1">
        {MODALIDADES.map((m) => (
          <FilterChip
            key={m}
            label={m}
            active={modalidade === m}
            onPress={() => onToggleModalidade(m)}
          />
        ))}
        <FilterChip
          label="Arquivadas"
          active={arquivadas}
          onPress={onToggleArquivadas}
        />
      </View>

      {/* Filtros de Área */}
      <View className="flex-row flex-wrap gap-2">
        {AREAS.map((a) => (
          <FilterChip
            key={a}
            label={a}
            active={area === a}
            onPress={() => onToggleArea(a)}
          />
        ))}
      </View>
    </View>
  );
}

