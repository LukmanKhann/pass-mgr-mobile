import React from 'react';
import { Switch, TouchableOpacity } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import MaterialSymbols from '../../../components/widgets/material-icon';
import { SectionHeader } from './section-header.component';
import { SettingItem } from './setting-item.component';

interface ISecuritySettingsShape {
  biometricEnabled: boolean;
  biometricAvailable: boolean;
  biometryType: string;
  hasNumericPassword: boolean;
  autoLockEnabled: boolean;
  handleBiometricToggle: (enabled: boolean, suppressSnackbar?: boolean) => Promise<boolean>;
  handleAutoLockToggle: (enabled: boolean) => Promise<boolean>;
  getAuthenticationStatus: () => string;
  canEnableBiometric: () => boolean;
}

interface IPasswordSettingsShape {
  handleSetNumericPassword: () => void;
  handleRemoveNumericPassword: () => void;
}

interface IProps {
  securitySettings: ISecuritySettingsShape;
  passwordSettings: IPasswordSettingsShape;
}

export function SecuritySection({ securitySettings, passwordSettings }: IProps): JSX.Element {
  const { colors } = useTheme();
  const {
    biometricEnabled,
    biometryType,
    hasNumericPassword,
    autoLockEnabled,
    handleBiometricToggle,
    handleAutoLockToggle,
    getAuthenticationStatus,
    canEnableBiometric,
  } = securitySettings;
  const { handleSetNumericPassword, handleRemoveNumericPassword } = passwordSettings;

  return (
    <>
      <SectionHeader title="Security" />
      <SettingItem
        icon="shield_lock"
        title="Authentication Status"
        subtitle={`Current: ${getAuthenticationStatus()}`}
        rightComponent={
          <MaterialSymbols name="info" size={20} color={colors.textTertiary} />
        }
      />
      <SettingItem
        icon={biometryType === 'Face ID' ? 'person' : 'fingerprint'}
        title={`${biometryType} Authentication`}
        subtitle={
          !hasNumericPassword
            ? 'Requires numeric password to be set first'
            : `Use ${biometryType.toLowerCase()} to unlock`
        }
        disabled={!canEnableBiometric()}
        rightComponent={
          <Switch
            value={biometricEnabled}
            onValueChange={(value: boolean) => void handleBiometricToggle(value)}
            disabled={!canEnableBiometric()}
            trackColor={{ false: colors.border, true: colors.accentLight }}
            thumbColor={biometricEnabled ? colors.accent : colors.textTertiary}
          />
        }
      />
      <SettingItem
        icon="lock"
        title="Numeric Password"
        subtitle={hasNumericPassword ? 'Use 4-digit password to unlock' : 'Set up numeric password'}
        onPress={handleSetNumericPassword}
        showArrow={!hasNumericPassword}
        rightComponent={
          hasNumericPassword ? (
            <TouchableOpacity onPress={handleRemoveNumericPassword} activeOpacity={0.7}>
              <MaterialSymbols name="close" size={20} color={colors.error} />
            </TouchableOpacity>
          ) : undefined
        }
      />
      <SettingItem
        icon="shield_lock"
        title="Auto-lock"
        subtitle="Automatically lock after inactivity"
        rightComponent={
          <Switch
            value={autoLockEnabled}
            onValueChange={(value: boolean) => void handleAutoLockToggle(value)}
            trackColor={{ false: colors.border, true: colors.accentLight }}
            thumbColor={autoLockEnabled ? colors.accent : colors.textTertiary}
          />
        }
      />
    </>
  );
}
