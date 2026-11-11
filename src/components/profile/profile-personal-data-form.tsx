import { Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type ProfileFormData, type ProfileFormErrors } from '@/hooks/use-profile-form';

interface ProfilePersonalDataFormProps {
  dados: ProfileFormData;
  errors: ProfileFormErrors;
  saved: boolean;
  onChangeField: (field: keyof ProfileFormData) => (value: string) => void;
  onSave: () => void;
}

export function ProfilePersonalDataForm({
  dados,
  errors,
  saved,
  onChangeField,
  onSave,
}: ProfilePersonalDataFormProps) {
  return (
    <View className="gap-3 mt-1">
      <Text className="text-base font-semibold text-slate-900 dark:text-white">
        Dados de Contato
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
        label="E-mail"
        value={dados.email}
        onChangeText={onChangeField('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        errorMessage={errors.email}
      />
      <Input
        label="Telefone"
        value={dados.phone}
        onChangeText={onChangeField('phone')}
        keyboardType="phone-pad"
        errorMessage={errors.phone}
      />

      <View className="mt-2 gap-2">
        <Button title="Salvar dados de contato" onPress={onSave} />
        {saved && (
          <View accessibilityLiveRegion="polite">
            <Text className="text-center text-sm text-emerald-500 font-medium">
              Alterações salvas com sucesso!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

