import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type TipoAvaliador } from '@/data/avaliacoes';
import { avaliacoesActions, useAvaliacoes } from '@/hooks/use-avaliacoes';
import { Button } from '@/components/ui/button';

export function ProfileStudentWall() {
  const avaliacoes = useAvaliacoes();
  const [filtro, setFiltro] = useState<'todos' | TipoAvaliador>('todos');
  const [modalVisible, setModalVisible] = useState(false);

  // Formulário de nova recomendação
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [tipo, setTipo] = useState<TipoAvaliador>('empresa');
  const [depoimento, setDepoimento] = useState('');
  const [estrelas, setEstrelas] = useState(5);
  const [erro, setErro] = useState('');

  const listaFiltrada =
    filtro === 'todos'
      ? avaliacoes
      : avaliacoes.filter((item) => item.tipo === filtro);

  const mediaEstrelas =
    avaliacoes.length > 0
      ? (
          avaliacoes.reduce((acc, curr) => acc + curr.estrelas, 0) /
          avaliacoes.length
        ).toFixed(1)
      : '5.0';

  const handleSalvar = () => {
    if (!nome.trim() || !depoimento.trim()) {
      setErro('Preencha o nome e o depoimento para enviar.');
      return;
    }

    avaliacoesActions.adicionar({
      autorNome: nome.trim(),
      autorCargo: cargo.trim() || 'Profissional / Colega',
      autorInstituicao: instituicao.trim() || 'Ecossistema PEIA',
      tipo,
      estrelas,
      depoimento: depoimento.trim(),
    });

    // Limpa estado e fecha modal
    setNome('');
    setCargo('');
    setInstituicao('');
    setDepoimento('');
    setErro('');
    setModalVisible(false);
  };

  const getBadgeStyle = (t: TipoAvaliador) => {
    switch (t) {
      case 'empresa':
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800',
          text: 'text-indigo-700 dark:text-indigo-300',
          label: 'Empresa',
        };
      case 'docente':
        return {
          bg: 'bg-violet-50 dark:bg-violet-950/70 border-violet-200 dark:border-violet-800',
          text: 'text-violet-700 dark:text-violet-300',
          label: 'Docente',
        };
      case 'colega':
      default:
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800',
          text: 'text-emerald-700 dark:text-emerald-300',
          label: 'Colega',
        };
    }
  };

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-4">
      {/* Cabeçalho do Mural */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5 flex-1 mr-2">
          <View className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-950/70 items-center justify-center">
            <Ionicons name="ribbon-outline" size={18} color="#d97706" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                Mural de Recomendações
              </Text>
              <View className="flex-row items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                <Ionicons name="star" size={11} color="#f59e0b" />
                <Text className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                  {mediaEstrelas}
                </Text>
              </View>
            </View>
            <Text numberOfLines={1} className="text-xs text-slate-500 dark:text-slate-400">
              Feedbacks de empresas, professores e colegas de projeto
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => setModalVisible(true)}
          className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 active:scale-95"
        >
          <Ionicons name="chatbox-ellipses-outline" size={14} color="#6366f1" />
          <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            + Avaliar
          </Text>
        </Pressable>
      </View>

      {/* Abas de Filtro de Avaliadores */}
      <View className="flex-row gap-1.5 pt-0.5">
        {[
          { key: 'todos', label: 'Todas' },
          { key: 'empresa', label: 'Empresas' },
          { key: 'docente', label: 'Docentes' },
          { key: 'colega', label: 'Colegas' },
        ].map((tab) => {
          const ativa = filtro === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setFiltro(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl border ${
                ativa
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  ativa ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Lista de Avaliações / Depoimentos */}
      <View className="gap-3 pt-1">
        {listaFiltrada.length === 0 ? (
          <View className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 items-center justify-center">
            <Text className="text-xs text-slate-400 text-center">
              Nenhuma avaliação cadastrada nesta categoria.
            </Text>
          </View>
        ) : (
          listaFiltrada.map((item) => {
            const badge = getBadgeStyle(item.tipo);
            const primeiraLetra = (item.autorNome[0] || 'U').toUpperCase();

            return (
              <View
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 gap-2.5"
              >
                {/* Linha do Autor */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2.5 flex-1 mr-2">
                    <View className="h-9 w-9 rounded-full bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-800 items-center justify-center">
                      <Text className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                        {primeiraLetra}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text numberOfLines={1} className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.autorNome}
                      </Text>
                      <Text numberOfLines={1} className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.autorCargo} · {item.autorInstituicao}
                      </Text>
                    </View>
                  </View>

                  <View className={`px-2 py-0.5 rounded-md border ${badge.bg}`}>
                    <Text className={`text-[10px] font-bold ${badge.text}`}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                {/* Estrelas */}
                <View className="flex-row items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= item.estrelas ? 'star' : 'star-outline'}
                      size={13}
                      color="#f59e0b"
                    />
                  ))}
                  <Text className="text-[10px] text-slate-400 ml-1.5">
                    {item.data}
                  </Text>
                </View>

                {/* Depoimento */}
                <Text className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{item.depoimento}"
                </Text>
              </View>
            );
          })
        )}
      </View>

      {/* Modal para Adicionar Nova Avaliação */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/60 items-center justify-center p-6"
        >
          <Pressable className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 gap-3.5">
            <View className="flex-row items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                Nova Recomendação
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#94a3b8" />
              </Pressable>
            </View>

            {erro ? (
              <Text className="text-xs text-rose-500 font-semibold">{erro}</Text>
            ) : null}

            {/* Nome do Avaliador */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Seu Nome
              </Text>
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Ex: Maria Fernandes"
                placeholderTextColor="#94a3b8"
                className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </View>

            {/* Cargo / Instituição */}
            <View className="flex-row gap-2">
              <View className="flex-1 gap-1">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Cargo
                </Text>
                <TextInput
                  value={cargo}
                  onChangeText={setCargo}
                  placeholder="Ex: Tech Lead"
                  placeholderTextColor="#94a3b8"
                  className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Empresa/Faculdade
                </Text>
                <TextInput
                  value={instituicao}
                  onChangeText={setInstituicao}
                  placeholder="Ex: Inova Tech"
                  placeholderTextColor="#94a3b8"
                  className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </View>
            </View>

            {/* Vínculo / Tipo */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Você é:
              </Text>
              <View className="flex-row gap-2">
                {(['empresa', 'docente', 'colega'] as TipoAvaliador[]).map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setTipo(t)}
                    className={`flex-1 py-2 rounded-xl border items-center capitalize ${
                      tipo === t
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        tipo === t ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Estrelas */}
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Avaliação:
              </Text>
              <View className="flex-row gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable key={star} onPress={() => setEstrelas(star)}>
                    <Ionicons
                      name={star <= estrelas ? 'star' : 'star-outline'}
                      size={20}
                      color="#f59e0b"
                    />
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Depoimento */}
            <View className="gap-1">
              <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Depoimento
              </Text>
              <TextInput
                value={depoimento}
                onChangeText={setDepoimento}
                placeholder="Escreva como foi trabalhar ou lecionar para esse estudante..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                style={{ textAlignVertical: 'top' }}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white h-20"
              />
            </View>

            <View className="flex-row gap-2 pt-2">
              <View className="flex-1">
                <Button
                  title="Cancelar"
                  variant="secondary"
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <View className="flex-1">
                <Button title="Salvar" onPress={handleSalvar} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
