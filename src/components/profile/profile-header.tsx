import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Perfil } from '@/hooks/use-perfil';
import { type UserRole } from '@/data/user';
import { ProfileAvatar } from '@/components/profile/profile-avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type ProfileFormData, type ProfileFormErrors } from '@/hooks/use-profile-form';

interface ProfileHeaderProps {
  perfil: Perfil | null;
  role: 'estudante' | 'empresa' | 'coordenacao';
  onUpdateAvatar?: (uri: string) => void;
  onRemoveAvatar?: () => void;
  // Dados e ações de formulário da classe User reunidos no menu
  dados: ProfileFormData;
  errors: ProfileFormErrors;
  saved: boolean;
  onChangeField: (field: keyof ProfileFormData) => (value: string) => void;
  onSave: () => void;
}

export function ProfileHeader({
  perfil,
  role,
  onUpdateAvatar = () => {},
  onRemoveAvatar = () => {},
  dados,
  errors,
  saved,
  onChangeField,
  onSave,
}: ProfileHeaderProps) {
  const [menuAberto, setMenuAberto] = useState(false);

  const getRoleLabel = (r?: UserRole) => {
    switch (r) {
      case 'superadmin':
        return 'Super Admin';
      case 'admin':
        return 'Administrador';
      case 'empresa':
        return 'Empresa';
      case 'aluno':
      default:
        return 'Aluno';
    }
  };

  const getSubtitle = () => {
    switch (role) {
      case 'estudante':
        return 'Atualize sua foto, gerencie seus dados e monte seu currículo.';
      case 'empresa':
        return 'Atualize o logotipo institucional e as informações da empresa.';
      case 'coordenacao':
      default:
        return 'Gerencie seus dados e controle de acesso institucional.';
    }
  };

  const nomeExibicao =
    perfil?.name || perfil?.surname
      ? `${perfil.name ?? ''} ${perfil.surname ?? ''}`.trim()
      : 'Usuário PEIA';

  return (
    <View className="gap-4">
      {/* Card Unificado: Foto sempre à mostra + Identificação + Menu retrátil de Informações da Conta */}
      <View className="items-center p-6 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm gap-3">
        {/* 1. Foto do Usuário (Sempre à mostra) */}
        <ProfileAvatar
          avatar={perfil?.avatar}
          name={perfil?.name || ''}
          surname={perfil?.surname || ''}
          onUpdateAvatar={onUpdateAvatar}
          onRemoveAvatar={onRemoveAvatar}
        />

        {/* 2. Identificação Principal */}
        <View className="items-center gap-1 w-full">
          <Text className="text-xl font-bold text-slate-900 dark:text-white text-center">
            {nomeExibicao}
          </Text>
          {perfil?.email && (
            <Text className="text-xs text-slate-500 dark:text-slate-400 text-center">
              {perfil.email}
            </Text>
          )}

          <View className="flex-row items-center gap-2 mt-1">
            <View className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800">
              <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                {getRoleLabel(perfil?.role)}
              </Text>
            </View>
            <View className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              <Text className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                ✓ Ativo
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs">
          {getSubtitle()}
        </Text>

        {/* 3. Menu de Informações da Conta (Escondido em menu retrátil) */}
        <View className="w-full mt-2">
          <Pressable
            onPress={() => setMenuAberto(!menuAberto)}
            accessibilityRole="button"
            accessibilityLabel="Alternar menu de informações da conta"
            className="w-full flex-row items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 active:opacity-75"
          >
            <View className="flex-row items-center gap-3 flex-1 mr-2">
              <View className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-950/70 items-center justify-center">
                <Ionicons name="id-card-outline" size={17} color="#6366f1" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-slate-900 dark:text-white">
                  Informações da Conta
                </Text>
                <Text numberOfLines={1} className="text-[11px] text-slate-500 dark:text-slate-400">
                  {menuAberto ? 'Toque para recolher' : 'Editar nome, e-mail e telefone'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Text className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {menuAberto ? 'Ocultar' : 'Editar'}
              </Text>
              <Ionicons
                name={menuAberto ? 'chevron-up' : 'chevron-down'}
                size={14}
                color="#64748b"
              />
            </View>
          </Pressable>

          {/* Conteúdo Expansível do Menu */}
          {menuAberto && (
            <View className="gap-3 mt-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/80">
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Edite os dados cadastrais vinculados à sua conta de acesso institucional:
              </Text>

              <Input
                label="Nome"
                value={dados.name}
                onChangeText={onChangeField('name')}
                errorMessage={errors.name}
              />
              <Input
                label="Sobrenome"
                value={dados.surname}
                onChangeText={onChangeField('surname')}
                errorMessage={errors.surname}
              />
              <Input
                label="E-mail de acesso"
                value={dados.email}
                onChangeText={onChangeField('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                errorMessage={errors.email}
              />
              <Input
                label="Telefone / WhatsApp"
                value={dados.phone}
                onChangeText={onChangeField('phone')}
                keyboardType="phone-pad"
                errorMessage={errors.phone}
              />

              <View className="mt-2 gap-2">
                <Button title="Salvar dados cadastrais" onPress={onSave} />
                {saved && (
                  <View accessibilityLiveRegion="polite">
                    <Text className="text-center text-xs text-emerald-500 font-medium">
                      ✓ Dados cadastrais atualizados com sucesso!
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
