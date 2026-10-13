import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/constants/routes';
import { perfilActions } from '@/hooks/use-perfil';
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
  loginEmail?: string;
  loginPassword?: string;
}

export function useAuthForm(isSignUp: boolean) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    variant: 'error',
    title: '',
    message: '',
  });

  // Estados de Cadastro
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');

  // Estados de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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

  const handleLoginEmailChange = (val: string) => {
    setLoginEmail(val);
    clearFieldError('loginEmail');
  };

  const handleLoginPasswordChange = (val: string) => {
    setLoginPassword(val);
    clearFieldError('loginPassword');
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const validateSignUp = (): boolean => {
    const newErrors: FormErrors = {};

    if (!validateRequired(name)) {
      newErrors.name = 'Nome é obrigatório.';
    }

    if (!validateRequired(surname)) {
      newErrors.surname = 'Sobrenome é obrigatório.';
    }

    if (!validateRequired(registerEmail)) {
      newErrors.registerEmail = 'E-mail é obrigatório.';
    } else if (!validateEmail(registerEmail)) {
      newErrors.registerEmail = 'Informe um e-mail com domínio válido.';
    }

    if (!validateRequired(registerPhone)) {
      newErrors.registerPhone = 'Telefone é obrigatório.';
    } else if (!validatePhone(registerPhone)) {
      newErrors.registerPhone = 'Informe um telefone válido com DDD.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = (): boolean => {
    const newErrors: FormErrors = {};

    if (!validateRequired(loginEmail)) {
      newErrors.loginEmail = 'E-mail é obrigatório.';
    } else if (!validateEmail(loginEmail)) {
      newErrors.loginEmail = 'Informe um e-mail com domínio válido.';
    }

    if (!validateRequired(loginPassword)) {
      newErrors.loginPassword = 'Senha é obrigatória.';
    } else if (loginPassword.length < 6) {
      newErrors.loginPassword = 'A senha deve ter no mínimo 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showAlert = (variant: AlertState['variant'], title: string, message: string) =>
    setAlert({ visible: true, variant, title, message });
  const closeAlert = () => setAlert((prev) => ({ ...prev, visible: false }));

  const handleSubmit = async () => {
    if (isSignUp) {
      if (!validateSignUp()) {
        showAlert('error', 'Campos inválidos', 'Por favor, corrija os erros destacados no formulário.');
        return;
      }

      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        perfilActions.criar({ name, surname, email: registerEmail, phone: registerPhone });
        showAlert('success', 'Cadastro realizado!', `Bem-vindo(a) ao PEIA, ${name}!`);
      } catch {
        showAlert('error', 'Erro', 'Não foi possível concluir o cadastro. Tente novamente.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!validateLogin()) {
        showAlert('error', 'Campos inválidos', 'Por favor, corrija os erros destacados no formulário.');
        return;
      }

      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.replace(ROUTES.HOME);
      } catch {
        showAlert('error', 'Erro', 'Não foi possível realizar o login. Verifique seus dados.');
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    loading,
    showPassword,
    toggleShowPassword,
    errors,
    alert,
    closeAlert,
    // Cadastro
    name,
    surname,
    registerEmail,
    registerPhone,
    setName: handleNameChange,
    setSurname: handleSurnameChange,
    setRegisterEmail: handleRegisterEmailChange,
    setRegisterPhone: handleRegisterPhoneChange,
    // Login
    loginEmail,
    loginPassword,
    setLoginEmail: handleLoginEmailChange,
    setLoginPassword: handleLoginPasswordChange,
    // Ações
    handleSubmit,
  };
}
