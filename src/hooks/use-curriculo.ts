import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import {
  type CurriculoGeral,
  type CurriculoVaga,
  type ContatoCurriculo,
  type FormacaoAcademica,
  type ExperienciaProfissional,
  type Habilidade,
  type Idioma,
  type ProjetoAcademicoOuPessoal,
  type CertificacaoOuCurso,
  criarCurriculoGeralVazio,
  gerarCurriculoVaga,
  MOCK_CURRICULO_GERAL,
  MOCK_CURRICULOS_VAGAS,
} from '@/data/curriculo';
import { curriculoService } from '@/services/curriculo-service';
import { perfilActions } from '@/hooks/use-perfil';
import { inscricoesActions } from '@/hooks/use-inscricoes';

// Store global em memória com listeners reativos para useSyncExternalStore
let curriculoGeral: CurriculoGeral | null = { ...MOCK_CURRICULO_GERAL };
let curriculosVagas: CurriculoVaga[] = [...MOCK_CURRICULOS_VAGAS];
let usuarioIdCarregado: string | null = null;

const listenersGeral = new Set<() => void>();
const listenersVagas = new Set<() => void>();

const notifyGeral = () => listenersGeral.forEach((l) => l());
const notifyVagas = () => listenersVagas.forEach((l) => l());

/**
 * Carrega e hidrata os currículos a partir da persistência (SQLite com fallback).
 */
export async function hidratarCurriculo(usuarioId?: string) {
  const perfilAtivo = perfilActions.obter();
  const id = usuarioId || perfilAtivo?.email || 'aluno_padrao';

  try {
    const geral = await curriculoService.obterCurriculoGeral(id, perfilAtivo);
    const vagas = await curriculoService.listarCurriculosVagas(id);

    curriculoGeral = geral;
    curriculosVagas =
      vagas.length > 0
        ? vagas
        : id === '001' || id === 'aluno_padrao' || id.includes('undb.edu.br')
        ? [...MOCK_CURRICULOS_VAGAS]
        : [];
    usuarioIdCarregado = id;

    notifyGeral();
    notifyVagas();
  } catch {
    // Falha silenciosa de inicialização
  }
}

// Inicializa a hidratação no mobile e na web client-side
if (Platform.OS !== 'web' || typeof window !== 'undefined') {
  hidratarCurriculo().catch(() => {});
}

export const curriculoActions = {
  /**
   * Força a recarga dos dados para um determinado usuário.
   */
  carregar: (usuarioId?: string) => hidratarCurriculo(usuarioId),

  /**
   * Salva o currículo geral por completo e persiste no SQLite.
   */
  salvarGeral: (novoCurriculo: CurriculoGeral) => {
    curriculoGeral = novoCurriculo;
    notifyGeral();
    curriculoService.salvarCurriculoGeral(novoCurriculo).catch(() => {});
  },

  /**
   * Atualiza as informações de contato do estudante no currículo mestre.
   */
  atualizarContato: (contato: Partial<ContatoCurriculo>) => {
    if (!curriculoGeral) return;
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      contato: { ...curriculoGeral.contato, ...contato },
    };
    curriculoActions.salvarGeral(atualizado);
  },

  /**
   * Atualiza a bio / resumo geral do estudante.
   */
  atualizarResumoGeral: (resumoGeral: string) => {
    if (!curriculoGeral) return;
    const atualizado: CurriculoGeral = { ...curriculoGeral, resumoGeral };
    curriculoActions.salvarGeral(atualizado);
  },

  // --------------------------------------------------------------------------
  // Gestão de Formação Acadêmica
  // --------------------------------------------------------------------------
  adicionarFormacao: (formacao: Omit<FormacaoAcademica, 'id'>) => {
    if (!curriculoGeral) return;
    const nova: FormacaoAcademica = {
      ...formacao,
      id: `form_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    };
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      formacoes: [nova, ...curriculoGeral.formacoes],
    };
    curriculoActions.salvarGeral(atualizado);
  },

  atualizarFormacao: (id: string, formacao: Partial<FormacaoAcademica>) => {
    if (!curriculoGeral) return;
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      formacoes: curriculoGeral.formacoes.map((f) => (f.id === id ? { ...f, ...formacao } : f)),
    };
    curriculoActions.salvarGeral(atualizado);
  },

  removerFormacao: (id: string) => {
    if (!curriculoGeral) return;
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      formacoes: curriculoGeral.formacoes.filter((f) => f.id !== id),
    };
    curriculoActions.salvarGeral(atualizado);
  },

  // --------------------------------------------------------------------------
  // Gestão de Experiências Profissionais
  // --------------------------------------------------------------------------
  adicionarExperiencia: (experiencia: Omit<ExperienciaProfissional, 'id'>) => {
    if (!curriculoGeral) return;
    const nova: ExperienciaProfissional = {
      ...experiencia,
      id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    };
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      experiencias: [nova, ...curriculoGeral.experiencias],
    };
    curriculoActions.salvarGeral(atualizado);
  },

  atualizarExperiencia: (id: string, experiencia: Partial<ExperienciaProfissional>) => {
    if (!curriculoGeral) return;
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      experiencias: curriculoGeral.experiencias.map((e) => (e.id === id ? { ...e, ...experiencia } : e)),
    };
    curriculoActions.salvarGeral(atualizado);
  },

  removerExperiencia: (id: string) => {
    if (!curriculoGeral) return;
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      experiencias: curriculoGeral.experiencias.filter((e) => e.id !== id),
    };
    curriculoActions.salvarGeral(atualizado);
  },

  // --------------------------------------------------------------------------
  // Gestão de Habilidades
  // --------------------------------------------------------------------------
  adicionarHabilidade: (habilidade: Omit<Habilidade, 'id'>) => {
    if (!curriculoGeral) return;
    // Evita duplicadas pelo mesmo nome
    if (curriculoGeral.habilidades.some((h) => h.nome.toLowerCase() === habilidade.nome.trim().toLowerCase())) {
      return;
    }
    const nova: Habilidade = {
      ...habilidade,
      nome: habilidade.nome.trim(),
      id: `sk_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    };
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      habilidades: [...curriculoGeral.habilidades, nova],
    };
    curriculoActions.salvarGeral(atualizado);
  },

  removerHabilidade: (id: string) => {
    if (!curriculoGeral) return;
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      habilidades: curriculoGeral.habilidades.filter((h) => h.id !== id),
    };
    curriculoActions.salvarGeral(atualizado);
  },

  // --------------------------------------------------------------------------
  // Gestão de Idiomas
  // --------------------------------------------------------------------------
  adicionarIdioma: (idioma: Omit<Idioma, 'id'>) => {
    if (!curriculoGeral) return;
    const novo: Idioma = {
      ...idioma,
      id: `idm_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    };
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      idiomas: [...curriculoGeral.idiomas, novo],
    };
    curriculoActions.salvarGeral(atualizado);
  },

  removerIdioma: (id: string) => {
    if (!curriculoGeral) return;
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      idiomas: curriculoGeral.idiomas.filter((i) => i.id !== id),
    };
    curriculoActions.salvarGeral(atualizado);
  },

  // --------------------------------------------------------------------------
  // Gestão de Projetos
  // --------------------------------------------------------------------------
  adicionarProjeto: (projeto: Omit<ProjetoAcademicoOuPessoal, 'id'>) => {
    if (!curriculoGeral) return;
    const novo: ProjetoAcademicoOuPessoal = {
      ...projeto,
      id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    };
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      projetos: [novo, ...curriculoGeral.projetos],
    };
    curriculoActions.salvarGeral(atualizado);
  },

  removerProjeto: (id: string) => {
    if (!curriculoGeral) return;
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      projetos: curriculoGeral.projetos.filter((p) => p.id !== id),
    };
    curriculoActions.salvarGeral(atualizado);
  },

  // --------------------------------------------------------------------------
  // Gestão de Certificações
  // --------------------------------------------------------------------------
  adicionarCertificacao: (certificacao: Omit<CertificacaoOuCurso, 'id'>) => {
    if (!curriculoGeral) return;
    const nova: CertificacaoOuCurso = {
      ...certificacao,
      id: `cert_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    };
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      certificacoes: [nova, ...curriculoGeral.certificacoes],
    };
    curriculoActions.salvarGeral(atualizado);
  },

  removerCertificacao: (id: string) => {
    if (!curriculoGeral) return;
    const atualizado: CurriculoGeral = {
      ...curriculoGeral,
      certificacoes: curriculoGeral.certificacoes.filter((c) => c.id !== id),
    };
    curriculoActions.salvarGeral(atualizado);
  },

  // --------------------------------------------------------------------------
  // Candidatura com Currículo Direcionado (Vaga)
  // --------------------------------------------------------------------------
  candidatarComCurriculoVaga: (curriculoVaga: CurriculoVaga) => {
    curriculosVagas = [curriculoVaga, ...curriculosVagas.filter((c) => c.vagaId !== curriculoVaga.vagaId)];
    notifyVagas();
    // Registra a inscrição na lista de candidaturas existente
    inscricoesActions.inscrever(curriculoVaga.vagaId);
    // Persiste o snapshot no SQLite
    curriculoService.salvarCurriculoVaga(curriculoVaga).catch(() => {});
  },

  gerarECandidatar: (params: Parameters<typeof gerarCurriculoVaga>[0]) => {
    const cv = gerarCurriculoVaga(params);
    curriculoActions.candidatarComCurriculoVaga(cv);
    return cv;
  },

  cancelarCandidaturaVaga: (vagaId: string, usuarioId?: string) => {
    const id = usuarioId || curriculoGeral?.usuarioId || 'aluno_padrao';
    curriculosVagas = curriculosVagas.filter((c) => c.vagaId !== vagaId);
    notifyVagas();
    inscricoesActions.cancelar(vagaId);
    curriculoService.removerCurriculoVaga(vagaId, id).catch(() => {});
  },
};

/**
 * Hook para acessar o Currículo Geral do estudante autenticado.
 */
export function useCurriculoGeral(): CurriculoGeral {
  return useSyncExternalStore(
    (listener) => {
      listenersGeral.add(listener);
      return () => listenersGeral.delete(listener);
    },
    () => {
      if (!curriculoGeral) {
        const perfilAtivo = perfilActions.obter();
        return criarCurriculoGeralVazio(perfilAtivo?.email || 'aluno_padrao', {
          nomeCompleto: perfilAtivo ? `${perfilAtivo.name || ''} ${perfilAtivo.surname || ''}`.trim() : '',
          email: perfilAtivo?.email || '',
          telefone: perfilAtivo?.phone || '',
        });
      }
      return curriculoGeral;
    }
  );
}

/**
 * Hook para listar todos os currículos direcionados enviados para vagas.
 */
export function useCurriculosVagas(): CurriculoVaga[] {
  return useSyncExternalStore(
    (listener) => {
      listenersVagas.add(listener);
      return () => listenersVagas.delete(listener);
    },
    () => curriculosVagas
  );
}

/**
 * Hook para obter o currículo direcionado específico de uma vaga.
 */
export function useCurriculoVaga(vagaId: string): CurriculoVaga | null {
  const vagas = useCurriculosVagas();
  return vagas.find((c) => c.vagaId === vagaId) ?? null;
}

