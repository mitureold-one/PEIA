import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompaniesManagement } from '@/hooks/use-companies-management';
import { CompaniesHeader } from '@/components/companies/companies-header';
import { CompanyForm } from '@/components/companies/company-form';
import { CompaniesList } from '@/components/companies/companies-list';
import { CompaniesRestrictedView } from '@/components/companies/companies-restricted-view';

export default function Companies() {
  const {
    isAdmin,
    empresas,
    nome,
    setNome,
    email,
    setEmail,
    erro,
    salvando,
    sucesso,
    cadastrar,
  } = useCompaniesManagement();

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <ScrollView contentContainerClassName="gap-4 p-6" keyboardShouldPersistTaps="handled">
        {/* Cabeçalho da aba de empresas */}
        <CompaniesHeader isAdmin={isAdmin} />

        {isAdmin ? (
          <>
            {/* Formulário de cadastro de nova empresa parceira */}
            <CompanyForm
              nome={nome}
              onChangeNome={setNome}
              email={email}
              onChangeEmail={setEmail}
              erro={erro}
              salvando={salvando}
              sucesso={sucesso}
              onSubmit={cadastrar}
            />

            {/* Listagem de empresas já salvas no SQLite */}
            <CompaniesList empresas={empresas} />
          </>
        ) : (
          <CompaniesRestrictedView />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
