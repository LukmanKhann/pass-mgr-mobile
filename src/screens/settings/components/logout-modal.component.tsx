import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import MaterialSymbols from '../../../components/widgets/material-icon';

import { useTheme } from '../../../hooks/use-theme.hook';
import { Typography } from '../../../components/widgets/typography';
import { Button } from '../../../components/controls/button';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({
  visible,
  onClose,
  onConfirm,
}: IProps): JSX.Element {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={[styles.overlay, { backgroundColor: colors.overlay }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <MaterialSymbols
              name="close"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <View style={styles.iconWrapper}>
            <MaterialSymbols name="logout" size={40} color={colors.error} />
          </View>
          <Typography
            variant="headingMd"
            color={colors.textPrimary}
            align="center"
          >
            Sign Out
          </Typography>
          <Typography
            variant="bodyMd"
            color={colors.textSecondary}
            align="center"
          >
            Are you sure you want to sign out?
          </Typography>
          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Sign Out"
              onPress={onConfirm}
              variant="danger"
              style={styles.button}
            />
          </View>
        </View>
      </TouchableOpacity>
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
    gap: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCEAE6',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});
