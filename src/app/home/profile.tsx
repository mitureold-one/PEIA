import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserRole } from '@/hooks/use-user-role';
import { usePerfil } from '@/hooks/use-perfil';
import { ProfileStudentHeader } from '@/components/profile/profile-student-header';
import { ProfileStudentInterests } from '@/components/profile/profile-student-interests';
import { ProfileStudentFollowing } from '@/components/profile/profile-student-following';
import { ProfileInscricoesList } from '@/components/profile/profile-inscricoes-list';
import { ProfileAdminCard } from '@/components/profile/profile-admin-card';
import { CurriculoGeralEditor } from '@/components/curriculo/curriculo-geral-editor';

export default function Profile() {
  const role = useUserRole();
  const perfil = usePerfil();

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <ScrollView contentContainerClassName="gap-5 p-6" keyboardShouldPersistTaps="handled">
        {/* Perfil Completo do Estudante (Subclasse) */}
        {role === 'estudante' && (
          <>
            {/* Foto, Identidade e Métricas Sociais */}
            <ProfileStudentHeader />

            {/* Áreas de Interesse & Foco Profissional */}
            <ProfileStudentInterests />

            {/* Empresas Parceiras que o Estudante Acompanha */}
            <ProfileStudentFollowing />

            {/* Minhas Candidaturas e Inscrições */}
            <ProfileInscricoesList />

            {/* Editor do Currículo Geral / Master para IA */}
            <CurriculoGeralEditor />
          </>
        )}

        {/* Painel Administrativo para Coordenação / Admins */}
        {(role === 'coordenacao' || perfil?.role === 'admin' || perfil?.role === 'superadmin') && (
          <>
            <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-2">
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                Painel da Coordenação
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                Acesse as ferramentas de supervisão e gestão institucional da plataforma.
              </Text>
            </View>
            <ProfileAdminCard perfil={perfil} />
          </>
        )}

        {/* Persona Empresa */}
        {role === 'empresa' && (
          <View className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-3">
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              Painel da Empresa Parceira
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Gerencie suas oportunidades de estágio publicadas e acesse os currículos
              direcionados enviados pelos estudantes candidatos.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
