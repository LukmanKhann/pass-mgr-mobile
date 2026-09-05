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
  // Ember Espresso — a warm, premium dark theme for a security-first vault.
  // Action vs. accent get distinct roles: amber-primary for CTAs, caramel-gold
  // accent for highlights. Warm neutrals give depth without going muddy.
  primary: '#E3A857', // molten amber — primary actions
  primaryLight: '#F2C98B',
  secondary: '#C8956C',
  accent: '#E0A96A', // luminous caramel-gold — icons, links, active states
  accentLight: '#F5D9A4', // pale gold — switched-on track, soft fills
  background: '#0C0A08', // deep espresso-black
  surface: '#151210', // lifted one step
  surfaceElevated: '#1F1A17', // modals, chips, icon wells
  border: '#322A25', // visible hairline
  borderLight: '#251F1C',
  divider: '#231E1A',
  textPrimary: '#F7EFE5', // warm ivory
  textSecondary: '#CBB59B', // sand — strong contrast
  textTertiary: '#9C846F', // muted but readable
  textInverse: '#150F0A', // dark ink for vivid fills
  textOnPrimary: '#1E1307',
  textOnAccent: '#231505',
  success: '#7FD394',
  successLight: '#173222',
  error: '#F48A6E',
  errorLight: '#47221A',
  warning: '#F0AE4E',
  warningLight: '#3D2D15',
  info: '#93C2E6',
  infoLight: '#1B2B3D',
  skeleton: '#262019',
  skeletonHighlight: '#362E28',
  overlay: 'rgba(5, 4, 3, 0.72)',
  shadow: 'rgba(0, 0, 0, 0.6)',
};