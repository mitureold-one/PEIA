import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProfileForm } from '@/hooks/use-profile-form';
import { useUserRole } from '@/hooks/use-user-role';
import { ProfileAvatar } from '@/components/profile/profile-avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProfileDangerZone } from '@/components/profile/profile-danger-zone';
import { perfilActions } from '@/hooks/use-perfil';
import { ROUTES } from '@/constants/routes';

export default function Configuracoes() {
  const router = useRouter();
  const role = useUserRole();
  const {
    perfil,
    dados,
    errors,
    saved,
    handleChange,
    handleAvatarChange,
    handleRemoveAvatar,
    save,
    confirmarExclusao,
  } = useProfileForm();

  const handleLogout = () => {
    perfilActions.excluir();
    router.replace(ROUTES.AUTH);
  };

  const getRoleLabel = () => {
    switch (perfil?.role) {
      case 'superadmin':
        return 'Super Administrador';
      case 'admin':
        return 'Administrador';
      case 'empresa':
        return 'Empresa Parceira';
      case 'aluno':
      default:
        return 'Estudante / Aluno';
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      {/* Barra Superior com Botão Voltar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          className="h-10 w-10 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700"
        >
          <Ionicons name="arrow-back" size={20} color="#6366f1" />
        </Pressable>

        <View className="items-center">
          <Text className="text-base font-bold text-slate-900 dark:text-white">
            Configurações da Conta
          </Text>
          <Text className="text-[11px] text-slate-500 dark:text-slate-400">
            CRUD & Dados Globais do Usuário
          </Text>
        </View>

        {/* Espaçador para centralizar o título */}
        <View className="w-10 h-10" />
      </View>

      <ScrollView contentContainerClassName="gap-5 p-6" keyboardShouldPersistTaps="handled">
        {/* Bloco 1: Foto de Perfil & Identidade */}
        <View className="items-center p-6 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm gap-3">
          <ProfileAvatar
            avatar={perfil?.avatar}
            name={perfil?.name || ''}
            surname={perfil?.surname || ''}
            onUpdateAvatar={handleAvatarChange}
            onRemoveAvatar={handleRemoveAvatar}
          />

          <View className="items-center gap-1">
            <Text className="text-xl font-bold text-slate-900 dark:text-white text-center">
              {perfil?.name ? `${perfil.name} ${perfil.surname ?? ''}`.trim() : 'Usuário PEIA'}
            </Text>
            {perfil?.email && (
              <Text className="text-xs text-slate-500 dark:text-slate-400 text-center">
                {perfil.email}
              </Text>
            )}

            <View className="flex-row items-center gap-2 mt-1">
              <View className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800">
                <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  {getRoleLabel()}
                </Text>
              </View>
              <View className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                <Text className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  ✓ Ativo
                </Text>
              </View>
            </View>
          </View>

          <Text className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs mt-1">
            Toque na foto para atualizar pela câmera, galeria ou selecionar um avatar.
          </Text>
        </View>

        {/* Bloco 2: CRUD dos Dados Cadastrais do Usuário (Classe User) */}
        <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-4">
          <View className="flex-row items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <View className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/60 items-center justify-center">
              <Ionicons name="id-card-outline" size={20} color="#6366f1" />
            </View>
            <View>
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                Dados Cadastrais da Conta
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                Edite suas credenciais e dados de contato institucional.
              </Text>
            </View>
          </View>

          <View className="gap-3">
            <Input
              label="Nome"
              value={dados.name}
              onChangeText={handleChange('name')}
              errorMessage={errors.name}
            />
            <Input
              label="Sobrenome"
              value={dados.surname}
              onChangeText={handleChange('surname')}
              errorMessage={errors.surname}
            />
            <Input
              label="E-mail de acesso"
              value={dados.email}
              onChangeText={handleChange('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              errorMessage={errors.email}
            />
            <Input
              label="Telefone / WhatsApp"
              value={dados.phone}
              onChangeText={handleChange('phone')}
              keyboardType="phone-pad"
              errorMessage={errors.phone}
            />

            <View className="mt-2 gap-2">
              <Button title="Salvar dados da conta" onPress={save} />
              {saved && (
                <View accessibilityLiveRegion="polite">
                  <Text className="text-center text-xs text-emerald-500 font-medium">
                    ✓ Informações da conta atualizadas e salvas no SQLite!
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Bloco 3: Sessão & Ações da Conta */}
        <View className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm gap-3">
          <Text className="text-sm font-bold text-slate-900 dark:text-white">
            Sessão & Acesso
          </Text>

          <Button
            title="Desconectar da Conta"
            variant="secondary"
            icon={<Ionicons name="log-out-outline" size={18} color="#6366f1" />}
            onPress={handleLogout}
          />
        </View>

        {/* Bloco 4: Zona de Perigo / Exclusão */}
        <ProfileDangerZone onExcluir={confirmarExclusao} />
      </ScrollView>
    </SafeAreaView>
  );
}

