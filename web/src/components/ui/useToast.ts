export type ToastType = 'info' | 'success' | 'error';

interface ToastEventDetail {
  type: ToastType;
  message: string;
  timeout?: number;
}

export function useToast() {
  function dispatch(type: ToastType, message: string, timeout?: number) {
    window.dispatchEvent(
      new CustomEvent<ToastEventDetail>('nv_toast', {
        detail: { type, message, timeout },
      })
    );
  }
  return {
    info: (msg: string, timeout?: number) => dispatch('info', msg, timeout),
    success: (msg: string, timeout?: number) => dispatch('success', msg, timeout),
    error: (msg: string, timeout?: number) => dispatch('error', msg, timeout),
  };
}
