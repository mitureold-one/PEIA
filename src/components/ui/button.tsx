import { ReactNode } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  isLoading = false,
  loadingText,
  icon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyle = 'items-center justify-center rounded-xl py-3.5 shadow-lg flex-row gap-2.5';
  const variantStyle =
    variant === 'primary'
      ? 'bg-indigo-600 shadow-indigo-500/20 active:bg-indigo-700'
      : 'bg-slate-800 active:bg-slate-700';
  const disabledStyle = isLoading || disabled ? 'opacity-70' : '';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: isLoading || disabled, busy: isLoading }}
      disabled={isLoading || disabled}
      className={`${baseStyle} ${variantStyle} ${disabledStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        icon && <View>{icon}</View>
      )}
      <Text className="text-base font-bold text-white">
        {isLoading ? (loadingText ?? 'Carregando...') : title}
      </Text>
    </TouchableOpacity>
  );
}
