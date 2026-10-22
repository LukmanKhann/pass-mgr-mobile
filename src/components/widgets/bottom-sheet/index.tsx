import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { TrueSheet, type SheetDetent } from '@lodev09/react-native-true-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../hooks/use-theme.hook';
import { SheetCloseButton } from './components/sheet-close-button.component';
import { SheetHeader } from './components/sheet-header.component';
import type { IAppBottomSheetProps } from './bottom-sheet.type';

const DEFAULT_DETENTS: SheetDetent[] = ['auto'];

export function AppBottomSheet({
  visible,
  onClose,
  onDidDismiss,
  children,
  title,
  subtitle,
  detents = DEFAULT_DETENTS,
  dismissible = true,
  showGrabber = true,
  showCloseButton = true,
  glass = true,
  contentStyle,
}: IAppBottomSheetProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<TrueSheet>(null);
  const visibleRef = useRef(visible);
  const presentedRef = useRef(false);
  // Let TrueSheet use Liquid Glass on iOS 26+ and its native blur on older iOS.
  const useIosGlassAppearance = glass && Platform.OS === 'ios';

  useEffect(() => {
    visibleRef.current = visible;

    const sheet = sheetRef.current;
    if (!sheet) {
      return;
    }

    if (visible) {
      presentedRef.current = true;
      sheet.present().catch(() => undefined);
      return;
    }

    if (presentedRef.current) {
      presentedRef.current = false;
      sheet.dismiss().catch(() => undefined);
    }
  }, [visible]);

  const handleDidDismiss = useCallback((): void => {
    presentedRef.current = false;
    if (visibleRef.current) {
      onClose();
    }
    onDidDismiss?.();
  }, [onClose, onDidDismiss]);

  return (
    <TrueSheet
      ref={sheetRef}
      detents={detents}
      dismissible={dismissible}
      grabber={showGrabber}
      grabberOptions={showGrabber ? { topMargin: spacing.lg } : undefined}
      dimmed
      cornerRadius={borderRadius.xl}
      {...(useIosGlassAppearance ? {} : { backgroundColor: colors.surface })}
      onDidDismiss={handleDidDismiss}
    >
      <View style={styles.root}>
        <View
          style={[
            styles.content,
            {
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.huge,
              paddingBottom: Math.max(insets.bottom, spacing.lg),
            },
            contentStyle,
          ]}
        >
          {title ? <SheetHeader title={title} subtitle={subtitle} /> : null}
          {children}
        </View>
        {showCloseButton && dismissible ? (
          <SheetCloseButton onClose={onClose} top={spacing.xxxl} />
        ) : null}
      </View>
    </TrueSheet>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  content: {
    width: '100%',
  },
});
