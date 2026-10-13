import React, { useMemo } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BUTTON_SIZE = 36;

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
            toggleColorScheme();
          }
        },
      }),
    [pan, toggleColorScheme]
  );

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.button, pan.getLayout()]}
      className="items-center justify-center rounded-full border border-slate-200/90 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/90 shadow-md"
      accessibilityRole="button"
      accessibilityLabel={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={18}
        color={isDark ? '#fbbf24' : '#6366f1'}
      />
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
});
