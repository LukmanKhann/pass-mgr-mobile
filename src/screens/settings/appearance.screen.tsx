import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import MaterialSymbols from '../../components/widgets/material-icon';

import { useTheme } from '../../hooks/use-theme.hook';
import { Typography } from '../../components/widgets/typography';
import { ScreenContainer } from '../../components/layouts/screen-container';

type ThemeMode = 'light' | 'dark' | 'system';

export default function AppearanceScreen(): JSX.Element {
  const { colors, mode, setMode, spacing, borderRadius } = useTheme();

  const options: Array<{
    value: ThemeMode;
    label: string;
    icon: string;
    description: string;
  }> = [
    {
      value: 'light',
      label: 'Light',
      icon: 'light_mode',
      description: 'Always use light theme',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: 'dark_mode',
      description: 'Always use dark theme',
    },
    {
      value: 'system',
      label: 'System',
      icon: 'mobile_3',
      description: 'Follow system settings',
    },
  ];

  const handleSelect = (value: ThemeMode): void => {
    setMode(value);
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {options.map(option => {
          const isSelected = mode === option.value;
          const optionDynamicStyle = {
            backgroundColor: colors.surface,
            borderColor: isSelected ? colors.accent : colors.border,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.md,
            borderWidth: isSelected ? 2 : 1,
          };
          const iconDynamicStyle = {
            backgroundColor: isSelected
              ? colors.accent
              : colors.surfaceElevated,
            borderRadius: borderRadius.full,
          };
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleSelect(option.value)}
              activeOpacity={0.7}
              style={[styles.option, optionDynamicStyle]}
            >
              <View style={styles.optionContent}>
                <View style={[styles.iconContainer, iconDynamicStyle]}>
                  <MaterialSymbols
                    name={option.icon}
                    size={24}
                    color={
                      isSelected ? colors.textOnAccent : colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.textContainer}>
                  <Typography
                    variant="bodyLg"
                    color={colors.textPrimary}
                    fontWeight="600"
                  >
                    {option.label}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary}>
                    {option.description}
                  </Typography>
                </View>
                {isSelected && (
                  <MaterialSymbols
                    name="check_circle"
                    size={24}
                    color={colors.accent}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  option: {
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
});
