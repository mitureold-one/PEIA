import { ReactNode } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

export interface InputProps extends TextInputProps {
  label: string;
  required?: boolean;
  isLoading?: boolean;
  errorMessage?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  label,
  required = false,
  isLoading = false,
  errorMessage,
  leftIcon,
  rightIcon,
  className = '',
  editable,
  accessibilityLabel,
  ...props
}: InputProps) {
  const isEditable = !isLoading && editable !== false;
  const hasError = !!errorMessage;

  return (
    <View className="gap-1.5">
      <Text className="text-xs font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <Text className="text-indigo-600 dark:text-indigo-400">*</Text>}
      </Text>
      <View
        className={`flex-row items-center rounded-xl border bg-white px-3.5 py-3 dark:bg-slate-950/60 ${
          hasError
            ? 'border-rose-500 dark:border-rose-500/80'
            : 'border-slate-300 dark:border-slate-800'
        } ${isLoading ? 'opacity-60' : ''}`}
      >
        {leftIcon && <View className="mr-2.5">{leftIcon}</View>}
        <TextInput
          accessibilityLabel={accessibilityLabel ?? label}
          placeholderTextColor="#94a3b8"
          editable={isEditable}
          className={`flex-1 text-sm text-slate-900 dark:text-white p-0 ${className}`}
          {...props}
        />
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {hasError && (
        <Text className="text-xs text-rose-500 dark:text-rose-400 pl-1">
          {errorMessage}
        </Text>
      )}
    </View>
  );
}
