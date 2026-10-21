import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MaterialSymbols from '../../../components/widgets/material-icon';

import { PinCircles } from '../../../components/Biometric/components/pin-circles.component';
import { PinKeypad } from '../../../components/Biometric/components/pin-keypad.component';
import { AppModal } from '../../../components/widgets/modal';
import { Typography } from '../../../components/widgets/typography';
import { useTheme } from '../../../hooks/use-theme.hook';
import type { INumericPasswordMode } from '../../../navigation/navigation.type';
import { useNumericPassword } from '../hooks/use-numeric-password.hook';
import type { INumericPasswordStep } from '../hooks/use-numeric-password.hook';

interface IProps {
  mode: INumericPasswordMode;
  hasExistingPin: boolean;
  maxLength: number;
  onDone: () => void;
  onRemoved: () => void;
  title?: string;
  subtitle?: string;
}

interface IStepCopy {
  title: string;
  subtitle: string;
  icon: string;
}

const SHAKE_SEQUENCE = [10, -10, 8, -8, 0];

export function NumericPasswordForm({
  mode,
  hasExistingPin,
  maxLength,
  onDone,
  onRemoved,
  title,
  subtitle,
}: IProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();
  const {
    step,
    pin,
    error,
    submitting,
    success,
    shakeKey,
    canRemove,
    pushDigit,
    deleteDigit,
    removePin,
  } = useNumericPassword({
    mode,
    hasExistingPin,
    maxLength,
    onDone,
    onRemoved,
  });

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shakeKey === 0) {
      return;
    }
    const animations = SHAKE_SEQUENCE.map(value =>
      Animated.timing(shakeAnim, {
        toValue: value,
        duration: 55,
        useNativeDriver: true,
      }),
    );
    Animated.sequence(animations).start();
  }, [shakeKey, shakeAnim]);

  useEffect(() => {
    if (error) {
      AccessibilityInfo.announceForAccessibility(error);
    }
  }, [error]);

  const getCopy = useCallback((): IStepCopy => {
    if (success) {
      if (mode === 'remove') {
        return {
          title: 'PIN removed',
          subtitle: 'Numeric and biometric unlock have been disabled',
          icon: 'check_circle',
        };
      }
      return {
        title: mode === 'verify' ? 'Verified' : 'PIN saved',
        subtitle:
          mode === 'verify'
            ? 'You can continue now'
            : 'Your numeric PIN is ready to use',
        icon: 'check_circle',
      };
    }

    if (step === 'verify') {
      if (mode === 'remove') {
        return {
          title: 'Remove numeric PIN',
          subtitle:
            'Enter your current PIN to remove it. Biometric unlock will also be turned off.',
          icon: 'delete',
        };
      }
      if (mode === 'verify') {
        return {
          title: title ?? 'Enter your PIN',
          subtitle: subtitle ?? 'Enter your 4-digit PIN to continue',
          icon: 'lock',
        };
      }
      return {
        title: 'Enter current PIN',
        subtitle: "Verify it's you before changing your PIN",
        icon: 'lock',
      };
    }

    if (step === 'create') {
      return {
        title: hasExistingPin ? 'Create a new PIN' : 'Create a PIN',
        subtitle: 'Choose a 4-digit PIN to unlock your vault',
        icon: 'shield_lock',
      };
    }

    return {
      title: 'Confirm your PIN',
      subtitle: 'Re-enter the same 4-digit PIN',
      icon: 'verified_user',
    };
  }, [hasExistingPin, mode, step, subtitle, success, title]);

  const copy = getCopy();
  const steps: INumericPasswordStep[] = hasExistingPin
    ? ['verify', 'create', 'confirm']
    : ['create', 'confirm'];
  const stepNumber = steps.indexOf(step) + 1;
  const showStepCounter = mode === 'set' && !success;

  const iconColor = success ? colors.success : colors.accent;
  const iconBackground = success ? colors.successLight : colors.surfaceElevated;

  const handleRemovePress = (): void => setShowRemoveModal(true);
  const handleRemoveConfirm = (): void => {
    setShowRemoveModal(false);
    removePin();
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <View style={[styles.topBar, { paddingHorizontal: spacing.lg }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onDone}
          disabled={success || submitting}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <MaterialSymbols name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        {showStepCounter ? (
          <View
            style={[
              styles.stepPill,
              {
                backgroundColor: colors.surfaceElevated,
                borderRadius: borderRadius.full,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
              },
            ]}
          >
            <Typography variant="caption" color={colors.textSecondary}>
              Step {stepNumber} of {steps.length}
            </Typography>
          </View>
        ) : (
          <View style={styles.closeButton} />
        )}
      </View>

      <View style={[styles.content, { paddingHorizontal: spacing.xl }]}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: iconBackground,
              borderRadius: borderRadius.full,
            },
          ]}
        >
          <MaterialSymbols
            name={copy.icon}
            variant={success ? 'filled' : 'rounded'}
            size={32}
            color={iconColor}
          />
        </View>

        <Typography
          variant="headingLg"
          color={colors.textPrimary}
          align="center"
        >
          {copy.title}
        </Typography>
        <Typography
          variant="bodyMd"
          color={colors.textSecondary}
          align="center"
          style={{ marginTop: spacing.xs }}
        >
          {copy.subtitle}
        </Typography>

        {!success ? (
          <Animated.View
            style={[
              styles.pinSection,
              { transform: [{ translateX: shakeAnim }] },
            ]}
          >
            <PinCircles
              length={pin.length}
              maxLength={maxLength}
              status={error ? 'error' : 'default'}
            />
            <Typography
              variant="caption"
              align="center"
              color={error ? colors.error : colors.textTertiary}
              accessibilityLiveRegion="polite"
              style={styles.errorText}
            >
              {error || 'Your PIN is stored securely on this device'}
            </Typography>
          </Animated.View>
        ) : (
          <Typography
            variant="caption"
            color={colors.textTertiary}
            align="center"
            style={{ marginTop: spacing.lg }}
          >
            {mode === 'verify' ? 'Unlocking…' : 'Returning to settings…'}
          </Typography>
        )}
      </View>

      {!success ? (
        <>
          <View style={[styles.keypadSection, { paddingTop: spacing.md }]}>
            <PinKeypad
              onDigitPress={pushDigit}
              onBackspace={deleteDigit}
              disabled={submitting}
            />
          </View>
          <View style={[styles.footer, { paddingBottom: spacing.md }]}>
            {canRemove && step !== 'confirm' ? (
              <TouchableOpacity
                onPress={handleRemovePress}
                disabled={submitting}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Remove numeric PIN"
                style={[styles.removeButton, { paddingHorizontal: spacing.lg }]}
              >
                <Typography variant="bodyMd" color={colors.error}>
                  Remove PIN
                </Typography>
              </TouchableOpacity>
            ) : null}
          </View>
        </>
      ) : null}

      <AppModal
        visible={showRemoveModal}
        title="Remove numeric PIN?"
        message="You will need to set a new PIN to unlock with a code. Biometric unlock will also be turned off."
        confirmTitle="Remove"
        cancelTitle="Keep PIN"
        confirmVariant="danger"
        onClose={() => setShowRemoveModal(false)}
        onConfirm={handleRemoveConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pinSection: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  errorText: {
    minHeight: 20,
    paddingHorizontal: 16,
  },
  keypadSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  footer: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    paddingVertical: 8,
  },
});
