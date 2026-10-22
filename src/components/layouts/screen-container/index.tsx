import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { SafeAreaView } from 'react-native-safe-area-context';

interface IProps {
  children: React.ReactNode;
  style?: object;
}

export function ScreenContainer({ children, style }: IProps): JSX.Element {
  const { colors } = useTheme();

  const handleOutsidePress = (): void => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }, style]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback
          onPress={handleOutsidePress}
          accessible={false}
        >
          <View style={styles.keyboardArea}>{children}</View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  keyboardArea: {
    flex: 1,
  },
});
