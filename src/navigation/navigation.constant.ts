export const SCREENS = {
  // Auth
  LOGIN: 'Login',
  SIGN_UP: 'SignUp',
  // Bottom tabs
  VAULT_TAB: 'VaultTab',
  ADD_CREDENTIAL_TAB: 'AddCredentialTab',
  GENERATOR_TAB: 'GeneratorTab',
  SETTINGS_TAB: 'SettingsTab',
  // Vault stack screens
  VAULT: 'Vault',
  EDIT_PASSWORD: 'EditPassword',
  // Generator stack screens
  GENERATOR: 'Generator',
  // Settings stack screens
  SETTINGS: 'Settings',
  APPEARANCE: 'Appearance',
} as const;

export type IScreenName = (typeof SCREENS)[keyof typeof SCREENS];
