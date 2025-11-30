/**
 * Toast Context Provider
 *
 * Provides global state management for toast notifications throughout the application.
 * This context allows any component to trigger toast notifications without prop drilling.
 *
 * Features:
 * - Auto-dismiss after configurable duration
 * - Multiple toasts can be displayed simultaneously
 * - Type-safe with TypeScript
 * - Easy-to-use helper methods (success, error, warning, info)
 */

import { createContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastType, ToastContextType } from '../types/toast';

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Generate unique ID for each toast
   */
  const generateId = (): string => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Add a new toast notification
   */
  const addToast = useCallback((type: ToastType, message: string, duration: number = 3000) => {
    const id = generateId();
    const newToast: Toast = { id, type, message, duration };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  /**
   * Remove a toast by ID
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Helper methods for different toast types
   */
  const success = useCallback((message: string, duration?: number) => {
    addToast('success', message, duration);
  }, [addToast]);

  const error = useCallback((message: string, duration?: number) => {
    addToast('error', message, duration);
  }, [addToast]);

  const warning = useCallback((message: string, duration?: number) => {
    addToast('warning', message, duration);
  }, [addToast]);

  const info = useCallback((message: string, duration?: number) => {
    addToast('info', message, duration);
  }, [addToast]);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
