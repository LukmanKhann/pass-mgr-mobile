import React from 'react';
import { Switch } from 'react-native';

import MaterialSymbols from '../../../components/widgets/material-icon';

import { useTheme } from '../../../hooks/use-theme.hook';
import { formatAutoLockSubtitle } from '../../../components/Biometric/auto-lock.constants';
import { SectionHeader } from './section-header.component';
import { SettingItem } from './setting-item.component';

interface ISecuritySettingsShape {
  biometricEnabled: boolean;
  biometricAvailable: boolean;
  biometryType: string;
  autoLockTimeout: number;
  handleBiometricToggle: (enabled: boolean) => Promise<void>;
  getAuthenticationStatus: () => string;
  canEnableBiometric: () => boolean;
}

interface IProps {
  securitySettings: ISecuritySettingsShape;
  onAutoLockPress: () => void;
}

export function SecuritySection({
  securitySettings,
  onAutoLockPress,
}: IProps): JSX.Element {
  const { colors } = useTheme();
  const {
    biometricEnabled,
    biometryType,
    autoLockTimeout,
    handleBiometricToggle,
    getAuthenticationStatus,
    canEnableBiometric,
  } = securitySettings;

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
        title={biometryType}
        subtitle={
          !canEnableBiometric()
            ? 'Biometrics are not available on this device'
            : `Use ${biometryType.toLowerCase()} to unlock or disable the lock`
        }
        disabled={!canEnableBiometric()}
        rightComponent={
          <Switch
            value={biometricEnabled}
            onValueChange={(value: boolean) =>
              void handleBiometricToggle(value)
            }
            disabled={!canEnableBiometric()}
            trackColor={{ false: colors.border, true: colors.accentLight }}
            thumbColor={biometricEnabled ? colors.accent : colors.textTertiary}
          />
        }
      />
      <SettingItem
        icon="schedule"
        title="Auto-lock"
        subtitle={formatAutoLockSubtitle(autoLockTimeout)}
        onPress={onAutoLockPress}
        showArrow
      />
    </>
  );
}
