import type { TextStyle } from 'react-native';

export type ITypographyVariant =
  | 'headingXl'
  | 'headingLg'
  | 'headingMd'
  | 'subtitleLg'
  | 'subtitleMd'
  | 'bodyLg'
  | 'bodyMd'
  | 'caption'
  | 'label'
  | 'buttonLg'
  | 'buttonMd'
  | 'tokenDisplay'
  | 'numberDisplay';

export interface ITypographyProps {
  variant?: ITypographyVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  fontWeight?: TextStyle['fontWeight'];
  children: React.ReactNode;
  style?: TextStyle;
}
