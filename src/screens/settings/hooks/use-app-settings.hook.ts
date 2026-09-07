import { useCallback, useContext } from 'react';

import { useTheme } from '../../../hooks/use-theme.hook';
import { AuthContext } from '../../../Auth/AuthContext';
import { CustomSnackbar } from '../../../global/utils/nitro-toast.util';
import type { IThemeMode } from '../../../context/theme-context.component';

export function useAppSettings() {
  const { mode, setMode } = useTheme();
  const { signOut, user } = useContext(AuthContext);

  const handleLogout = useCallback(() => {}, [signOut]);

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

  const handleModeChange = useCallback(
    (newMode: IThemeMode) => {
      setMode(newMode);
    },
    [setMode],
  );

  return {
    mode,
    handleModeChange,
    user,
    signOut,
    handleLogout,
    handleBackupSync,
    handleExportData,
    handleImportData,
    handleHelpSupport,
    handleAbout,
    handleRateApp,
  };
}
