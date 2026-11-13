import { View } from 'react-native';
import { useProfileStudentHeader } from '@/hooks/use-profile-student-header';
import { ProfileStudentInfo } from '@/components/profile/profile-student-info';
import { ProfileStudentCounters } from '@/components/profile/profile-student-counters';
import { ProfileStudentMetricModals } from '@/components/profile/profile-student-metric-modals';

/**
 * Cabeçalho do Perfil do Estudante no estilo LinkedIn / Hero Profissional.
 * - Foto centralizada em destaque e dados acadêmicos no topo.
 * - Barra horizontal de 3 métricas simétricas na base.
 * - Modais desacoplados para CRUD acadêmico, troca de foto e listagens.
 */
export function ProfileStudentHeader() {
  const {
    aluno,
    iniciais,
    vagasInscritas,
    empresasSeguidas,
    colegasConectados,
    metricaAtiva,
    abrirMetrica,
    fecharMetrica,
    navegarParaVaga,
    toggleSeguirEmpresa,
    toggleSeguirUsuario,
    atualizarDadosAluno,
    toggleAbertoOportunidades,
    atualizarFotoPerfil,
  } = useProfileStudentHeader();

  return (
    <>
      <View className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-5">
        {/* 1. Foto de Destaque e Identificação Centralizada (Estilo LinkedIn) */}
        <ProfileStudentInfo
          aluno={aluno}
          iniciais={iniciais}
          onUpdateAcademicData={atualizarDadosAluno}
          onToggleAbertoOportunidades={toggleAbertoOportunidades}
          onUpdateAvatar={atualizarFotoPerfil}
        />

        {/* 2. Barra Horizontal Simétrica de Métricas (Inscrições, Empresas, Conexões) */}
        <ProfileStudentCounters
          layout="row"
          vagasCount={vagasInscritas.length}
          empresasCount={empresasSeguidas.length}
          conexoesCount={colegasConectados.length}
          onOpenMetrica={abrirMetrica}
        />
      </View>

      {/* 3. Diálogos Modais Modulares de Métricas */}
      <ProfileStudentMetricModals
        metricaAtiva={metricaAtiva}
        onClose={fecharMetrica}
        vagasInscritas={vagasInscritas}
        empresasSeguidas={empresasSeguidas}
        colegasConectados={colegasConectados}
        onSelectVaga={navegarParaVaga}
        onToggleSeguirEmpresa={toggleSeguirEmpresa}
        onToggleSeguirUsuario={toggleSeguirUsuario}
      />
    </>
  );
}
