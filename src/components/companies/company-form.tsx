import { Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CompanyFormProps {
  nome: string;
  onChangeNome: (val: string) => void;
  email: string;
  onChangeEmail: (val: string) => void;
  erro: string;
  salvando: boolean;
  sucesso: boolean;
  onSubmit: () => void;
}

export function CompanyForm({
  nome,
  onChangeNome,
  email,
  onChangeEmail,
  erro,
  salvando,
  sucesso,
  onSubmit,
}: CompanyFormProps) {
  return (
    <View className="gap-3 p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
      <Text className="text-base font-semibold text-slate-900 dark:text-white">
        Cadastrar Nova Empresa
      </Text>
      <Input
        label="Nome da empresa"
        required
        placeholder="Ex: Tech Solutions Brasil"
        value={nome}
        onChangeText={onChangeNome}
      />
      <Input
        label="E-mail de contato corporativo"
        required
        placeholder="Ex: contato@empresa.com.br"
        value={email}
        onChangeText={onChangeEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {!!erro && (
        <Text className="text-xs text-rose-600 dark:text-rose-400 font-medium">
          {erro}
        </Text>
      )}

      {sucesso && (
        <Text className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          ✓ Empresa cadastrada com sucesso no SQLite local!
        </Text>
      )}

      <Button
        title="Cadastrar empresa"
        onPress={onSubmit}
        isLoading={salvando}
        loadingText="Cadastrando..."
      />
    </View>
  );
}

