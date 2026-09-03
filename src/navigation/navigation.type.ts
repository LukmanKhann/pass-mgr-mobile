import type { NavigatorScreenParams } from '@react-navigation/native';

export type IAuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type IMainTabParamList = {
  Vault: undefined;
  AddCredential: undefined;
  Generator: undefined;
  Settings: undefined;
};

export type IRootParamList = {
  AuthStack: NavigatorScreenParams<IAuthStackParamList>;
  MainTabs: NavigatorScreenParams<IMainTabParamList>;
};
