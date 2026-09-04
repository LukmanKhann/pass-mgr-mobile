import React from 'react';
import { Switch } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { SectionHeader } from './section-header.component';
import { SettingItem } from './setting-item.component';

interface IProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function AppearanceSection({ isDark, toggleTheme }: IProps): JSX.Element {
  const { colors } = useTheme();

  return (
    <>
      <SectionHeader title="Appearance" />
      <SettingItem
        icon={isDark ? 'dark_mode' : 'light_mode'}
        title="Dark Mode"
        subtitle={`Currently using ${isDark ? 'dark' : 'light'} theme`}
        rightComponent={
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.accentLight }}
            thumbColor={isDark ? colors.accent : colors.textTertiary}
          />
        }
      />
    </>
  );
}
