import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  type CategoriaHabilidade,
  type GrauAcademico,
  type ModalidadeTrabalho,
  type StatusFormacao
} from '@/data/curriculo';
import { curriculoActions, useCurriculoGeral } from '@/hooks/use-curriculo';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

export function CurriculoGeralEditor() {
  const curriculo = useCurriculoGeral();
  const [secaoAtiva, setSecaoAtiva] = useState<'resumo' | 'formacao' | 'experiencia' | 'habilidades' | 'projetos'>('resumo');

  // Estados locais para formulários de adição
  const [resumoTexto, setResumoTexto] = useState(curriculo.resumoGeral);
  const [resumoSalvo, setResumoSalvo] = useState(false);

  // Modal de Nova Formação
  const [modalFormacao, setModalFormacao] = useState(false);
  const [novaInstituicao, setNovaInstituicao] = useState('');
  const [novoCurso, setNovoCurso] = useState('');
  const [novoGrau, setNovoGrau] = useState<GrauAcademico>('Graduação');
  const [novoStatus, setNovoStatus] = useState<StatusFormacao>('Em andamento');
  const [novaDataInicio, setNovaDataInicio] = useState('');
  const [novaDataFim, setNovaDataFim] = useState('');

  // Modal de Nova Experiência
  const [modalExp, setModalExp] = useState(false);
  const [novoCargo, setNovoCargo] = useState('');
  const [novaEmpresa, setNovaEmpresa] = useState('');
  const [novaModalidade, setNovaModalidade] = useState<ModalidadeTrabalho>('Híbrido');
  const [novaDataInicioExp, setNovaDataInicioExp] = useState('');
  const [novaDataFimExp, setNovaDataFimExp] = useState('');
  const [ehAtualExp, setEhAtualExp] = useState(false);
  const [novaDescricaoExp, setNovaDescricaoExp] = useState('');

  // Adição rápida de Habilidade
  const [novaHabilidade, setNovaHabilidade] = useState('');
  const [categoriaHabilidade, setCategoriaHabilidade] = useState<CategoriaHabilidade>('tecnica');

  // Adição rápida de Idioma
  const [novoIdioma, setNovoIdioma] = useState('');
  const [nivelIdioma, setNivelIdioma] = useState<'Básico' | 'Intermediário' | 'Avançado' | 'Fluente'>('Intermediário');

  const salvarResumo = () => {
    curriculoActions.atualizarResumoGeral(resumoTexto);
    setResumoSalvo(true);
    setTimeout(() => setResumoSalvo(false), 2500);
  };

  const salvarNovaFormacao = () => {
    if (!novaInstituicao.trim() || !novoCurso.trim()) return;
    curriculoActions.adicionarFormacao({
      instituicao: novaInstituicao.trim(),
      curso: novoCurso.trim(),
      grau: novoGrau,
      status: novoStatus,
      dataInicio: novaDataInicio.trim() || '2024',
      dataFim: novaDataFim.trim(),
    });
    setNovaInstituicao('');
    setNovoCurso('');
    setNovaDataInicio('');
    setNovaDataFim('');
    setModalFormacao(false);
  };

  const salvarNovaExp = () => {
    if (!novoCargo.trim() || !novaEmpresa.trim()) return;
    curriculoActions.adicionarExperiencia({
      cargo: novoCargo.trim(),
      empresa: novaEmpresa.trim(),
      modalidade: novaModalidade,
      dataInicio: novaDataInicioExp.trim() || '2024',
      dataFim: ehAtualExp ? undefined : novaDataFimExp.trim(),
      atual: ehAtualExp,
      descricao: novaDescricaoExp.trim(),
      atividades: novaDescricaoExp ? [novaDescricaoExp.trim()] : [],
    });
    setNovoCargo('');
    setNovaEmpresa('');
    setNovaDataInicioExp('');
    setNovaDataFimExp('');
    setNovaDescricaoExp('');
    setEhAtualExp(false);
    setModalExp(false);
  };

  const adicionarHabilidadeHandler = () => {
    if (!novaHabilidade.trim()) return;
    curriculoActions.adicionarHabilidade({
      nome: novaHabilidade.trim(),
      categoria: categoriaHabilidade,
      nivel: 'intermediario',
    });
    setNovaHabilidade('');
  };

  const adicionarIdiomaHandler = () => {
    if (!novoIdioma.trim()) return;
    curriculoActions.adicionarIdioma({
      nome: novoIdioma.trim(),
      nivel: nivelIdioma,
    });
    setNovoIdioma('');
  };

  return (
    <View className="gap-3 mt-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-slate-900 dark:text-white">
            Meu Currículo Geral
          </Text>
        </View>
        <Text className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Mestre
        </Text>
      </View>
      <Text className="text-xs text-slate-500 dark:text-slate-400">
        Cadastre todo o seu histórico aqui. Ao se candidatar a uma vaga, você poderá direcionar e selecionar o que destacar.
      </Text>

      {/* Navegação entre seções do currículo */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 py-1">
        {[
          { key: 'resumo', label: 'Resumo', icon: 'document-text-outline' },
          { key: 'formacao', label: `Formação (${curriculo.formacoes.length})`, icon: 'school-outline' },
          { key: 'experiencia', label: `Experiência (${curriculo.experiencias.length})`, icon: 'briefcase-outline' },
          { key: 'habilidades', label: `Habilidades (${curriculo.habilidades.length})`, icon: 'flash-outline' },
          { key: 'projetos', label: `Idiomas & Mais`, icon: 'globe-outline' },
        ].map((aba) => {
          const ativa = secaoAtiva === aba.key;
          return (
            <Pressable
              key={aba.key}
              onPress={() => setSecaoAtiva(aba.key as any)}
              className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${ativa
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
            >
              <Ionicons
                name={aba.icon as any}
                size={14}
                color={ativa ? '#ffffff' : '#64748b'}
              />
              <Text className={`text-xs font-semibold ${ativa ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                {aba.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 1: RESUMO PROFISSIONAL */}
      {/* ---------------------------------------------------------------------- */}
      {secaoAtiva === 'resumo' && (
        <View className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-3">
          <Input
            label="Apresentação / Resumo Geral"
            value={resumoTexto}
            onChangeText={(txt) => {
              setResumoTexto(txt);
              setResumoSalvo(false);
            }}
            placeholder="Descreva sua trajetória, objetivos e principais competências..."
            multiline
            textAlignVertical="top"
            className="min-h-[100px]"
          />
          <View className="flex-row items-center justify-between">
            {resumoSalvo ? (
              <Text className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Resumo atualizado!
              </Text>
            ) : <View />}
            <Button title="Salvar Resumo" onPress={salvarResumo} className="px-5 py-2.5" />
          </View>
        </View>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 2: FORMAÇÃO ACADÊMICA */}
      {/* ---------------------------------------------------------------------- */}
      {secaoAtiva === 'formacao' && (
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Formações Cadastradas
            </Text>
            <Button
              title="+ Adicionar Formação"
              variant="secondary"
              className="py-1.5 px-3 text-xs"
              onPress={() => setModalFormacao(true)}
            />
          </View>

          {curriculo.formacoes.length === 0 ? (
            <View className="p-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 items-center justify-center">
              <Text className="text-sm text-slate-500 dark:text-slate-400">Nenhuma formação cadastrada.</Text>
            </View>
          ) : (
            curriculo.formacoes.map((item) => (
              <View
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-1.5"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-bold text-slate-900 dark:text-white text-base">
                    {item.curso}
                  </Text>
                  <Pressable
                    onPress={() => curriculoActions.removerFormacao(item.id)}
                    className="p-1 rounded-lg active:bg-rose-100 dark:active:bg-rose-950"
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </Pressable>
                </View>
                <Text className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {item.instituicao} · {item.grau}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {item.status} {item.dataInicio ? `(${item.dataInicio} ${item.dataFim ? `a ${item.dataFim}` : ''})` : ''}
                </Text>
                {item.descricao ? (
                  <Text className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {item.descricao}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </View>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 3: EXPERIÊNCIA PROFISSIONAL */}
      {/* ---------------------------------------------------------------------- */}
      {secaoAtiva === 'experiencia' && (
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Histórico Profissional / Estágios
            </Text>
            <Button
              title="+ Adicionar Experiência"
              variant="secondary"
              className="py-1.5 px-3 text-xs"
              onPress={() => setModalExp(true)}
            />
          </View>

          {curriculo.experiencias.length === 0 ? (
            <View className="p-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 items-center justify-center">
              <Text className="text-sm text-slate-500 dark:text-slate-400">Nenhuma experiência cadastrada.</Text>
            </View>
          ) : (
            curriculo.experiencias.map((item) => (
              <View
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-1.5"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-bold text-slate-900 dark:text-white text-base">
                    {item.cargo}
                  </Text>
                  <Pressable
                    onPress={() => curriculoActions.removerExperiencia(item.id)}
                    className="p-1 rounded-lg active:bg-rose-100 dark:active:bg-rose-950"
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </Pressable>
                </View>
                <Text className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {item.empresa} {item.modalidade ? `· ${item.modalidade}` : ''}
                </Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {item.dataInicio} {item.atual ? '- Atual' : item.dataFim ? `- ${item.dataFim}` : ''}
                </Text>
                {item.descricao ? (
                  <Text className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {item.descricao}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </View>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 4: HABILIDADES */}
      {/* ---------------------------------------------------------------------- */}
      {secaoAtiva === 'habilidades' && (
        <View className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-3">
          <View className="flex-row items-end gap-2">
            <View className="flex-1">
              <Input
                label="Adicionar Habilidade"
                value={novaHabilidade}
                onChangeText={setNovaHabilidade}
                placeholder="Ex: React Native, Git, Liderança..."
              />
            </View>
            <Button
              title="Adicionar"
              onPress={adicionarHabilidadeHandler}
              className="py-3 px-4 mb-0.5"
            />
          </View>

          <View className="flex-row gap-2 mt-1">
            {(['tecnica', 'comportamental', 'ferramenta'] as CategoriaHabilidade[]).map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategoriaHabilidade(cat)}
                className={`px-3 py-1.5 rounded-lg border ${categoriaHabilidade === cat
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800'
                  }`}
              >
                <Text className={`text-xs font-semibold capitalize ${categoriaHabilidade === cat ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}>
                  {cat === 'tecnica' ? 'Técnica' : cat === 'comportamental' ? 'Comportamental' : 'Ferramenta'}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
            Habilidades no seu Currículo ({curriculo.habilidades.length}):
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {curriculo.habilidades.map((h) => (
              <View
                key={h.id}
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <Text className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {h.nome}
                </Text>
                <Pressable
                  onPress={() => curriculoActions.removerHabilidade(h.id)}
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={14} color="#94a3b8" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SEÇÃO 5: IDIOMAS & PROJETOS */}
      {/* ---------------------------------------------------------------------- */}
      {secaoAtiva === 'projetos' && (
        <View className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-3">
          <View className="flex-row items-end gap-2">
            <View className="flex-1">
              <Input
                label="Adicionar Idioma"
                value={novoIdioma}
                onChangeText={setNovoIdioma}
                placeholder="Ex: Inglês, Espanhol..."
              />
            </View>
            <Button
              title="Adicionar"
              onPress={adicionarIdiomaHandler}
              className="py-3 px-4 mb-0.5"
            />
          </View>

          <View className="flex-row flex-wrap gap-2">
            {curriculo.idiomas.map((i) => (
              <View
                key={i.id}
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <Text className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {i.nome} ({i.nivel})
                </Text>
                <Pressable
                  onPress={() => curriculoActions.removerIdioma(i.id)}
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={14} color="#94a3b8" />
                </Pressable>
              </View>
            ))}
          </View>

          <Text className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-4">
            Projetos Acadêmicos / Destaque ({curriculo.projetos.length})
          </Text>
          {curriculo.projetos.map((p) => (
            <View
              key={p.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 gap-1"
            >
              <View className="flex-row justify-between items-center">
                <Text className="font-bold text-slate-900 dark:text-white text-sm">{p.titulo}</Text>
                <Pressable onPress={() => curriculoActions.removerProjeto(p.id)}>
                  <Ionicons name="trash-outline" size={14} color="#ef4444" />
                </Pressable>
              </View>
              <Text className="text-xs text-slate-600 dark:text-slate-400">{p.descricao}</Text>
              {p.tecnologias?.length > 0 && (
                <Text className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                  {p.tecnologias.join(' · ')}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: ADICIONAR FORMAÇÃO */}
      {/* ---------------------------------------------------------------------- */}
      <Modal visible={modalFormacao} transparent animationType="slide" onRequestClose={() => setModalFormacao(false)}>
        <Pressable
          onPress={() => setModalFormacao(false)}
          className="flex-1 bg-black/60 justify-end"
        >
          <Pressable className="bg-white dark:bg-slate-900 p-6 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 gap-3">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-lg font-bold text-slate-900 dark:text-white">Nova Formação</Text>
              <Pressable onPress={() => setModalFormacao(false)}>
                <Ionicons name="close" size={24} color="#94a3b8" />
              </Pressable>
            </View>
            <Input label="Instituição" placeholder="Ex: UNDB" value={novaInstituicao} onChangeText={setNovaInstituicao} />
            <Input label="Curso" placeholder="Ex: Engenharia de Software" value={novoCurso} onChangeText={setNovoCurso} />
            <Input label="Período de Início" placeholder="Ex: 02/2023" value={novaDataInicio} onChangeText={setNovaDataInicio} />
            <Input label="Previsão de Término / Conclusão" placeholder="Ex: 12/2026" value={novaDataFim} onChangeText={setNovaDataFim} />
            <View className="flex-row gap-2 mt-2">
              <Button title="Cancelar" variant="secondary" className="flex-1" onPress={() => setModalFormacao(false)} />
              <Button title="Salvar Formação" className="flex-1" onPress={salvarNovaFormacao} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL: ADICIONAR EXPERIÊNCIA */}
      {/* ---------------------------------------------------------------------- */}
      <Modal visible={modalExp} transparent animationType="slide" onRequestClose={() => setModalExp(false)}>
        <Pressable
          onPress={() => setModalExp(false)}
          className="flex-1 bg-black/60 justify-end"
        >
          <Pressable className="bg-white dark:bg-slate-900 p-6 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 gap-3">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-lg font-bold text-slate-900 dark:text-white">Nova Experiência</Text>
              <Pressable onPress={() => setModalExp(false)}>
                <Ionicons name="close" size={24} color="#94a3b8" />
              </Pressable>
            </View>
            <Input label="Cargo" placeholder="Ex: Estagiário de Desenvolvimento" value={novoCargo} onChangeText={setNovoCargo} />
            <Input label="Empresa" placeholder="Ex: Tech Solutions" value={novaEmpresa} onChangeText={setNovaEmpresa} />
            <Input label="Período de Início" placeholder="Ex: 03/2024" value={novaDataInicioExp} onChangeText={setNovaDataInicioExp} />
            <Input label="Descrição das Atividades" placeholder="Descreva suas tarefas e ferramentas..." value={novaDescricaoExp} onChangeText={setNovaDescricaoExp} multiline />
            <View className="flex-row gap-2 mt-2">
              <Button title="Cancelar" variant="secondary" className="flex-1" onPress={() => setModalExp(false)} />
              <Button title="Salvar Experiência" className="flex-1" onPress={salvarNovaExp} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
