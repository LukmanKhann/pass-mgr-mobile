import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import MaterialSymbols from '../../../components/widgets/material-icon';

import { Typography } from '../../../components/widgets/typography';
import { useTheme } from '../../../hooks/use-theme.hook';
import { CATEGORY_DOT_COLORS } from '../utils/password-list.util';
import { PASSWORD_CATEGORIES } from '../../../global/constants/password-categories.constant';
import type { ISortOrder } from '../password-list.type';

const IOS_CHIP_ROW_TOP_PADDING = 180;
const ANDROID_CHIP_ROW_TOP_PADDING = 8;

interface IProps {
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  filteredPasswords: Array<{ category?: string }>;
  getPasswordsByCategory: (category: string) => Array<{ category?: string }>;
  sortOrder: ISortOrder;
  onSortChange: (order: ISortOrder) => void;
}

export function PasswordListHeader({
  selectedCategory,
  setSelectedCategory,
  filteredPasswords,
  getPasswordsByCategory,
  sortOrder,
  onSortChange,
}: IProps): JSX.Element {
  const { colors, borderRadius, spacing } = useTheme();

  const categories = PASSWORD_CATEGORIES.map(category => ({
    ...category,
    count:
      category.id === 'all'
        ? filteredPasswords.length
        : getPasswordsByCategory(category.id).length,
  }));

  const getChipStyle = (active: boolean) => ({
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    gap: 6,
    backgroundColor: active ? colors.accent : colors.surface,
    borderColor: active ? undefined : colors.borderLight,
    borderWidth: active ? 0 : 1,
  });

  return (
    <View
      style={[
        styles.chipRow,
        {
          paddingTop:
            Platform.OS === 'ios'
              ? IOS_CHIP_ROW_TOP_PADDING
              : ANDROID_CHIP_ROW_TOP_PADDING,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          onPress={() => {
            if (sortOrder === 'asc') onSortChange('desc');
            else if (sortOrder === 'desc') onSortChange('none');
            else onSortChange('asc');
          }}
          style={[
            styles.chip,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderLight,
              borderRadius: borderRadius.xl,
              gap: spacing.xs,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialSymbols name="swap_vert" size={18} color={colors.accent} />
          {sortOrder !== 'none' && (
            <View
              style={[styles.sortDot, { backgroundColor: colors.success }]}
            />
          )}
        </TouchableOpacity>
        {categories.map(category => {
          const active = selectedCategory === category.id;
          const dotColor = active
            ? colors.textOnAccent
            : CATEGORY_DOT_COLORS[category.id] ?? colors.accent;

          return (
            <React.Fragment key={category.id}>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.borderLight },
                ]}
              />
              <TouchableOpacity
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
                style={[styles.chip, getChipStyle(active)]}
              >
                <View style={[styles.dot, { backgroundColor: dotColor }]} />
                <Typography
                  variant="caption"
                  color={active ? colors.textOnAccent : colors.textSecondary}
                  fontWeight="600"
                >
                  {category.name} {category.count}
                </Typography>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 34,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  divider: {
    width: 1,
    height: 20,
    marginHorizontal: 4,
  },
  sortDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
