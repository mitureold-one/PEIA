// ponytail: dados mockados; trocar por chamada à API quando houver backend.
export type Modalidade = 'Presencial' | 'Híbrido' | 'Remoto';

export interface Vaga {
  id: string;
  titulo: string;
  empresa: string;
  cidade: string;
  area: string;
  modalidade: Modalidade;
  bolsa: number;
  descricao: string;
  arquivada?: boolean;
  excluidaEm?: string;
}

export const MODALIDADES: Modalidade[] = ['Presencial', 'Híbrido', 'Remoto'];
export const AREAS = ['Tecnologia', 'Marketing', 'Administração', 'Engenharia', 'Design'];

export const VAGAS: Vaga[] = [
  { id: '1', titulo: 'Estágio em Desenvolvimento Mobile', empresa: 'Nubix', cidade: 'São Paulo', area: 'Tecnologia', modalidade: 'Híbrido', bolsa: 2200, descricao: 'Desenvolvimento de apps em React Native junto ao time de produto.' },
  { id: '2', titulo: 'Estágio em Dados', empresa: 'Dataly', cidade: 'Remoto', area: 'Tecnologia', modalidade: 'Remoto', bolsa: 2000, descricao: 'Apoio na construção de dashboards e pipelines de dados.' },
  { id: '3', titulo: 'Estágio em Marketing Digital', empresa: 'Brisa Agência', cidade: 'Curitiba', area: 'Marketing', modalidade: 'Presencial', bolsa: 1500, descricao: 'Gestão de redes sociais e campanhas pagas.' },
  { id: '4', titulo: 'Estágio em Administração', empresa: 'Grupo Alfa', cidade: 'Belo Horizonte', area: 'Administração', modalidade: 'Presencial', bolsa: 1400, descricao: 'Rotinas administrativas e apoio financeiro.' },
  { id: '5', titulo: 'Estágio em Engenharia Civil', empresa: 'Construtora Prisma', cidade: 'Rio de Janeiro', area: 'Engenharia', modalidade: 'Presencial', bolsa: 1800, descricao: 'Acompanhamento de obras e medições.' },
  { id: '6', titulo: 'Estágio em UX/UI Design', empresa: 'Pixel Lab', cidade: 'Porto Alegre', area: 'Design', modalidade: 'Híbrido', bolsa: 1900, descricao: 'Prototipação e pesquisa com usuários.' },
  { id: '7', titulo: 'Estágio em QA', empresa: 'Nubix', cidade: 'Remoto', area: 'Tecnologia', modalidade: 'Remoto', bolsa: 1800, descricao: 'Testes manuais e automatizados de aplicativos.' },
];
