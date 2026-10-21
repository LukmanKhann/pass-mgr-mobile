import type { NavigatorScreenParams } from '@react-navigation/native';

export type IAuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type IVaultStackParamList = {
  Vault: undefined;
  EditPassword: { passwordId: string } | undefined;
};

export type IGeneratorStackParamList = {
  Generator: undefined;
};

export type INumericPasswordMode = 'verify' | 'set' | 'remove';

export type ISettingsStackParamList = {
  Settings: undefined;
  Appearance: undefined;
  NumericPassword: {
    mode?: INumericPasswordMode;
    title?: string;
    subtitle?: string;
  };
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
  NumericPassword: {
    mode?: INumericPasswordMode;
    title?: string;
    subtitle?: string;
  };
  Appearance: undefined;
};
