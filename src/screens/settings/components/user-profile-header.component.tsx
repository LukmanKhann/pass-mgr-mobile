import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import MaterialSymbols from '../../../components/widgets/material-icon';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Typography } from '../../../components/widgets/typography';
import { AuthContext } from '../../../Auth/AuthContext';

export function UserProfileHeader(): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const { user } = useContext(AuthContext);

  return (
    <View
      style={[
        styles.container,
        { gap: spacing.sm, borderBottomColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: colors.surfaceElevated,
            borderRadius: borderRadius.full,
          },
        ]}
      >
        <MaterialSymbols
          name="account_circle"
          size={40}
          color={colors.accent}
        />
      </View>
      <Typography variant="headingMd" color={colors.textPrimary}>
        {user?.displayName || 'User'}
      </Typography>
      <Typography variant="bodyMd" color={colors.textSecondary}>
        {user?.email || 'user@example.com'}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
