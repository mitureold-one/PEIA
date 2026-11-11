import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type ProfileFormData, type ProfileFormErrors } from '@/hooks/use-profile-form';

interface ProfilePersonalDataFormProps {
  dados: ProfileFormData;
  errors: ProfileFormErrors;
  saved: boolean;
  onChangeField: (field: keyof ProfileFormData) => (value: string) => void;
  onSave: () => void;
  defaultExpanded?: boolean;
}

export function ProfilePersonalDataForm({
  dados,
  errors,
  saved,
  onChangeField,
  onSave,
  defaultExpanded = false,
}: ProfilePersonalDataFormProps) {
  const [expandido, setExpandido] = useState(defaultExpanded);

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm mt-1">
      {/* Cabeçalho com Toggle Expansível */}
      <Pressable
        onPress={() => setExpandido(!expandido)}
        accessibilityRole="button"
        accessibilityLabel="Alternar visualização dos dados cadastrais"
        className="flex-row items-center justify-between active:opacity-75"
      >
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          <View className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-900 items-center justify-center border border-slate-200 dark:border-slate-800">
            <Ionicons name="id-card-outline" size={20} color="#6366f1" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-bold text-slate-900 dark:text-white">
                Dados Cadastrais da Conta
              </Text>
              <Text className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                User
              </Text>
            </View>
            <Text numberOfLines={1} className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {dados.email || 'Clique para visualizar ou alterar e-mail e telefone'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {expandido ? 'Ocultar' : 'Editar'}
          </Text>
          <Ionicons
            name={expandido ? 'chevron-up' : 'chevron-down'}
            size={14}
            color="#64748b"
          />
        </View>
      </Pressable>

      {/* Seção Expansível com os inputs da superclasse User */}
      {expandido && (
        <View className="gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-1">
            Informações básicas de identificação vinculadas ao seu login e contato institucional.
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
                <Text className="text-center text-sm text-emerald-500 font-medium">
                  ✓ Dados cadastrais atualizados com sucesso!
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
