import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requireOptionalNativeModule } from 'expo';
import { type ConversaCandidatura, type MensagemFeedback } from '@/data/feedback';

const DB_NAME = 'peia.db';
const KEY_PREFIX = 'peia:conversas:';

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
            CREATE TABLE IF NOT EXISTS conversas_candidaturas (
              id TEXT PRIMARY KEY,
              vagaId TEXT NOT NULL,
              usuarioId TEXT NOT NULL,
              dadosJson TEXT NOT NULL,
              atualizadoEm TEXT
            );
          `);

          isSQLiteAvailable = true;
        }
      } catch {
        sqliteDb = null;
        isSQLiteAvailable = false;
      }
    }
  }

  initialized = true;
}

export const feedbackService = {
  /**
   * Salva ou atualiza uma conversa de candidatura.
   */
  async salvarConversa(conversa: ConversaCandidatura): Promise<ConversaCandidatura> {
    await ensureInitialized();
    const json = JSON.stringify(conversa);
    const userId = conversa.usuarioId.trim().toLowerCase();

    if (isSQLiteAvailable && sqliteDb) {
      try {
        sqliteDb.runSync(
          `INSERT OR REPLACE INTO conversas_candidaturas (id, vagaId, usuarioId, dadosJson, atualizadoEm)
           VALUES (?, ?, ?, ?, ?);`,
          [conversa.id, conversa.vagaId, userId, json, conversa.atualizadoEm]
        );
      } catch {
        // Fallback
      }
    }

    try {
      const key = `${KEY_PREFIX}${userId}`;
      const stored = await AsyncStorage.getItem(key);
      const list: ConversaCandidatura[] = stored ? JSON.parse(stored) : [];
      const updated = list.filter((c) => c.id !== conversa.id);
      updated.unshift(conversa);
      await AsyncStorage.setItem(key, JSON.stringify(updated));
    } catch {
      // Ignora erro em background
    }

    return conversa;
  },

  /**
   * Lista todas as conversas e feedbacks de um estudante.
   */
  async listarConversas(usuarioId: string): Promise<ConversaCandidatura[]> {
    await ensureInitialized();
    const userId = usuarioId.trim().toLowerCase();

    if (isSQLiteAvailable && sqliteDb) {
      try {
        const rows = sqliteDb.getAllSync<{ dadosJson: string }>(
          'SELECT dadosJson FROM conversas_candidaturas WHERE usuarioId = ? ORDER BY atualizadoEm DESC;',
          [userId]
        );
        return rows.map((r) => JSON.parse(r.dadosJson));
      } catch {
        // Fallback
      }
    }

    try {
      const key = `${KEY_PREFIX}${userId}`;
      const stored = await AsyncStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Busca a conversa associada a uma vaga específica.
   */
  async obterPorVaga(vagaId: string, usuarioId: string): Promise<ConversaCandidatura | null> {
    await ensureInitialized();
    const userId = usuarioId.trim().toLowerCase();

    if (isSQLiteAvailable && sqliteDb) {
      try {
        const row = sqliteDb.getFirstSync<{ dadosJson: string }>(
          'SELECT dadosJson FROM conversas_candidaturas WHERE vagaId = ? AND usuarioId = ? LIMIT 1;',
          [vagaId, userId]
        );
        if (row?.dadosJson) {
          return JSON.parse(row.dadosJson);
        }
      } catch {
        // Fallback
      }
    }

    try {
      const list = await feedbackService.listarConversas(userId);
      return list.find((c) => c.vagaId === vagaId) ?? null;
    } catch {
      return null;
    }
  },
};

