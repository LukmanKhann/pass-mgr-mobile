import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import NumericPasswordModal from '../../components/Biometric/components/numeric-password-modal.component';
import MaterialSymbols from '../../components/widgets/material-icon';

import { useTheme } from '../../hooks/use-theme.hook';
import { Button } from '../../components/controls/button';
import { Typography } from '../../components/widgets/typography';
import { useAppSettings } from './hooks/use-app-settings.hook';
import { usePasswordSettings } from './hooks/use-password-settings.hook';
import { useSecuritySettings } from './hooks/use-security-settings.hook';
import { AppearanceSection } from './components/appearance-section.component';
import { DataSection } from './components/data-section.component';
import { SecuritySection } from './components/security-section.component';
import { SupportSection } from './components/support-section.component';
import { UserProfileHeader } from './components/user-profile-header.component';
import { HeaderShadow } from '../../components/layouts/header-shadow';

export default function SettingsScreen(): JSX.Element {
  const { colors, spacing } = useTheme();
  const appSettings = useAppSettings();
  const securitySettings = useSecuritySettings();
  const passwordSettings = usePasswordSettings({
    hasNumericPassword: securitySettings.hasNumericPassword,
    setHasNumericPassword: securitySettings.setHasNumericPassword,
    setBiometricEnabled: securitySettings.handleBiometricToggle,
    biometricEnabled: securitySettings.biometricEnabled,
  });

  if (securitySettings.loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Typography
          variant="bodyMd"
          color={colors.textSecondary}
          style={styles.loading}
        >
          Loading settings...
        </Typography>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderShadow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserProfileHeader />
        <SecuritySection
          securitySettings={securitySettings}
          passwordSettings={passwordSettings}
        />
        <AppearanceSection
          isDark={appSettings.isDark}
          toggleTheme={appSettings.toggleTheme}
        />
        <DataSection
          handleBackupSync={appSettings.handleBackupSync}
          handleExportData={appSettings.handleExportData}
          handleImportData={appSettings.handleImportData}
        />
        <SupportSection
          handleHelpSupport={appSettings.handleHelpSupport}
          handleAbout={appSettings.handleAbout}
          handleRateApp={appSettings.handleRateApp}
        />

        <View style={[styles.logout, { marginTop: spacing.xl }]}>
          <Button
            title="Sign Out"
            onPress={appSettings.handleLogout}
            variant="danger"
            fullWidth
            icon={
              <MaterialSymbols
                name="logout"
                size={20}
                color={colors.textInverse}
              />
            }
          />
        </View>

        <View
          style={[styles.version, { gap: spacing.xs, marginTop: spacing.xl }]}
        >
          <Typography
            variant="caption"
            color={colors.textTertiary}
            align="center"
          >
            SecureVault v1.0.0
          </Typography>
          <Typography
            variant="caption"
            color={colors.textTertiary}
            align="center"
          >
            Made with love for your security
          </Typography>
        </View>
      </ScrollView>

      <NumericPasswordModal
        visible={passwordSettings.showSetPasswordModal}
        onClose={() => passwordSettings.setShowSetPasswordModal(false)}
        onSuccess={(password: string) =>
          void passwordSettings.handlePasswordSet(password)
        }
        title="Set Numeric Password"
        subtitle="Create a 4-digit password to unlock your vault"
        mode="set"
        maxLength={4}
      />

      <NumericPasswordModal
        visible={passwordSettings.showChangePasswordModal}
        onClose={() => passwordSettings.setShowChangePasswordModal(false)}
        onSuccess={(password: string) =>
          void passwordSettings.handlePasswordSet(password)
        }
        title="Change Password"
        subtitle="Create a new 4-digit password"
        mode="set"
        maxLength={4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
  },
  logout: {
    marginHorizontal: 16,
  },
  version: {
    alignItems: 'center',
  },
});
