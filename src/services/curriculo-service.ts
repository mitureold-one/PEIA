import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requireOptionalNativeModule } from 'expo';
import {
  type CurriculoGeral,
  type CurriculoVaga,
  type CurriculoLegado,
  criarCurriculoGeralVazio,
  converterLegadoParaCurriculoGeral,
  converterCurriculoGeralParaLegado,
  MOCK_CURRICULO_GERAL,
} from '@/data/curriculo';

const DB_NAME = 'peia.db';
const LEGACY_STORAGE_KEY = 'peia:resume';
const KEY_PREFIX_GERAL = 'peia:curriculo_geral:';
const KEY_PREFIX_VAGAS = 'peia:curriculos_vagas:';

let sqliteDb: import('expo-sqlite').SQLiteDatabase | null = null;
let isSQLiteAvailable = false;
let initialized = false;

async function ensureInitialized() {
  if (initialized) return;

  if (Platform.OS !== 'web') {
    const hasNativeSQLite = Boolean(requireOptionalNativeModule('ExpoSQLite'));

    if (hasNativeSQLite) {
      try {
        const SQLite = require('expo-sqlite');
        if (!sqliteDb && SQLite?.openDatabaseSync) {
          sqliteDb = SQLite.openDatabaseSync(DB_NAME);
        }

        if (sqliteDb) {
          sqliteDb.execSync(`
            CREATE TABLE IF NOT EXISTS curriculos_gerais (
              usuarioId TEXT PRIMARY KEY,
              dadosJson TEXT NOT NULL,
              atualizadoEm TEXT
            );

            CREATE TABLE IF NOT EXISTS curriculos_vagas (
              id TEXT PRIMARY KEY,
              vagaId TEXT NOT NULL,
              usuarioId TEXT NOT NULL,
              dadosJson TEXT NOT NULL,
              dataEnvio TEXT
            );
          `);

          isSQLiteAvailable = true;
        }
      } catch {
        sqliteDb = null;
        isSQLiteAvailable = false;
      }
    } else {
      sqliteDb = null;
      isSQLiteAvailable = false;
    }
  }

  initialized = true;
}

export const curriculoService = {
  /**
   * Obtém o Currículo Geral de um estudante pelo seu identificador (id ou e-mail).
   * Caso não exista, tenta migrar do formato legado ou inicializa uma estrutura padrão.
   */
  async obterCurriculoGeral(usuarioId: string, contatoPadrao?: any): Promise<CurriculoGeral> {
    await ensureInitialized();
    const idNormalizado = usuarioId.trim().toLowerCase();

    // 1. Tenta carregar do SQLite
    if (isSQLiteAvailable && sqliteDb) {
      try {
        const row = sqliteDb.getFirstSync<{ dadosJson: string }>(
          'SELECT dadosJson FROM curriculos_gerais WHERE usuarioId = ? LIMIT 1;',
          [idNormalizado]
        );
        if (row?.dadosJson) {
          return JSON.parse(row.dadosJson);
        }
      } catch {
        // Fallback para AsyncStorage
      }
    }

    // 2. Tenta carregar do AsyncStorage
    try {
      const stored = await AsyncStorage.getItem(`${KEY_PREFIX_GERAL}${idNormalizado}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignora falhas de parse
    }

    // 3. Verifica se existe currículo legado simples ('peia:resume') para migrar
    try {
      const legacyRaw = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacy: Partial<CurriculoLegado> = JSON.parse(legacyRaw);
        if (legacy.summary || legacy.education || legacy.experience || legacy.skills) {
          const migrado = converterLegadoParaCurriculoGeral(legacy, idNormalizado, {
            nomeCompleto: contatoPadrao ? `${contatoPadrao.name || ''} ${contatoPadrao.surname || ''}`.trim() : '',
            email: contatoPadrao?.email || idNormalizado,
            telefone: contatoPadrao?.phone || '',
          });
          await curriculoService.salvarCurriculoGeral(migrado);
          return migrado;
        }
      }
    } catch {
      // Sem legado válido
    }

    // 4. Se for o usuário de demonstração padrão (John Doe), carrega o mock preenchido
    if (idNormalizado.includes('john') || idNormalizado.includes('001')) {
      const inicial = { ...MOCK_CURRICULO_GERAL, usuarioId: idNormalizado };
      await curriculoService.salvarCurriculoGeral(inicial);
      return inicial;
    }

    // 5. Retorna uma estrutura em branco
    const vazio = criarCurriculoGeralVazio(idNormalizado, {
      nomeCompleto: contatoPadrao ? `${contatoPadrao.name || ''} ${contatoPadrao.surname || ''}`.trim() : '',
      email: contatoPadrao?.email || idNormalizado,
      telefone: contatoPadrao?.phone || '',
    });
    await curriculoService.salvarCurriculoGeral(vazio);
    return vazio;
  },

  /**
   * Salva o Currículo Geral completo de um estudante.
   */
  async salvarCurriculoGeral(curriculo: CurriculoGeral): Promise<CurriculoGeral> {
    await ensureInitialized();
    const idNormalizado = curriculo.usuarioId.trim().toLowerCase();
    const atualizado: CurriculoGeral = {
      ...curriculo,
      usuarioId: idNormalizado,
      atualizadoEm: new Date().toISOString(),
    };
    const json = JSON.stringify(atualizado);

    if (isSQLiteAvailable && sqliteDb) {
      try {
        sqliteDb.runSync(
          `INSERT OR REPLACE INTO curriculos_gerais (usuarioId, dadosJson, atualizadoEm)
           VALUES (?, ?, ?);`,
          [idNormalizado, json, atualizado.atualizadoEm]
        );
      } catch {
        // Fallback para AsyncStorage
      }
    }

    // Persiste também no AsyncStorage para resiliência e espelha formato legado para compatibilidade retroativa
    try {
      await AsyncStorage.setItem(`${KEY_PREFIX_GERAL}${idNormalizado}`, json);
      const legado = converterCurriculoGeralParaLegado(atualizado);
      await AsyncStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(legado));
    } catch {
      // Ignora erro de persistência em background
    }

    return atualizado;
  },

  /**
   * Salva um Currículo Direcionado enviado para uma vaga específica.
   */
  async salvarCurriculoVaga(curriculo: CurriculoVaga): Promise<CurriculoVaga> {
    await ensureInitialized();
    const json = JSON.stringify(curriculo);

    if (isSQLiteAvailable && sqliteDb) {
      try {
        sqliteDb.runSync(
          `INSERT OR REPLACE INTO curriculos_vagas (id, vagaId, usuarioId, dadosJson, dataEnvio)
           VALUES (?, ?, ?, ?, ?);`,
          [curriculo.id, curriculo.vagaId, curriculo.usuarioId.toLowerCase(), json, curriculo.dataEnvio]
        );
      } catch {
        // Fallback
      }
    }

    try {
      const key = `${KEY_PREFIX_VAGAS}${curriculo.usuarioId.toLowerCase()}`;
      const stored = await AsyncStorage.getItem(key);
      const list: CurriculoVaga[] = stored ? JSON.parse(stored) : [];
      const updatedList = list.filter((c) => c.vagaId !== curriculo.vagaId);
      updatedList.push(curriculo);
      await AsyncStorage.setItem(key, JSON.stringify(updatedList));
    } catch {
      // Ignora erro em background
    }

    return curriculo;
  },

  /**
   * Busca o currículo direcionado enviado para uma vaga específica.
   */
  async obterCurriculoVaga(vagaId: string, usuarioId: string): Promise<CurriculoVaga | null> {
    await ensureInitialized();
    const idNormalizado = usuarioId.trim().toLowerCase();

    if (isSQLiteAvailable && sqliteDb) {
      try {
        const row = sqliteDb.getFirstSync<{ dadosJson: string }>(
          'SELECT dadosJson FROM curriculos_vagas WHERE vagaId = ? AND usuarioId = ? LIMIT 1;',
          [vagaId, idNormalizado]
        );
        if (row?.dadosJson) {
          return JSON.parse(row.dadosJson);
        }
      } catch {
        // Fallback
      }
    }

    try {
      const key = `${KEY_PREFIX_VAGAS}${idNormalizado}`;
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const list: CurriculoVaga[] = JSON.parse(stored);
        return list.find((c) => c.vagaId === vagaId) ?? null;
      }
    } catch {
      // Ignora
    }

    return null;
  },

  /**
   * Lista todos os currículos direcionados enviados pelo aluno.
   */
  async listarCurriculosVagas(usuarioId: string): Promise<CurriculoVaga[]> {
    await ensureInitialized();
    const idNormalizado = usuarioId.trim().toLowerCase();

    if (isSQLiteAvailable && sqliteDb) {
      try {
        const rows = sqliteDb.getAllSync<{ dadosJson: string }>(
          'SELECT dadosJson FROM curriculos_vagas WHERE usuarioId = ? ORDER BY dataEnvio DESC;',
          [idNormalizado]
        );
        return rows.map((r) => JSON.parse(r.dadosJson));
      } catch {
        // Fallback
      }
    }

    try {
      const key = `${KEY_PREFIX_VAGAS}${idNormalizado}`;
      const stored = await AsyncStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Remove o currículo direcionado caso o aluno cancele a candidatura.
   */
  async removerCurriculoVaga(vagaId: string, usuarioId: string): Promise<void> {
    await ensureInitialized();
    const idNormalizado = usuarioId.trim().toLowerCase();

    if (isSQLiteAvailable && sqliteDb) {
      try {
        sqliteDb.runSync(
          'DELETE FROM curriculos_vagas WHERE vagaId = ? AND usuarioId = ?;',
          [vagaId, idNormalizado]
        );
      } catch {
        // Fallback
      }
    }

    try {
      const key = `${KEY_PREFIX_VAGAS}${idNormalizado}`;
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const list: CurriculoVaga[] = JSON.parse(stored);
        const filtrado = list.filter((c) => c.vagaId !== vagaId);
        await AsyncStorage.setItem(key, JSON.stringify(filtrado));
      }
    } catch {
      // Ignora
    }
  },
};

