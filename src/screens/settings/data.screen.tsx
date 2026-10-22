import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/use-theme.hook';
import { HeaderShadow } from '../../components/layouts/header-shadow';
import { DataSection } from './components/data-section.component';
import { useAppSettings } from './hooks/use-app-settings.hook';

export default function DataScreen(): JSX.Element {
  const { colors } = useTheme();
  const { handleBackupSync, handleExportData, handleImportData } =
    useAppSettings();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderShadow />
      <ScrollView contentContainerStyle={styles.content}>
        <DataSection
          handleBackupSync={handleBackupSync}
          handleExportData={handleExportData}
          handleImportData={handleImportData}
        />
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
});
