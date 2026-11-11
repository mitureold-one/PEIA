import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { empresasActions, useEmpresas } from '@/hooks/use-empresas';
import { usePermissions } from '@/hooks/use-user-role';

export default function Companies() {
  const router = useRouter();
  const { isAdmin } = usePermissions();
  const empresas = useEmpresas();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const cadastrar = async () => {
    if (!nome.trim() || !email.trim()) {
      setErro('Informe o nome e o e-mail da empresa.');
      return;
    }
    setSalvando(true);
    setErro('');
    try {
      await empresasActions.criar({ nome: nome.trim(), email: email.trim() });
      setNome('');
      setEmail('');
    } catch (e: any) {
      setErro(e?.message || 'Falha ao salvar a empresa no banco local.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <ScrollView contentContainerClassName="gap-4 p-6" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">Empresas</Text>
          {isAdmin && (
            <Button
              title="Painel Gestão"
              variant="secondary"
              onPress={() => router.push(ROUTES.GESTAO_USUARIOS as any)}
            />
          )}
        </View>

        {isAdmin ? (
          <>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              Cadastre empresas conveniadas para participarem do programa de estágios com persistência no SQLite.
            </Text>
            <Input label="Nome da empresa" required value={nome} onChangeText={setNome} />
            <Input
              label="E-mail de contato"
              required
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!!erro && <Text className="text-sm text-rose-600 dark:text-rose-400">{erro}</Text>}
            <Button
              title="Cadastrar empresa"
              onPress={cadastrar}
              isLoading={salvando}
              loadingText="Cadastrando..."
            />

            <Text className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
              Empresas cadastradas ({empresas.length})
            </Text>
            {empresas.length ? (
              empresas.map((empresa) => (
                <View
                  key={empresa.id}
                  className="gap-1 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <Text className="font-semibold text-slate-900 dark:text-white">{empresa.nome}</Text>
                  <Text className="text-sm text-slate-500 dark:text-slate-400">{empresa.email}</Text>
                </View>
              ))
            ) : (
              <Text className="text-sm text-slate-500 dark:text-slate-400">
                Ainda não há empresas cadastradas no banco local.
              </Text>
            )}
          </>
        ) : (
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            O cadastro de empresas é exclusivo para a coordenação e administradores.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
