import React from 'react';
import { Platform, Text, TextProps } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import type { ITypographyProps, ITypographyVariant } from './typography.type';

const fontFamily = Platform.select({
  android: 'sans-serif',
  ios: 'System',
  default: 'System',
});

const typographyVariants: Record<string, TextProps['style']> = {
  headingXl: {
    fontFamily, fontSize: 28, fontWeight: '700', lineHeight: 36, letterSpacing: -0.3,
  },
  headingLg: {
    fontFamily, fontSize: 24, fontWeight: '700', lineHeight: 32, letterSpacing: -0.2,
  },
  headingMd: {
    fontFamily, fontSize: 20, fontWeight: '600', lineHeight: 28, letterSpacing: -0.1,
  },
  subtitleLg: {
    fontFamily, fontSize: 18, fontWeight: '600', lineHeight: 26,
  },
  subtitleMd: {
    fontFamily, fontSize: 16, fontWeight: '600', lineHeight: 24,
  },
  bodyLg: {
    fontFamily, fontSize: 16, fontWeight: '400', lineHeight: 24,
  },
  bodyMd: {
    fontFamily, fontSize: 14, fontWeight: '400', lineHeight: 20,
  },
  caption: {
    fontFamily, fontSize: 12, fontWeight: '400', lineHeight: 16,
  },
  label: {
    fontFamily, fontSize: 13, fontWeight: '500', lineHeight: 18, letterSpacing: 0.5,
  },
  buttonLg: {
    fontFamily, fontSize: 16, fontWeight: '600', lineHeight: 24, letterSpacing: 0.3,
  },
  buttonMd: {
    fontFamily, fontSize: 14, fontWeight: '600', lineHeight: 20, letterSpacing: 0.3,
  },
  tokenDisplay: {
    fontFamily, fontSize: 48, fontWeight: '700', lineHeight: 56,
  },
  numberDisplay: {
    fontFamily, fontSize: 36, fontWeight: '700', lineHeight: 44,
  },
};

export function Typography({
  variant = 'bodyLg',
  color,
  align,
  fontWeight,
  children,
  style,
  ...props
}: ITypographyProps & TextProps) {
  const { colors } = useTheme();
  const variantStyle = typographyVariants[variant];

  return (
    <Text
      style={[
        { color: color || colors.textPrimary },
        variantStyle,
        align ? { textAlign: align } : undefined,
        fontWeight ? { fontWeight } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
