import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import MaterialSymbols from '../../../components/widgets/material-icon';

import { Typography } from '../../../components/widgets/typography';
import { useTheme } from '../../../hooks/use-theme.hook';
import { CATEGORY_DOT_COLORS } from '../utils/password-list.util';
import type { IPasswordListCategory, ISortOrder } from '../password-list.type';

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

  const categories: IPasswordListCategory[] = [
    { id: 'all', name: 'All', count: filteredPasswords.length },
    {
      id: 'social',
      name: 'Social',
      count: getPasswordsByCategory('social').length,
    },
    { id: 'work', name: 'Work', count: getPasswordsByCategory('work').length },
    {
      id: 'finance',
      name: 'Finance',
      count: getPasswordsByCategory('finance').length,
    },
    {
      id: 'games',
      name: 'Games',
      count: getPasswordsByCategory('games').length,
    },
    {
      id: 'personal',
      name: 'Personal',
      count: getPasswordsByCategory('personal').length,
    },
    {
      id: 'shopping',
      name: 'Shopping',
      count: getPasswordsByCategory('shopping').length,
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      count: getPasswordsByCategory('entertainment').length,
    },
    {
      id: 'others',
      name: 'Others',
      count: getPasswordsByCategory('others').length,
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.contentContainer, { gap: spacing.sm }]}
    >
      <TouchableOpacity
        onPress={() => {
          if (sortOrder === 'asc') onSortChange('desc');
          else if (sortOrder === 'desc') onSortChange('none');
          else onSortChange('asc');
        }}
        style={[
          styles.sortButton,
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
          <View style={[styles.sortDot, { backgroundColor: colors.success }]} />
        )}
      </TouchableOpacity>
      {categories.map((category: IPasswordListCategory) => {
        const active = selectedCategory === category.id;
        const dotColor = active
          ? colors.textOnAccent
          : CATEGORY_DOT_COLORS[category.id] ?? colors.accent;

        return (
          <React.Fragment key={category.id}>
            <View
              style={[styles.divider, { backgroundColor: colors.borderLight }]}
            />
            <TouchableOpacity
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                {
                  borderRadius: borderRadius.full,
                  paddingHorizontal: spacing.md,
                  gap: 6,
                },
                active
                  ? { backgroundColor: colors.accent }
                  : {
                      backgroundColor: colors.surface,
                      borderColor: colors.borderLight,
                      borderWidth: 1,
                    },
              ]}
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
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 4,
    zIndex: 10,
    elevation: 10,
  },
  contentContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 34,
    paddingVertical: 8,
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  sortDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
