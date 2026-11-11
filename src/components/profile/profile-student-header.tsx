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

  // 1. Inscrições em ordem alfabética (A-Z)
  const vagasInscritas = useMemo(() => {
    return vagas
      .filter((v) => inscricoes.includes(v.id))
      .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR', { sensitivity: 'base' }));
  }, [vagas, inscricoes]);

  // 2. Empresas seguidas em ordem alfabética (A-Z)
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

  // 3. Conexões em ordem alfabética (A-Z)
  const colegasConectados = useMemo(() => {
    return COLEGAS_BASE
      .filter((c) => seguindoUsuarios.includes(c.id))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
  }, [seguindoUsuarios]);

  return (
    <>
      {/* Card Header com divisão: Identificação à esquerda e Atalhos de Listas à direita */}
      <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/70 shadow-sm">
        <View className="flex-row items-center justify-between gap-4">
          {/* LADO ESQUERDO: Foto em quadrado com cantos arredondados, Nome e Ocupação */}
          <View className="flex-1 gap-2.5">
            <View className="flex-row items-center gap-3">
              {/* Foto em Quadrado com Cantos Arredondados */}
              <Pressable
                onPress={() => router.push(ROUTES.CONFIGURACOES)}
                accessibilityRole="button"
                accessibilityLabel="Editar foto de perfil e dados cadastrais"
                className="relative active:opacity-85"
              >
                <View className="h-18 w-18 sm:h-20 sm:w-20 rounded-2xl border-2 border-indigo-500/40 dark:border-indigo-400/50 p-1 bg-white dark:bg-slate-900 shadow-sm overflow-hidden items-center justify-center">
                  {perfil?.avatar ? (
                    <Image
                      source={{ uri: perfil.avatar }}
                      resizeMode="cover"
                      className="h-full w-full rounded-xl"
                    />
                  ) : (
                    <View className="h-full w-full rounded-xl bg-indigo-600 items-center justify-center">
                      <Text className="text-xl sm:text-2xl font-black text-white">
                        {iniciais}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Badge de Edição */}
                <View className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-indigo-600 border border-white dark:border-slate-900 items-center justify-center shadow-xs">
                  <Ionicons name="create-outline" size={11} color="#ffffff" />
                </View>
              </Pressable>

              {/* Nome e Ocupação */}
              <View className="flex-1 pr-1">
                <Text
                  numberOfLines={1}
                  className="text-base sm:text-lg font-bold text-slate-900 dark:text-white"
                >
                  {nomeCompleto}
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  Estudante de Tecnologia
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5"
                >
                  UNDB · Graduação
                </Text>
              </View>
            </View>

            {/* Tag de Oportunidades */}
            <View className="flex-row items-center">
              <View className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                <Text className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  ● Aberto a Oportunidades
                </Text>
              </View>
            </View>
          </View>

          {/* LADO DIREITO: Atalhos verticais para as Listas (Inscrições, Empresas, Conexões) */}
          <View className="gap-2 w-36">
            {/* 1. Atalho Inscrições */}
            <Pressable
              onPress={() => setMetricaAtiva('inscricoes')}
              accessibilityRole="button"
              accessibilityLabel="Ver lista de inscrições"
              className="flex-row items-center justify-between px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 active:scale-95 shadow-2xs"
            >
              <View className="flex-row items-center gap-2">
                <View className="h-6 w-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 items-center justify-center">
                  <Ionicons name="briefcase" size={12} color="#6366f1" />
                </View>
                <View>
                  <Text className="text-xs font-black text-slate-900 dark:text-white">
                    {vagasInscritas.length}
                  </Text>
                  <Text className="text-[10px] text-slate-500 dark:text-slate-400">
                    Inscrições
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={13} color="#94a3b8" />
            </Pressable>

            {/* 2. Atalho Empresas */}
            <Pressable
              onPress={() => setMetricaAtiva('empresas')}
              accessibilityRole="button"
              accessibilityLabel="Ver lista de empresas que segue"
              className="flex-row items-center justify-between px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 active:scale-95 shadow-2xs"
            >
              <View className="flex-row items-center gap-2">
                <View className="h-6 w-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 items-center justify-center">
                  <Ionicons name="business" size={12} color="#6366f1" />
                </View>
                <View>
                  <Text className="text-xs font-black text-slate-900 dark:text-white">
                    {empresasSeguidas.length}
                  </Text>
                  <Text className="text-[10px] text-slate-500 dark:text-slate-400">
                    Empresas
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={13} color="#94a3b8" />
            </Pressable>

            {/* 3. Atalho Conexões */}
            <Pressable
              onPress={() => setMetricaAtiva('conexoes')}
              accessibilityRole="button"
              accessibilityLabel="Ver lista de conexões e colegas"
              className="flex-row items-center justify-between px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 active:scale-95 shadow-2xs"
            >
              <View className="flex-row items-center gap-2">
                <View className="h-6 w-6 rounded-lg bg-violet-100 dark:bg-violet-950/70 items-center justify-center">
                  <Ionicons name="people" size={12} color="#8b5cf6" />
                </View>
                <View>
                  <Text className="text-xs font-black text-slate-900 dark:text-white">
                    {colegasConectados.length}
                  </Text>
                  <Text className="text-[10px] text-slate-500 dark:text-slate-400">
                    Conexões
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={13} color="#94a3b8" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Modal Genérico Centralizado: 1. INSCRIÇÕES */}
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
                ● Inscrição ativa · Toque para ver detalhes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          </Pressable>
        )}
      />

      {/* Modal Genérico Centralizado: 2. EMPRESAS SEGUIDAS */}
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

      {/* Modal Genérico Centralizado: 3. CONEXÕES / COLEGAS */}
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
