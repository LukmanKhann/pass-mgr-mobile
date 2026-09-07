import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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
import { LogoutModal } from './components/logout-modal.component';
import { UserProfileHeader } from './components/user-profile-header.component';
import { HeaderShadow } from '../../components/layouts/header-shadow';
import type { ISettingsStackParamList } from '../../navigation/navigation.type';

type Props = NativeStackScreenProps<ISettingsStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props): JSX.Element {
  const { colors, spacing } = useTheme();

  const dynamicStyles = {
    containerBackground: {
      backgroundColor: colors.background,
    },
    logoutMargin: {
      marginTop: spacing.xl,
    },
    versionGap: {
      gap: spacing.xs,
    },
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const appSettings = useAppSettings();
  const securitySettings = useSecuritySettings();
  const passwordSettings = usePasswordSettings({
    hasNumericPassword: securitySettings.hasNumericPassword,
    setHasNumericPassword: securitySettings.setHasNumericPassword,
    setBiometricEnabled: securitySettings.handleBiometricToggle,
    biometricEnabled: securitySettings.biometricEnabled,
  });

  const passwordUI = useMemo(
    () => ({
      ...passwordSettings,
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
      handleRemoveNumericPassword: passwordSettings.handleRemoveNumericPassword,
    }),
    [navigation, passwordSettings, securitySettings.hasNumericPassword],
  );

  if (securitySettings.loading) {
    return (
      <View style={[styles.container, dynamicStyles.containerBackground]}>
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
    <View style={[styles.container, dynamicStyles.containerBackground]}>
      <HeaderShadow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserProfileHeader />
        <SecuritySection
          securitySettings={securitySettings}
          passwordSettings={passwordUI}
        />
        <AppearanceSection navigation={navigation} mode={appSettings.mode} />
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

        <View style={[styles.logout, dynamicStyles.logoutMargin]}>
          <Button
            title="Sign Out"
            onPress={() => setShowLogoutModal(true)}
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
          style={[
            styles.version,
            dynamicStyles.versionGap,
            dynamicStyles.logoutMargin,
          ]}
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

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          void appSettings.signOut?.();
        }}
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
