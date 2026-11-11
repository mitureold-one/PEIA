import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import type { UserRole } from '@/data/user';
import { perfilActions } from '@/hooks/use-perfil';
import { userRoleActions, useUserRole } from '@/hooks/use-user-role';
import type { AlertState } from '@/components/ui/alert-modal';
import {
  formatPhone,
  validateEmail,
  validatePhone,
  validateRequired,
} from '@/utils/validators';

export interface FormErrors {
  name?: string;
  surname?: string;
  registerEmail?: string;
  registerPhone?: string;
  registerPassword?: string;
  loginEmail?: string;
  loginPassword?: string;
}

/**
 * Hook exclusivo para controle de formulário da tela de autenticação (UI / Form Controller).
 * Responsabilidade: gerenciar estados de campos, formatação e validação visual de entradas.
 * As operações de domínio e persistência são delegadas para o hook `useAuth`.
 */
export function useAuthForm(isSignUp: boolean) {
  const router = useRouter();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    variant: 'error',
    title: '',
    message: '',
  });

  const [onAlertCloseCallback, setOnAlertCloseCallback] = useState<(() => void) | null>(null);

  // Estados de Cadastro
  const [role, setRole] = useState<UserRole>('aluno');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Estados de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const userRole = useUserRole();

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    clearFieldError('name');
  };

  const handleSurnameChange = (val: string) => {
    setSurname(val);
    clearFieldError('surname');
  };

  const handleRegisterEmailChange = (val: string) => {
    setRegisterEmail(val);
    clearFieldError('registerEmail');
  };

  const handleRegisterPhoneChange = (val: string) => {
    const formatted = formatPhone(val);
    setRegisterPhone(formatted);
    clearFieldError('registerPhone');
  };

  const handleRegisterPasswordChange = (val: string) => {
    setRegisterPassword(val);
    clearFieldError('registerPassword');
  };

  const handleLoginEmailChange = (val: string) => {
    setLoginEmail(val);
    clearFieldError('loginEmail');
  };

  const handleLoginPasswordChange = (val: string) => {
    setLoginPassword(val);
    clearFieldError('loginPassword');
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowRegisterPassword = () => setShowRegisterPassword((prev) => !prev);

  const validateSignUp = (): boolean => {
    const newErrors: FormErrors = {};

    if (!validateRequired(name)) {
      newErrors.name = 'Nome é obrigatório.';
    }

    if (!validateRequired(surname)) {
      newErrors.surname = 'Sobrenome é obrigatório.';
    }

    const cleanEmail = registerEmail.trim();
    if (!validateRequired(cleanEmail)) {
      newErrors.registerEmail = 'E-mail é obrigatório.';
    } else if (!validateEmail(cleanEmail)) {
      newErrors.registerEmail = 'Informe um e-mail com domínio válido.';
    }

    if (!validateRequired(registerPhone)) {
      newErrors.registerPhone = 'Telefone é obrigatório.';
    } else if (!validatePhone(registerPhone)) {
      newErrors.registerPhone = 'Informe um telefone válido com DDD.';
    }

    if (!validateRequired(registerPassword)) {
      newErrors.registerPassword = 'Senha é obrigatória.';
    } else if (registerPassword.length < 6) {
      newErrors.registerPassword = 'A senha deve ter pelo menos 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = (): boolean => {
    const newErrors: FormErrors = {};
    const cleanEmail = loginEmail.trim();

    if (!validateRequired(cleanEmail)) {
      newErrors.loginEmail = 'E-mail é obrigatório.';
    } else if (!validateEmail(cleanEmail)) {
      newErrors.loginEmail = 'Informe um e-mail com domínio válido.';
    }

    if (!validateRequired(loginPassword)) {
      newErrors.loginPassword = 'Senha é obrigatória.';
    } else if (loginPassword.length < 4) {
      newErrors.loginPassword = 'A senha deve ter no mínimo 4 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showAlert = (
    variant: AlertState['variant'],
    title: string,
    message: string,
    onCloseCallback?: () => void
  ) => {
    setOnAlertCloseCallback(() => onCloseCallback ?? null);
    setAlert({ visible: true, variant, title, message });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
    if (onAlertCloseCallback) {
      const cb = onAlertCloseCallback;
      setOnAlertCloseCallback(null);
      cb();
    }
  };

  const handleSubmit = async () => {
    if (isSignUp) {
      if (!validateSignUp()) {
        return;
      }

      setLoading(true);
      try {
        const savedUser = await auth.signUp({
          name: name.trim(),
          surname: surname.trim(),
          email: registerEmail.trim(),
          phone: registerPhone.trim(),
          password: registerPassword,
          role,
        });

        userRoleActions.definir(role === 'aluno' ? 'estudante' : role === 'empresa' ? 'empresa' : 'coordenacao');

        showAlert(
          'success',
          'Conta criada!',
          `Bem-vindo(a) ao PEIA, ${savedUser.name}! Seu cadastro foi salvo no banco local.`,
          () => {
            router.replace(ROUTES.HOME);
          }
        );
      } catch (err: any) {
        const errorMsg = err?.message || 'Não foi possível concluir o cadastro. Tente novamente.';
        showAlert('error', 'Erro no cadastro', errorMsg);
      } finally {
        setLoading(false);
      }
    } else {
      if (!validateLogin()) {
        return;
      }

      setLoading(true);
      try {
        const loggedUser = await auth.signIn(loginEmail, loginPassword);
        const targetRole =
          loggedUser.role === 'aluno'
            ? 'estudante'
            : loggedUser.role === 'empresa'
            ? 'empresa'
            : 'coordenacao';
        userRoleActions.definir(targetRole);
        if (targetRole === 'coordenacao') {
          router.replace(ROUTES.COMPANIES);
        } else {
          router.replace(ROUTES.HOME);
        }
      } catch (err: any) {
        const errorMsg = err?.message || 'Falha ao autenticar. Tente novamente.';
        showAlert('error', 'Erro no login', errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    loading: loading || auth.loading,
    showPassword,
    showRegisterPassword,
    toggleShowPassword,
    toggleShowRegisterPassword,
    errors,
    alert,
    closeAlert,
    // Campos de Cadastro
    role,
    setRole,
    name,
    surname,
    registerEmail,
    registerPhone,
    registerPassword,
    setName: handleNameChange,
    setSurname: handleSurnameChange,
    setRegisterEmail: handleRegisterEmailChange,
    setRegisterPhone: handleRegisterPhoneChange,
    setRegisterPassword: handleRegisterPasswordChange,
    // Campos de Login
    loginEmail,
    loginPassword,
    userRole,
    setUserRole: userRoleActions.definir,
    setLoginEmail: handleLoginEmailChange,
    setLoginPassword: handleLoginPasswordChange,
    // Ação do formulário
    handleSubmit,
  };
}
