export type UserRole = 'aluno' | 'empresa' | 'admin' | 'superadmin';

export interface UserProps {
  id?: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  password?: string;
  token?: string;
  role?: UserRole;
  avatar?: string;
  createdAt?: string;
}

/**
 * Entidade de domínio unificada que representa o Usuário no sistema.
 * Suporta separação de personas (Aluno, Empresa, Administrador, Super Administrador).
 */
export class User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  password?: string;
  token?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;

  constructor(props: UserProps) {
    this.id = props.id || String(Date.now()).slice(-6);
    this.name = props.name.trim();
    this.surname = props.surname.trim();
    this.email = props.email.trim().toLowerCase();
    this.phone = props.phone?.trim() ?? '';
    this.password = props.password ?? '';
    this.token = props.token || (Math.random().toString(36).substring(2) + Date.now().toString(36));
    this.role = props.role ?? 'aluno';
    this.avatar = props.avatar;
    this.createdAt = props.createdAt || new Date().toISOString();
  }

  /**
   * Factory method para criar uma nova entidade User.
   */
  static create(props: {
    name: string;
    surname: string;
    email: string;
    phone?: string;
    password?: string;
    role?: UserRole;
    avatar?: string;
  }): User {
    return new User(props);
  }

  get fullName(): string {
    return `${this.name} ${this.surname}`.trim();
  }

  get isAluno(): boolean {
    return this.role === 'aluno';
  }

  get isEmpresa(): boolean {
    return this.role === 'empresa';
  }

  get isAdmin(): boolean {
    return this.role === 'admin' || this.role === 'superadmin';
  }

  get isSuperAdmin(): boolean {
    return this.role === 'superadmin';
  }

  get roleLabel(): string {
    switch (this.role) {
      case 'aluno':
        return 'Aluno';
      case 'empresa':
        return 'Empresa';
      case 'admin':
        return 'Administrador';
      case 'superadmin':
        return 'Super Administrador';
      default:
        return 'Aluno';
    }
  }
}

// Mantém compatibilidade com o tipo em minúsculo
export type user = User;

export const userList: User[] = [
  new User({
    id: '001',
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@aluno.undb.edu.br',
    phone: '(98) 98888-0001',
    token: 'token_aluno_123',
    password: 'password123',
    role: 'aluno',
    createdAt: new Date().toISOString(),
  }),
  new User({
    id: '002',
    name: 'Tech',
    surname: 'Corp',
    email: 'recrutamento@techcorp.com.br',
    phone: '(98) 98888-0002',
    token: 'token_empresa_123',
    password: 'password123',
    role: 'empresa',
    createdAt: new Date().toISOString(),
  }),
  new User({
    id: '003',
    name: 'Admin',
    surname: 'UNDB',
    email: 'admin@undb.edu.br',
    phone: '(98) 98888-0003',
    token: 'token_admin_123',
    password: 'password123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  }),
  new User({
    id: '004',
    name: 'Super',
    surname: 'Admin',
    email: 'root@peia.edu.br',
    phone: '(98) 98888-0004',
    token: 'token_superadmin_123',
    password: 'password123',
    role: 'superadmin',
    createdAt: new Date().toISOString(),
  }),
];
