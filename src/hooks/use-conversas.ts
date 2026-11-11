import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import {
  type ConversaCandidatura,
  type MensagemFeedback,
  criarConversaInicial,
} from '@/data/feedback';
import { feedbackService } from '@/services/feedback-service';
import { perfilActions } from '@/hooks/use-perfil';
import { useInscricoes } from '@/hooks/use-inscricoes';
import { useVagas } from '@/hooks/use-vagas';
import { curriculoService } from '@/services/curriculo-service';

let conversas: ConversaCandidatura[] = [];
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

export async function sincronizarConversas(usuarioId?: string) {
  const perfil = perfilActions.obter();
  const userId = usuarioId || perfil?.email || 'aluno_padrao';

  try {
    let list = await feedbackService.listarConversas(userId);

    // Se o usuário tem candidaturas mas ainda não tem conversas geradas, cria para cada vaga
    const storedCurriculo = await curriculoService.obterCurriculoGeral(userId);

    // Salva a lista carregada
    conversas = list;
    notify();
  } catch {
    // Falha silenciosa
  }
}

if (Platform.OS !== 'web' || typeof window !== 'undefined') {
  void sincronizarConversas();
}

export const conversasActions = {
  recarregar: (userId?: string) => sincronizarConversas(userId),

  /**
   * Garante que uma conversa exista para a candidatura recém-enviada.
   */
  garantirConversa: async (vagaId: string, vagaData: any, curriculoData: any) => {
    const perfil = perfilActions.obter();
    const userId = perfil?.email || 'aluno_padrao';

    const existente = await feedbackService.obterPorVaga(vagaId, userId);
    if (!existente) {
      const nova = criarConversaInicial(vagaData, userId, curriculoData);
      await feedbackService.salvarConversa(nova);
      conversas = [nova, ...conversas.filter((c) => c.id !== nova.id)];
      notify();
      return nova;
    }
    return existente;
  },

  /**
   * Envia uma nova mensagem do aluno para o canal da vaga.
   */
  enviarMensagem: async (conversaId: string, texto: string) => {
    if (!texto.trim()) return;

    const conversa = conversas.find((c) => c.id === conversaId);
    if (!conversa) return;

    const novaMensagem: MensagemFeedback = {
      id: `msg_aluno_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      remetente: 'aluno',
      nomeRemetente: 'Você',
      texto: texto.trim(),
      timestamp: new Date().toISOString(),
    };

    const atualizada: ConversaCandidatura = {
      ...conversa,
      mensagens: [...conversa.mensagens, novaMensagem],
      atualizadoEm: new Date().toISOString(),
    };

    conversas = conversas.map((c) => (c.id === conversaId ? atualizada : c));
    notify();
    await feedbackService.salvarConversa(atualizada);

    // Simula resposta automática do Assistente de Carreira PEIA ou Recrutador após breve delay
    setTimeout(async () => {
      const respostaAutomatica: MensagemFeedback = {
        id: `msg_resp_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
        remetente: 'ia_peia',
        nomeRemetente: 'Assistente PEIA',
        texto: `Mensagem recebida e registrada no seu histórico de candidatura para ${conversa.empresa}. O time de RH será notificado.`,
        timestamp: new Date().toISOString(),
      };

      const final: ConversaCandidatura = {
        ...atualizada,
        mensagens: [...atualizada.mensagens, respostaAutomatica],
        atualizadoEm: new Date().toISOString(),
      };

      conversas = conversas.map((c) => (c.id === conversaId ? final : c));
      notify();
      await feedbackService.salvarConversa(final);
    }, 1500);
  },
};

export function useConversas() {
  const inscricoes = useInscricoes();
  const vagas = useVagas();

  const lista = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => conversas
  );

  // Sincroniza em background caso o aluno tenha inscrições mas as conversas ainda não estejam instanciadas
  if (inscricoes.length > 0 && lista.length < inscricoes.length) {
    const perfil = perfilActions.obter();
    const userId = perfil?.email || 'aluno_padrao';

    for (const vId of inscricoes) {
      if (!lista.some((c) => c.vagaId === vId)) {
        const vagaMatch = vagas.find((v) => v.id === vId);
        if (vagaMatch) {
          curriculoService.obterCurriculoGeral(userId).then((curr) => {
            void conversasActions.garantirConversa(vId, vagaMatch, curr);
          });
        }
      }
    }
  }

  return lista;
}

