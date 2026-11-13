import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { type CurriculoVaga, gerarCurriculoVaga } from '@/data/curriculo';
import { type Vaga } from '@/data/vagas';
import { curriculoActions, useCurriculoGeral } from '@/hooks/use-curriculo';
import { usePerfil } from '@/hooks/use-perfil';
import { Button } from '@/components/ui/button';

interface ModalVisualizarCurriculoVagaProps {
  visible: boolean;
  vaga: Vaga;
  curriculoVaga: CurriculoVaga | null;
  onClose: () => void;
  onCancelSuccess: () => void;
  onEditCandidatura?: () => void;
}

export function ModalVisualizarCurriculoVaga({
  visible,
  vaga,
  curriculoVaga,
  onClose,
  onCancelSuccess,
  onEditCandidatura,
}: ModalVisualizarCurriculoVagaProps) {
  const perfil = usePerfil();
  const curriculoGeral = useCurriculoGeral();
  const [copiado, setCopiado] = useState(false);

  // Fallback inteligente: se não houver snapshot salvo em banco, sintetiza dinamicamente a partir do perfil do aluno
  const cv: CurriculoVaga =
    curriculoVaga ||
    gerarCurriculoVaga({
      curriculoGeral,
      vagaId: vaga.id,
      tituloVaga: vaga.titulo,
      empresaVaga: vaga.empresa,
    });

  const nomeAluno =
    perfil && (perfil.name || perfil.surname)
      ? `${perfil.name || ''} ${perfil.surname || ''}`.trim()
      : curriculoGeral.contato.nomeCompleto || 'Estudante PEIA';

  const cargoAluno =
    (perfil as any)?.cargo ||
    cv.experiencias[0]?.cargo ||
    'Estudante de Tecnologia';

  const instituicaoAluno =
    (perfil as any)?.instituicao ||
    cv.formacoes[0]?.instituicao ||
    'Centro Universitário UNDB';

  const cursoAluno =
    (perfil as any)?.curso ||
    cv.formacoes[0]?.curso ||
    'Engenharia de Software';

  const emailAluno = perfil?.email || curriculoGeral.contato.email || 'aluno@undb.edu.br';
  const telefoneAluno = perfil?.phone || curriculoGeral.contato.telefone || '(98) 98888-0001';

  const dataFormatada = cv.dataEnvio
    ? new Date(cv.dataEnvio).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Hoje, candidatura recente';

  const compatibilidade = cv.compatibilidadeEstimada || 94;

  const confirmarCancelamento = () => {
    Alert.alert(
      'Cancelar candidatura',
      `Tem certeza de que deseja retirar sua candidatura da vaga "${vaga.titulo}" na ${vaga.empresa}?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: () => {
            curriculoActions.cancelarCandidaturaVaga(vaga.id, cv.usuarioId);
            onClose();
            onCancelSuccess();
          },
        },
      ]
    );
  };

  /**
   * Monta o texto integral do currículo enviado para compartilhamento e cópia externa.
   */
  const gerarTextoCurriculo = () => {
    let t = `====================================================\n`;
    t += `CURRÍCULO DIRECIONADO - PLATAFORMA PEIA\n`;
    t += `Vaga Alvo: ${vaga.titulo} (${vaga.empresa})\n`;
    t += `Data de Envio: ${dataFormatada}\n`;
    t += `====================================================\n\n`;

    t += `1. DADOS DO CANDIDATO\n`;
    t += `Nome: ${nomeAluno}\n`;
    t += `Perfil: ${cargoAluno}\n`;
    t += `Instituição: ${instituicaoAluno} - ${cursoAluno}\n`;
    t += `E-mail: ${emailAluno}\n`;
    t += `Telefone: ${telefoneAluno}\n\n`;

    if (cv.resumoCustomizado) {
      t += `2. APRESENTAÇÃO / PITCH DIRECIONADO\n`;
      t += `${cv.resumoCustomizado}\n\n`;
    }

    if (cv.habilidadesDestacadas && cv.habilidadesDestacadas.length > 0) {
      t += `3. COMPETÊNCIAS E HABILIDADES DESTACADAS\n`;
      t += cv.habilidadesDestacadas.map((h) => `• ${h.nome}`).join('\n') + `\n\n`;
    }

    if (cv.experiencias && cv.experiencias.length > 0) {
      t += `4. EXPERIÊNCIAS PROFISSIONAIS\n`;
      cv.experiencias.forEach((e) => {
        t += `• ${e.cargo} na ${e.empresa} (${e.dataInicio} ${e.atual ? '- Atual' : e.dataFim ? `- ${e.dataFim}` : ''})\n`;
        if (e.descricao) t += `  ${e.descricao}\n`;
      });
      t += `\n`;
    }

    if (cv.formacoes && cv.formacoes.length > 0) {
      t += `5. FORMAÇÃO ACADÊMICA\n`;
      cv.formacoes.forEach((f) => {
        t += `• ${f.curso} - ${f.instituicao} (${f.grau} · ${f.status})\n`;
      });
      t += `\n`;
    }

    if (cv.idiomas && cv.idiomas.length > 0) {
      t += `6. IDIOMAS\n`;
      t += cv.idiomas.map((i) => `• ${i.nome}: ${i.nivel}`).join('\n') + `\n\n`;
    }

    t += `Documento emitido via PEIA - Plataforma de Estágios e Integração Acadêmica.`;
    return t;
  };

  const handleCompartilhar = async () => {
    try {
      await Share.share({
        title: `Currículo - ${nomeAluno} para ${vaga.empresa}`,
        message: gerarTextoCurriculo(),
      });
    } catch {
      // Ignora cancelamento de compartilhamento
    }
  };

  const handleCopiarPitch = async () => {
    try {
      if (cv.resumoCustomizado) {
        await Share.share({
          title: 'Pitch de Apresentação',
          message: cv.resumoCustomizado,
        });
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      }
    } catch {
      // Ignora
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <Pressable onPress={onClose} className="flex-1 bg-black/70 backdrop-blur-md justify-end">
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 max-h-[90%] h-[90%] flex-col overflow-hidden"
          >
            {/* Barra Superior do Modal */}
            <View className="flex-row items-center justify-between p-4 px-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <View className="flex-row items-center gap-2.5 flex-1 mr-2">
                <View className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 items-center justify-center border border-indigo-100 dark:border-indigo-900/60">
                  <Ionicons name="document-text" size={18} color="#6366f1" />
                </View>
                <View className="flex-1">
                  <Text numberOfLines={1} className="text-base font-bold text-slate-900 dark:text-white">
                    Currículo Enviado
                  </Text>
                  <Text numberOfLines={1} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    {vaga.titulo} · {vaga.empresa}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={handleCompartilhar}
                  accessibilityLabel="Compartilhar ou exportar currículo"
                  className="h-9 px-3 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex-row items-center gap-1.5 active:scale-95"
                >
                  <Ionicons name="share-social-outline" size={15} color="#6366f1" />
                  <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    Exportar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar modal de visualização de currículo"
                  className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center active:scale-95"
                >
                  <Ionicons name="close" size={18} color="#64748b" />
                </Pressable>
              </View>
            </View>

            {/* Conteúdo Rolável do Currículo Enviado */}
            <ScrollView
              className="flex-1 p-5"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="gap-4 pb-8"
            >
              {/* Card de Status da Candidatura com a Empresa */}
              <View className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 gap-2.5 shadow-2xs">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <View className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <Text className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                      Candidatura Ativa na {vaga.empresa}
                    </Text>
                  </View>
                  <View className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800">
                    <Text className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                      {compatibilidade}% MATCH
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between pt-1 border-t border-emerald-100 dark:border-emerald-900/40">
                  <Text className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Enviado em: <Text className="font-semibold">{dataFormatada}</Text>
                  </Text>
                  <Text className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Modalidade: <Text className="font-semibold">{vaga.modalidade}</Text>
                  </Text>
                </View>
              </View>

              {/* Dossiê / Folha do Candidato */}
              <View className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 gap-3.5 shadow-2xs">
                <View className="flex-row items-center gap-3.5">
                  {perfil?.avatar ? (
                    <Image
                      source={{ uri: perfil.avatar }}
                      className="w-14 h-14 rounded-full border-2 border-indigo-500/40"
                      contentFit="cover"
                    />
                  ) : (
                    <View className="w-14 h-14 rounded-full bg-indigo-600 items-center justify-center border-2 border-indigo-400/30 shadow-sm">
                      <Text className="text-lg font-black text-white">
                        {(nomeAluno[0] || 'A').toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View className="flex-1">
                    <Text className="text-base font-bold text-slate-900 dark:text-white">
                      {nomeAluno}
                    </Text>
                    <Text className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {cargoAluno}
                    </Text>
                    <Text className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {instituicaoAluno} · {cursoAluno}
                    </Text>
                  </View>
                </View>

                {/* Contatos do Candidato */}
                <View className="flex-row flex-wrap gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                  <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <Ionicons name="mail-outline" size={12} color="#6366f1" />
                    <Text className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      {emailAluno}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <Ionicons name="call-outline" size={12} color="#6366f1" />
                    <Text className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      {telefoneAluno}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <Ionicons name="location-outline" size={12} color="#6366f1" />
                    <Text className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      {curriculoGeral.contato.cidade || 'São Luís'} - {curriculoGeral.contato.estado || 'MA'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 1. Apresentação / Pitch Direcionado */}
              {cv.resumoCustomizado ? (
                <View className="p-4 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-2.5 shadow-2xs">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="sparkles" size={16} color="#8b5cf6" />
                      <Text className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Pitch / Apresentação Enviada
                      </Text>
                    </View>
                    <Pressable
                      onPress={handleCopiarPitch}
                      className="flex-row items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 active:scale-95"
                    >
                      <Ionicons
                        name={copiado ? 'checkmark' : 'copy-outline'}
                        size={12}
                        color={copiado ? '#10b981' : '#64748b'}
                      />
                      <Text
                        className={`text-[10px] font-semibold ${
                          copiado ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {copiado ? 'Copiado!' : 'Compartilhar'}
                      </Text>
                    </Pressable>
                  </View>

                  <Text className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    "{cv.resumoCustomizado}"
                  </Text>
                </View>
              ) : null}

              {/* 2. Competências e Habilidades Destacadas */}
              {cv.habilidadesDestacadas && cv.habilidadesDestacadas.length > 0 && (
                <View className="p-4 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-2.5 shadow-2xs">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="hardware-chip-outline" size={16} color="#6366f1" />
                    <Text className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Habilidades Destacadas para esta Vaga ({cv.habilidadesDestacadas.length})
                    </Text>
                  </View>

                  <View className="flex-row flex-wrap gap-2 pt-1">
                    {cv.habilidadesDestacadas.map((h) => (
                      <View
                        key={h.id}
                        className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80"
                      >
                        <Ionicons name="checkmark-circle" size={13} color="#6366f1" />
                        <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                          {h.nome}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* 3. Experiências Enviadas */}
              {cv.experiencias && cv.experiencias.length > 0 && (
                <View className="p-4 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-2.5 shadow-2xs">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="briefcase-outline" size={16} color="#6366f1" />
                    <Text className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Experiências Profissionais no Currículo ({cv.experiencias.length})
                    </Text>
                  </View>

                  <View className="gap-2.5 pt-1">
                    {cv.experiencias.map((e) => (
                      <View
                        key={e.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 gap-1.5"
                      >
                        <View className="flex-row items-center justify-between">
                          <Text className="font-bold text-slate-900 dark:text-white text-xs">
                            {e.cargo}
                          </Text>
                          {e.atual && (
                            <View className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800">
                              <Text className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                Atual
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                          {e.empresa} {e.modalidade ? `· ${e.modalidade}` : ''}
                        </Text>
                        <Text className="text-[10px] text-slate-400 dark:text-slate-500">
                          {e.dataInicio} {e.atual ? '- Momento Atual' : e.dataFim ? `- ${e.dataFim}` : ''}
                        </Text>
                        {e.descricao ? (
                          <Text className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 mt-0.5">
                            {e.descricao}
                          </Text>
                        ) : null}
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* 4. Formações Acadêmicas Enviadas */}
              {cv.formacoes && cv.formacoes.length > 0 && (
                <View className="p-4 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-2.5 shadow-2xs">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="school-outline" size={16} color="#6366f1" />
                    <Text className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Formação Educacional ({cv.formacoes.length})
                    </Text>
                  </View>

                  <View className="gap-2.5 pt-1">
                    {cv.formacoes.map((f) => (
                      <View
                        key={f.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 gap-1"
                      >
                        <Text className="font-bold text-slate-900 dark:text-white text-xs">
                          {f.curso}
                        </Text>
                        <Text className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                          {f.instituicao}
                        </Text>
                        <Text className="text-[10px] text-slate-400 dark:text-slate-500">
                          {f.grau} · Status: <Text className="font-semibold text-slate-600 dark:text-slate-300">{f.status}</Text>
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* 5. Idiomas & Certificações */}
              {cv.idiomas && cv.idiomas.length > 0 && (
                <View className="p-4 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-2 shadow-2xs">
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Idiomas Declarados
                  </Text>
                  <View className="flex-row flex-wrap gap-2 pt-0.5">
                    {cv.idiomas.map((i) => (
                      <View
                        key={i.id}
                        className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <Text className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {i.nome} ({i.nivel})
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Rodapé Fixo com Ações Úteis e Reais */}
            <View className="p-4 px-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 gap-2.5">
              <View className="flex-row gap-2.5">
                <Button
                  title="Compartilhar Currículo"
                  icon={<Ionicons name="share-outline" size={16} color="#ffffff" />}
                  onPress={handleCompartilhar}
                  className="flex-1 py-3"
                />

                {onEditCandidatura && (
                  <Button
                    title="Editar Pitch"
                    variant="secondary"
                    icon={<Ionicons name="create-outline" size={16} color="#6366f1" />}
                    onPress={onEditCandidatura}
                    className="flex-1 py-3"
                  />
                )}
              </View>

              <View className="flex-row items-center justify-between pt-1">
                <Pressable
                  onPress={confirmarCancelamento}
                  className="py-1 px-2 active:opacity-70 flex-row items-center gap-1"
                >
                  <Ionicons name="trash-outline" size={13} color="#ef4444" />
                  <Text className="text-xs font-semibold text-rose-500">
                    Retirar Candidatura
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onClose}
                  className="py-1 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 active:opacity-70"
                >
                  <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Fechar
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
