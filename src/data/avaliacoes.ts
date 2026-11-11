export type TipoAvaliador = 'empresa' | 'docente' | 'colega';

export interface AvaliacaoEstudante {
  id: string;
  autorNome: string;
  autorCargo: string;
  autorInstituicao: string;
  autorAvatar?: string;
  tipo: TipoAvaliador;
  estrelas: number; // 1 a 5
  depoimento: string;
  data: string;
}

export const AVALIACOES_INICIAIS: AvaliacaoEstudante[] = [
  {
    id: 'av_1',
    autorNome: 'Renata Vasconcelos',
    autorCargo: 'Tech Recruiter & HR Lead',
    autorInstituicao: 'TechHub São Luís',
    tipo: 'empresa',
    estrelas: 5,
    depoimento:
      'Excelente desempenho na análise de currículo e entrevista técnica. Demonstrou ótima articulação sobre projetos em React Native e sólidos fundamentos de lógica.',
    data: '10 de Nov, 2026',
  },
  {
    id: 'av_2',
    autorNome: 'Prof. Carlos Eduardo',
    autorCargo: 'Coord. de Sistemas de Informação',
    autorInstituicao: 'UNDB',
    tipo: 'docente',
    estrelas: 5,
    depoimento:
      'Aluno dedicado com excelente histórico em Engenharia de Software e Projetos Integradores. Sempre colaborativo com a equipe e focado em boas práticas.',
    data: '28 de Out, 2026',
  },
  {
    id: 'av_3',
    autorNome: 'Lucas Mendes',
    autorCargo: 'Desenvolvedor Frontend',
    autorInstituicao: 'Colega de Hackathon',
    tipo: 'colega',
    estrelas: 5,
    depoimento:
      'Trabalhamos juntos no desenvolvimento de soluções móveis. Entrega ágil, clareza no código e facilidade em resolver problemas complexos sob pressão.',
    data: '15 de Set, 2026',
  },
];

