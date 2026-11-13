import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { perfilActions, usePerfil } from '@/hooks/use-perfil';
import { useInscricoes } from '@/hooks/use-inscricoes';
import { useVagas } from '@/hooks/use-vagas';
import { useEmpresas } from '@/hooks/use-empresas';
import { estudanteSocialActions, useEstudanteSocial } from '@/hooks/use-estudante-social';
import { EMPRESAS_BASE, COLEGAS_BASE, type EmpresaSocial, type ColegaSocial } from '@/data/social';
import { Aluno, userList, type AlunoProps } from '@/data/user';
import { userService } from '@/services/user-service';
import { ROUTES } from '@/constants/routes';
import type { Vaga } from '@/data/vagas';

export type MetricaTipo = 'inscricoes' | 'empresas' | 'conexoes' | null;

export interface UseProfileStudentHeaderReturn {
  aluno: Aluno;
  nomeCompleto: string;
  iniciais: string;
  avatar?: string;
  vagasInscritas: Vaga[];
  empresasSeguidas: EmpresaSocial[];
  colegasConectados: ColegaSocial[];
  metricaAtiva: MetricaTipo;
  abrirMetrica: (tipo: 'inscricoes' | 'empresas' | 'conexoes') => void;
  fecharMetrica: () => void;
  navegarParaConfiguracoes: () => void;
  navegarParaVaga: (id: string) => void;
  toggleSeguirEmpresa: (id: string) => void;
  toggleSeguirUsuario: (id: string) => void;
  atualizarDadosAluno: (dados: Partial<AlunoProps>) => Promise<void>;
  toggleAbertoOportunidades: () => Promise<void>;
  atualizarFotoPerfil: (uri?: string) => Promise<void>;
}

export function useProfileStudentHeader(): UseProfileStudentHeaderReturn {
  const router = useRouter();
  const perfil = usePerfil();
  const inscricoes = useInscricoes();
  const vagas = useVagas();
  const empresasCadastradas = useEmpresas();
  const { seguindoEmpresas, seguindoUsuarios } = useEstudanteSocial();

  const [metricaAtiva, setMetricaAtiva] = useState<MetricaTipo>(null);

  // Hidratação a partir da subclasse de domínio Aluno
  const aluno = useMemo(() => {
    const defaultStudent =
      (userList.find((u) => u instanceof Aluno || u.isAluno) as Aluno) ||
      (userList[0] as Aluno);

    if (!perfil) {
      return defaultStudent;
    }

    return Aluno.createAluno({
      id: (defaultStudent as any).id,
      name: perfil.name || defaultStudent.name,
      surname: perfil.surname ?? defaultStudent.surname,
      email: perfil.email || defaultStudent.email,
      phone: perfil.phone || defaultStudent.phone,
      role: 'aluno',
      avatar: perfil.avatar ?? defaultStudent.avatar,
      cargo: perfil.cargo ?? defaultStudent.cargo ?? 'Estudante de Tecnologia',
      instituicao: perfil.instituicao ?? defaultStudent.instituicao ?? 'UNDB',
      curso: perfil.curso ?? defaultStudent.curso ?? 'Graduação',
      abertoOportunidades:
        perfil.abertoOportunidades ?? defaultStudent.abertoOportunidades ?? true,
    });
  }, [perfil]);

  const nomeCompleto = aluno.fullName;
  const iniciais = `${aluno.name ? aluno.name[0] : 'E'}${aluno.surname ? aluno.surname[0] : ''}`.toUpperCase();
  const avatar = aluno.avatar;

  // 1. Inscrições ativas ordenadas alfabeticamente (A-Z)
  const vagasInscritas = useMemo(() => {
    return vagas
      .filter((v) => inscricoes.includes(v.id))
      .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR', { sensitivity: 'base' }));
  }, [vagas, inscricoes]);

  // 2. Empresas seguidas unificadas e ordenadas alfabeticamente (A-Z)
  const empresasSeguidas = useMemo(() => {
    const map = new Map<string, EmpresaSocial>();
    EMPRESAS_BASE.forEach((e) => map.set(e.id, e));
    empresasCadastradas.forEach((e) =>
      map.set(e.id, { id: e.id, nome: e.nome, setor: 'Empresa Parceira' })
    );

    return Array.from(map.values())
      .filter((e) => seguindoEmpresas.includes(e.id))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
  }, [empresasCadastradas, seguindoEmpresas]);

  // 3. Conexões conectadas ordenadas alfabeticamente (A-Z)
  const colegasConectados = useMemo(() => {
    return COLEGAS_BASE
      .filter((c) => seguindoUsuarios.includes(c.id))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
  }, [seguindoUsuarios]);

  const abrirMetrica = (tipo: 'inscricoes' | 'empresas' | 'conexoes') => {
    setMetricaAtiva(tipo);
  };

  const fecharMetrica = () => {
    setMetricaAtiva(null);
  };

  const navegarParaConfiguracoes = () => {
    router.push(ROUTES.CONFIGURACOES);
  };

  const navegarParaVaga = (id: string) => {
    fecharMetrica();
    router.push({
      pathname: ROUTES.VAGA_DETALHE as any,
      params: { id },
    });
  };

  const toggleSeguirEmpresa = (id: string) => {
    estudanteSocialActions.toggleSeguirEmpresa(id);
  };

  const toggleSeguirUsuario = (id: string) => {
    estudanteSocialActions.toggleSeguirUsuario(id);
  };

  // CRUD dos dados acadêmicos e status da subclasse Aluno
  const atualizarDadosAluno = async (dados: Partial<AlunoProps>) => {
    const proximoCargo = dados.cargo !== undefined ? dados.cargo : aluno.cargo;
    const proximaInstituicao = dados.instituicao !== undefined ? dados.instituicao : aluno.instituicao;
    const proximoCurso = dados.curso !== undefined ? dados.curso : aluno.curso;
    const proximoStatus =
      dados.abertoOportunidades !== undefined ? dados.abertoOportunidades : aluno.abertoOportunidades;

    perfilActions.editar({
      name: aluno.name,
      surname: aluno.surname,
      email: aluno.email,
      phone: aluno.phone ?? '',
      avatar: aluno.avatar,
      role: 'aluno',
      cargo: proximoCargo,
      instituicao: proximaInstituicao,
      curso: proximoCurso,
      abertoOportunidades: proximoStatus,
    });

    try {
      const userDb = await userService.findByEmail(aluno.email);
      if (userDb) {
        (userDb as any).cargo = proximoCargo;
        (userDb as any).instituicao = proximaInstituicao;
        (userDb as any).curso = proximoCurso;
        (userDb as any).abertoOportunidades = proximoStatus;
        await userService.save(userDb);
      }
    } catch {
      // Silencioso em caso de erro na camada do SQLite
    }
  };

  const toggleAbertoOportunidades = async () => {
    await atualizarDadosAluno({
      abertoOportunidades: !aluno.abertoOportunidades,
    });
  };

  const atualizarFotoPerfil = async (uri?: string) => {
    perfilActions.editar({
      name: aluno.name,
      surname: aluno.surname,
      email: aluno.email,
      phone: aluno.phone ?? '',
      avatar: uri,
      role: 'aluno',
      cargo: aluno.cargo,
      instituicao: aluno.instituicao,
      curso: aluno.curso,
      abertoOportunidades: aluno.abertoOportunidades,
    });

    try {
      const userDb = await userService.findByEmail(aluno.email);
      if (userDb) {
        userDb.avatar = uri;
        await userService.save(userDb);
      }
    } catch {
      // Silencioso em caso de erro na camada do SQLite
    }
  };

  return {
    aluno,
    nomeCompleto,
    iniciais,
    avatar,
    vagasInscritas,
    empresasSeguidas,
    colegasConectados,
    metricaAtiva,
    abrirMetrica,
    fecharMetrica,
    navegarParaConfiguracoes,
    navegarParaVaga,
    toggleSeguirEmpresa,
    toggleSeguirUsuario,
    atualizarDadosAluno,
    toggleAbertoOportunidades,
    atualizarFotoPerfil,
  };
}
