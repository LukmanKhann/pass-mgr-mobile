import React from 'react';
import { SectionHeader } from './section-header.component';
import { SettingItem } from './setting-item.component';

interface IProps {
  handleBackupSync: () => void;
  handleExportData: () => void;
  handleImportData: () => void;
}

export function DataSection({ handleBackupSync, handleExportData, handleImportData }: IProps): JSX.Element {
  return (
    <>
      <SectionHeader title="Data" />
      <SettingItem icon="backup-restore" title="Backup & Sync" subtitle="Sync your data across devices" showArrow onPress={handleBackupSync} />
      <SettingItem icon="export" title="Export Data" subtitle="Export your passwords securely" showArrow onPress={handleExportData} />
      <SettingItem icon="import" title="Import Data" subtitle="Import passwords from other apps" showArrow onPress={handleImportData} />
    </>
  );
}
