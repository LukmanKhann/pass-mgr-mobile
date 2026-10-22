import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../hooks/use-theme.hook';
import { HeaderShadow } from '../../components/layouts/header-shadow';
import { SecuritySection } from './components/security-section.component';
import { AutoLockSheet } from './components/auto-lock-sheet.component';
import { useSecuritySettings } from './hooks/use-security-settings.hook';

export default function SecurityScreen(): JSX.Element {
  const { colors } = useTheme();
  const [showAutoLockSheet, setShowAutoLockSheet] = useState(false);

  const securitySettings = useSecuritySettings();

  const isFirstFocus = useRef(true);
  const refreshSettings = securitySettings.refreshSettings;

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      refreshSettings();
    }, [refreshSettings]),
  );

  const handleAutoLockSelect = async (minutes: number): Promise<void> => {
    const success = await securitySettings.handleAutoLockChange(minutes);
    if (success) {
      setShowAutoLockSheet(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderShadow />
      <ScrollView contentContainerStyle={styles.content}>
        <SecuritySection
          securitySettings={securitySettings}
          onAutoLockPress={() => setShowAutoLockSheet(true)}
        />
      </ScrollView>

      <AutoLockSheet
        visible={showAutoLockSheet}
        value={securitySettings.autoLockTimeout}
        onClose={() => setShowAutoLockSheet(false)}
        onSelect={minutes => {
          void handleAutoLockSelect(minutes);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
});
