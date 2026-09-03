import type { ViewStyle } from 'react-native';

export type ICardVariant = 'elevated' | 'outlined' | 'flat';

export interface ICardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: ICardVariant;
  padding?: number;
}
