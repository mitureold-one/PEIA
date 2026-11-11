import { View } from 'react-native';
import { ProfileStudentHeader } from '@/components/profile/profile-student-header';
import { ProfileStudentWall } from '@/components/profile/profile-student-wall';
import { ProfileStudentInterests } from '@/components/profile/profile-student-interests';
import { ProfileInscricoesList } from '@/components/profile/profile-inscricoes-list';
import { CurriculoGeralEditor } from '@/components/curriculo/curriculo-geral-editor';

/**
 * Montagem modular dos componentes exclusivos da subclasse Estudante.
 */
export function StudentProfileView() {
  return (
    <View className="gap-5">
      {/* 1. Foto do Estudante, Identificação e Contadores (com modal de empresas seguidas) */}
      <ProfileStudentHeader />

      {/* 2. Mural de Avaliações & Recomendações (Empresas, Docentes e Colegas) */}
      <ProfileStudentWall />

      {/* 3. Áreas de Interesse & Foco Profissional */}
      <ProfileStudentInterests />

      {/* 4. Candidaturas e Inscrições em Vagas */}
      <ProfileInscricoesList />

      {/* 5. Editor do Currículo Geral / Master para IA */}
      <CurriculoGeralEditor />
    </View>
  );
}
