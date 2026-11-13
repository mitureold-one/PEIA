import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ScanMode } from '@/hooks/use-curriculo-scanner';

interface ScanModeTabsProps {
  activeMode: ScanMode;
  onSelectMode: (mode: ScanMode) => void;
  disabled?: boolean;
}

/**
 * Seletor de Modo do Scanner OCR (/home/scan).
 * Implementado com Pressable para garantir resposta de toque imediata e sem conflitos
 * com o ScrollView ou a camada gráfica nativa no Android e iOS.
 */
export function ScanModeTabs({ activeMode, onSelectMode, disabled }: ScanModeTabsProps) {
  const isArquivo = activeMode === 'arquivo';
  const isCamera = activeMode === 'camera';

  return (
    <View className="flex-row p-1.5 rounded-2xl bg-slate-200/90 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
      {/* 1. Método Principal: Arquivo Digital (PDF ou Imagem) */}
      <Pressable
        disabled={disabled}
        onPress={() => onSelectMode('arquivo')}
        accessibilityRole="button"
        accessibilityLabel="Modo arquivo: selecionar imagem ou PDF"
        accessibilityState={{ selected: isArquivo, disabled }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className={`flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-xl gap-2 active:scale-[0.98] ${
          isArquivo
            ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700'
            : 'opacity-70 active:opacity-100'
        } ${disabled ? 'opacity-40' : ''}`}
      >
        <Ionicons
          name={isArquivo ? 'document-text' : 'document-text-outline'}
          size={18}
          color={isArquivo ? '#6366f1' : '#64748b'}
        />
        <Text
          className={`text-xs ${
            isArquivo
              ? 'font-bold text-slate-900 dark:text-white'
              : 'font-semibold text-slate-600 dark:text-slate-400'
          }`}
        >
          Imagem ou PDF
        </Text>
      </Pressable>

      {/* 2. Método Secundário: Câmera */}
      <Pressable
        disabled={disabled}
        onPress={() => onSelectMode('camera')}
        accessibilityRole="button"
        accessibilityLabel="Modo câmera: fotografar documento impresso"
        accessibilityState={{ selected: isCamera, disabled }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className={`flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-xl gap-2 active:scale-[0.98] ${
          isCamera
            ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700'
            : 'opacity-70 active:opacity-100'
        } ${disabled ? 'opacity-40' : ''}`}
      >
        <Ionicons
          name={isCamera ? 'camera' : 'camera-outline'}
          size={18}
          color={isCamera ? '#6366f1' : '#64748b'}
        />
        <Text
          className={`text-xs ${
            isCamera
              ? 'font-bold text-slate-900 dark:text-white'
              : 'font-semibold text-slate-600 dark:text-slate-400'
          }`}
        >
          Câmera
        </Text>
      </Pressable>
    </View>
  );
}
