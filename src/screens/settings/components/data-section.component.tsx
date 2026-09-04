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
      <SettingItem icon="cloud_upload" title="Backup & Sync" subtitle="Sync your data across devices" showArrow onPress={handleBackupSync} />
      <SettingItem icon="cloud_download" title="Export Data" subtitle="Export your passwords securely" showArrow onPress={handleExportData} />
      <SettingItem icon="attach_file" title="Import Data" subtitle="Import passwords from other apps" showArrow onPress={handleImportData} />
    </>
  );
}
