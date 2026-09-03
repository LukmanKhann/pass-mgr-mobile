export interface IColorTokens {
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  accentLight: string;
  background: string;
  surface: string;
  surfaceElevated: string;
   border: string;
   borderLight: string;
   divider: string;
   textPrimary: string;
   textSecondary: string;
   textTertiary: string;
   textInverse: string;
   textOnPrimary: string;
   textOnAccent: string;
   success: string;
   successLight: string;
   error: string;
   errorLight: string;
   warning: string;
   warningLight: string;
   info: string;
   infoLight: string;
   skeleton: string;
   skeletonHighlight: string;
   overlay: string;
   shadow: string;
}

export const lightColors: IColorTokens = {
  primary: '#2C1810',
  primaryLight: '#4A2C1E',
  secondary: '#6B3F2A',
  accent: '#C8956C',
  accentLight: '#DEB896',
  background: '#FDF8F4',
  surface: '#FFFFFF',
  surfaceElevated: '#FFF9F5',
  border: '#E8D5C4',
  borderLight: '#F2E8DE',
  divider: '#EDE0D4',
  textPrimary: '#1C0F08',
  textSecondary: '#6B4C3B',
   textTertiary: '#9C7B6B',
   textInverse: '#FFFFFF',
   textOnPrimary: '#FFF8F2',
   textOnAccent: '#FFFFFF',
   success: '#2E7D32',
   successLight: '#E8F5E9',
   error: '#B33A1A',
   errorLight: '#FDE8E1',
   warning: '#C68642',
   warningLight: '#FFF3E0',
   info: '#5B7FA8',
   infoLight: '#E3EBF5',
   skeleton: '#EBD9CC',
   skeletonHighlight: '#F5ECE4',
   overlay: 'rgba(44, 24, 16, 0.5)',
   shadow: 'rgba(44, 24, 16, 0.1)',
};

export const darkColors: IColorTokens = {
  primary: '#F5E6D8',
  primaryLight: '#E8D5C4',
  secondary: '#C8956C',
  accent: '#C8956C',
  accentLight: '#A07050',
   background: '#0F0906',
   surface: '#1A1108',
   surfaceElevated: '#251A10',
   border: '#3D2415',
   borderLight: '#2A1A0D',
   divider: '#2A1A0D',
   textPrimary: '#F5E6D8',
   textSecondary: '#B8956B',
   textTertiary: '#7A5C42',
   textInverse: '#1C0F08',
   textOnPrimary: '#1C0F08',
   textOnAccent: '#1C0F08',
   success: '#66BB6A',
   successLight: '#1A3A1C',
   error: '#EF6C50',
   errorLight: '#3A1A12',
   warning: '#FFA726',
   warningLight: '#3A2A12',
   info: '#7BAFD4',
   infoLight: '#1A2A3A',
   skeleton: '#2A1A0D',
   skeletonHighlight: '#3D2415',
   overlay: 'rgba(0, 0, 0, 0.65)',
   shadow: 'rgba(0, 0, 0, 0.4)',
};