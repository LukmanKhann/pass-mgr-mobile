import type { ViewStyle } from 'react-native';

export type IButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type IButtonSize = 'sm' | 'md' | 'lg';

export interface IButtonProps {
  title: string;
  onPress: () => void;
  variant?: IButtonVariant;
  size?: IButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}
