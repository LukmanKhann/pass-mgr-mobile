import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Button } from '../../../components/controls/button';
import { Input } from '../../../components/controls/input';
import { Typography } from '../../../components/widgets/typography';
import MaterialSymbols from '../../../components/widgets/material-icon';
import type { IPasswordItem } from '../../../global/types/common.type';
import { CATEGORIES } from '../utils/password-list.util';

interface IProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (values: IPasswordItem) => Promise<void>;
  title: string;
  username: string;
  password: string;
  category: string;
  passwordVisible: boolean;
  onTogglePasswordVisibility: (value: boolean) => void;
  loading: boolean;
}

export function EditPasswordModal({
  visible,
  onDismiss,
  onSave,
  title: initialTitle,
  username: initialUsername,
  password: initialPassword,
  category: initialCategory,
  passwordVisible,
  onTogglePasswordVisibility,
  loading,
}: IProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const [title, setTitle] = useState(initialTitle);
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);
  const [category, setCategory] = useState(initialCategory || 'others');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setTitle(initialTitle);
    setUsername(initialUsername);
    setPassword(initialPassword);
    setCategory(initialCategory || 'others');
    setErrors({});
  }, [visible, initialTitle, initialUsername, initialPassword, initialCategory]);

  const handleSave = async (): Promise<void> => {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = 'Domain is required';
    if (!username.trim()) nextErrors.username = 'Username is required';
    if (!password.trim()) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    await onSave({ id: '', title, username, password, category });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              borderRadius: borderRadius.xl,
              padding: spacing.xl,
            },
          ]}
        >
          <Typography variant="headingMd" color={colors.textPrimary} align="center" style={styles.title}>
            Edit Credentials
          </Typography>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.form}>
            <Input
              label="Domain"
              value={title}
              onChangeText={setTitle}
              error={errors.title}
              placeholder="example.com"
              autoCapitalize="none"
            />
            <Input
              label="Username"
              value={username}
              onChangeText={setUsername}
              error={errors.username}
              placeholder="jane@example.com"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry={!passwordVisible}
              rightIcon={
                <MaterialSymbols
                  name={passwordVisible ? 'visibility_off' : 'visibility'}
                  size={20}
                  color={colors.textTertiary}
                />
              }
              onRightIconPress={() => onTogglePasswordVisibility(!passwordVisible)}
            />

            <View style={[styles.categoryWrap, { gap: spacing.xs }]}>
              <Typography variant="label" color={colors.textSecondary}>
                Category
              </Typography>
              <View style={[styles.categoryRow, { gap: spacing.sm }]}>
                {CATEGORIES.map(cat => {
                  const active = category === cat.value;
                  return (
                    <TouchableOpacity
                      key={cat.value}
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
                  );
                })}
              </View>
            </View>

            <View style={[styles.buttonRow, { gap: spacing.md, marginTop: spacing.lg }]}>
              <Button title="Cancel" onPress={onDismiss} variant="outline" style={styles.button} disabled={loading} />
              <Button
                title={loading ? 'Saving...' : 'Save Changes'}
                onPress={handleSave}
                variant="primary"
                style={styles.button}
                loading={loading}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxHeight: 520,
  },
  form: {
    marginTop: 8,
  },
  title: {
    marginBottom: 4,
  },
  categoryWrap: {
    marginTop: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  button: {
    flex:  1,
  },
});
