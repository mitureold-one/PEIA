import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BUTTON_SIZE = 38;

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  const initialX = Math.max((windowWidth || 360) - BUTTON_SIZE - 16, 16);
  const initialY = Math.max((insets?.top || 0) + 8, 16);

  const pan = useMemo(
    () => new Animated.ValueXY({ x: initialX, y: initialY }),
    [initialX, initialY]
  );

  // Guarda o tema para o qual estamos dispersando a cor
  const [targetDark, setTargetDark] = useState(!isDark);

  // Valores animados da dispersão
  const screenWaveAnim = useRef(new Animated.Value(0)).current;
  const localRipplesAnim = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  const iconRotation = useRef(new Animated.Value(0)).current;

  const triggerToggleWithDispersion = () => {
    const nextIsDark = !isDark;
    setTargetDark(nextIsDark);

    screenWaveAnim.setValue(0);
    localRipplesAnim.setValue(0);
    iconRotation.setValue(0);

    // 1. Dispara a grande onda de dispersão de cor que varre os componentes da tela
    Animated.timing(screenWaveAnim, {
      toValue: 1,
      duration: 650,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();

    // 2. Dispara os halos locais ao redor do botão e a rotação/escala elástica do ícone
    Animated.parallel([
      Animated.timing(localRipplesAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 0.35,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(iconRotation, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      iconRotation.setValue(0);
    });

    // Alterna o tema no momento em que a onda de dispersão atinge o ápice visual
    setTimeout(() => {
      toggleColorScheme();
    }, 180);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3,
        onPanResponderGrant: () => {
          pan.extractOffset();
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gestureState) => {
          pan.flattenOffset();
          const dist = Math.hypot(gestureState.dx, gestureState.dy);
          if (dist < 6) {
            triggerToggleWithDispersion();
          }
        },
      }),
    [pan, isDark]
  );

  // -------------------------------------------------------------------------
  // Interpolações da Onda de Dispersão Global de Cores (Screen-wide Wave)
  // Expande de scale 0 até cobrir a tela (scale 50x) e dissolve gradualmente
  // -------------------------------------------------------------------------
  const screenWaveScale = screenWaveAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.1, 25, 52],
  });

  const screenWaveOpacity = screenWaveAnim.interpolate({
    inputRange: [0, 0.25, 0.65, 1],
    outputRange: [0.95, 0.85, 0.5, 0],
  });

  // -------------------------------------------------------------------------
  // Interpolações dos Halos Locais de Dispersão
  // -------------------------------------------------------------------------
  const localWave1Scale = localRipplesAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 2.5],
  });
  const localWave1Opacity = localRipplesAnim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0.8, 0.5, 0],
  });

  const localWave2Scale = localRipplesAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 3.4],
  });
  const localWave2Opacity = localRipplesAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.6, 0.3, 0],
  });

  const rotateInterpolation = iconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Cores da onda de dispersão dependendo de para qual tema estamos indo
  const incomingBg = targetDark ? '#03031b' : '#f8fafc';
  const incomingBorder = targetDark ? '#4f46e5' : '#fbbf24';
  const haloLocalColor = isDark ? '#fbbf24' : '#6366f1';

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.button, pan.getLayout()]}
      className="items-center justify-center rounded-full border border-slate-200/90 bg-white/95 dark:border-slate-700/80 dark:bg-slate-900/95 shadow-lg"
      accessibilityRole="button"
      accessibilityLabel={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
    >
      {/* ================================================================= */}
      {/* GRANDE ONDA DE DISPERSÃO: varre a tela e transita a cor dos componentes */}
      {/* ================================================================= */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.dispersionScreenWave,
          {
            backgroundColor: incomingBg,
            borderColor: incomingBorder,
            transform: [{ scale: screenWaveScale }],
            opacity: screenWaveOpacity,
          },
        ]}
      />

      {/* Halos locais de impacto ao redor do botão */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.dispersionRing,
          {
            borderColor: haloLocalColor,
            transform: [{ scale: localWave2Scale }],
            opacity: localWave2Opacity,
          },
        ]}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.dispersionRing,
          {
            borderColor: haloLocalColor,
            borderWidth: 2,
            transform: [{ scale: localWave1Scale }],
            opacity: localWave1Opacity,
          },
        ]}
      />

      {/* Ícone com rotação 360° e escala elástica */}
      <Animated.View
        style={{
          transform: [
            { scale: iconScale },
            { rotate: rotateInterpolation },
          ],
        }}
      >
        <Ionicons
          name={isDark ? 'sunny' : 'moon'}
          size={20}
          color={isDark ? '#fbbf24' : '#6366f1'}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    zIndex: 9999,
    elevation: 10,
    cursor: 'pointer',
  },
  dispersionRing: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 1.5,
  },
  dispersionScreenWave: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 2,
    zIndex: -1,
  },
});
