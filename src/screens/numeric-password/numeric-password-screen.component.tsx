import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import BiometricAuthService from '../../components/Biometric/service/BiometricAuth';

import { useTheme } from '../../hooks/use-theme.hook';
import { NumericPasswordForm } from './components/numeric-password-form.component';
import type { IRootStackParamList } from '../../navigation/navigation.type';

type Props = NativeStackScreenProps<IRootStackParamList, 'NumericPassword'>;

const PIN_LENGTH = 4;

export default function NumericPasswordScreen({
  navigation,
  route,
}: Props): JSX.Element {
  const { colors } = useTheme();
  const [hasExistingPin, setHasExistingPin] = useState<boolean | null>(null);

  const mode = route.params?.mode ?? 'set';

  useEffect(() => {
    let mounted = true;
    BiometricAuthService.hasNumericPassword()
      .then(exists => {
        if (mounted) {
          setHasExistingPin(exists);
        }
      })
      .catch(() => {
        if (mounted) {
          setHasExistingPin(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (mode === 'remove' && hasExistingPin === false) {
      navigation.goBack();
    }
  }, [hasExistingPin, mode, navigation]);

  const handleDone = useCallback(() => navigation.goBack(), [navigation]);

  if (hasExistingPin === null) {
    return (
      <SafeAreaView
        style={[styles.loading, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator color={colors.accent} size="small" />
      </SafeAreaView>
    );
  }

  return (
    <NumericPasswordForm
      mode={mode}
      hasExistingPin={hasExistingPin}
      maxLength={PIN_LENGTH}
      onDone={handleDone}
      onRemoved={handleDone}
      title={route.params?.title}
      subtitle={route.params?.subtitle}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
