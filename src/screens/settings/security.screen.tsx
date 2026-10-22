import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../hooks/use-theme.hook';
import { HeaderShadow } from '../../components/layouts/header-shadow';
import { SecuritySection } from './components/security-section.component';
import { AutoLockSheet } from './components/auto-lock-sheet.component';
import { useSecuritySettings } from './hooks/use-security-settings.hook';
import type { ISettingsStackParamList } from '../../navigation/navigation.type';

type Props = NativeStackScreenProps<ISettingsStackParamList, 'Security'>;

export default function SecurityScreen({ navigation }: Props): JSX.Element {
  const { colors } = useTheme();
  const [showAutoLockSheet, setShowAutoLockSheet] = useState(false);

  const securitySettings = useSecuritySettings();

  const passwordUI = useMemo(
    () => ({
      handleSetNumericPassword: () => {
        navigation.navigate('NumericPassword', {
          mode: 'set',
          title: securitySettings.hasNumericPassword
            ? 'Change Password'
            : 'Set Numeric Password',
          subtitle: securitySettings.hasNumericPassword
            ? 'Create a new 4-digit password'
            : 'Create a 4-digit password to unlock your vault',
        });
      },
      handleRemoveNumericPassword: () => {
        navigation.navigate('NumericPassword', { mode: 'remove' });
      },
    }),
    [navigation, securitySettings.hasNumericPassword],
  );

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
          passwordSettings={passwordUI}
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
