import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Button } from '../../controls/button';
import { Typography } from '../typography';

interface IProps {
  visible: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmTitle?: string;
  cancelTitle?: string;
}

export function AppModal({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  confirmTitle = 'Confirm',
  cancelTitle = 'Close',
}: IProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
            },
          ]}
        >
          {title ? (
            <Typography variant="headingMd" color={colors.textPrimary} align="center" style={styles.title}>
              {title}
            </Typography>
          ) : null}
          {message ? (
            <Typography variant="bodyMd" color={colors.textSecondary} align="center" style={styles.message}>
              {message}
            </Typography>
          ) : null}
          <View style={styles.buttonRow}>
            {onConfirm ? (
              <Button title={confirmTitle} onPress={onConfirm} variant="primary" style={styles.button} />
            ) : null}
            <Button title={cancelTitle} onPress={onClose} variant="outline" style={styles.button} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
  },
  message: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
