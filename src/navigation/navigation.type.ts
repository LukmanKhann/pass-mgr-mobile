import type { NavigatorScreenParams } from '@react-navigation/native';

// ── Auth stack ──────────────────────────────────────────────────────────────
export type IAuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

// ── Per-tab stack param lists ────────────────────────────────────────────────
export type IVaultStackParamList = {
  Vault: undefined;
  EditPassword: { passwordId: string } | undefined;
};

export type IGeneratorStackParamList = {
  Generator: undefined;
};

export type ISettingsStackParamList = {
  Settings: undefined;
};

// AddCredential is a single-screen tab — no nested stack needed.
export type IAddCredentialParamList = undefined;

// ── Main tab param list ──────────────────────────────────────────────────────
export type IMainTabParamList = {
  VaultTab: NavigatorScreenParams<IVaultStackParamList>;
  AddCredentialTab: undefined;
  GeneratorTab: NavigatorScreenParams<IGeneratorStackParamList>;
  SettingsTab: NavigatorScreenParams<ISettingsStackParamList>;
};

// ── Root (auth + tabs) ───────────────────────────────────────────────────────
export type IRootParamList = {
  AuthStack: NavigatorScreenParams<IAuthStackParamList>;
  MainTabs: NavigatorScreenParams<IMainTabParamList>;
};
