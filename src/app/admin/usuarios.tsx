import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertModal, type AlertState } from '@/components/ui/alert-modal';
import { usePerfil } from '@/hooks/use-perfil';
import { userService } from '@/services/user-service';
import { User, type UserRole } from '@/data/user';
import {
  formatPhone,
  validateEmail,
  validatePhone,
  validateRequired,
} from '@/utils/validators';

export default function GestaoUsuarios() {
  const router = useRouter();
  const perfil = usePerfil();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isSuperAdmin = perfil?.role === 'superadmin';
  const isAdmin = perfil?.role === 'admin' || isSuperAdmin;

  // Estados do formulário interno
  const [role, setRole] = useState<UserRole>('empresa');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Lista de usuários cadastrados no banco
  const [users, setUsers] = useState<User[]>([]);

  // Modal de feedback
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    variant: 'error',
    title: '',
    message: '',
  });

  const loadUsers = async () => {
    try {
      const list = await userService.listAll();
      setUsers(list);
    } catch (err) {
      console.warn('Erro ao carregar usuários:', err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Se o perfil logado não tiver permissão
  if (!isAdmin) {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 items-center justify-center p-6 bg-slate-50 dark:bg-[#03031b]">
        <View className="max-w-md w-full p-6 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/50 shadow-xl items-center text-center">
          <View className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 items-center justify-center mb-4">
            <Ionicons name="lock-closed" size={28} color="#e11d48" />
          </View>
          <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
            Acesso Restrito
          </Text>
          <Text className="text-sm text-slate-600 dark:text-slate-400 mb-6 text-center">
            Esta tela é exclusiva para Administradores e Super Administradores da plataforma.
          </Text>
          <Button title="Voltar ao Início" onPress={() => router.back()} className="w-full" />
        </View>
      </SafeAreaView>
    );
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!validateRequired(name)) errs.name = 'Nome ou Razão Social é obrigatório.';
    if (!validateRequired(surname)) errs.surname = 'Sobrenome ou Responsável é obrigatório.';

    const cleanEmail = email.trim();
    if (!validateRequired(cleanEmail)) {
      errs.email = 'E-mail é obrigatório.';
    } else if (!validateEmail(cleanEmail)) {
      errs.email = 'Informe um e-mail com formato válido.';
    }

    if (!validateRequired(phone)) {
      errs.phone = 'Telefone é obrigatório.';
    } else if (!validatePhone(phone)) {
      errs.phone = 'Telefone inválido com DDD.';
    }

    if (!validateRequired(password)) {
      errs.password = 'Senha é obrigatória.';
    } else if (password.length < 6) {
      errs.password = 'A senha deve ter no mínimo 6 caracteres.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCadastrar = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const novo = await userService.register({
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role,
      });

      setAlert({
        visible: true,
        variant: 'success',
        title: 'Usuário cadastrado!',
        message: `${novo.roleLabel} "${novo.fullName}" foi inserido com sucesso no banco de dados local.`,
      });

      // Limpa os campos
      setName('');
      setSurname('');
      setEmail('');
      setPhone('');
      setPassword('');
      setErrors({});

      // Recarrega lista
      await loadUsers();
    } catch (err: any) {
      setAlert({
        visible: true,
        variant: 'error',
        title: 'Falha no cadastro',
        message: err?.message || 'Não foi possível cadastrar o usuário.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'superadmin':
        return { label: 'Super Admin', bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300', icon: 'shield-checkmark' as const };
      case 'admin':
        return { label: 'Admin', bg: 'bg-indigo-100 dark:bg-indigo-950/60', text: 'text-indigo-700 dark:text-indigo-300', icon: 'shield' as const };
      case 'empresa':
        return { label: 'Empresa', bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300', icon: 'business' as const };
      default:
        return { label: 'Aluno', bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', icon: 'school' as const };
    }
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-slate-50 dark:bg-[#03031b]">
      <ScrollView contentContainerClassName="gap-6 p-6" keyboardShouldPersistTaps="handled">
        {/* Banner do Perfil Atual */}
        <View className="rounded-2xl bg-indigo-600 dark:bg-indigo-900/60 p-4 shadow-lg shadow-indigo-500/20">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center">
              <Ionicons name={isSuperAdmin ? 'ribbon' : 'shield-checkmark'} size={22} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-xs uppercase tracking-wider text-indigo-200 font-bold">
                Permissão de {isSuperAdmin ? 'Super Administrador' : 'Administrador'}
              </Text>
              <Text className="text-base font-bold text-white">
                Cadastro Interno de Usuários
              </Text>
            </View>
          </View>
        </View>

        {/* Card do Formulário de Criação */}
        <View className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
          <Text className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Novo Usuário do Sistema
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            {isSuperAdmin
              ? 'Como Super Admin, você pode criar Administradores e Empresas parceiras.'
              : 'Como Administrador, você pode cadastrar novas Empresas na plataforma.'}
          </Text>

          {/* Seletor de Role permitido para o nível atual */}
          <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Tipo de Perfil a Criar:
          </Text>
          <View className="flex-row rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80 mb-4">
            <TouchableOpacity
              onPress={() => setRole('empresa')}
              className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg ${
                role === 'empresa' ? 'bg-white shadow-sm dark:bg-indigo-600' : 'opacity-70'
              }`}
            >
              <Ionicons
                name="business-outline"
                size={16}
                color={role === 'empresa' ? (isDark ? '#ffffff' : '#4f46e5') : '#94a3b8'}
              />
              <Text
                className={`text-xs font-semibold ${
                  role === 'empresa' ? 'text-indigo-600 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Empresa
              </Text>
            </TouchableOpacity>

            {isSuperAdmin && (
              <TouchableOpacity
                onPress={() => setRole('admin')}
                className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg ${
                  role === 'admin' ? 'bg-white shadow-sm dark:bg-indigo-600' : 'opacity-70'
                }`}
              >
                <Ionicons
                  name="shield-outline"
                  size={16}
                  color={role === 'admin' ? (isDark ? '#ffffff' : '#4f46e5') : '#94a3b8'}
                />
                <Text
                  className={`text-xs font-semibold ${
                    role === 'admin' ? 'text-indigo-600 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Administrador
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setRole('aluno')}
              className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-lg ${
                role === 'aluno' ? 'bg-white shadow-sm dark:bg-indigo-600' : 'opacity-70'
              }`}
            >
              <Ionicons
                name="school-outline"
                size={16}
                color={role === 'aluno' ? (isDark ? '#ffffff' : '#4f46e5') : '#94a3b8'}
              />
              <Text
                className={`text-xs font-semibold ${
                  role === 'aluno' ? 'text-indigo-600 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Aluno
              </Text>
            </TouchableOpacity>
          </View>

          {/* Campos do Formulário */}
          <View className="gap-3">
            <Input
              label={role === 'empresa' ? 'Razão Social / Nome da Empresa' : 'Nome'}
              placeholder={role === 'empresa' ? 'Ex: Google Brasil' : 'Primeiro Nome'}
              value={name}
              onChangeText={setName}
              errorMessage={errors.name}
              required
            />

            <Input
              label={role === 'empresa' ? 'Nome do Responsável / RH' : 'Sobrenome'}
              placeholder={role === 'empresa' ? 'Ex: Maria Silva' : 'Sobrenome'}
              value={surname}
              onChangeText={setSurname}
              errorMessage={errors.surname}
              required
            />

            <Input
              label="E-mail de Acesso"
              placeholder={role === 'empresa' ? 'contato@empresa.com.br' : 'usuario@undb.edu.br'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              errorMessage={errors.email}
              required
            />

            <Input
              label="Telefone / Contato"
              placeholder="(98) 99999-9999"
              value={phone}
              onChangeText={(v) => setPhone(formatPhone(v))}
              keyboardType="phone-pad"
              errorMessage={errors.phone}
              required
            />

            <Input
              label="Senha de Acesso"
              placeholder="Mínimo de 6 caracteres"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              errorMessage={errors.password}
              required
            />

            <Button
              title={`Cadastrar ${role === 'empresa' ? 'Empresa' : role === 'admin' ? 'Administrador' : 'Aluno'}`}
              onPress={handleCadastrar}
              isLoading={loading}
              className="mt-2"
            />
          </View>
        </View>

        {/* Listagem de Usuários no Banco */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              Usuários no Banco ({users.length})
            </Text>
            <TouchableOpacity onPress={loadUsers} hitSlop={10}>
              <Ionicons name="refresh" size={18} color="#6366f1" />
            </TouchableOpacity>
          </View>

          {users.map((u) => {
            const badge = getRoleBadge(u.role);
            return (
              <View
                key={u.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex-row items-center justify-between"
              >
                <View className="flex-1 mr-2">
                  <Text className="font-bold text-slate-900 dark:text-white text-sm">
                    {u.name} {u.surname}
                  </Text>
                  <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {u.email}
                  </Text>
                  {u.phone ? (
                    <Text className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {u.phone}
                    </Text>
                  ) : null}
                </View>

                <View className={`px-2.5 py-1 rounded-full flex-row items-center gap-1 ${badge.bg}`}>
                  <Ionicons name={badge.icon} size={12} color={isDark ? '#e0e7ff' : '#4338ca'} />
                  <Text className={`text-xs font-semibold ${badge.text}`}>
                    {badge.label}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <AlertModal {...alert} onClose={() => setAlert((prev) => ({ ...prev, visible: false }))} />
    </SafeAreaView>
  );
}

