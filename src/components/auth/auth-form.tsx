import { AlertModal } from '@/components/ui/alert-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthForm } from '@/hooks/use-auth-form';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Text, TouchableOpacity, View } from 'react-native';

export interface AuthFormProps {
  isSignUp: boolean;
}

export function AuthForm({ isSignUp }: AuthFormProps) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#818cf8' : '#6366f1';

  const {
    loading,
    showPassword,
    showRegisterPassword,
    toggleShowPassword,
    toggleShowRegisterPassword,
    errors,
    alert,
    closeAlert,
    role,
    setRole,
    name,
    surname,
    registerEmail,
    registerPhone,
    registerPassword,
    setName,
    setSurname,
    setRegisterEmail,
    setRegisterPhone,
    setRegisterPassword,
    loginEmail,
    loginPassword,
    userRole,
    setUserRole,
    setLoginEmail,
    setLoginPassword,
    handleSubmit,
  } = useAuthForm(isSignUp);

  return (
    <View className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-2xl shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/50">
      {/* Top accent bar */}
      <View className="mb-4 h-1 w-10 self-center rounded-full bg-indigo-500/30 dark:bg-indigo-400/40" />

      {/* Cabeçalho do Card */}
      <View className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="text-base font-bold text-slate-900 dark:text-white">
            {isSignUp ? 'Criar Conta de Estudante' : 'Acessar Plataforma'}
          </Text>
        </View>
        <Text className="text-xs text-slate-500 dark:text-slate-400">
          {isSignUp
            ? 'Preencha seus dados para iniciar a sua jornada no PEIA.'
            : 'Entre com suas credenciais institucionais ou corporativas.'}
        </Text>
      </View>

      {isSignUp ? (
        <View key="signup-view" className="gap-4">
          <Input
            key="signup-name"
            label="Nome"
            required
            value={name}
            onChangeText={setName}
            placeholder="Seu Nome"
            isLoading={loading}
            errorMessage={errors.name}
            leftIcon={<Ionicons name="person-outline" size={18} color={iconColor} />}
          />

          <Input
            key="signup-surname"
            label="Sobrenome"
            required
            value={surname}
            onChangeText={setSurname}
            placeholder="Seu Sobrenome"
            isLoading={loading}
            errorMessage={errors.surname}
            leftIcon={<Ionicons name="person-outline" size={18} color={iconColor} />}
          />

          <Input
            key="signup-email"
            label="E-mail Institucional"
            required
            value={registerEmail}
            onChangeText={setRegisterEmail}
            placeholder="002-*****@aluno.undb.edu.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            isLoading={loading}
            errorMessage={errors.registerEmail}
            leftIcon={<Ionicons name="mail-outline" size={18} color={iconColor} />}
          />

          <Input
            key="signup-phone"
            label="Telefone"
            required
            value={registerPhone}
            onChangeText={setRegisterPhone}
            placeholder="(99) 99999-9999"
            keyboardType="phone-pad"
            isLoading={loading}
            errorMessage={errors.registerPhone}
            leftIcon={<Ionicons name="call-outline" size={18} color={iconColor} />}
          />

          <Input
            key="signup-password"
            label="Senha"
            required
            value={registerPassword}
            onChangeText={setRegisterPassword}
            placeholder="Mínimo de 6 caracteres"
            secureTextEntry={!showRegisterPassword}
            autoCapitalize="none"
            isLoading={loading}
            errorMessage={errors.registerPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={iconColor} />}
            rightIcon={
              <TouchableOpacity
                onPress={toggleShowRegisterPassword}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showRegisterPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colorScheme === 'dark' ? '#94a3b8' : '#64748b'}
                />
              </TouchableOpacity>
            }
          />

          <Button
            key="signup-button"
            title="Criar Conta"
            onPress={handleSubmit}
            isLoading={loading}
            loadingText="Criando conta..."
            icon={<Ionicons name="person-add-outline" size={19} color="#ffffff" />}
            className="mt-2"
          />
        </View>
      ) : (
        <View key="login-view" className="gap-4">
          <Input
            key="login-email"
            label="E-mail Institucional"
            required
            value={loginEmail}
            onChangeText={setLoginEmail}
            placeholder="aluno@undb.edu.br"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            isLoading={loading}
            errorMessage={errors.loginEmail}
            leftIcon={<Ionicons name="mail-outline" size={18} color={iconColor} />}
          />

          <Input
            key="login-password"
            label="Senha"
            required
            value={loginPassword}
            onChangeText={setLoginPassword}
            placeholder="Sua senha"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            isLoading={loading}
            errorMessage={errors.loginPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={iconColor} />}
            rightIcon={
              <TouchableOpacity
                onPress={toggleShowPassword}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colorScheme === 'dark' ? '#94a3b8' : '#64748b'}
                />
              </TouchableOpacity>
            }
          />

          <Button
            key="login-button"
            title="Acessar Conta"
            onPress={handleSubmit}
            isLoading={loading}
            loadingText="Acessando..."
            icon={<Ionicons name="log-in-outline" size={19} color="#ffffff" />}
            className="mt-2"
          />

          {/* Demonstração / Atalhos Rápidos de Login */}
          <View className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Text className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2.5 uppercase tracking-wider">
              Acesso Rápido para Apresentação:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity
                onPress={() => {
                  setLoginEmail('john.doe@aluno.undb.edu.br');
                  setLoginPassword('password123');
                  setUserRole('estudante');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-row items-center gap-1.5 active:opacity-70"
              >
                <Text className="text-xs">🎓</Text>
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-200">Aluno</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setLoginEmail('recrutamento@techcorp.com.br');
                  setLoginPassword('password123');
                  setUserRole('empresa');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-row items-center gap-1.5 active:opacity-70"
              >
                <Text className="text-xs">🏢</Text>
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-200">Empresa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setLoginEmail('admin@undb.edu.br');
                  setLoginPassword('password123');
                  setUserRole('coordenacao');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-row items-center gap-1.5 active:opacity-70"
              >
                <Text className="text-xs">🛡️</Text>
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-200">Admin</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setLoginEmail('root@peia.edu.br');
                  setLoginPassword('password123');
                  setUserRole('coordenacao');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-row items-center gap-1.5 active:opacity-70"
              >
                <Text className="text-xs">👑</Text>
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-200">Super Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <AlertModal {...alert} onClose={closeAlert} />
    </View>
  );
}
