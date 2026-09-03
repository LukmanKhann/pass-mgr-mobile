import { ViewStyle } from 'react-native';

export interface IModalProps {
  visible: boolean;
  title?: string;
   message?: string;
   onClose: () => void;
   onConfirm?: () => void;
   confirmTitle?: string;
   cancelTitle?: string;
   style?: ViewStyle;
}