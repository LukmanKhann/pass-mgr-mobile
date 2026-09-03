import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Badge } from '../../../components/widgets/badge';
import { Card } from '../../../components/widgets/card';
import { Icon } from '../../../components/widgets/icon';
import { Typography } from '../../../components/widgets/typography';
import type { IPasswordItemProps } from '../password-list.type';

export function PasswordItem({
  item,
  passwordVisible,
  loading,
  onTogglePasswordVisibility,
  onEdit,
  onDelete,
  onCopyUsername,
  onCopyPassword,
}: IPasswordItemProps): JSX.Element {
  const { colors, spacing } = useTheme();
  const [titleExpanded, setTitleExpanded] = useState(false);
  const [usernameExpanded, setUsernameExpanded] = useState(false);

  const getDomainColor = (domain: string): string => {
    const palette = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
    const index = domain ? domain.length % palette.length : 0;
    return palette[index];
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const copy = (value: string, kind: 'username' | 'password') => {
    Clipboard.setString(value);
    if (kind === 'username') onCopyUsername(value);
    else onCopyPassword(value);
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={[styles.headerRow, { gap: spacing.md }]}>
        <View
          style={[styles.domainIcon, { backgroundColor: getDomainColor(item.title) }]}
        >
          <Typography variant="bodyLg" color={colors.textInverse} align="center" fontWeight="700">
            {item.title?.charAt(0)?.toUpperCase() || 'U'}
          </Typography>
        </View>
        <View style={[styles.titleBlock, { gap: spacing.xxs }]}>
          <Typography
            variant="subtitleMd"
            color={colors.textPrimary}
            align="left"
            numberOfLines={titleExpanded ? 0 : 1}
            onPress={() => setTitleExpanded(prev => !prev)}
          >
            {titleExpanded ? item.title || 'Untitled' : truncateText(item.title || 'Untitled', 30)}
          </Typography>
          <Typography
            variant="caption"
            color={colors.textSecondary}
            align="left"
            numberOfLines={usernameExpanded ? 0 : 1}
            onPress={() => setUsernameExpanded(prev => !prev)}
          >
            {usernameExpanded ? item.username || 'No username' : truncateText(item.username || 'No username', 30)}
          </Typography>
          {item.category ? <Badge label={item.category} /> : null}
        </View>
      </View>

      {passwordVisible && (
        <View style={[styles.passwordReveal, { backgroundColor: colors.surfaceElevated, marginTop: spacing.md }]}>
          <Typography variant="bodyMd" color={colors.textPrimary} align="left">
            {item.password || 'No password'}
          </Typography>
        </View>
      )}

      <View style={[styles.actions, { gap: spacing.sm, marginTop: spacing.md, borderTopColor: colors.border }]}>
        <Icon
          name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
          size={20}
          color={colors.accent}
          onPress={() => onTogglePasswordVisibility(item.id)}
        />
        <Icon
          name="content-copy"
          size={20}
          color={item.username ? colors.textSecondary : colors.textTertiary}
          onPress={() => item.username && copy(item.username, 'username')}
        />
        <Icon
          name="vpn-key"
          size={20}
          color={item.password ? colors.textSecondary : colors.textTertiary}
          onPress={() => item.password && copy(item.password, 'password')}
        />
        <Icon
          name="pencil-outline"
          size={20}
          color={colors.textSecondary}
          onPress={() => onEdit(item.id)}
        />
        <Icon
          name="trash-can-outline"
          size={20}
          color={colors.error}
          onPress={() => onDelete(item.id)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  domainIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
  },
  passwordReveal: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 12,
  },
});
