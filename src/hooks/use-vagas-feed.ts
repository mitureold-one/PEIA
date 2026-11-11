import { useMemo, useState } from 'react';
import { useVagas } from '@/hooks/use-vagas';
import { usePermissions } from '@/hooks/use-user-role';

export function useVagasFeed() {
  const todasVagas = useVagas();
  const { role, canCreateVaga } = usePermissions();

  const [query, setQuery] = useState('');
  const [area, setArea] = useState<string | null>(null);
  const [modalidade, setModalidade] = useState<string | null>(null);
  const [arquivadas, setArquivadas] = useState(false);

  const vagasFiltradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    return todasVagas.filter(
      (v) =>
        !!v.arquivada === arquivadas &&
        (!area || v.area === area) &&
        (!modalidade || v.modalidade === modalidade) &&
        (!q || `${v.titulo} ${v.empresa} ${v.cidade}`.toLowerCase().includes(q))
    );
  }, [todasVagas, query, area, modalidade, arquivadas]);

  const toggleArea = (a: string) => {
    setArea((current) => (current === a ? null : a));
  };

  const toggleModalidade = (m: string) => {
    setModalidade((current) => (current === m ? null : m));
  };

  const toggleArquivadas = () => {
    setArquivadas((current) => !current);
  };

  const limparFiltros = () => {
    setQuery('');
    setArea(null);
    setModalidade(null);
    setArquivadas(false);
  };

  return {
    vagas: vagasFiltradas,
    totalVagas: todasVagas.length,
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
  };
}

