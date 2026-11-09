import { useState } from 'react';
import { User, type UserRole } from '@/data/user';
import { userService } from '@/services/user-service';
import { perfilActions } from '@/hooks/use-perfil';

export interface SignUpInput {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  password?: string;
  role?: UserRole;
}

/**
 * Hook de caso de uso de autenticação.
 * Orquestra o ciclo de vida do usuário: recebe dados da UI, instancia a entidade de domínio User,
 * delega a persistência ao userService e sincroniza a sessão global com respectiva persona/role.
 */
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Transforma os dados do formulário na entidade de domínio User e persiste no banco SQLite.
   */
  const signUp = async (data: SignUpInput): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      // 1. Instanciação da entidade de domínio User com regras de negócio e role
      const newUser = User.create({
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role ?? 'aluno',
      });

      // 2. Persistência na camada de dados (SQLite)
      const savedUser = await userService.save(newUser);

      // 3. Atualização do estado global de perfil da sessão ativa
      perfilActions.criar({
        name: savedUser.name,
        surname: savedUser.surname,
        email: savedUser.email,
        phone: savedUser.phone ?? '',
        role: savedUser.role,
      });

      return savedUser;
    } catch (err: any) {
      const msg = err?.message || 'Erro ao realizar cadastro';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza login autenticando o usuário contra o banco local ou inicializando uma sessão válida.
   */
  const signIn = async (email: string, password?: string): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await userService.findByEmail(normalizedEmail);

      let userToLog: User;

      if (existingUser) {
        userToLog = existingUser;
      } else {
        // Fallback para e-mails novos testados no login (simulação mock)
        const extractedName = normalizedEmail.includes('@')
          ? normalizedEmail.split('@')[0]
          : normalizedEmail;

        userToLog = User.create({
          name: extractedName || 'Estudante',
          surname: 'PEIA',
          email: normalizedEmail,
          phone: '(98) 99999-9999',
          password: password ?? '',
          role: 'aluno',
        });

        await userService.save(userToLog);
      }

      perfilActions.criar({
        name: userToLog.name,
        surname: userToLog.surname,
        email: userToLog.email,
        phone: userToLog.phone ?? '',
        role: userToLog.role,
      });

      return userToLog;
    } catch (err: any) {
      const msg = err?.message || 'Erro ao realizar login';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Encerra a sessão ativa do usuário.
   */
  const signOut = () => {
    perfilActions.excluir();
  };

  return {
    signUp,
    signIn,
    signOut,
    loading,
    error,
  };
}
