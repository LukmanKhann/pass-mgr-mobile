import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { SheetDetent } from '@lodev09/react-native-true-sheet';

export interface IAppBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onDidDismiss?: () => void;
  children: ReactNode;
  title?: string;
  subtitle?: string;
  detents?: SheetDetent[];
  dismissible?: boolean;
  showGrabber?: boolean;
  showCloseButton?: boolean;
  glass?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}
