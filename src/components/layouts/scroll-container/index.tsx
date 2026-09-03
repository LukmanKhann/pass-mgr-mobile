import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';

interface IProps extends ScrollViewProps {
  children: React.ReactNode;
}

export function ScrollContainer({ children, style, contentContainerStyle, ...rest }: IProps): JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.scrollView, { backgroundColor: colors.background }, style]}
      contentContainerStyle={[styles.content, { paddingBottom: spacing.xxl }, contentContainerStyle]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
