import React, { useContext, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native';

import { useTheme } from '../../hooks/use-theme.hook';
import { Button } from '../../components/controls/button';
import { Input } from '../../components/controls/input';
import { ScreenContainer } from '../../components/layouts/screen-container';
import { Typography } from '../../components/widgets/typography';
import MaterialSymbols from '../../components/widgets/material-icon';
import PasswordContext from '../../context/PasswordContext/password-context.component';
import { CustomSnackbar } from '../../global/utils/snackbar.util';
import { CATEGORIES } from '../password-list/utils/password-list.util';

interface IProps {
  navigation: { navigate: (screen: string) => void };
}

export default function AddPasswordScreen({ navigation }: IProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const { addPassword } = useContext(PasswordContext);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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
      CustomSnackbar.success('Credentials saved successfully');
      navigation.navigate('Vault');
    } catch (error) {
      CustomSnackbar.error('Failed to save credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.header, { gap: spacing.sm }]}>
            <View
              style={[
                styles.headerIcon,
                {
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.surfaceElevated,
                },
              ]}
            >
              <MaterialSymbols name="shield_lock" variant="filled" size={32} color={colors.accent} />
            </View>
            <Typography variant="headingMd" color={colors.textPrimary} align="center">
              Add New Credential
            </Typography>
            <Typography variant="bodyMd" color={colors.textSecondary} align="center">
              Secure your digital identity with encrypted storage
            </Typography>
          </View>

          <View style={[styles.form, { gap: spacing.lg }]}>
            <Input
              label="Domain"
              placeholder="example.com"
              autoCapitalize="none"
              value={title}
              onChangeText={setTitle}
              error={errors.title}
              leftIcon={
                <MaterialSymbols name="verified_user" size={20} color={colors.textTertiary} />
              }
            />
            <Input
              label="Username"
              placeholder="jane@example.com"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
              error={errors.username}
              leftIcon={
                <MaterialSymbols name="person" size={20} color={colors.textTertiary} />
              }
            />
            <Input
              label="Password"
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              leftIcon={
                <MaterialSymbols name="lock" size={20} color={colors.textTertiary} />
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

            <View style={[styles.categoryWrap, { gap: spacing.xs }]}>
              <Typography variant="label" color={colors.textSecondary}>
                Category
              </Typography>
              <View style={[styles.categoryRow, { gap: spacing.sm }]}>
                {CATEGORIES.map(cat => {
                  const active = category === cat.value;
                  return (
                    <View key={cat.value} style={[styles.categoryChipWrap, { gap: spacing.sm }]}>
                      <TouchableOpacity
                        onPress={() => setCategory(cat.value)}
                        activeOpacity={0.7}
                        style={[
                          styles.categoryChip,
                          active
                            ? { backgroundColor: colors.accent }
                            : { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderWidth: 1 },
                        ]}
                      >
                        <Typography
                          variant="caption"
                          color={active ? colors.textOnAccent : colors.textSecondary}
                          fontWeight="600"
                        >
                          {cat.label}
                        </Typography>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
              {errors.category ? (
                <Typography variant="caption" color={colors.error}>
                  {errors.category}
                </Typography>
              ) : null}
            </View>

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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
  },
  categoryWrap: {
    width: '100%',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChipWrap: {
    marginBottom: 6,
  },
  categoryChip: {
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
