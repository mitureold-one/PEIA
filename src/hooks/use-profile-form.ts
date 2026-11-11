import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/constants/routes';
import { perfilActions, usePerfil, type Perfil } from '@/hooks/use-perfil';
import { userService } from '@/services/user-service';
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

  const handleAvatarChange = async (uri: string) => {
    setDados((prev) => ({ ...prev, avatar: uri }));
    if (perfil) {
      perfilActions.editar({
        ...perfil,
        avatar: uri,
      });

      // Persistência resiliente no banco SQLite / AsyncStorage do userService
      try {
        const user = await userService.findByEmail(perfil.email);
        if (user) {
          user.avatar = uri;
          await userService.save(user);
        }
      } catch {
        // Silencioso se der erro na persistência SQLite em background
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setDados((prev) => ({ ...prev, avatar: undefined }));
    if (perfil) {
      perfilActions.editar({
        ...perfil,
        avatar: undefined,
      });

      // Persistência resiliente no banco SQLite / AsyncStorage do userService
      try {
        const user = await userService.findByEmail(perfil.email);
        if (user) {
          user.avatar = undefined;
          await userService.save(user);
        }
      } catch {
        // Silencioso se der erro na persistência SQLite em background
      }
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

    const trimmedName = dados.name.trim();
    const trimmedSurname = dados.surname.trim();
    const trimmedEmail = dados.email.trim();
    const trimmedPhone = dados.phone.trim();

    perfilActions.editar({
      name: trimmedName,
      surname: trimmedSurname,
      email: trimmedEmail,
      phone: trimmedPhone,
      avatar: dados.avatar,
      role: perfil?.role,
    });

    // Persistência no SQLite / UserService
    try {
      const emailToLookup = perfil?.email || trimmedEmail;
      const user = await userService.findByEmail(emailToLookup);
      if (user) {
        user.name = trimmedName;
        user.surname = trimmedSurname;
        user.phone = trimmedPhone;
        user.avatar = dados.avatar;
        await userService.save(user);
      }
    } catch {
      // Silencioso em caso de erro na camada do SQLite
    }

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

