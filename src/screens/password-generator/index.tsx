import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import Clipboard from '@react-native-clipboard/clipboard';

import { useTheme } from '../../hooks/use-theme.hook';
import { Button } from '../../components/controls/button';
import { Typography } from '../../components/widgets/typography';
import MaterialSymbols from '../../components/widgets/material-icon';
import { CustomSnackbar } from '../../global/utils/snackbar.util';
import { calculatePasswordStrength, generatePassword } from './utils/password-generator.util';

interface IOptionRowProps {
  label: string;
  icon: string;
  value: boolean;
  onToggle: () => void;
}

function OptionRow({ label, icon, value, onToggle }: IOptionRowProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[
        styles.optionRow,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
        },
      ]}
    >
      <View style={[styles.optionLabel, { gap: spacing.sm }]}>
        <MaterialSymbols name={icon} size={20} color={colors.textSecondary} />
        <Typography variant="bodyMd" color={colors.textPrimary}>
          {label}
        </Typography>
      </View>
      <View style={[styles.checkbox, { borderColor: value ? colors.accent : colors.border, backgroundColor: value ? colors.accent : 'transparent', borderRadius: borderRadius.sm }]}>
        {value ? <MaterialSymbols name="check" size={14} color={colors.textOnAccent} /> : null}
      </View>
    </TouchableOpacity>
  );
}

export default function PasswordGenerator(): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const [password, setPassword] = useState('');
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
  const [lowerCase, setLowerCase] = useState(true);
  const [upperCase, setUpperCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [sliderValue, setSliderValue] = useState(8);

  const handleGenerate = (): void => {
    try {
      const result = generatePassword(sliderValue, { lowerCase, upperCase, numbers, symbols });
      setPassword(result);
      setIsPasswordGenerated(true);
      setPasswordStrength(calculatePasswordStrength(result));
    } catch (error) {
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

  const strengthColor =
    passwordStrength === 'Weak'
      ? colors.error
      : passwordStrength === 'Medium'
      ? colors.warning
      : colors.success;

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.header, { gap: spacing.xs }]}>
        <Typography variant="headingLg" color={colors.textPrimary}>
          Password Generator
        </Typography>
        <Typography variant="bodyMd" color={colors.textSecondary}>
          Create secure passwords instantly
        </Typography>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: borderRadius.lg, padding: spacing.lg }]}>
        <View style={[styles.sliderHeader, { gap: spacing.sm }]}>
          <Typography variant="label" color={colors.textSecondary}>
            Password Length
          </Typography>
          <Typography variant="subtitleMd" color={colors.accent} fontWeight="700">
            {sliderValue}
          </Typography>
        </View>
        <Slider
          minimumValue={4}
          maximumValue={32}
          step={1}
          value={sliderValue}
          onValueChange={(value: number) => setSliderValue(Math.round(value))}
          minimumTrackTintColor={colors.accent}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.accent}
        />
        <View style={styles.sliderRange}>
          <Typography variant="caption" color={colors.textTertiary}>4</Typography>
          <Typography variant="caption" color={colors.textTertiary}>32</Typography>
        </View>
      </View>

      <View style={[styles.options, { gap: spacing.md }]}>
        <OptionRow label="Lowercase" icon="format_list_bulleted" value={lowerCase} onToggle={() => setLowerCase(prev => !prev)} />
        <OptionRow label="Uppercase" icon="format_list_bulleted" value={upperCase} onToggle={() => setUpperCase(prev => !prev)} />
        <OptionRow label="Numbers" icon="keyboard_arrow_up" value={numbers} onToggle={() => setNumbers(prev => !prev)} />
        <OptionRow label="Special Characters" icon="warning" value={symbols} onToggle={() => setSymbols(prev => !prev)} />
      </View>

      {isPasswordGenerated ? (
        <View
          style={[
            styles.passwordCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.xl,
              padding: spacing.lg,
            },
          ]}
        >
          <View style={[styles.passwordHeader, { gap: spacing.sm }]}>
            <Typography variant="label" color={colors.textSecondary}>
              Generated Password
            </Typography>
            <View style={[styles.strengthBadge, { backgroundColor: strengthColor, borderRadius: borderRadius.full }]}>
              <Typography variant="caption" color={colors.textInverse} fontWeight="600">
                {passwordStrength}
              </Typography>
            </View>
          </View>
          <Typography variant="tokenDisplay" color={colors.accent} align="center" selectable style={styles.passwordText}>
            {password}
          </Typography>
          <View style={[styles.passwordActions, { gap: spacing.md }]}>
            <Button title="Generate" onPress={handleGenerate} variant="primary" style={styles.actionButton} />
            <Button title="Copy" onPress={handleCopy} variant="outline" icon={<MaterialSymbols name="assignment" size={18} color={colors.textPrimary} />} style={styles.actionButton} />
          </View>
        </View>
      ) : (
        <Button title="Generate Password" onPress={handleGenerate} variant="primary" fullWidth style={styles.generateButton} />
      )}

      <Button title="Reset All" onPress={resetAll} variant="ghost" fullWidth style={styles.resetButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  options: {
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  optionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height:  22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  passwordCard: {
    marginBottom: 16,
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
    flex:  1,
  },
  generateButton: {
    marginBottom:  8,
  },
  resetButton: {
    marginBottom:  24,
  },
});
