import { useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePerfil } from '@/hooks/use-perfil';
import { useInscricoes } from '@/hooks/use-inscricoes';
import { useVagas } from '@/hooks/use-vagas';
import { useEmpresas } from '@/hooks/use-empresas';
import { estudanteSocialActions, useEstudanteSocial } from '@/hooks/use-estudante-social';
import { ProfileMetricDialogModal } from '@/components/ui/profile-metric-dialog-modal';
import { ROUTES } from '@/constants/routes';

type MetricaTipo = 'inscricoes' | 'empresas' | 'conexoes' | null;

const EMPRESAS_BASE = [
  { id: 'empresa_1', nome: 'TechHub São Luís', setor: 'Tecnologia & Inovação' },
  { id: 'empresa_2', nome: 'Inova Maranhão', setor: 'Startups & P&D' },
  { id: 'empresa_3', nome: 'Vale Lab', setor: 'Engenharia & Mineração' },
  { id: 'empresa_4', nome: 'Ambev Tech', setor: 'Desenvolvimento & Cloud' },
  { id: 'empresa_5', nome: 'Alura & FIAP Hub', setor: 'Educação & EdTech' },
  { id: 'empresa_6', nome: 'Nubank Tech', setor: 'Fintech & Mobile' },
  { id: 'empresa_7', nome: 'Banco do Brasil DITEC', setor: 'Setor Bancário & IA' },
];

const COLEGAS_BASE = [
  { id: 'user_2', nome: 'Beatriz Lima', curso: 'Engenharia da Computação · UNDB' },
  { id: 'user_3', nome: 'Carlos Eduardo Ramos', curso: 'Sistemas de Informação · UNDB' },
  { id: 'user_4', nome: 'Felipe Andrade', curso: 'Análise e Desenv. de Sistemas' },
  { id: 'user_5', nome: 'Gabriel Rocha', curso: 'Ciência da Computação' },
  { id: 'user_6', nome: 'Juliana Castro', curso: 'Engenharia de Software' },
  { id: 'user_7', nome: 'Lucas Mendes', curso: 'UI/UX Design & Produto' },
  { id: 'user_8', nome: 'Mariana Souza', curso: 'Inteligência Artificial & Dados' },
];

export function ProfileStudentHeader() {
  const router = useRouter();
  const perfil = usePerfil();
  const inscricoes = useInscricoes();
  const vagas = useVagas();
  const empresasCadastradas = useEmpresas();
  const { seguindoEmpresas, seguindoUsuarios } = useEstudanteSocial();

  const [metricaAtiva, setMetricaAtiva] = useState<MetricaTipo>(null);

  const nomeCompleto = perfil?.name
    ? `${perfil.name} ${perfil.surname ?? ''}`.trim()
    : 'Estudante PEIA';

  const iniciais = `${perfil?.name ? perfil.name[0] : 'E'}${
    perfil?.surname ? perfil.surname[0] : ''
  }`.toUpperCase();

  // 1. Dados de Inscrições em Ordem Alfabética (A-Z)
  const vagasInscritas = useMemo(() => {
    return vagas
      .filter((v) => inscricoes.includes(v.id))
      .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR', { sensitivity: 'base' }));
  }, [vagas, inscricoes]);

  // 2. Dados de Empresas Seguidas em Ordem Alfabética (A-Z)
  const empresasSeguidas = useMemo(() => {
    const map = new Map<string, { id: string; nome: string; setor: string }>();
    EMPRESAS_BASE.forEach((e) => map.set(e.id, e));
    empresasCadastradas.forEach((e) =>
      map.set(e.id, { id: e.id, nome: e.nome, setor: 'Empresa Parceira' })
    );

    return Array.from(map.values())
      .filter((e) => seguindoEmpresas.includes(e.id))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
  }, [empresasCadastradas, seguindoEmpresas]);

  // 3. Dados de Conexões em Ordem Alfabética (A-Z)
  const colegasConectados = useMemo(() => {
    return COLEGAS_BASE
      .filter((c) => seguindoUsuarios.includes(c.id))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
  }, [seguindoUsuarios]);

  return (
    <>
      <View className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-4">
        {/* Foto do Estudante e Identificação */}
        <View className="items-center gap-3">
          <Pressable
            onPress={() => router.push(ROUTES.CONFIGURACOES)}
            accessibilityRole="button"
            accessibilityLabel="Editar foto e dados cadastrais"
            className="relative active:opacity-85"
          >
            <View className="h-24 w-24 rounded-full border-2 border-indigo-500/40 dark:border-indigo-400/50 p-1 bg-white dark:bg-slate-900 shadow-md">
              {perfil?.avatar ? (
                <Image
                  source={{ uri: perfil.avatar }}
                  resizeMode="cover"
                  className="h-full w-full rounded-full"
                />
              ) : (
                <View className="h-full w-full rounded-full bg-indigo-600 items-center justify-center">
                  <Text className="text-2xl font-black text-white">
                    {iniciais}
                  </Text>
                </View>
              )}
            </View>

            {/* Badge de Edição */}
            <View className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 items-center justify-center shadow-sm">
              <Ionicons name="create-outline" size={13} color="#ffffff" />
            </View>
          </Pressable>

          <View className="items-center gap-1">
            <Text className="text-xl font-bold text-slate-900 dark:text-white text-center">
              {nomeCompleto}
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Estudante de Tecnologia · UNDB
            </Text>

            <View className="flex-row items-center gap-2 mt-1">
              <View className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                <Text className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  ● Aberto a Oportunidades
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Barra com os 3 Contadores Interativos */}
        <View className="flex-row items-center justify-around py-3 px-2 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          {/* 1. Contador Inscrições */}
          <Pressable
            onPress={() => setMetricaAtiva('inscricoes')}
            accessibilityRole="button"
            accessibilityLabel="Ver vagas inscritas"
            className="items-center flex-1 active:opacity-75"
          >
            <Text className="text-base font-black text-indigo-600 dark:text-indigo-400">
              {vagasInscritas.length}
            </Text>
            <View className="flex-row items-center gap-0.5">
              <Text className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold underline">
                Inscrições
              </Text>
              <Ionicons name="chevron-forward" size={10} color="#6366f1" />
            </View>
          </Pressable>

          <View className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* 2. Contador Empresas */}
          <Pressable
            onPress={() => setMetricaAtiva('empresas')}
            accessibilityRole="button"
            accessibilityLabel="Ver empresas seguidas"
            className="items-center flex-1 active:opacity-75"
          >
            <Text className="text-base font-black text-indigo-600 dark:text-indigo-400">
              {empresasSeguidas.length}
            </Text>
            <View className="flex-row items-center gap-0.5">
              <Text className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold underline">
                Empresas
              </Text>
              <Ionicons name="chevron-forward" size={10} color="#6366f1" />
            </View>
          </Pressable>

          <View className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* 3. Contador Conexões */}
          <Pressable
            onPress={() => setMetricaAtiva('conexoes')}
            accessibilityRole="button"
            accessibilityLabel="Ver conexões e colegas"
            className="items-center flex-1 active:opacity-75"
          >
            <Text className="text-base font-black text-indigo-600 dark:text-indigo-400">
              {colegasConectados.length}
            </Text>
            <View className="flex-row items-center gap-0.5">
              <Text className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold underline">
                Conexões
              </Text>
              <Ionicons name="chevron-forward" size={10} color="#6366f1" />
            </View>
          </Pressable>
        </View>
      </View>

      {/* Modal Genérico Hidratado: 1. INSCRIÇÕES */}
      <ProfileMetricDialogModal
        visible={metricaAtiva === 'inscricoes'}
        title="Vagas que Você se Candidatou"
        countLabel={`${vagasInscritas.length} ${vagasInscritas.length === 1 ? 'candidatura ativa' : 'candidaturas ativas'} (A-Z)`}
        iconName="briefcase"
        searchPlaceholder="Pesquisar por título, empresa ou cidade..."
        items={vagasInscritas}
        filterFn={(v, q) =>
          v.titulo.toLowerCase().includes(q) ||
          v.empresa.toLowerCase().includes(q) ||
          v.cidade.toLowerCase().includes(q)
        }
        emptyMessage="Você ainda não se inscreveu em vagas."
        onClose={() => setMetricaAtiva(null)}
        renderItem={(vaga) => (
          <Pressable
            key={vaga.id}
            onPress={() => {
              setMetricaAtiva(null);
              router.push({
                pathname: ROUTES.VAGA_DETALHE as any,
                params: { id: vaga.id },
              });
            }}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex-row items-center justify-between active:opacity-75"
          >
            <View className="flex-1 pr-2">
              <Text className="text-xs font-bold text-slate-900 dark:text-white">
                {vaga.titulo}
              </Text>
              <Text className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {vaga.empresa} · {vaga.cidade} · {vaga.modalidade}
              </Text>
              <Text className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                ● Inscrição ativa · Toque para detalhes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </Pressable>
        )}
      />

      {/* Modal Genérico Hidratado: 2. EMPRESAS SEGUIDAS */}
      <ProfileMetricDialogModal
        visible={metricaAtiva === 'empresas'}
        title="Empresas que Você Segue"
        countLabel={`${empresasSeguidas.length} ${empresasSeguidas.length === 1 ? 'empresa acompanhada' : 'empresas acompanhadas'} (A-Z)`}
        iconName="business"
        searchPlaceholder="Pesquisar por nome ou setor da empresa..."
        items={empresasSeguidas}
        filterFn={(e, q) =>
          e.nome.toLowerCase().includes(q) || e.setor.toLowerCase().includes(q)
        }
        emptyMessage="Você ainda não segue empresas."
        onClose={() => setMetricaAtiva(null)}
        renderItem={(empresa) => (
          <View
            key={empresa.id}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3 flex-1 mr-2">
              <View className="h-10 w-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 items-center justify-center border border-indigo-200 dark:border-indigo-800">
                <Text className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                  {(empresa.nome[0] || 'E').toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text numberOfLines={1} className="text-xs font-bold text-slate-900 dark:text-white">
                  {empresa.nome}
                </Text>
                <Text numberOfLines={1} className="text-[11px] text-slate-500 dark:text-slate-400">
                  {empresa.setor}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => estudanteSocialActions.toggleSeguirEmpresa(empresa.id)}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 active:scale-95 flex-row items-center gap-1"
            >
              <Ionicons name="checkmark" size={12} color="#10b981" />
              <Text className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                Seguindo
              </Text>
            </Pressable>
          </View>
        )}
      />

      {/* Modal Genérico Hidratado: 3. CONEXÕES / COLEGAS */}
      <ProfileMetricDialogModal
        visible={metricaAtiva === 'conexoes'}
        title="Suas Conexões Acadêmicas"
        countLabel={`${colegasConectados.length} ${colegasConectados.length === 1 ? 'colega conectado' : 'colegas conectados'} (A-Z)`}
        iconName="people"
        searchPlaceholder="Pesquisar colega por nome ou curso..."
        items={colegasConectados}
        filterFn={(c, q) =>
          c.nome.toLowerCase().includes(q) || c.curso.toLowerCase().includes(q)
        }
        emptyMessage="Você ainda não possui conexões adicionadas."
        onClose={() => setMetricaAtiva(null)}
        renderItem={(colega) => (
          <View
            key={colega.id}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3 flex-1 mr-2">
              <View className="h-10 w-10 rounded-full bg-violet-600/10 dark:bg-violet-500/20 items-center justify-center border border-violet-200 dark:border-violet-800">
                <Text className="text-xs font-black text-violet-600 dark:text-violet-400">
                  {(colega.nome[0] || 'C').toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text numberOfLines={1} className="text-xs font-bold text-slate-900 dark:text-white">
                  {colega.nome}
                </Text>
                <Text numberOfLines={1} className="text-[11px] text-slate-500 dark:text-slate-400">
                  {colega.curso}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => estudanteSocialActions.toggleSeguirUsuario(colega.id)}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 active:scale-95 flex-row items-center gap-1"
            >
              <Ionicons name="checkmark-circle" size={12} color="#6366f1" />
              <Text className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                Conectado
              </Text>
            </Pressable>
          </View>
        )}
      />
    </>
  );
}
