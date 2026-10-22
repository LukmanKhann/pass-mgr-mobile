import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import MaterialSymbols from '../../components/widgets/material-icon';

import { useTheme } from '../../hooks/use-theme.hook';
import { Button } from '../../components/controls/button';
import { Typography } from '../../components/widgets/typography';
import { useAppSettings } from './hooks/use-app-settings.hook';
import { LogoutModal } from './components/logout-modal.component';
import { UserProfileHeader } from './components/user-profile-header.component';
import { SectionHeader } from './components/section-header.component';
import { SettingItem } from './components/setting-item.component';
import { HeaderShadow } from '../../components/layouts/header-shadow';
import { SCREENS } from '../../navigation/navigation.constant';
import type { ISettingsStackParamList } from '../../navigation/navigation.type';

type Props = NativeStackScreenProps<ISettingsStackParamList, 'Settings'>;

const MODE_LABELS: Record<string, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const MODE_ICONS: Record<string, string> = {
  light: 'light_mode',
  dark: 'dark_mode',
  system: 'mobile_3',
};

export default function SettingsScreen({ navigation }: Props): JSX.Element {
  const { colors, mode, spacing } = useTheme();
  const { signOut } = useAppSettings();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const openSecurity = useCallback(
    () => navigation.navigate(SCREENS.SECURITY),
    [navigation],
  );
  const openAppearance = useCallback(
    () => navigation.navigate(SCREENS.APPEARANCE),
    [navigation],
  );
  const openData = useCallback(
    () => navigation.navigate(SCREENS.DATA),
    [navigation],
  );
  const openSupport = useCallback(
    () => navigation.navigate(SCREENS.SUPPORT),
    [navigation],
  );

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

  return (
    <View style={[styles.container, dynamicStyles.containerBackground]}>
      <HeaderShadow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserProfileHeader />

        <SectionHeader title="Security" />
        <SettingItem
          icon="shield_lock"
          title="Security"
          subtitle="Biometric, numeric password & auto-lock"
          showArrow
          onPress={openSecurity}
        />

        <SectionHeader title="Preferences" />
        <SettingItem
          icon={MODE_ICONS[mode] ?? 'palette'}
          title="Appearance"
          subtitle={`${MODE_LABELS[mode] ?? 'System'} theme`}
          showArrow
          onPress={openAppearance}
        />

        <SectionHeader title="Data" />
        <SettingItem
          icon="cloud_upload"
          title="Data"
          subtitle="Backup, export & import"
          showArrow
          onPress={openData}
        />

        <SectionHeader title="Support" />
        <SettingItem
          icon="help"
          title="Support"
          subtitle="Help, about & rate us"
          showArrow
          onPress={openSupport}
        />

        <View style={[styles.footer, dynamicStyles.logoutMargin]}>
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

          <View style={[styles.version, dynamicStyles.versionGap]}>
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
        </View>
      </ScrollView>

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          void signOut?.();
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
  footer: {
    gap: 24,
    paddingHorizontal: 16,
  },
  version: {
    alignItems: 'center',
  },
});
