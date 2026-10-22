import { useCallback, useContext } from 'react';

import { AuthContext } from '../../../Auth/AuthContext';
import { CustomSnackbar } from '../../../global/utils/toast.util';

export function useAppSettings() {
  const { signOut } = useContext(AuthContext);

  const handleBackupSync = useCallback(() => {
    CustomSnackbar.info('Coming Soon', 'This feature will be available soon');
  }, []);

  const handleExportData = useCallback(() => {
    CustomSnackbar.info('Coming Soon', 'This feature will be available soon');
  }, []);

  const handleImportData = useCallback(() => {
    CustomSnackbar.info('Coming Soon', 'This feature will be available soon');
  }, []);

  const handleHelpSupport = useCallback(() => {
    CustomSnackbar.success('Help', 'Contact us at support@securevault.com');
  }, []);

  const handleAbout = useCallback(() => {
    CustomSnackbar.info(
      'About SecureVault',
      'Version 1.0.0. Built with security in mind',
    );
  }, []);

  const handleRateApp = useCallback(() => {
    CustomSnackbar.info('Rate Us', 'Thank you for using SecureVault!');
  }, []);

  return {
    signOut,
    handleBackupSync,
    handleExportData,
    handleImportData,
    handleHelpSupport,
    handleAbout,
    handleRateApp,
  };
}
