import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Typography } from '../../../components/widgets/typography';
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
    { id: 'other', name: 'Other', count: getPasswordsByCategory('other').length },
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { gap: spacing.sm }]}
      >
        {categories.map((category: IPasswordListCategory) => {
          const active = selectedCategory === category.id;
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
                  paddingVertical: spacing.xs,
                },
                active
                  ? { backgroundColor: colors.accent }
                  : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
              ]}
            >
              <Typography
                variant="caption"
                color={active ? colors.textOnAccent : colors.textSecondary}
                fontWeight="600"
              >
                {category.name} ({category.count})
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
    paddingVertical: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  chip: {
    marginRight: 0,
  },
});
