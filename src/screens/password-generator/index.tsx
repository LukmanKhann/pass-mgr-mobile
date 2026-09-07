import React, { useState } from 'react';
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
import Slider from '@react-native-community/slider';
import Clipboard from '@react-native-clipboard/clipboard';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Animated, { FadeInDown } from 'react-native-reanimated';
import MaterialSymbols from '../../components/widgets/material-icon';

import { useTheme } from '../../hooks/use-theme.hook';
import { Button } from '../../components/controls/button';
import { Typography } from '../../components/widgets/typography';
import { CustomSnackbar } from '../../global/utils/nitro-toast.util';
import {
  calculatePasswordStrength,
  generatePassword,
  getPasswordStrengthLevel,
} from './utils/password-generator.util';
import { StrengthMeter } from '../../components/widgets/strength-meter';
import { HeaderShadow } from '../../components/layouts/header-shadow';

interface IOptionRowProps {
  label: string;
  icon: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

function OptionRow({
  label,
  icon,
  value,
  onToggle,
}: IOptionRowProps): JSX.Element {
  const { colors, isDark, spacing, borderRadius } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(!value)}
      style={[
        styles.optionRow,
        {
          backgroundColor: colors.surface,
          borderColor: isDark ? colors.borderLight : colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          gap: spacing.md,
        },
      ]}
    >
      <View
        style={[
          styles.iconWell,
          {
            backgroundColor: colors.surfaceElevated,
            borderRadius: borderRadius.md,
          },
        ]}
      >
        <MaterialSymbols
          name={icon}
          size={20}
          color={value ? colors.accent : colors.textTertiary}
        />
      </View>
      <Typography
        variant="bodyMd"
        color={colors.textPrimary}
        style={styles.optionLabel}
      >
        {label}
      </Typography>
      <BouncyCheckbox
        disableText
        isChecked={value}
        size={24}
        fillColor={colors.accent}
        unFillColor={colors.surface}
        iconStyle={{
          borderRadius: 6,
          borderWidth: 1.5,
          borderColor: value ? colors.accent : colors.border,
        }}
        innerIconStyle={{ borderRadius: 6 }}
        iconComponent={
          <MaterialSymbols name="check" size={16} color={colors.textOnAccent} />
        }
        onPress={onToggle}
      />
    </TouchableOpacity>
  );
}

export default function PasswordGenerator(): JSX.Element {
  const { colors, isDark, spacing, borderRadius } = useTheme();
  const [password, setPassword] = useState('');
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
  const [lowerCase, setLowerCase] = useState(true);
  const [upperCase, setUpperCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [sliderValue, setSliderValue] = useState(8);

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

  const strengthLevel = getPasswordStrengthLevel(passwordStrength);
  const strengthColors: Record<string, string> = {
    Weak: colors.error,
    Medium: colors.warning,
    Strong: colors.success,
  };
  const strengthColor = strengthColors[passwordStrength] ?? colors.success;

  const handleGenerate = (): void => {
    try {
      const result = generatePassword(sliderValue, {
        lowerCase,
        upperCase,
        numbers,
        symbols,
      });
      setPassword(result);
      setIsPasswordGenerated(true);
      setPasswordStrength(calculatePasswordStrength(result));
    } catch {
      CustomSnackbar.error('Please select at least one character type');
    }
  };

  const handleCopy = async (): Promise<void> => {
    await Clipboard.setString(password);
    CustomSnackbar.success('Password copied to clipboard');
  };

  const resetAll = (): void => {
    setPassword('');
    setIsPasswordGenerated(false);
    setPasswordStrength('');
    setLowerCase(true);
    setUpperCase(false);
    setNumbers(false);
    setSymbols(false);
    setSliderValue(8);
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
              { marginHorizontal: spacing.lg, padding: spacing.lg },
            ]}
          >
            <View style={styles.sliderHeader}>
              <Typography variant="label" color={colors.textSecondary}>
                Length
              </Typography>
              <Typography
                variant="numberDisplay"
                color={colors.accent}
                fontWeight="700"
              >
                {sliderValue}
              </Typography>
            </View>
            <Slider
              minimumValue={8}
              maximumValue={32}
              step={1}
              value={sliderValue}
              onValueChange={(value: number) => setSliderValue(value)}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.accent}
            />
            <View style={styles.sliderRange}>
              <Typography variant="caption" color={colors.textTertiary}>
                8
              </Typography>
              <Typography variant="caption" color={colors.textTertiary}>
                32
              </Typography>
            </View>
          </View>

          <View
            style={[
              styles.options,
              { paddingHorizontal: spacing.lg, gap: spacing.sm },
            ]}
          >
            <OptionRow
              label="Lowercase letters"
              icon="text_fields"
              value={lowerCase}
              onToggle={setLowerCase}
            />
            <OptionRow
              label="Uppercase letters"
              icon="keyboard_capslock"
              value={upperCase}
              onToggle={setUpperCase}
            />
            <OptionRow
              label="Numbers"
              icon="dialpad"
              value={numbers}
              onToggle={setNumbers}
            />
            <OptionRow
              label="Special characters"
              icon="asterisk"
              value={symbols}
              onToggle={setSymbols}
            />
          </View>

          {isPasswordGenerated ? (
            <Animated.View
              entering={FadeInDown.duration(250)}
              style={[
                styles.card,
                elevatedCard,
                { marginHorizontal: spacing.lg, padding: spacing.lg },
              ]}
            >
              <View style={styles.passwordHeader}>
                <Typography variant="label" color={colors.textSecondary}>
                  Generated Password
                </Typography>
                <View
                  style={[
                    styles.strengthBadge,
                    {
                      backgroundColor: strengthColor,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                >
                  <Typography
                    variant="caption"
                    color={colors.textInverse}
                    fontWeight="600"
                  >
                    {passwordStrength}
                  </Typography>
                </View>
              </View>
              <StrengthMeter
                level={strengthLevel}
                color={strengthColor}
                style={{ marginVertical: spacing.md }}
              />
              <Typography
                variant="tokenDisplay"
                color={colors.textPrimary}
                align="center"
                selectable
                style={styles.passwordText}
              >
                {password}
              </Typography>
              <View style={[styles.passwordActions, { gap: spacing.md }]}>
                <Button
                  title="Copy"
                  onPress={handleCopy}
                  variant="outline"
                  icon={
                    <MaterialSymbols
                      name="assignment"
                      size={18}
                      color={colors.primary}
                    />
                  }
                  style={styles.actionButton}
                />
                <Button
                  title="Regenerate"
                  onPress={handleGenerate}
                  variant="primary"
                  icon={
                    <MaterialSymbols
                      name="refresh"
                      size={18}
                      color={colors.textOnPrimary}
                    />
                  }
                  style={styles.actionButton}
                />
              </View>
            </Animated.View>
          ) : (
            <View style={{ paddingHorizontal: spacing.lg }}>
              <Button
                title="Generate Password"
                onPress={handleGenerate}
                variant="primary"
                fullWidth
                icon={
                  <MaterialSymbols
                    name="bolt"
                    size={18}
                    color={colors.textOnPrimary}
                  />
                }
                style={styles.generateButton}
              />
            </View>
          )}

          <View style={{ paddingHorizontal: spacing.lg }}>
            <Button
              title="Reset All"
              onPress={resetAll}
              variant="ghost"
              fullWidth
              style={styles.resetButton}
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
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  options: {
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  iconWell: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    flex: 1,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  passwordText: {
    marginVertical: 12,
  },
  passwordActions: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
  },
  generateButton: {
    marginBottom: 8,
  },
  resetButton: {
    marginBottom: 24,
  },
});
