export interface IAuthMethods {
  biometric: boolean;
  biometryType: string;
}

export interface IUseAuthLockParams {
  onAuthenticated: () => void;
  onSetupRequired: () => void;
}

export interface IUseAuthLockResult {
  isLoading: boolean;
  authMethods: IAuthMethods;
  handleBiometricAuth: () => Promise<void>;
}
