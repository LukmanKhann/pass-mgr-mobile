import React, { createContext, useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ToastItem } from './toast-item.component';
import type { IToastConfig, IToastContextValue } from './toast.type';
import type { IShowToastParams } from './toast.type';

export const ToastContext = createContext<IToastContextValue>({
  showToast: () => {},
});

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [toasts, setToasts] = useState<IToastConfig[]>([]);
  const counterRef = useRef(0);
  const insets = useSafeAreaInsets();

  const showToast = useCallback((params: IShowToastParams) => {
    const id = `toast_${++counterRef.current}`;
    setToasts(prev => [...prev, { ...params, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View
        style={[styles.overlay, { bottom: insets.bottom + 8 }]}
        pointerEvents="box-none"
      >
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});
