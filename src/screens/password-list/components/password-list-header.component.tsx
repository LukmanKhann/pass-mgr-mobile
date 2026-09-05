import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Typography } from '../../../components/widgets/typography';
import { useTheme } from '../../../hooks/use-theme.hook';
import { CATEGORY_DOT_COLORS } from '../utils/password-list.util';
import type { IPasswordListCategory } from '../password-list.type';

interface IProps {
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  filteredPasswords: Array<{ category?: string }>;
  getPasswordsByCategory: (category: string) => Array<{ category?: string }>;
}

export function PasswordListHeader({
  selectedCategory,
  setSelectedCategory,
  filteredPasswords,
  getPasswordsByCategory,
}: IProps): JSX.Element {
  const { colors, borderRadius, spacing } = useTheme();

  const categories: IPasswordListCategory[] = [
    { id: 'all', name: 'All', count: filteredPasswords.length },
    { id: 'social', name: 'Social', count: getPasswordsByCategory('social').length },
    { id: 'work', name: 'Work', count: getPasswordsByCategory('work').length },
    { id: 'finance', name: 'Finance', count: getPasswordsByCategory('finance').length },
    { id: 'games', name: 'Games', count: getPasswordsByCategory('games').length },
    { id: 'personal', name: 'Personal', count: getPasswordsByCategory('personal').length },
    { id: 'shopping', name: 'Shopping', count: getPasswordsByCategory('shopping').length },
    { id: 'entertainment', name: 'Entertainment', count: getPasswordsByCategory('entertainment').length },
    { id: 'others', name: 'Others', count: getPasswordsByCategory('others').length },
  ];

  return (
    <View style={[styles.wrapper, { paddingBottom: spacing.md }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { gap: spacing.sm }]}
      >
        {categories.map((category: IPasswordListCategory) => {
          const active = selectedCategory === category.id;
          const dotColor = active
            ? colors.textOnAccent
            : CATEGORY_DOT_COLORS[category.id] ?? colors.accent;

          return (
            <TouchableOpacity
              key={category.id}
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
                  : { backgroundColor: colors.surface, borderColor: colors.borderLight, borderWidth: 1 },
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
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
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
});
