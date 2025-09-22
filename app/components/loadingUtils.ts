// Loading utility functions and constants for better maintainability

export const LOADING_MESSAGES = {
  DEFAULT: "טוען מידע...",
  AUTHENTICATING: "מתחבר...",
  LOADING_CITIES: "טוען ערים...",
  LOADING_TASKS: "טוען משימות...",
  LOADING_SUPPLIERS: "טוען ספקים...",
  SAVING: "שומר...",
  DELETING: "מוחק...",
} as const;

export const LOADING_CONFIG = {
  DEBOUNCE_DELAY: 300,
  SPINNER_SIZE: {
    SMALL: 'h-4 w-4',
    MEDIUM: 'h-6 w-6', 
    LARGE: 'h-8 w-8',
    XLARGE: 'h-12 w-12'
  },
  COLORS: {
    PRIMARY: 'border-blue-600',
    SUCCESS: 'border-green-600',
    WARNING: 'border-yellow-600',
    ERROR: 'border-red-600'
  }
} as const;

export type LoadingMessage = keyof typeof LOADING_MESSAGES;
export type SpinnerSize = keyof typeof LOADING_CONFIG.SPINNER_SIZE;
export type SpinnerColor = keyof typeof LOADING_CONFIG.COLORS;
