import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { useTheme } from '../../../hooks/use-theme.hook';
import MaterialSymbols from '../../../components/widgets/material-icon';
import { Typography } from '../../../components/widgets/typography';
import { CATEGORY_DOT_COLORS } from '../utils/password-list.util';
import type { IPasswordItemProps } from '../password-list.type';

const DOMAIN_PALETTE = [
  '#6C7BF2',
  '#3FA37F',
  '#E89B3F',
  '#DE6A5C',
  '#9856E6',
  '#3FA6C9',
  '#8FB93A',
  '#E07B54',
];

function getDomainColor(title: string): string {
  const palette = DOMAIN_PALETTE;
  const index = title ? title.length % palette.length : 0;
  return palette[index];
}

function capitalize(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function PasswordItem({
  item,
  passwordVisible,
  onTogglePasswordVisibility,
  onEdit,
  onDelete,
  onCopyUsername,
  onCopyPassword,
}: IPasswordItemProps): JSX.Element {
  const { colors, isDark, borderRadius, spacing } = useTheme();
  const domainColor = getDomainColor(item.title);
  const username = item.username || 'No username';
  const title = item.title || 'Untitled';

  const copy = (value: string, kind: 'username' | 'password') => {
    if (!value) return;
    Clipboard.setString(value);
    if (kind === 'username') onCopyUsername(value);
    else onCopyPassword(value);
  };

  const elevatedStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    ...(isDark ? { borderWidth: 1, borderColor: colors.borderLight } : null),
  };

  return (
    <Animated.View style={[styles.card, elevatedStyle]}>
      <TouchableOpacity
        style={[styles.topRow, { gap: spacing.md, padding: spacing.md }]}
        activeOpacity={0.7}
        onPress={() => onTogglePasswordVisibility(item.id)}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: `${domainColor}22`, borderRadius: borderRadius.md },
          ]}
        >
          <Typography variant="subtitleMd" color={domainColor} fontWeight="700">
            {title.charAt(0).toUpperCase()}
          </Typography>
        </View>

        <View style={styles.textBlock}>
          <Typography variant="subtitleMd" color={colors.textPrimary} numberOfLines={1}>
            {title}
          </Typography>
          <Typography variant="bodyMd" color={colors.textSecondary} numberOfLines={1}>
            {username}
          </Typography>
        </View>

        <MaterialSymbols
          name={passwordVisible ? 'visibility_off' : 'visibility'}
          size={22}
          color={colors.accent}
        />
      </TouchableOpacity>

      {item.category ? (
        <View style={[styles.categoryRow, { paddingHorizontal: spacing.md, gap: 6 }]}>
          <View
            style={[
              styles.categoryDot,
              { backgroundColor: CATEGORY_DOT_COLORS[item.category.toLowerCase()] ?? colors.accent },
            ]}
          />
          <Typography variant="caption" color={colors.textSecondary} fontWeight="600">
            {capitalize(item.category)}
          </Typography>
        </View>
      ) : null}

      {passwordVisible ? (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOutUp.duration(150)}
          style={[
            styles.passwordPanel,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.borderLight,
              borderRadius: borderRadius.md,
              marginHorizontal: spacing.md,
              marginTop: spacing.sm,
              gap: spacing.sm,
            },
          ]}
        >
          <MaterialSymbols name="lock" size={16} color={colors.textTertiary} />
          <Typography
            variant="bodyLg"
            color={colors.textPrimary}
            fontWeight="700"
            numberOfLines={1}
            selectable
            style={styles.passwordText}
          >
            {item.password || 'No password'}
          </Typography>
          <TouchableOpacity
            onPress={() => copy(item.password, 'password')}
            disabled={!item.password}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <MaterialSymbols name="assignment" size={18} color={colors.accent} />
          </TouchableOpacity>
        </Animated.View>
      ) : null}

      <View style={[styles.actions, { borderTopColor: colors.border, padding: spacing.md, gap: spacing.sm }]}>
        <TouchableOpacity
          style={[styles.copyButton, { borderRadius: borderRadius.md }]}
          onPress={() => copy(item.username, 'username')}
          disabled={!item.username}
          activeOpacity={0.7}
        >
          <MaterialSymbols name="person" size={16} color={colors.textSecondary} />
          <Typography variant="caption" color={colors.textSecondary} fontWeight="600">
            Copy user
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.copyButton, { borderRadius: borderRadius.md }]}
          onPress={() => copy(item.password, 'password')}
          disabled={!item.password}
          activeOpacity={0.7}
        >
          <MaterialSymbols name="lock" size={16} color={colors.textSecondary} />
          <Typography variant="caption" color={colors.textSecondary} fontWeight="600">
            Copy pass
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: colors.surfaceElevated, borderRadius: borderRadius.full },
          ]}
          onPress={() => onEdit(item.id)}
          activeOpacity={0.7}
        >
          <MaterialSymbols name="edit" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: colors.surfaceElevated, borderRadius: borderRadius.full },
          ]}
          onPress={() => onDelete(item.id)}
          activeOpacity={0.7}
        >
          <MaterialSymbols name="delete" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    marginRight: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  passwordPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  passwordText: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 10,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    gap: 6,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});