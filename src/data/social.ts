export interface EmpresaSocial {
  id: string;
  nome: string;
  setor: string;
}

export interface ColegaSocial {
  id: string;
  nome: string;
  curso: string;
}

export const EMPRESAS_BASE: EmpresaSocial[] = [
  { id: 'empresa_1', nome: 'TechHub São Luís', setor: 'Tecnologia & Inovação' },
  { id: 'empresa_2', nome: 'Inova Maranhão', setor: 'Startups & P&D' },
  { id: 'empresa_3', nome: 'Vale Lab', setor: 'Engenharia & Mineração' },
  { id: 'empresa_4', nome: 'Ambev Tech', setor: 'Desenvolvimento & Cloud' },
  { id: 'empresa_5', nome: 'Alura & FIAP Hub', setor: 'Educação & EdTech' },
  { id: 'empresa_6', nome: 'Nubank Tech', setor: 'Fintech & Mobile' },
  { id: 'empresa_7', nome: 'Banco do Brasil DITEC', setor: 'Setor Bancário & IA' },
];

export const COLEGAS_BASE: ColegaSocial[] = [
  { id: 'user_2', nome: 'Beatriz Lima', curso: 'Engenharia da Computação · UNDB' },
  { id: 'user_3', nome: 'Carlos Eduardo Ramos', curso: 'Sistemas de Informação · UNDB' },
  { id: 'user_4', nome: 'Felipe Andrade', curso: 'Análise e Desenv. de Sistemas' },
  { id: 'user_5', nome: 'Gabriel Rocha', curso: 'Ciência da Computação' },
  { id: 'user_6', nome: 'Juliana Castro', curso: 'Engenharia de Software' },
  { id: 'user_7', nome: 'Lucas Mendes', curso: 'UI/UX Design & Produto' },
  { id: 'user_8', nome: 'Mariana Souza', curso: 'Inteligência Artificial & Dados' },
];

