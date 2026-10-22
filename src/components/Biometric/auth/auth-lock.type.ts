export interface IAuthMethods {
  biometric: boolean;
  numeric: boolean;
  biometryType: string;
}

export interface IUseAuthLockParams {
  onAuthenticated: () => void;
  onSetupRequired: () => void;
  onForgotPin: () => Promise<void> | void;
}

export interface IUseAuthLockResult {
  isLoading: boolean;
  authMethods: IAuthMethods;
  showPinSheet: boolean;
  showForgotModal: boolean;
  showLimitModal: boolean;
  handleBiometricAuth: () => Promise<void>;
  handleUsePin: () => void;
  handleClosePinSheet: () => void;
  handleVerifyPin: (pin: string) => Promise<boolean>;
  handlePinSheetDismissed: () => void;
  handleForgotRequest: () => void;
  handleCloseForgotModal: () => void;
  handleForgotConfirm: () => void;
  handleCloseLimitModal: () => void;
}
