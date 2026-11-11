import { View } from 'react-native';
import { ProfileStudentHeader } from '@/components/profile/profile-student-header';
import { ProfileStudentWall } from '@/components/profile/profile-student-wall';
import { ProfileStudentInterests } from '@/components/profile/profile-student-interests';
import { CurriculoGeralEditor } from '@/components/curriculo/curriculo-geral-editor';

/**
 * Montagem modular dos componentes exclusivos da subclasse Estudante.
 * Foto, identificação e atalhos de listas no Header;
 * Mural de avaliações, Interesses profissionais e Currículo Geral na timeline.
 */
export function StudentProfileView() {
  return (
    <View className="gap-5">
      {/* 1. Header Dividido: Foto em Quadrado com cantos arredondados e Atalhos de Listas à Direita */}
      <ProfileStudentHeader />

      {/* 2. Mural de Avaliações & Recomendações (Empresas, Docentes e Colegas) */}
      <ProfileStudentWall />

      {/* 3. Áreas de Interesse & Foco Profissional */}
      <ProfileStudentInterests />

      {/* 4. Editor do Currículo Geral / Master para IA */}
      <CurriculoGeralEditor />
    </View>
  );
}
