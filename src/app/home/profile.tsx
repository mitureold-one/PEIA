import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { perfilActions, usePerfil } from '@/hooks/use-perfil';
import { formatPhone, validateEmail, validatePhone, validateRequired } from '@/utils/validators';

const STORAGE_KEY = 'peia:resume';

const EMPTY_RESUME = { summary: '', experience: '', education: '', skills: '' };
type Resume = typeof EMPTY_RESUME;

const EMPTY_PERFIL = { name: '', surname: '', email: '', phone: '' };

export default function Profile() {
  const router = useRouter();
  const perfil = usePerfil();
  const [dados, setDados] = useState(EMPTY_PERFIL);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_PERFIL>>({});
  const [resume, setResume] = useState<Resume>(EMPTY_RESUME);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => v && setResume({ ...EMPTY_RESUME, ...JSON.parse(v) }));
  }, []);

  // Sincroniza o formulário quando o perfil carrega ou muda.
  useEffect(() => {
    if (perfil) setDados({ name: perfil.name, surname: perfil.surname, email: perfil.email, phone: perfil.phone });
  }, [perfil]);

  const setD = (key: keyof typeof EMPTY_PERFIL) => (value: string) => {
    setDados((prev) => ({ ...prev, [key]: key === 'phone' ? formatPhone(value) : value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSaved(false);
  };

  const setR = (key: keyof Resume) => (value: string) => {
    setResume((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    const e: typeof errors = {};
    if (!validateRequired(dados.name)) e.name = 'Nome é obrigatório.';
    if (!validateRequired(dados.surname)) e.surname = 'Sobrenome é obrigatório.';
    if (!validateEmail(dados.email)) e.email = 'Informe um e-mail válido.';
    if (!validatePhone(dados.phone)) e.phone = 'Informe um telefone válido com DDD.';
    setErrors(e);
    if (Object.keys(e).length) return;

    perfilActions.editar(dados);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    setSaved(true);
  };

  const confirmarExclusao = () =>
    Alert.alert('Excluir perfil', 'Deseja excluir seu perfil? Você será desconectado.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          perfilActions.excluir();
          router.replace(ROUTES.AUTH);
        },
      },
    ]);

  const multiline = { multiline: true, textAlignVertical: 'top', className: 'min-h-[80px]' } as const;

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <ScrollView contentContainerClassName="gap-4 p-6" keyboardShouldPersistTaps="handled">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">Meu perfil</Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400">
          Atualize seus dados e monte seu currículo. Tudo fica salvo neste aparelho.
        </Text>

        <Text className="mt-2 text-base font-semibold text-slate-900 dark:text-white">Dados pessoais</Text>
        <Input label="Nome" value={dados.name} onChangeText={setD('name')} errorMessage={errors.name} />
        <Input label="Sobrenome" value={dados.surname} onChangeText={setD('surname')} errorMessage={errors.surname} />
        <Input label="E-mail" value={dados.email} onChangeText={setD('email')} keyboardType="email-address" autoCapitalize="none" errorMessage={errors.email} />
        <Input label="Telefone" value={dados.phone} onChangeText={setD('phone')} keyboardType="phone-pad" errorMessage={errors.phone} />

        <Text className="mt-2 text-base font-semibold text-slate-900 dark:text-white">Currículo</Text>
        <Input label="Resumo profissional" value={resume.summary} onChangeText={setR('summary')} {...multiline} />
        <Input label="Experiência" value={resume.experience} onChangeText={setR('experience')} {...multiline} />
        <Input label="Formação" value={resume.education} onChangeText={setR('education')} {...multiline} />
        <Input label="Habilidades" value={resume.skills} onChangeText={setR('skills')} {...multiline} />

        <Button title="Salvar alterações" onPress={save} />
        {saved && <View accessibilityLiveRegion="polite"><Text className="text-center text-sm text-emerald-500">Alterações salvas!</Text></View>}
        <Button title="Excluir perfil" className="bg-rose-600 active:bg-rose-700" onPress={confirmarExclusao} />
      </ScrollView>
    </SafeAreaView>
  );
}
