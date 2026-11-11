import { Pressable, Text } from 'react-native';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={`rounded-full border px-3.5 py-1.5 ${
        active
          ? 'border-indigo-600 bg-indigo-600'
          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
      }`}
    >
      <Text
        className={`text-xs font-medium ${
          active ? 'text-white' : 'text-slate-700 dark:text-slate-300'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

