import React, { useContext, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../hooks/use-theme.hook';
import { Button } from '../../components/controls/button';
import { Input } from '../../components/controls/input';
import { Typography } from '../../components/widgets/typography';
import MaterialSymbols from '../../components/widgets/material-icon';
import PasswordContext from '../../context/PasswordContext/password-context.component';
import { CustomSnackbar } from '../../global/utils/snackbar.util';
import {
  CATEGORIES,
  CATEGORY_DOT_COLORS,
} from '../password-list/utils/password-list.util';
import {
  calculatePasswordStrength,
  generatePassword,
  getPasswordStrengthLevel,
} from '../password-generator/utils/password-generator.util';
import { SCREENS } from '../../navigation/shared/navigation.constant';
import { StrengthMeter } from '../../components/widgets/strength-meter';
import { HeaderShadow } from '../../components/layouts/header-shadow';

interface IProps {
  navigation: { navigate: (screen: string) => void };
}

export default function AddPasswordScreen({ navigation }: IProps): JSX.Element {
  const { colors, isDark, spacing, borderRadius } = useTheme();
  const { addPassword } = useContext(PasswordContext);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const strength = password ? calculatePasswordStrength(password) : '';
  const strengthLevel = getPasswordStrengthLevel(strength);
  const strengthColors: Record<string, string> = {
    Weak: colors.error,
    Medium: colors.warning,
    Strong: colors.success,
  };
  const strengthColor = strengthColors[strength] ?? colors.success;

  const elevatedCard: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    ...(isDark ? { borderWidth: 1, borderColor: colors.borderLight } : null),
  };

  const clearError = (field: string): void => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleGeneratePassword = (): void => {
    try {
      const generated = generatePassword(8, {
        lowerCase: true,
        upperCase: true,
        numbers: true,
        symbols: true,
      });
      setPassword(generated);
      setShowPassword(true);
      clearError('password');
    } catch {
      CustomSnackbar.error('Could not generate a password');
    }
  };

  const handleSave = async (): Promise<void> => {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = 'Domain is required';
    if (!username.trim()) nextErrors.username = 'Username is required';
    if (!password.trim()) nextErrors.password = 'Password is required';
    if (!category) nextErrors.category = 'Category is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await addPassword(title, username, password, category);
      setTitle('');
      setUsername('');
      setPassword('');
      setCategory('');
      setErrors({});
      CustomSnackbar.success('Credentials saved successfully');
      navigation.navigate(SCREENS.VAULT_TAB);
    } catch {
      CustomSnackbar.error('Failed to save credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <HeaderShadow />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
        >
          <View
            style={[
              styles.card,
              elevatedCard,
              {
                padding: spacing.lg,
                gap: spacing.md,
                marginHorizontal: spacing.lg,
              },
            ]}
          >
            <Input
              label="Domain"
              placeholder="example.com"
              autoCapitalize="none"
              value={title}
              onChangeText={(value: string) => {
                setTitle(value);
                clearError('title');
              }}
              error={errors.title}
              leftIcon={
                <MaterialSymbols
                  name="language"
                  size={20}
                  color={colors.textTertiary}
                />
              }
            />
            <Input
              label="Username"
              placeholder="you@example.com"
              autoCapitalize="none"
              value={username}
              onChangeText={(value: string) => {
                setUsername(value);
                clearError('username');
              }}
              error={errors.username}
              leftIcon={
                <MaterialSymbols
                  name="person"
                  size={20}
                  color={colors.textTertiary}
                />
              }
            />
            <Input
              label="Password"
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(value: string) => {
                setPassword(value);
                clearError('password');
              }}
              error={errors.password}
              leftIcon={
                <MaterialSymbols
                  name="lock"
                  size={20}
                  color={colors.textTertiary}
                />
              }
              rightIcon={
                <MaterialSymbols
                  name={showPassword ? 'visibility_off' : 'visibility'}
                  size={20}
                  color={colors.textTertiary}
                />
              }
              onRightIconPress={() => setShowPassword(prev => !prev)}
            />

            {password ? (
              <View style={[styles.strengthRow, { gap: spacing.sm }]}>
                <View style={styles.strengthSegments}>
                  <StrengthMeter level={strengthLevel} color={strengthColor} />
                </View>
                <Typography
                  variant="caption"
                  color={strengthColor}
                  fontWeight="600"
                >
                  {strength}
                </Typography>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleGeneratePassword}
              activeOpacity={0.7}
              style={[
                styles.generatePill,
                {
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.borderLight,
                  gap: spacing.sm,
                },
              ]}
            >
              <MaterialSymbols
                name="auto_awesome_mosaic"
                size={18}
                color={colors.accent}
              />
              <Typography
                variant="caption"
                color={colors.accent}
                fontWeight="600"
              >
                Generate strong password
              </Typography>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.card,
              elevatedCard,
              {
                padding: spacing.lg,
                gap: spacing.md,
                marginHorizontal: spacing.lg,
              },
            ]}
          >
            <Typography variant="label" color={colors.textSecondary}>
              Category
            </Typography>
            <View style={[styles.categoryRow, { gap: spacing.sm }]}>
              {CATEGORIES.map(cat => {
                const active = category === cat.value;
                const dotColor = active
                  ? colors.textOnAccent
                  : CATEGORY_DOT_COLORS[cat.value] ?? colors.accent;
                return (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => {
                      setCategory(cat.value);
                      clearError('category');
                    }}
                    activeOpacity={0.7}
                    style={[
                      styles.categoryChip,
                      {
                        borderRadius: borderRadius.full,
                        paddingHorizontal: spacing.md,
                        gap: 6,
                      },
                      active
                        ? { backgroundColor: colors.accent }
                        : {
                            backgroundColor: colors.surfaceElevated,
                            borderColor: colors.borderLight,
                            borderWidth: 1,
                          },
                    ]}
                  >
                    <View
                      style={[
                        styles.categoryDot,
                        { backgroundColor: dotColor },
                      ]}
                    />
                    <Typography
                      variant="caption"
                      color={
                        active ? colors.textOnAccent : colors.textSecondary
                      }
                      fontWeight="600"
                    >
                      {cat.label}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.category ? (
              <Typography variant="caption" color={colors.error}>
                {errors.category}
              </Typography>
            ) : null}
          </View>

          <View style={{ paddingHorizontal: spacing.lg }}>
            <Button
              title={loading ? 'Saving...' : 'Save Credential'}
              onPress={handleSave}
              variant="primary"
              fullWidth
              loading={loading}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 16,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strengthSegments: {
    flex: 1,
  },
  generatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
