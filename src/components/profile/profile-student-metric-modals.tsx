import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileMetricDialogModal } from '@/components/ui/profile-metric-dialog-modal';
import type { MetricaTipo } from '@/hooks/use-profile-student-header';
import type { EmpresaSocial, ColegaSocial } from '@/data/social';
import type { Vaga } from '@/data/vagas';

export interface ProfileStudentMetricModalsProps {
  metricaAtiva: MetricaTipo;
  onClose: () => void;
  vagasInscritas: Vaga[];
  empresasSeguidas: EmpresaSocial[];
  colegasConectados: ColegaSocial[];
  onSelectVaga: (id: string) => void;
  onToggleSeguirEmpresa: (id: string) => void;
  onToggleSeguirUsuario: (id: string) => void;
}

export function ProfileStudentMetricModals({
  metricaAtiva,
  onClose,
  vagasInscritas,
  empresasSeguidas,
  colegasConectados,
  onSelectVaga,
  onToggleSeguirEmpresa,
  onToggleSeguirUsuario,
}: ProfileStudentMetricModalsProps) {
  return (
    <>
      {/* 1. Modal de Inscrições Ativas */}
      <ProfileMetricDialogModal
        visible={metricaAtiva === 'inscricoes'}
        title="Vagas que Você se Candidatou"
        countLabel={`${vagasInscritas.length} ${
          vagasInscritas.length === 1 ? 'candidatura ativa' : 'candidaturas ativas'
        } (A-Z)`}
        iconName="briefcase"
        searchPlaceholder="Pesquisar por título, empresa ou cidade..."
        items={vagasInscritas}
        filterFn={(v, q) =>
          v.titulo.toLowerCase().includes(q) ||
          v.empresa.toLowerCase().includes(q) ||
          v.cidade.toLowerCase().includes(q)
        }
        emptyMessage="Você ainda não se inscreveu em vagas."
        onClose={onClose}
        renderItem={(vaga) => (
          <Pressable
            key={vaga.id}
            onPress={() => onSelectVaga(vaga.id)}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex-row items-center justify-between active:opacity-75"
          >
            <View className="flex-1 pr-2">
              <Text className="text-xs font-bold text-slate-900 dark:text-white">
                {vaga.titulo}
              </Text>
              <Text className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {vaga.empresa} · {vaga.cidade} · {vaga.modalidade}
              </Text>
              <View className="flex-row items-center gap-2 mt-1">
                <Text className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ● Currículo enviado à empresa
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
              <Ionicons name="document-text-outline" size={12} color="#6366f1" />
              <Text className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                Ver
              </Text>
            </View>
          </Pressable>
        )}
      />

      {/* 2. Modal de Empresas que Segue */}
      <ProfileMetricDialogModal
        visible={metricaAtiva === 'empresas'}
        title="Empresas que Você Segue"
        countLabel={`${empresasSeguidas.length} ${
          empresasSeguidas.length === 1 ? 'empresa acompanhada' : 'empresas acompanhadas'
        } (A-Z)`}
        iconName="business"
        searchPlaceholder="Pesquisar por nome ou setor da empresa..."
        items={empresasSeguidas}
        filterFn={(e, q) =>
          e.nome.toLowerCase().includes(q) || e.setor.toLowerCase().includes(q)
        }
        emptyMessage="Você ainda não segue empresas."
        onClose={onClose}
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
              onPress={() => onToggleSeguirEmpresa(empresa.id)}
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

      {/* 3. Modal de Conexões Acadêmicas */}
      <ProfileMetricDialogModal
        visible={metricaAtiva === 'conexoes'}
        title="Suas Conexões Acadêmicas"
        countLabel={`${colegasConectados.length} ${
          colegasConectados.length === 1 ? 'colega conectado' : 'colegas conectados'
        } (A-Z)`}
        iconName="people"
        searchPlaceholder="Pesquisar colega por nome ou curso..."
        items={colegasConectados}
        filterFn={(c, q) =>
          c.nome.toLowerCase().includes(q) || c.curso.toLowerCase().includes(q)
        }
        emptyMessage="Você ainda não possui conexões adicionadas."
        onClose={onClose}
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
              onPress={() => onToggleSeguirUsuario(colega.id)}
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

