import { type CurriculoGeral, type CurriculoVaga } from '@/data/curriculo';
import { type Vaga } from '@/data/vagas';

export type StatusCandidatura =
  | 'em_analise'
  | 'feedback_disponivel'
  | 'entrevista_agendada'
  | 'aprovado'
  | 'reprovado';

export interface MensagemFeedback {
  id: string;
  remetente: 'empresa' | 'aluno' | 'ia_peia';
  nomeRemetente: string;
  texto: string;
  timestamp: string;
}

export interface AnaliseCurriculoVaga {
  scoreMatch: number; // 0 a 100
  nivelCompatibilidade: 'Alta' | 'Média' | 'Básica';
  pontosFortes: string[];
  pontosMelhoria: string[];
  dicasEntrevista: string;
}

export interface ConversaCandidatura {
  id: string;
  vagaId: string;
  tituloVaga: string;
  empresa: string;
  usuarioId: string;
  status: StatusCandidatura;
  analise: AnaliseCurriculoVaga;
  mensagens: MensagemFeedback[];
  atualizadoEm: string;
}

/**
 * Motor de análise inteligente do PEIA: compara as qualificações do currículo
 * do estudante com a vaga para gerar o diagnóstico de compatibilidade e feedbacks.
 */
export function gerarAnaliseAutomatica(
  vaga: Vaga,
  curriculo: CurriculoGeral | CurriculoVaga | null
): AnaliseCurriculoVaga {
  if (!curriculo) {
    return {
      scoreMatch: 50,
      nivelCompatibilidade: 'Média',
      pontosFortes: ['Interesse na oportunidade.'],
      pontosMelhoria: ['Complete seu currículo para aumentar a precisão do feedback.'],
      dicasEntrevista: 'Fale sobre seus objetivos e vontade de aprender.',
    };
  }

  const descVaga = `${vaga.titulo} ${vaga.descricao} ${vaga.area}`.toLowerCase();

  // Extrai habilidades
  const habilidadesAluno = 'habilidades' in curriculo
    ? curriculo.habilidades
    : curriculo.habilidadesDestacadas;

  const matchesHabilidades: string[] = [];
  const sugestoes: string[] = [];

  for (const h of habilidadesAluno) {
    if (descVaga.includes(h.nome.toLowerCase())) {
      matchesHabilidades.push(h.nome);
    }
  }

  // Pontuações
  let score = 65; // Base
  if (matchesHabilidades.length > 0) score += Math.min(matchesHabilidades.length * 10, 25);
  if (curriculo.experiencias?.length > 0) score += 5;
  if (curriculo.formacoes?.length > 0) score += 5;
  score = Math.min(score, 98);

  const nivel: AnaliseCurriculoVaga['nivelCompatibilidade'] =
    score >= 80 ? 'Alta' : score >= 65 ? 'Média' : 'Básica';

  const pontosFortes = [
    matchesHabilidades.length > 0
      ? `Domínio em competências-chave exigidas pela vaga: ${matchesHabilidades.join(', ')}.`
      : 'Formação acadêmica alinhada à área da oportunidade.',
    curriculo.experiencias?.length > 0
      ? 'Histórico prático comprovado em projetos ou experiências anteriores.'
      : 'Boa estruturação e clareza no resumo profissional.',
  ];

  const pontosMelhoria = [
    `Aprofundar conhecimentos específicos no segmento de ${vaga.area}.`,
    'Destacar projetos práticos no GitHub ou portfólio para ilustrar a execução técnica.',
  ];

  const dicasEntrevista =
    `Na entrevista para ${vaga.empresa}, enfatize como sua bagagem prática pode resolver desafios reais no dia a dia da equipe de ${vaga.area}.`;

  return {
    scoreMatch: score,
    nivelCompatibilidade: nivel,
    pontosFortes,
    pontosMelhoria,
    dicasEntrevista,
  };
}

/**
 * Cria a conversa inicial e feedback automático quando o aluno se inscreve em uma vaga.
 */
export function criarConversaInicial(
  vaga: Vaga,
  usuarioId: string,
  curriculo: CurriculoGeral | CurriculoVaga | null
): ConversaCandidatura {
  const agora = new Date().toISOString();
  const analise = gerarAnaliseAutomatica(vaga, curriculo);

  const mensagemBoasVindas: MensagemFeedback = {
    id: `msg_ia_${Date.now()}_1`,
    remetente: 'ia_peia',
    nomeRemetente: 'Assistente PEIA',
    texto: `Olá! Seu currículo para "${vaga.titulo}" foi submetido à ${vaga.empresa}. Calculamos uma compatibilidade inicial de ${analise.scoreMatch}% com os requisitos da vaga. Confira os pontos fortes e sugestões no card acima!`,
    timestamp: agora,
  };

  const mensagemEmpresa: MensagemFeedback = {
    id: `msg_emp_${Date.now()}_2`,
    remetente: 'empresa',
    nomeRemetente: `Recrutamento ${vaga.empresa}`,
    texto: `Olá! Agradecemos o envio da sua candidatura. Nosso time de talentos já tem acesso ao seu currículo direcionado e entrará em contato em breve para os próximos passos.`,
    timestamp: new Date(Date.now() + 1000).toISOString(),
  };

  return {
    id: `conv_${vaga.id}_${usuarioId}`,
    vagaId: vaga.id,
    tituloVaga: vaga.titulo,
    empresa: vaga.empresa,
    usuarioId,
    status: 'feedback_disponivel',
    analise,
    mensagens: [mensagemBoasVindas, mensagemEmpresa],
    atualizadoEm: agora,
  };
}

