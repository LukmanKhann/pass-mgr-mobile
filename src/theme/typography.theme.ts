import { TextStyle } from 'react-native';

import { fonts } from './fonts';

const fontFamily = (weight: string) => {
  switch (weight) {
    case '700':
      return fonts.bold;
    case '600':
      return fonts.semiBold;
    case '500':
      return fonts.medium;
    default:
      return fonts.regular;
  }
};

export const typography = {
  headingXl: {
    fontFamily: fontFamily('700'),
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.3,
  } as TextStyle,
  headingLg: {
    fontFamily: fontFamily('700'),
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.2,
  } as TextStyle,
  headingMd: {
    fontFamily: fontFamily('600'),
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.1,
  } as TextStyle,
  subtitleLg: {
    fontFamily: fontFamily('600'),
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  } as TextStyle,
  subtitleMd: {
    fontFamily: fontFamily('600'),
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,
  bodyLg: {
    fontFamily: fontFamily('400'),
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,
  bodyMd: {
    fontFamily: fontFamily('400'),
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,
  caption: {
    fontFamily: fontFamily('400'),
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  } as TextStyle,
  label: {
    fontFamily: fontFamily('500'),
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.5,
  } as TextStyle,
  buttonLg: {
    fontFamily: fontFamily('600'),
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.3,
  } as TextStyle,
  buttonMd: {
    fontFamily: fontFamily('600'),
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.3,
  } as TextStyle,
  tokenDisplay: {
    fontFamily: fontFamily('700'),
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
  } as TextStyle,
  numberDisplay: {
    fontFamily: fontFamily('700'),
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
  } as TextStyle,
} as const;

export type ITypographyTokens = typeof typography;
export type ITypographyVariant = keyof ITypographyTokens;
