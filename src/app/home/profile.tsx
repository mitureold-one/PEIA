import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserRole } from '@/hooks/use-user-role';
import { useProfileForm } from '@/hooks/use-profile-form';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileAdminCard } from '@/components/profile/profile-admin-card';
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
    handleAvatarChange,
    handleRemoveAvatar,
    save,
    confirmarExclusao,
  } = useProfileForm();

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <ScrollView contentContainerClassName="gap-4 p-6" keyboardShouldPersistTaps="handled">
        {/* Card Unificado: Foto sempre à mostra + Identificação + Menu retrátil de Informações da Conta */}
        <ProfileHeader
          perfil={perfil}
          role={role}
          onUpdateAvatar={handleAvatarChange}
          onRemoveAvatar={handleRemoveAvatar}
          dados={dados}
          errors={errors}
          saved={saved}
          onChangeField={handleChange}
          onSave={save}
        />

        {/* Atalho para o painel administrativo (Admin e Super Admin) */}
        <ProfileAdminCard perfil={perfil} />

        {/* Módulos de subclasse em primeiro plano (Inscrições e Currículo do Estudante) */}
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
