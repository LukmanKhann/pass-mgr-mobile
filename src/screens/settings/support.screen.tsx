import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/use-theme.hook';
import { Typography } from '../../components/widgets/typography';
import { HeaderShadow } from '../../components/layouts/header-shadow';
import { SupportSection } from './components/support-section.component';
import { useAppSettings } from './hooks/use-app-settings.hook';

export default function SupportScreen(): JSX.Element {
  const { colors } = useTheme();
  const { handleHelpSupport, handleAbout, handleRateApp } = useAppSettings();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderShadow />
      <ScrollView contentContainerStyle={styles.content}>
        <SupportSection
          handleHelpSupport={handleHelpSupport}
          handleAbout={handleAbout}
          handleRateApp={handleRateApp}
        />

        <View style={styles.version}>
          <Typography variant="caption" color={colors.textTertiary}>
            SecureVault v1.0.0
          </Typography>
          <Typography variant="caption" color={colors.textTertiary}>
            Made with love for your security
          </Typography>
        </View>
      </ScrollView>
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
  version: {
    alignItems: 'center',
    gap: 4,
    marginTop: 40,
  },
});
