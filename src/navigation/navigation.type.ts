import type { NavigatorScreenParams } from '@react-navigation/native';

export type IAuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email?: string };
};

export type IVaultStackParamList = {
  Vault: undefined;
  EditPassword: { passwordId: string } | undefined;
};

export type IGeneratorStackParamList = {
  Generator: undefined;
};

export type ISettingsStackParamList = {
  Settings: undefined;
  Appearance: undefined;
  Security: undefined;
  Data: undefined;
  Support: undefined;
};

export type IAddCredentialParamList = undefined;

export type IMainTabParamList = {
  VaultTab: NavigatorScreenParams<IVaultStackParamList>;
  AddCredentialTab: undefined;
  GeneratorTab: NavigatorScreenParams<IGeneratorStackParamList>;
  SettingsTab: NavigatorScreenParams<ISettingsStackParamList>;
};

export type IRootStackParamList = {
  Main: NavigatorScreenParams<IMainTabParamList>;
  Appearance: undefined;
};
