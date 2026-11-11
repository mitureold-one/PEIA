import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserRole } from '@/hooks/use-user-role';
import { usePerfil } from '@/hooks/use-perfil';
import { StudentProfileView } from '@/components/profile/student-profile-view';
import { CompanyProfileView } from '@/components/profile/company-profile-view';
import { CoordinationProfileView } from '@/components/profile/coordination-profile-view';

/**
 * Ponto de entrada da rota Perfil (Subclasses).
 * Orquestra de maneira 100% modular a montagem da tela conforme o papel do usuário.
 */
export default function Profile() {
  const role = useUserRole();
  const perfil = usePerfil();

  const isCoordenacaoOuAdmin =
    role === 'coordenacao' ||
    perfil?.role === 'admin' ||
    perfil?.role === 'superadmin';

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <ScrollView
        contentContainerClassName="gap-5 p-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {role === 'estudante' && <StudentProfileView />}
        {role === 'empresa' && <CompanyProfileView />}
        {isCoordenacaoOuAdmin && <CoordinationProfileView />}
      </ScrollView>
    </SafeAreaView>
  );
}
