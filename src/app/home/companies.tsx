import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { empresasActions, useEmpresas } from '@/hooks/use-empresas';
import { useUserRole } from '@/hooks/use-user-role';

export default function Companies() {
  const role = useUserRole();
  const empresas = useEmpresas();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');

  const cadastrar = () => {
    if (!nome.trim() || !email.trim()) {
      setErro('Informe o nome e o e-mail da empresa.');
      return;
    }
    empresasActions.criar({ nome: nome.trim(), email: email.trim() });
    setNome('');
    setEmail('');
    setErro('');
  };

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <ScrollView contentContainerClassName="gap-4 p-6" keyboardShouldPersistTaps="handled">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">Empresas</Text>
        {role === 'coordenacao' ? (
          <>
            <Text className="text-sm text-slate-500 dark:text-slate-400">Cadastre empresas para que possam participar do programa de estágios.</Text>
            <Input label="Nome da empresa" required value={nome} onChangeText={setNome} />
            <Input label="E-mail de contato" required value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            {!!erro && <Text className="text-sm text-rose-600">{erro}</Text>}
            <Button title="Cadastrar empresa" onPress={cadastrar} />
            <Text className="mt-2 text-base font-semibold text-slate-900 dark:text-white">Empresas cadastradas</Text>
            {empresas.length ? empresas.map((empresa) => (
              <View key={empresa.id} className="gap-1 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <Text className="font-semibold text-slate-900 dark:text-white">{empresa.nome}</Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400">{empresa.email}</Text>
              </View>
            )) : <Text className="text-sm text-slate-500 dark:text-slate-400">Ainda não há empresas cadastradas.</Text>}
          </>
        ) : <Text className="text-sm text-slate-500 dark:text-slate-400">O cadastro de empresas é exclusivo da coordenação.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}
