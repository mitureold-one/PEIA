import { View } from 'react-native';
import { ProfileStudentHeader } from '@/components/profile/profile-student-header';
import { ProfileStudentInterests } from '@/components/profile/profile-student-interests';
import { ProfileStudentSummary } from '@/components/profile/profile-student-summary';
import { ProfileStudentEducation } from '@/components/profile/profile-student-education';
import { ProfileStudentExperience } from '@/components/profile/profile-student-experience';
import { ProfileStudentSkills } from '@/components/profile/profile-student-skills';

/**
 * Montagem modular da main do perfil do Estudante.
 * O mural de recomendações fica reservado para empresas e coordenação avaliarem o estudante.
 * A main do próprio estudante apresenta o seu currículo vivo em seções modulares distribuídas:
 * 1. Hero do Estudante (Foto de Destaque, Identidade e Métricas)
 * 2. Carrossel Lateral de Áreas de Interesse (Foco para compatibilidade IA)
 * 3. Sobre Mim / Resumo Profissional
 * 4. Formação Acadêmica
 * 5. Experiência Profissional / Estágios
 * 6. Competências & Idiomas
 */
export function StudentProfileView() {
  return (
    <View className="gap-5">
      {/* 1. Hero do Estudante */}
      <ProfileStudentHeader />

      {/* 2. Áreas de Interesse & Foco Profissional (Carrossel Lateral) */}
      <ProfileStudentInterests />

      {/* 3. Sobre Mim / Resumo Geral */}
      <ProfileStudentSummary />

      {/* 4. Formação Acadêmica */}
      <ProfileStudentEducation />

      {/* 5. Experiência Profissional e Estágios */}
      <ProfileStudentExperience />

      {/* 6. Competências, Habilidades & Idiomas */}
      <ProfileStudentSkills />
    </View>
  );
}
