/**
 * Estrutura de Dados do Módulo de Currículos - PEIA
 *
 * Define o modelo do Currículo Geral (Master/Completo do Estudante)
 * e do Currículo Direcionado para Vaga (Tailored/Enviado com base nas necessidades da vaga).
 */

export type ModalidadeTrabalho = 'Presencial' | 'Híbrido' | 'Remoto';

export type GrauAcademico =
  | 'Graduação'
  | 'Tecnólogo'
  | 'Pós-graduação'
  | 'Mestrado'
  | 'Ensino Técnico'
  | 'Outro';

export type StatusFormacao = 'Em andamento' | 'Concluído' | 'Trancado';

export type NivelHabilidade = 'basico' | 'intermediario' | 'avancado' | 'especialista';

export type CategoriaHabilidade = 'tecnica' | 'comportamental' | 'ferramenta' | 'idioma';

export type NivelIdioma = 'Básico' | 'Intermediário' | 'Avançado' | 'Fluente' | 'Nativo';

// ============================================================================
// Sub-estruturas granulares do Currículo
// ============================================================================

export interface ContatoCurriculo {
  nomeCompleto: string;
  email: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface FormacaoAcademica {
  id: string;
  instituicao: string;
  curso: string;
  grau: GrauAcademico;
  status: StatusFormacao;
  dataInicio: string; // Ex: "02/2023" ou "2023-02"
  dataFim?: string; // Previsão ou conclusão. Ex: "12/2026"
  descricao?: string;
}

export interface ExperienciaProfissional {
  id: string;
  cargo: string;
  empresa: string;
  modalidade?: ModalidadeTrabalho;
  dataInicio: string; // Ex: "03/2024"
  dataFim?: string; // Vazio se for emprego atual
  atual: boolean;
  descricao: string;
  atividades?: string[]; // Bullet points das principais responsabilidades/conquistas
  competenciasUtilizadas?: string[]; // Ex: ["React Native", "TypeScript", "Git"]
}

export interface Habilidade {
  id: string;
  nome: string; // Ex: "TypeScript", "Comunicação assertiva", "Figma"
  categoria: CategoriaHabilidade;
  nivel?: NivelHabilidade;
}

export interface Idioma {
  id: string;
  nome: string; // Ex: "Inglês", "Espanhol"
  nivel: NivelIdioma;
}

export interface ProjetoAcademicoOuPessoal {
  id: string;
  titulo: string;
  descricao: string;
  link?: string;
  tecnologias: string[];
  data?: string;
}

export interface CertificacaoOuCurso {
  id: string;
  titulo: string;
  instituicao: string;
  ano?: string;
  cargaHoraria?: number; // Em horas
  credencialUrl?: string;
}

// ============================================================================
// 1. Currículo Geral do Estudante (Master Resume)
// Onde o aluno cadastra absolutamente tudo sobre sua trajetória.
// ============================================================================
export interface CurriculoGeral {
  id: string;
  usuarioId: string;
  contato: ContatoCurriculo;
  resumoGeral: string; // Bio abrangente / apresentação principal
  formacoes: FormacaoAcademica[];
  experiencias: ExperienciaProfissional[];
  habilidades: Habilidade[];
  idiomas: Idioma[];
  projetos: ProjetoAcademicoOuPessoal[];
  certificacoes: CertificacaoOuCurso[];
  criadoEm: string;
  atualizadoEm: string;
}

// ============================================================================
// 2. Currículo Direcionado para a Vaga (Targeted / Custom Resume)
// Gerado e enviado conforme os requisitos específicos e necessidades da vaga.
// ============================================================================
export interface CurriculoVaga {
  id: string;
  vagaId: string;
  usuarioId: string;
  tituloVaga?: string;
  empresaVaga?: string;

  /**
   * Resumo ou pitch personalizado e ajustado com foco nas dores e requisitos da vaga.
   */
  resumoCustomizado?: string;

  /**
   * Carta de apresentação ou mensagem direcionada ao recrutador da empresa.
   */
  cartaApresentacao?: string;

  /**
   * Subconjunto selecionado de formações acadêmicas pertinentes à vaga.
   */
  formacoes: FormacaoAcademica[];

  /**
   * Subconjunto de experiências profissionais relevantes para a posição.
   */
  experiencias: ExperienciaProfissional[];

  /**
   * Habilidades que dão match direto com a descrição da vaga.
   */
  habilidadesDestacadas: Habilidade[];

  /**
   * Idiomas relevantes para o perfil da vaga.
   */
  idiomas: Idioma[];

  /**
   * Projetos de destaque selecionados para demonstrar competência prática na vaga.
   */
  projetos: ProjetoAcademicoOuPessoal[];

  /**
   * Certificações específicas que agregam valor para o cargo.
   */
  certificacoes: CertificacaoOuCurso[];

  /**
   * Porcentagem calculada de aderência / match com a vaga (opcional para IA/PEIA).
   */
  compatibilidadeEstimada?: number;

  /**
   * Data em que o currículo direcionado foi snapshotado e submetido.
   */
  dataEnvio: string;
}

// ============================================================================
// Compatibilidade Legada (Compatível com o formato simples anterior)
// ============================================================================
export interface CurriculoLegado {
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

// ============================================================================
// Métodos Utilitários & Factory
// ============================================================================

/**
 * Cria uma estrutura inicial em branco para o Currículo Geral.
 */
export function criarCurriculoGeralVazio(
  usuarioId: string,
  contatoInicial?: Partial<ContatoCurriculo>,
): CurriculoGeral {
  const agora = new Date().toISOString();
  return {
    id: `curr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    usuarioId,
    contato: {
      nomeCompleto: contatoInicial?.nomeCompleto ?? '',
      email: contatoInicial?.email ?? '',
      telefone: contatoInicial?.telefone ?? '',
      cidade: contatoInicial?.cidade ?? '',
      estado: contatoInicial?.estado ?? '',
      linkedin: contatoInicial?.linkedin ?? '',
      github: contatoInicial?.github ?? '',
      portfolio: contatoInicial?.portfolio ?? '',
    },
    resumoGeral: '',
    formacoes: [],
    experiencias: [],
    habilidades: [],
    idiomas: [],
    projetos: [],
    certificacoes: [],
    criadoEm: agora,
    atualizadoEm: agora,
  };
}

/**
 * Converte a estrutura de texto legada em um Currículo Geral estruturado.
 */
export function converterLegadoParaCurriculoGeral(
  legado: Partial<CurriculoLegado>,
  usuarioId: string,
  contato?: Partial<ContatoCurriculo>,
): CurriculoGeral {
  const base = criarCurriculoGeralVazio(usuarioId, contato);
  base.resumoGeral = legado.summary?.trim() ?? '';

  if (legado.education?.trim()) {
    base.formacoes.push({
      id: `form_${Date.now()}`,
      instituicao: 'Instituição de Ensino',
      curso: legado.education.trim(),
      grau: 'Graduação',
      status: 'Em andamento',
      dataInicio: '',
      descricao: legado.education.trim(),
    });
  }

  if (legado.experience?.trim()) {
    base.experiencias.push({
      id: `exp_${Date.now()}`,
      cargo: 'Experiência Profissional / Estágio',
      empresa: 'Experiência Anterior',
      atual: false,
      dataInicio: '',
      descricao: legado.experience.trim(),
    });
  }

  if (legado.skills?.trim()) {
    const itens = legado.skills.split(/[,\n•-]/).map((s) => s.trim()).filter(Boolean);
    base.habilidades = itens.map((nome, index) => ({
      id: `skill_${Date.now()}_${index}`,
      nome,
      categoria: 'tecnica',
    }));
  }

  return base;
}

/**
 * Converte o Currículo Geral para o formato legado em blocos de texto (útil para retrocompatibilidade com inputs simples).
 */
export function converterCurriculoGeralParaLegado(curriculo: CurriculoGeral): CurriculoLegado {
  const formacoesTexto = curriculo.formacoes
    .map((f) => `${f.curso} - ${f.instituicao} (${f.status})`)
    .join('\n');

  const experienciasTexto = curriculo.experiencias
    .map((e) => `${e.cargo} na ${e.empresa}${e.descricao ? `: ${e.descricao}` : ''}`)
    .join('\n');

  const habilidadesTexto = curriculo.habilidades.map((h) => h.nome).join(', ');

  return {
    summary: curriculo.resumoGeral,
    education: formacoesTexto,
    experience: experienciasTexto,
    skills: habilidadesTexto,
  };
}

/**
 * Filtra e constrói o Currículo Direcionado para uma Vaga específica a partir do Currículo Geral do Aluno.
 */
export function gerarCurriculoVaga(params: {
  curriculoGeral: CurriculoGeral;
  vagaId: string;
  tituloVaga?: string;
  empresaVaga?: string;
  resumoCustomizado?: string;
  cartaApresentacao?: string;
  idsFormacoes?: string[];
  idsExperiencias?: string[];
  idsHabilidades?: string[];
  idsProjetos?: string[];
  idsCertificacoes?: string[];
  idsIdiomas?: string[];
  compatibilidadeEstimada?: number;
}): CurriculoVaga {
  const { curriculoGeral } = params;

  // Se nenhum id específico for passado, seleciona todos por padrão
  const formacoes = params.idsFormacoes
    ? curriculoGeral.formacoes.filter((f) => params.idsFormacoes?.includes(f.id))
    : [...curriculoGeral.formacoes];

  const experiencias = params.idsExperiencias
    ? curriculoGeral.experiencias.filter((e) => params.idsExperiencias?.includes(e.id))
    : [...curriculoGeral.experiencias];

  const habilidadesDestacadas = params.idsHabilidades
    ? curriculoGeral.habilidades.filter((h) => params.idsHabilidades?.includes(h.id))
    : [...curriculoGeral.habilidades];

  const projetos = params.idsProjetos
    ? curriculoGeral.projetos.filter((p) => params.idsProjetos?.includes(p.id))
    : [...curriculoGeral.projetos];

  const certificacoes = params.idsCertificacoes
    ? curriculoGeral.certificacoes.filter((c) => params.idsCertificacoes?.includes(c.id))
    : [...curriculoGeral.certificacoes];

  const idiomas = params.idsIdiomas
    ? curriculoGeral.idiomas.filter((i) => params.idsIdiomas?.includes(i.id))
    : [...curriculoGeral.idiomas];

  return {
    id: `currvaga_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    vagaId: params.vagaId,
    usuarioId: curriculoGeral.usuarioId,
    tituloVaga: params.tituloVaga,
    empresaVaga: params.empresaVaga,
    resumoCustomizado: params.resumoCustomizado ?? curriculoGeral.resumoGeral,
    cartaApresentacao: params.cartaApresentacao,
    formacoes,
    experiencias,
    habilidadesDestacadas,
    projetos,
    certificacoes,
    idiomas,
    compatibilidadeEstimada: params.compatibilidadeEstimada,
    dataEnvio: new Date().toISOString(),
  };
}

// ============================================================================
// Mock de exemplo para testes, desenvolvimento e onboarding
// ============================================================================
export const MOCK_CURRICULO_GERAL: CurriculoGeral = {
  id: 'curr_mock_001',
  usuarioId: '001',
  contato: {
    nomeCompleto: 'John Doe',
    email: 'john.doe@aluno.undb.edu.br',
    telefone: '(98) 98888-0001',
    cidade: 'São Luís',
    estado: 'MA',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
  },
  resumoGeral:
    'Estudante de Engenharia de Software na UNDB com forte interesse em desenvolvimento mobile (React Native/TypeScript) e interfaces acessíveis. Experiência prática na Empresa Júnior UNDB e em projetos acadêmicos com arquiteturas escaláveis.',
  formacoes: [
    {
      id: 'form_1',
      instituicao: 'Centro Universitário UNDB',
      curso: 'Engenharia de Software',
      grau: 'Graduação',
      status: 'Em andamento',
      dataInicio: '2023',
      dataFim: '2026',
      descricao: 'Ênfase em Arquitetura de Software, Algoritmos, Computação em Nuvem e Desenvolvimento Mobile.',
    },
    {
      id: 'form_2',
      instituicao: 'Instituto Federal do Maranhão (IFMA)',
      curso: 'Técnico em Informática para Internet',
      grau: 'Ensino Técnico',
      status: 'Concluído',
      dataInicio: '2020',
      dataFim: '2022',
      descricao: 'Formação em lógica de programação, banco de dados relacionais, desenvolvimento web e redes.',
    },
  ],
  experiencias: [
    {
      id: 'exp_1',
      cargo: 'Desenvolvedor Frontend Trainee',
      empresa: 'Empresa Júnior UNDB',
      modalidade: 'Híbrido',
      dataInicio: '2024',
      atual: true,
      descricao: 'Desenvolvimento e manutenção de aplicações móveis e portais institucionais utilizando React Native e TailwindCSS.',
      atividades: [
        'Criação de componentes reutilizáveis e acessíveis em React Native e NativeWind.',
        'Integração de APIs RESTful e persistência resiliente em SQLite local.',
        'Participação ativa em cerimônias ágeis com metodologia Scrum.',
      ],
      competenciasUtilizadas: ['React Native', 'TypeScript', 'TailwindCSS', 'Git', 'SQLite'],
    },
    {
      id: 'exp_2',
      cargo: 'Monitor de Algoritmos e Programação',
      empresa: 'Centro Universitário UNDB',
      modalidade: 'Presencial',
      dataInicio: '2023',
      dataFim: '2024',
      atual: false,
      descricao: 'Suporte a alunos dos primeiros períodos em fundamentos de algoritmos, estrutura de dados e boas práticas de lógica.',
      atividades: [
        'Plantão de dúvidas e mentoria individualizada para novos estudantes de tecnologia.',
        'Elaboração de exercícios práticos e materiais de apoio didático.',
      ],
      competenciasUtilizadas: ['Lógica de Programação', 'TypeScript', 'Estrutura de Dados'],
    },
  ],
  habilidades: [
    { id: 'sk_1', nome: 'React Native', categoria: 'tecnica', nivel: 'avancado' },
    { id: 'sk_2', nome: 'TypeScript', categoria: 'tecnica', nivel: 'avancado' },
    { id: 'sk_3', nome: 'Expo SDK 58', categoria: 'tecnica', nivel: 'avancado' },
    { id: 'sk_4', nome: 'TailwindCSS / NativeWind', categoria: 'tecnica', nivel: 'avancado' },
    { id: 'sk_5', nome: 'SQLite / Persistência Local', categoria: 'tecnica', nivel: 'intermediario' },
    { id: 'sk_6', nome: 'Git & GitHub', categoria: 'ferramenta', nivel: 'avancado' },
    { id: 'sk_7', nome: 'Trabalho em Equipe', categoria: 'comportamental' },
    { id: 'sk_8', nome: 'Resolução de Problemas', categoria: 'comportamental' },
  ],
  idiomas: [
    { id: 'id_1', nome: 'Português', nivel: 'Nativo' },
    { id: 'id_2', nome: 'Inglês', nivel: 'Intermediário' },
  ],
  projetos: [
    {
      id: 'proj_1',
      titulo: 'App PEIA - Plataforma de Estágios',
      descricao: 'Aplicativo mobile com Expo SDK 58, SQLite local e OCR para leitura e direcionamento inteligente de currículos.',
      link: 'https://github.com/exemplo/peia',
      tecnologias: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'NativeWind'],
      data: '2025',
    },
  ],
  certificacoes: [
    {
      id: 'cert_1',
      titulo: 'Desenvolvimento Mobile com React Native & Expo',
      instituicao: 'Rocketseat',
      ano: '2024',
      cargaHoraria: 60,
    },
  ],
  criadoEm: '2025-01-10T10:00:00.000Z',
  atualizadoEm: '2025-02-15T14:30:00.000Z',
};

/**
 * Snapshots iniciais mockados de currículos direcionados para as candidaturas padrão de John Doe.
 */
export const MOCK_CURRICULOS_VAGAS: CurriculoVaga[] = [
  {
    id: 'currvaga_mock_001',
    vagaId: '1',
    usuarioId: '001',
    tituloVaga: 'Estágio em Desenvolvimento Mobile',
    empresaVaga: 'Nubix',
    resumoCustomizado:
      'Olá equipe da Nubix! Como estudante de Engenharia de Software na UNDB e desenvolvedor trainee com foco em React Native e TypeScript, tenho grande entusiasmo em colaborar na criação de experiências móveis fluidas e modernas. Possuo vivência em desenvolvimento ágil, gerenciamento de estado e persistência local resiliente em SQLite, alinhando-se diretamente às demandas de produto da Nubix.',
    cartaApresentacao:
      'Estou à disposição para entrevistas e desafios técnicos, motivado a somar com o time de engenharia da Nubix.',
    formacoes: [
      {
        id: 'form_1',
        instituicao: 'Centro Universitário UNDB',
        curso: 'Engenharia de Software',
        grau: 'Graduação',
        status: 'Em andamento',
        dataInicio: '2023',
        dataFim: '2026',
        descricao: 'Ênfase em Arquitetura de Software, Algoritmos e Desenvolvimento Mobile.',
      },
    ],
    experiencias: [
      {
        id: 'exp_1',
        cargo: 'Desenvolvedor Frontend Trainee',
        empresa: 'Empresa Júnior UNDB',
        modalidade: 'Híbrido',
        dataInicio: '2024',
        atual: true,
        descricao: 'Desenvolvimento e manutenção de aplicações móveis utilizando React Native, Expo e TailwindCSS.',
        atividades: [
          'Criação de componentes reutilizáveis e acessíveis em React Native e NativeWind.',
          'Integração de APIs RESTful e persistência resiliente em SQLite local.',
          'Participação em sprints Scrum com entrega contínua.',
        ],
        competenciasUtilizadas: ['React Native', 'TypeScript', 'TailwindCSS', 'Git', 'SQLite'],
      },
    ],
    habilidadesDestacadas: [
      { id: 'sk_1', nome: 'React Native', categoria: 'tecnica', nivel: 'avancado' },
      { id: 'sk_2', nome: 'TypeScript', categoria: 'tecnica', nivel: 'avancado' },
      { id: 'sk_3', nome: 'Expo SDK 58', categoria: 'tecnica', nivel: 'avancado' },
      { id: 'sk_4', nome: 'TailwindCSS / NativeWind', categoria: 'tecnica', nivel: 'avancado' },
      { id: 'sk_5', nome: 'SQLite / Persistência Local', categoria: 'tecnica', nivel: 'intermediario' },
      { id: 'sk_6', nome: 'Git & GitHub', categoria: 'ferramenta', nivel: 'avancado' },
    ],
    idiomas: [
      { id: 'id_1', nome: 'Português', nivel: 'Nativo' },
      { id: 'id_2', nome: 'Inglês', nivel: 'Intermediário' },
    ],
    projetos: [
      {
        id: 'proj_1',
        titulo: 'App PEIA - Plataforma de Estágios',
        descricao: 'Aplicativo mobile com Expo SDK 58, SQLite local e OCR para leitura e direcionamento inteligente de currículos.',
        link: 'https://github.com/exemplo/peia',
        tecnologias: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'NativeWind'],
        data: '2025',
      },
    ],
    certificacoes: [
      {
        id: 'cert_1',
        titulo: 'Desenvolvimento Mobile com React Native & Expo',
        instituicao: 'Rocketseat',
        ano: '2024',
        cargaHoraria: 60,
      },
    ],
    compatibilidadeEstimada: 96,
    dataEnvio: '2025-02-10T14:30:00.000Z',
  },
  {
    id: 'currvaga_mock_002',
    vagaId: '2',
    usuarioId: '001',
    tituloVaga: 'Estágio em Dados',
    empresaVaga: 'Dataly',
    resumoCustomizado:
      'Prezado time da Dataly! Tenho grande interesse na vaga de Estágio em Dados. Durante minha graduação em Engenharia de Software e nas atividades na Empresa Júnior, aprofundei conhecimentos em modelagem de dados relacionais, banco SQLite, pipelines de dados locais e raciocínio analítico estruturado. Busco contribuir na construção de visualizações claras e apoio nas tomadas de decisão da Dataly.',
    cartaApresentacao:
      'Comprometido com a qualidade e organização dos dados, pronto para colaborar remotamente com o time.',
    formacoes: [
      {
        id: 'form_1',
        instituicao: 'Centro Universitário UNDB',
        curso: 'Engenharia de Software',
        grau: 'Graduação',
        status: 'Em andamento',
        dataInicio: '2023',
        dataFim: '2026',
        descricao: 'Formação com ênfase em Banco de Dados, Algoritmos e Métricas de Software.',
      },
      {
        id: 'form_2',
        instituicao: 'Instituto Federal do Maranhão (IFMA)',
        curso: 'Técnico em Informática para Internet',
        grau: 'Ensino Técnico',
        status: 'Concluído',
        dataInicio: '2020',
        dataFim: '2022',
        descricao: 'Bancos de dados relacionais (SQL), modelagem lógica e lógica de programação.',
      },
    ],
    experiencias: [
      {
        id: 'exp_2',
        cargo: 'Monitor de Algoritmos e Programação',
        empresa: 'Centro Universitário UNDB',
        modalidade: 'Presencial',
        dataInicio: '2023',
        dataFim: '2024',
        atual: false,
        descricao: 'Mentoria e suporte técnico em estruturas de dados, lógica analítica e resolução de problemas algorítmicos.',
        competenciasUtilizadas: ['Lógica de Programação', 'TypeScript', 'Estrutura de Dados'],
      },
    ],
    habilidadesDestacadas: [
      { id: 'sk_5', nome: 'SQLite / Persistência Local', categoria: 'tecnica', nivel: 'intermediario' },
      { id: 'sk_2', nome: 'TypeScript', categoria: 'tecnica', nivel: 'avancado' },
      { id: 'sk_8', nome: 'Resolução de Problemas', categoria: 'comportamental' },
      { id: 'sk_7', nome: 'Trabalho em Equipe', categoria: 'comportamental' },
      { id: 'sk_6', nome: 'Git & GitHub', categoria: 'ferramenta', nivel: 'avancado' },
    ],
    idiomas: [
      { id: 'id_1', nome: 'Português', nivel: 'Nativo' },
      { id: 'id_2', nome: 'Inglês', nivel: 'Intermediário' },
    ],
    projetos: [
      {
        id: 'proj_1',
        titulo: 'App PEIA - Plataforma de Estágios',
        descricao: 'Persistência resiliente de dados com tabelas SQLite e sincronização com AsyncStorage.',
        link: 'https://github.com/exemplo/peia',
        tecnologias: ['SQLite', 'TypeScript'],
        data: '2025',
      },
    ],
    certificacoes: [],
    compatibilidadeEstimada: 91,
    dataEnvio: '2025-02-12T09:15:00.000Z',
  },
];


