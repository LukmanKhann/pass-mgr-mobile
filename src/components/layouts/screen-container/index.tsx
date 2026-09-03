import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';

interface IProps {
  children: React.ReactNode;
  style?: object;
}

export function ScreenContainer({ children, style }: IProps): JSX.Element {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }, style]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex:  1,
  },
  keyboardAvoid: {
    flex:  1,
  },
});
