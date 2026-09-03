import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Typography } from '../../../components/widgets/typography';
import MaterialSymbols from '../../../components/widgets/material-icon';
import type { ISortOrder, IViewMode } from '../password-list.type';

interface IProps {
  value: string;
  onChangeText: (text: string) => void;
  sortOrder: ISortOrder;
  onSortChange: (order: ISortOrder) => void;
  viewMode: IViewMode;
  setViewMode: (mode: IViewMode) => void;
}

export function PasswordListSearchBar({
  value,
  onChangeText,
  sortOrder,
  onSortChange,
  viewMode,
  setViewMode,
}: IProps): JSX.Element {
  const { colors, borderRadius, spacing } = useTheme();

  return (
    <View style={[styles.container, { gap: spacing.sm }]}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        <MaterialSymbols name="search" size={20} color={colors.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search Cred"
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 ? (
          <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.7}>
            <MaterialSymbols name="close" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={() => onSortChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        style={[
          styles.toggleButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
          },
        ]}
        activeOpacity={0.7}
      >
        <MaterialSymbols name="swap_vert" size={20} color={colors.accent} />
        <Typography variant="caption" color={colors.accent} fontWeight="600">
          {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
        </Typography>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        style={[
          styles.toggleButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
          },
        ]}
        activeOpacity={0.7}
      >
        <MaterialSymbols name={viewMode === 'grid' ? 'dashboard' : 'format_list_bulleted'} size={20} color={colors.accent} />
        <Typography variant="caption" color={colors.accent} fontWeight="600">
          {viewMode === 'grid' ? 'Grid' : 'List'}
        </Typography>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 44,
  },
  searchInput: {
    flex:  1,
    fontSize:  16,
    paddingVertical:  8,
    paddingHorizontal:  8,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minWidth: 60,
    paddingVertical: 6,
  },
});
