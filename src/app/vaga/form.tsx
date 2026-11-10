import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AREAS, MODALIDADES, type Modalidade } from '@/data/vagas';
import { vagasActions } from '@/hooks/use-vagas';
import { useUserRole } from '@/hooks/use-user-role';

function Chips<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((o) => (
        <Pressable
          key={o}
          onPress={() => onChange(o)}
          accessibilityRole="button"
          accessibilityState={{ selected: value === o }}
          className={`rounded-full border px-3.5 py-1.5 ${
            value === o ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 dark:border-slate-700'
          }`}
        >
          <Text className={`text-xs font-medium ${value === o ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
            {o}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// Sem id = criar; com id = editar.
export default function VagaForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const role = useUserRole();

  const [titulo, setTitulo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [cidade, setCidade] = useState('');
  const [area, setArea] = useState(AREAS[0]);
  const [modalidade, setModalidade] = useState<Modalidade>(MODALIDADES[0]);
  const [bolsa, setBolsa] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tentou, setTentou] = useState(false);

  const obrigatorio = (v: string) => (tentou && !v.trim() ? 'Campo obrigatório.' : undefined);

  const salvar = () => {
    if (role !== 'empresa' || id) return;
    setTentou(true);
    if (![titulo, empresa, cidade].every((v) => v.trim())) return;
    const dados = {
      titulo: titulo.trim(),
      empresa: empresa.trim(),
      cidade: cidade.trim(),
      area,
      modalidade,
      bolsa: Number(bolsa.replace(/\D/g, '')) || 0,
      descricao: descricao.trim(),
    };
    vagasActions.criar(dados);
    router.back();
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-[#03031b]"
      contentContainerClassName="gap-4 p-6"
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen options={{ title: 'Nova vaga' }} />
      {role !== 'empresa' || id ? (
        <View className="gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <Text className="font-semibold text-amber-800 dark:text-amber-300">
            {role === 'empresa' ? 'Publicação de vagas' : 'Acesso restrito a empresas'}
          </Text>
          <Text className="text-sm text-amber-700 dark:text-amber-400">
            {role === 'empresa' ? 'Empresas podem anunciar vagas, mas não editar ou remover anúncios existentes.' : 'Somente empresas podem anunciar vagas.'}
          </Text>
          <Button title="Voltar para as vagas" onPress={() => router.replace('/home')} />
        </View>
      ) : <>
      <Input label="Título" required value={titulo} onChangeText={setTitulo} errorMessage={obrigatorio(titulo)} />
      <Input label="Empresa" required value={empresa} onChangeText={setEmpresa} errorMessage={obrigatorio(empresa)} />
      <Input label="Cidade" required value={cidade} onChangeText={setCidade} errorMessage={obrigatorio(cidade)} />
      <View className="gap-1.5">
        <Text className="text-xs font-medium text-slate-700 dark:text-slate-300">Área</Text>
        <Chips options={AREAS} value={area} onChange={setArea} />
      </View>
      <View className="gap-1.5">
        <Text className="text-xs font-medium text-slate-700 dark:text-slate-300">Modalidade</Text>
        <Chips options={MODALIDADES} value={modalidade} onChange={setModalidade} />
      </View>
      <Input label="Bolsa (R$)" value={bolsa} onChangeText={setBolsa} keyboardType="numeric" />
      <Input
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        textAlignVertical="top"
        className="min-h-[100px]"
      />
      <Button title="Anunciar vaga" onPress={salvar} />
      </>}
    </ScrollView>
  );
}
