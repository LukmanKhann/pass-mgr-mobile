import React from 'react';
import { SectionHeader } from './section-header.component';
import { SettingItem } from './setting-item.component';

interface IProps {
  handleHelpSupport: () => void;
  handleAbout: () => void;
  handleRateApp: () => void;
}

export function SupportSection({ handleHelpSupport, handleAbout, handleRateApp }: IProps): JSX.Element {
  return (
    <>
      <SectionHeader title="Support" />
      <SettingItem icon="help" title="Help & Support" subtitle="Get help and contact support" showArrow onPress={handleHelpSupport} />
      <SettingItem icon="info" title="About" subtitle="App version and information" showArrow onPress={handleAbout} />
      <SettingItem icon="star" title="Rate App" subtitle="Help us improve by rating the app" showArrow onPress={handleRateApp} />
    </>
  );
}
