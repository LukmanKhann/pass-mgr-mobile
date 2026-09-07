import React, { useEffect, useRef } from 'react';
import {
  Animated,
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

const IOS_PADDING_FOCUSED = 125;
const IOS_PADDING_UNFOCUSED = 180;
const ANIMATION_DURATION = 250;

interface IProps {
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  filteredPasswords: Array<{ category?: string }>;
  getPasswordsByCategory: (category: string) => Array<{ category?: string }>;
  sortOrder: ISortOrder;
  onSortChange: (order: ISortOrder) => void;
  isSearchFocused: boolean;
}

export function PasswordListHeader({
  selectedCategory,
  setSelectedCategory,
  filteredPasswords,
  getPasswordsByCategory,
  sortOrder,
  onSortChange,
  isSearchFocused,
}: IProps): JSX.Element {
  const { colors, borderRadius, spacing } = useTheme();
  const paddingAnim = useRef(
    new Animated.Value(Platform.OS === 'ios' ? IOS_PADDING_UNFOCUSED : 8),
  ).current;

  useEffect(() => {
    const targetPadding =
      Platform.OS === 'ios'
        ? isSearchFocused
          ? IOS_PADDING_FOCUSED
          : IOS_PADDING_UNFOCUSED
        : 8;

    Animated.timing(paddingAnim, {
      toValue: targetPadding,
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
  }, [isSearchFocused, paddingAnim]);

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
    <Animated.View style={[styles.chipRow, { paddingVertical: paddingAnim }]}>
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
    </Animated.View>
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
