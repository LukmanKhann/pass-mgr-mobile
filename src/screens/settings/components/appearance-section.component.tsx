import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import MaterialSymbols from '../../../components/widgets/material-icon';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Typography } from '../../../components/widgets/typography';
import { SCREENS } from '../../../navigation/navigation.constant';
import type { ISettingsStackParamList } from '../../../navigation/navigation.type';

type NavigationProp = NativeStackNavigationProp<
  ISettingsStackParamList,
  'Settings'
>;

interface IProps {
  navigation: NavigationProp;
  mode: 'light' | 'dark' | 'system';
}

const modeLabels: Record<string, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const modeIcons: Record<string, string> = {
  light: 'light_mode',
  dark: 'dark_mode',
  system: 'mobile_3',
};

export function AppearanceSection({ navigation, mode }: IProps): JSX.Element {
  const { colors, borderRadius } = useTheme();

  const handlePress = (): void => {
    navigation.navigate(SCREENS.APPEARANCE);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: borderRadius.lg,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: colors.surfaceElevated,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <MaterialSymbols
            name={modeIcons[mode] ?? 'palette'}
            size={24}
            color={colors.accent}
          />
        </View>
        <View style={styles.textContainer}>
          <Typography
            variant="bodyMd"
            color={colors.textPrimary}
            fontWeight="600"
          >
            Appearance
          </Typography>
          <Typography variant="caption" color={colors.textSecondary}>
            {modeLabels[mode] ?? 'System'} theme
          </Typography>
        </View>
        <MaterialSymbols
          name="chevron_right"
          size={24}
          color={colors.textTertiary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
});
