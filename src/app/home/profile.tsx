import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserRole } from '@/hooks/use-user-role';
import { useProfileForm } from '@/hooks/use-profile-form';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileAdminCard } from '@/components/profile/profile-admin-card';
import { ProfilePersonalDataForm } from '@/components/profile/profile-personal-data-form';
import { ProfileInscricoesList } from '@/components/profile/profile-inscricoes-list';
import { ProfileDangerZone } from '@/components/profile/profile-danger-zone';
import { CurriculoGeralEditor } from '@/components/curriculo/curriculo-geral-editor';

export default function Profile() {
  const role = useUserRole();
  const {
    perfil,
    dados,
    errors,
    saved,
    handleChange,
    save,
    confirmarExclusao,
  } = useProfileForm();

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <ScrollView contentContainerClassName="gap-4 p-6" keyboardShouldPersistTaps="handled">
        {/* Cabeçalho da conta e identificação do perfil */}
        <ProfileHeader perfil={perfil} role={role} />

        {/* Atalho para o painel administrativo (Admin e Super Admin) */}
        <ProfileAdminCard perfil={perfil} />

        {/* Formulário de dados pessoais e contato */}
        <ProfilePersonalDataForm
          dados={dados}
          errors={errors}
          saved={saved}
          onChangeField={handleChange}
          onSave={save}
        />

        {/* Módulos exclusivos da persona Estudante */}
        {role === 'estudante' && (
          <>
            <ProfileInscricoesList />
            <CurriculoGeralEditor />
          </>
        )}

        {/* Ação de encerramento/exclusão de conta */}
        <ProfileDangerZone onExcluir={confirmarExclusao} />
      </ScrollView>
    </SafeAreaView>
  );
}
