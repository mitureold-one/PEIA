import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEmpresas } from '@/hooks/use-empresas';
import { estudanteSocialActions, useEstudanteSocial } from '@/hooks/use-estudante-social';

// Empresas parceiras mockadas para garantir visual rico se o banco estiver vazio
const EMPRESAS_DEMO = [
  { id: 'empresa_1', nome: 'TechHub São Luís', setor: 'Tecnologia & Inovação' },
  { id: 'empresa_2', nome: 'Inova Maranhão', setor: 'P&D e Startups' },
  { id: 'empresa_3', nome: 'Vale Lab', setor: 'Engenharia & Mineração' },
  { id: 'empresa_4', nome: 'Ambev Tech', setor: 'Desenvolvimento & Cloud' },
];

export function ProfileStudentFollowing() {
  const empresasCadastradas = useEmpresas();
  const { seguindoEmpresas } = useEstudanteSocial();

  // Combina lista real com a base demo para garantir rica experiência visual
  const listaEmpresas = empresasCadastradas.length > 0
    ? empresasCadastradas.map((e) => ({ id: e.id, nome: e.nome, setor: 'Empresa Parceira' }))
    : EMPRESAS_DEMO;

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-3.5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <View className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950/70 items-center justify-center">
            <Ionicons name="business-outline" size={16} color="#6366f1" />
          </View>
          <View>
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              Empresas Parceiras
            </Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Acompanhe vagas prioritárias e novidades corporativas
            </Text>
          </View>
        </View>

        <View className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
          <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {seguindoEmpresas.length} seguindo
          </Text>
        </View>
      </View>

      <View className="gap-2.5 pt-1">
        {listaEmpresas.slice(0, 4).map((empresa) => {
          const isSeguindo = seguindoEmpresas.includes(empresa.id);
          const primeiraLetra = (empresa.nome[0] || 'E').toUpperCase();

          return (
            <View
              key={empresa.id}
              className="flex-row items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80"
            >
              <View className="flex-row items-center gap-3 flex-1 mr-2">
                <View className="h-10 w-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 items-center justify-center border border-indigo-200 dark:border-indigo-800">
                  <Text className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    {primeiraLetra}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text numberOfLines={1} className="text-sm font-bold text-slate-900 dark:text-white">
                    {empresa.nome}
                  </Text>
                  <Text numberOfLines={1} className="text-xs text-slate-500 dark:text-slate-400">
                    {empresa.setor}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => estudanteSocialActions.toggleSeguirEmpresa(empresa.id)}
                className={`px-3 py-1.5 rounded-full border active:scale-95 ${
                  isSeguindo
                    ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                    : 'bg-indigo-600 border-indigo-500'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSeguindo ? 'text-slate-700 dark:text-slate-300' : 'text-white'
                  }`}
                >
                  {isSeguindo ? 'Seguindo' : '+ Seguir'}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

