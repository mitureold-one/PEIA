import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { perfilActions, usePerfil } from '@/hooks/use-perfil';
import { useUserRole } from '@/hooks/use-user-role';
import { useInscricoes } from '@/hooks/use-inscricoes';
import { useVagas } from '@/hooks/use-vagas';
import { formatPhone, validateEmail, validatePhone, validateRequired } from '@/utils/validators';

const STORAGE_KEY = 'peia:resume';

const EMPTY_RESUME = { summary: '', experience: '', education: '', skills: '' };
type Resume = typeof EMPTY_RESUME;

const EMPTY_PERFIL = { name: '', surname: '', email: '', phone: '' };

export default function Profile() {
  const router = useRouter();
  const perfil = usePerfil();
  const role = useUserRole();
  const inscricoes = useInscricoes();
  const vagas = useVagas();
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
    if (role === 'estudante') await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
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
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white flex-1 mr-2">
            {role === 'estudante' ? 'Meu perfil de estudante' : role === 'empresa' ? 'Conta da empresa' : 'Conta da coordenação'}
          </Text>
          {perfil?.role && (
            <View className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800">
              <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                {perfil.role === 'superadmin'
                  ? 'Super Admin'
                  : perfil.role === 'admin'
                  ? 'Administrador'
                  : perfil.role === 'empresa'
                  ? 'Empresa'
                  : 'Aluno'}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-sm text-slate-500 dark:text-slate-400">
          {role === 'estudante'
            ? 'Atualize seus dados, monte seu currículo e acompanhe suas inscrições.'
            : 'Atualize os dados de contato da sua conta.'} Tudo fica salvo neste aparelho.
        </Text>

        {/* Painel Administrativo de Gestão (visível apenas para Admin e Super Admin) */}
        {(perfil?.role === 'admin' || perfil?.role === 'superadmin') && (
          <View className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900/60 my-1">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-base">🛡️</Text>
              <Text className="font-bold text-slate-900 dark:text-white">
                Painel de Gestão de Usuários
              </Text>
            </View>
            <Text className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Como {perfil.role === 'superadmin' ? 'Super Administrador' : 'Administrador'}, você tem permissão para cadastrar novas empresas e gerenciar perfis no SQLite.
            </Text>
            <Button
              title="Acessar Cadastro Interno"
              onPress={() => router.push(ROUTES.GESTAO_USUARIOS as any)}
            />
          </View>
        )}

        <Text className="mt-2 text-base font-semibold text-slate-900 dark:text-white">Dados pessoais</Text>
        <Input label="Nome" value={dados.name} onChangeText={setD('name')} errorMessage={errors.name} />
        <Input label="Sobrenome" value={dados.surname} onChangeText={setD('surname')} errorMessage={errors.surname} />
        <Input label="E-mail" value={dados.email} onChangeText={setD('email')} keyboardType="email-address" autoCapitalize="none" errorMessage={errors.email} />
        <Input label="Telefone" value={dados.phone} onChangeText={setD('phone')} keyboardType="phone-pad" errorMessage={errors.phone} />

        {role === 'estudante' && <>
        <Text className="mt-2 text-base font-semibold text-slate-900 dark:text-white">Minhas inscrições</Text>
        {inscricoes.length === 0 ? (
          <Text className="text-sm text-slate-500 dark:text-slate-400">Você ainda não se inscreveu em vagas.</Text>
        ) : vagas.filter((vaga) => inscricoes.includes(vaga.id)).map((vaga) => (
          <Pressable
            key={vaga.id}
            onPress={() => router.push({ pathname: ROUTES.VAGA_DETALHE as any, params: { id: vaga.id } })}
            accessibilityRole="button"
            className="gap-1 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60"
          >
            <Text className="font-semibold text-slate-900 dark:text-white">{vaga.titulo}</Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">{vaga.empresa} · Inscrição realizada</Text>
          </Pressable>
        ))}

        <Text className="mt-2 text-base font-semibold text-slate-900 dark:text-white">Currículo</Text>
        <Input label="Resumo profissional" value={resume.summary} onChangeText={setR('summary')} {...multiline} />
        <Input label="Experiência" value={resume.experience} onChangeText={setR('experience')} {...multiline} />
        <Input label="Formação" value={resume.education} onChangeText={setR('education')} {...multiline} />
        <Input label="Habilidades" value={resume.skills} onChangeText={setR('skills')} {...multiline} />
        </>}

        <Button title="Salvar alterações" onPress={save} />
        {saved && <View accessibilityLiveRegion="polite"><Text className="text-center text-sm text-emerald-500">Alterações salvas!</Text></View>}
        <Button title="Excluir perfil" className="bg-rose-600 active:bg-rose-700" onPress={confirmarExclusao} />
      </ScrollView>
    </SafeAreaView>
  );
}
