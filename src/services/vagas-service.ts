import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requireOptionalNativeModule } from 'expo';
import { VAGAS, type Vaga } from '@/data/vagas';

const DB_NAME = 'peia.db';
const STORAGE_KEY = 'peia:sqlite_fallback_vagas';

let sqliteDb: import('expo-sqlite').SQLiteDatabase | null = null;
let isSQLiteAvailable = false;
let initialized = false;

/**
 * Inicializa o banco de dados (SQLite no app nativo com fallback transparente para AsyncStorage).
 */
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
            CREATE TABLE IF NOT EXISTS vagas (
              id TEXT PRIMARY KEY,
              titulo TEXT NOT NULL,
              empresa TEXT NOT NULL,
              cidade TEXT NOT NULL,
              area TEXT NOT NULL,
              modalidade TEXT NOT NULL,
              bolsa REAL NOT NULL,
              descricao TEXT NOT NULL,
              arquivada INTEGER DEFAULT 0,
              excluidaEm TEXT
            );
          `);

          // Seed inicial se a tabela estiver vazia
          const result = sqliteDb.getFirstSync<{ count: number }>(
            'SELECT COUNT(*) as count FROM vagas;'
          );

          if (!result || result.count === 0) {
            for (const v of VAGAS) {
              sqliteDb.runSync(
                `INSERT OR IGNORE INTO vagas (id, titulo, empresa, cidade, area, modalidade, bolsa, descricao, arquivada, excluidaEm)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                  v.id,
                  v.titulo,
                  v.empresa,
                  v.cidade,
                  v.area,
                  v.modalidade,
                  v.bolsa,
                  v.descricao,
                  v.arquivada ? 1 : 0,
                  v.excluidaEm ?? null,
                ]
              );
            }
          }

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

  // Fallback de persistência para quando SQLite não estiver linkado (ex: Expo Go padrão ou Web)
  if (!isSQLiteAvailable) {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(VAGAS));
      }
    } catch {
      // Ignora falhas de SSR
    }
  }

  initialized = true;
}

function parseVagaRow(row: any): Vaga {
  return {
    id: String(row.id),
    titulo: row.titulo,
    empresa: row.empresa,
    cidade: row.cidade,
    area: row.area,
    modalidade: row.modalidade,
    bolsa: Number(row.bolsa),
    descricao: row.descricao,
    arquivada: Boolean(row.arquivada),
    excluidaEm: row.excluidaEm || undefined,
  };
}

export const vagasService = {
  /**
   * Lista todas as vagas salvas no banco SQLite (ou fallback storage).
   */
  async listAll(): Promise<Vaga[]> {
    await ensureInitialized();

    if (isSQLiteAvailable && sqliteDb) {
      try {
        const rows = sqliteDb.getAllSync<any>('SELECT * FROM vagas ORDER BY CAST(id AS INTEGER) DESC, id DESC;');
        return rows.map(parseVagaRow);
      } catch {
        // Fallback silencioso
      }
    }

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [...VAGAS];
    } catch {
      return [...VAGAS];
    }
  },

  /**
   * Salva ou atualiza uma vaga no banco de dados.
   */
  async save(vaga: Vaga): Promise<Vaga> {
    await ensureInitialized();

    if (isSQLiteAvailable && sqliteDb) {
      try {
        sqliteDb.runSync(
          `INSERT OR REPLACE INTO vagas (id, titulo, empresa, cidade, area, modalidade, bolsa, descricao, arquivada, excluidaEm)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            vaga.id,
            vaga.titulo,
            vaga.empresa,
            vaga.cidade,
            vaga.area,
            vaga.modalidade,
            vaga.bolsa,
            vaga.descricao,
            vaga.arquivada ? 1 : 0,
            vaga.excluidaEm ?? null,
          ]
        );
        return vaga;
      } catch {
        // Fallback silencioso
      }
    }

    const list = await vagasService.listAll();
    const filtered = list.filter((v) => v.id !== vaga.id);
    filtered.unshift(vaga);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    return vaga;
  },

  /**
   * Cria uma nova vaga gerando ID único e persistindo no banco.
   */
  async create(dados: Omit<Vaga, 'id'>): Promise<Vaga> {
    const novaVaga: Vaga = {
      ...dados,
      id: Date.now().toString(),
    };
    return vagasService.save(novaVaga);
  },

  /**
   * Atualiza dados de uma vaga existente.
   */
  async update(id: string, changes: Partial<Vaga>): Promise<void> {
    await ensureInitialized();

    if (isSQLiteAvailable && sqliteDb) {
      try {
        const row = sqliteDb.getFirstSync<any>('SELECT * FROM vagas WHERE id = ? LIMIT 1;', [id]);
        if (row) {
          const atual: Vaga = parseVagaRow(row);
          const atualizada: Vaga = { ...atual, ...changes };
          await vagasService.save(atualizada);
          return;
        }
      } catch {
        // Fallback silencioso
      }
    }

    const list = await vagasService.listAll();
    const idx = list.findIndex((v) => v.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...changes };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  },

  /**
   * Arquiva ou desarquiva uma vaga.
   */
  async archive(id: string, arquivada: boolean): Promise<void> {
    return vagasService.update(id, { arquivada });
  },

  /**
   * Soft delete: marca a vaga com a data de exclusão.
   */
  async delete(id: string): Promise<void> {
    return vagasService.update(id, { excluidaEm: new Date().toISOString() });
  },
};
