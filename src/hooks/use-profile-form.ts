import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/constants/routes';
import { perfilActions, usePerfil, type Perfil } from '@/hooks/use-perfil';
import { formatPhone, validateEmail, validatePhone, validateRequired } from '@/utils/validators';

export interface ProfileFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  avatar?: string;
}

export type ProfileFormErrors = Partial<Record<keyof ProfileFormData, string>>;

const INITIAL_FORM: ProfileFormData = {
  name: '',
  surname: '',
  email: '',
  phone: '',
  avatar: undefined,
};

export function useProfileForm() {
  const router = useRouter();
  const perfil = usePerfil();

  const [dados, setDados] = useState<ProfileFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [saved, setSaved] = useState(false);

  // Sincroniza formulário quando o perfil reativo carrega ou muda
  useEffect(() => {
    if (perfil) {
      setDados({
        name: perfil.name ?? '',
        surname: perfil.surname ?? '',
        email: perfil.email ?? '',
        phone: perfil.phone ?? '',
        avatar: perfil.avatar,
      });
    }
  }, [perfil]);

  const handleChange = (field: keyof ProfileFormData) => (value: string) => {
    const formatted = field === 'phone' ? formatPhone(value) : value;
    setDados((prev) => ({ ...prev, [field]: formatted }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSaved(false);
  };

  const handleAvatarChange = (uri: string) => {
    setDados((prev) => ({ ...prev, avatar: uri }));
    if (perfil) {
      perfilActions.editar({
        ...perfil,
        avatar: uri,
      });
    }
  };

  const handleRemoveAvatar = () => {
    setDados((prev) => ({ ...prev, avatar: undefined }));
    if (perfil) {
      perfilActions.editar({
        ...perfil,
        avatar: undefined,
      });
    }
  };

  const save = async (): Promise<boolean> => {
    const newErrors: ProfileFormErrors = {};
    if (!validateRequired(dados.name)) newErrors.name = 'Nome é obrigatório.';
    if (!validateRequired(dados.surname)) newErrors.surname = 'Sobrenome é obrigatório.';
    if (!validateEmail(dados.email)) newErrors.email = 'Informe um e-mail válido.';
    if (!validatePhone(dados.phone)) newErrors.phone = 'Informe um telefone válido com DDD.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return false;

    perfilActions.editar({
      name: dados.name.trim(),
      surname: dados.surname.trim(),
      email: dados.email.trim(),
      phone: dados.phone.trim(),
      avatar: dados.avatar,
      role: perfil?.role,
    });

    setSaved(true);
    return true;
  };

  const confirmarExclusao = () => {
    Alert.alert(
      'Excluir perfil',
      'Deseja excluir seu perfil? Você será desconectado.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            perfilActions.excluir();
            router.replace(ROUTES.AUTH);
          },
        },
      ]
    );
  };

  return {
    perfil,
    dados,
    errors,
    saved,
    handleChange,
    handleAvatarChange,
    handleRemoveAvatar,
    save,
    confirmarExclusao,
  };
}

