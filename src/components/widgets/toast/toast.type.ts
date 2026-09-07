export type IToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface IToastConfig {
  id: string;
  type: IToastVariant;
  title: string;
  message?: string;
  duration?: number;
}

export interface IShowToastParams {
  type: IToastVariant;
  title: string;
  message?: string;
  duration?: number;
}

export interface IToastContextValue {
  showToast: (params: IShowToastParams) => void;
}
