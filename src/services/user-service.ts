import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requireOptionalNativeModule } from 'expo';
import { userList, User, Aluno, type UserRole } from '@/data/user';

const DB_NAME = 'peia.db';
const STORAGE_KEY = 'peia:sqlite_fallback_users';

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
            CREATE TABLE IF NOT EXISTS users (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              surname TEXT,
              email TEXT NOT NULL UNIQUE,
              phone TEXT,
              password TEXT,
              token TEXT,
              role TEXT NOT NULL DEFAULT 'aluno',
              createdAt TEXT
            );
          `);

          try {
            sqliteDb.execSync(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'aluno';`);
          } catch {
            // Coluna role já existe
          }

          try {
            sqliteDb.execSync(`ALTER TABLE users ADD COLUMN avatar TEXT;`);
          } catch {
            // Coluna avatar já existe
          }

          try {
            sqliteDb.execSync(`ALTER TABLE users ADD COLUMN cargo TEXT;`);
          } catch {
            // Coluna cargo já existe
          }

          try {
            sqliteDb.execSync(`ALTER TABLE users ADD COLUMN instituicao TEXT;`);
          } catch {
            // Coluna instituicao já existe
          }

          try {
            sqliteDb.execSync(`ALTER TABLE users ADD COLUMN curso TEXT;`);
          } catch {
            // Coluna curso já existe
          }

          try {
            sqliteDb.execSync(`ALTER TABLE users ADD COLUMN abertoOportunidades INTEGER DEFAULT 1;`);
          } catch {
            // Coluna abertoOportunidades já existe
          }

          const result = sqliteDb.getFirstSync<{ count: number }>(
            'SELECT COUNT(*) as count FROM users;'
          );

          if (!result || result.count === 0) {
            for (const u of userList) {
              sqliteDb.runSync(
                `INSERT OR IGNORE INTO users (id, name, surname, email, phone, password, token, role, createdAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                  u.id,
                  u.name,
                  u.surname ?? '',
                  u.email,
                  u.phone ?? '',
                  u.password ?? '',
                  u.token ?? '',
                  u.role ?? 'aluno',
                  u.createdAt ?? new Date().toISOString(),
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
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userList));
      }
    } catch {
      // Ignora falhas de SSR
    }
  }

  initialized = true;
}

function mapRowToUser(row: any): User {
  if (row.role === 'aluno') {
    return new Aluno({
      ...row,
      abertoOportunidades:
        row.abertoOportunidades === 1 ||
        row.abertoOportunidades === true ||
        row.abertoOportunidades === undefined,
    });
  }
  return new User(row);
}

export const userService = {
  /**
   * Salva ou atualiza uma entidade User na camada de persistência.
   */
  async save(user: User): Promise<User> {
    await ensureInitialized();

    const normalizedEmail = user.email.trim().toLowerCase();

    // Valida se já existe outro usuário cadastrado com esse e-mail
    const existing = await userService.findByEmail(normalizedEmail);
    if (existing && existing.id !== user.id) {
      throw new Error('Já existe um usuário cadastrado com este e-mail institucional.');
    }

    const aluno = user instanceof Aluno ? user : null;
    const cargo = aluno?.cargo ?? (user as any).cargo ?? null;
    const instituicao = aluno?.instituicao ?? (user as any).instituicao ?? null;
    const curso = aluno?.curso ?? (user as any).curso ?? null;
    const abertoOportunidades =
      aluno?.abertoOportunidades ?? (user as any).abertoOportunidades ?? true;

    if (isSQLiteAvailable && sqliteDb) {
      try {
        sqliteDb.runSync(
          `INSERT OR REPLACE INTO users (id, name, surname, email, phone, password, token, role, avatar, cargo, instituicao, curso, abertoOportunidades, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            user.id,
            user.name,
            user.surname,
            user.email,
            user.phone ?? '',
            user.password ?? '',
            user.token ?? '',
            user.role ?? 'aluno',
            user.avatar ?? null,
            cargo,
            instituicao,
            curso,
            abertoOportunidades ? 1 : 0,
            user.createdAt,
          ]
        );
        return user;
      } catch {
        // Fallback para AsyncStorage
      }
    }

    const list = await userService.listAll();
    const filtered = list.filter((u) => u.id !== user.id);
    filtered.push(user);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    return user;
  },

  /**
   * Registra um novo usuário a partir de dados brutos (instancia o User e salva).
   */
  async register(data: {
    name: string;
    surname: string;
    email: string;
    phone?: string;
    password?: string;
    role?: UserRole;
  }): Promise<User> {
    const newUser = User.create(data);
    return userService.save(newUser);
  },

  /**
   * Busca um usuário pelo e-mail institucional.
   */
  async findByEmail(email: string): Promise<User | null> {
    await ensureInitialized();
    const normalized = email.trim().toLowerCase();

    if (isSQLiteAvailable && sqliteDb) {
      try {
        const row = sqliteDb.getFirstSync<any>(
          'SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1;',
          [normalized]
        );
        return row ? mapRowToUser(row) : null;
      } catch {
        // Fallback para AsyncStorage
      }
    }

    const list = await userService.listAll();
    const match = list.find((u) => u.email.toLowerCase() === normalized);
    return match ? match : null;
  },

  /**
   * Busca um usuário pelo ID / Matrícula.
   */
  async findById(id: string): Promise<User | null> {
    await ensureInitialized();
    const trimmedId = id.trim();

    if (isSQLiteAvailable && sqliteDb) {
      try {
        const row = sqliteDb.getFirstSync<any>(
          'SELECT * FROM users WHERE id = ? LIMIT 1;',
          [trimmedId]
        );
        return row ? mapRowToUser(row) : null;
      } catch {
        // Fallback para AsyncStorage
      }
    }

    const list = await userService.listAll();
    const match = list.find((u) => u.id === trimmedId);
    return match ? match : null;
  },

  /**
   * Lista todos os usuários cadastrados.
   */
  async listAll(): Promise<User[]> {
    await ensureInitialized();

    if (isSQLiteAvailable && sqliteDb) {
      try {
        const rows = sqliteDb.getAllSync<any>('SELECT * FROM users ORDER BY createdAt DESC;');
        return rows.map((r) => mapRowToUser(r));
      } catch {
        // Fallback para AsyncStorage
      }
    }

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const rawList = stored ? JSON.parse(stored) : [...userList];
      return rawList.map((r: any) => mapRowToUser(r));
    } catch {
      return [...userList];
    }
  },
};
