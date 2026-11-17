import { create } from 'zustand';

interface ToastState {
  message: string | null;
  showToast: (message: string) => void;
}

let toastTimeout: ReturnType<typeof setTimeout> | undefined;

export const useToastStore = create<ToastState>()((set) => ({
  message: null,
  showToast: (message) => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    set({ message });
    toastTimeout = setTimeout(() => {
      set({ message: null });
      toastTimeout = undefined;
    }, 3500);
  },
}));
