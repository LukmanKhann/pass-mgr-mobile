import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

import MaterialSymbols from '../material-icon';

import { Typography } from '../typography';
import { useTheme } from '../../../hooks/use-theme.hook';
import type { IToastConfig } from './toast.type';

const ICONS = {
  success: 'check_circle',
  error: 'warning',
  warning: 'warning',
  info: 'info',
} as const;

const COLOR_KEYS = {
  bg: {
    success: 'successLight',
    error: 'errorLight',
    warning: 'warningLight',
    info: 'infoLight',
  } as const,
  border: {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  } as const,
};

const TOAST_DURATION = 3000;
const ANIMATION_DURATION = 250;

interface IToastItemProps {
  toast: IToastConfig;
  onDismiss: (id: string) => void;
}

export function ToastItem({
  toast,
  onDismiss,
}: IToastItemProps): React.JSX.Element {
  const { colors, borderRadius } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const dismissRef = useRef<() => void>(() => {});

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 20,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss(toast.id));
  };

  dismissRef.current = dismiss;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      dismissRef.current();
    }, toast.duration || TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [opacity, translateY, toast.duration]);

  const iconName = ICONS[toast.type];
  const bgKey = COLOR_KEYS.bg[toast.type];
  const borderKey = COLOR_KEYS.border[toast.type];
  const backgroundColor = (colors as any)[bgKey] || colors.surface;
  const borderColor = (colors as any)[borderKey] || colors.accent;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
          borderRadius: borderRadius.md,
          shadowColor: colors.shadow,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={dismiss}
        activeOpacity={0.9}
      >
        <MaterialSymbols name={iconName} size={22} color={colors.textInverse} />
        <View style={styles.textContainer}>
          <Typography variant="bodyMd" fontWeight="600">
            {toast.title}
          </Typography>
          {toast.message && (
            <Typography variant="caption" color={colors.textSecondary}>
              {toast.message}
            </Typography>
          )}
        </View>
        <TouchableOpacity
          onPress={dismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialSymbols name="close" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderLeftWidth: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
});
