import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/use-theme.hook';
import { Button } from '../../components/controls/button';
import { Input } from '../../components/controls/input';
import { ScreenContainer } from '../../components/layouts/screen-container';
import { Typography } from '../../components/widgets/typography';
import MaterialSymbols from '../../components/widgets/material-icon';
import PasswordContext from '../../context/PasswordContext/password-context.component';
import { CustomSnackbar } from '../../global/utils/snackbar.util';

interface IProps {
  navigation: { navigate: (screen: string) => void };
  route: { params: { id: string } };
}

export default function EditPasswordScreen({ navigation, route }: IProps): JSX.Element {
  const { colors, spacing } = useTheme();
  const { passwords, editPassword } = useContext(PasswordContext);
  const { id } = route.params;
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const passwordToEdit = passwords.find(item => item.id === id);
    if (passwordToEdit) {
      setTitle(passwordToEdit.title);
      setUsername(passwordToEdit.username);
      setPassword(passwordToEdit.password);
    }
  }, [id, passwords]);

  const handleSave = async (): Promise<void> => {
    if (!title.trim() || !username.trim() || !password.trim()) {
      CustomSnackbar.warning('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await editPassword(id, title, username, password, 'others');
      CustomSnackbar.success('Password updated successfully');
      navigation.navigate('Vault');
    } catch (error) {
      CustomSnackbar.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { gap: spacing.sm }]}>
          <MaterialSymbols name="edit" size={40} color={colors.accent} />
          <Typography variant="headingMd" color={colors.textPrimary} align="center">
            Edit Credentials
          </Typography>
        </View>

        <View style={[styles.form, { gap: spacing.lg }]}>
          <Input
            label="Domain"
            placeholder="example.com"
            autoCapitalize="none"
            value={title}
            onChangeText={setTitle}
          />
          <Input
            label="Username"
            placeholder="jane@example.com"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <Input
            label="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            rightIcon={
              <MaterialSymbols
                name={showPassword ? 'visibility_off' : 'visibility'}
                size={20}
                color={colors.textTertiary}
              />
            }
            onRightIconPress={() => setShowPassword(prev => !prev)}
          />
          <Button
            title={loading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            variant="primary"
            fullWidth
            loading={loading}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
});
