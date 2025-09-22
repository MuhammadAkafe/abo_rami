// Centralized loading components exports for better maintainability

export { default as LoadingComponent, PostLoginLoading } from '../LoadingCompoenent';
export { LOADING_MESSAGES, LOADING_CONFIG } from '../loadingUtils';
export type { LoadingMessage, SpinnerSize, SpinnerColor } from '../loadingUtils';

// Convenience exports for common loading scenarios
export const LoadingStates = {
  // Full screen loading
  FullScreen: (props: { message?: string; usePostLoginMessage?: boolean }) => (
    <LoadingComponent isLoading={true} fullScreen={true} {...props} />
  ),
  
  // Inline loading
  Inline: (props: { message?: string; messageKey?: LoadingMessage }) => (
    <LoadingComponent isLoading={true} {...props} />
  ),
  
  // Small loading for buttons
  Button: (props: { message?: string }) => (
    <LoadingComponent 
      isLoading={true} 
      spinnerSize="SMALL" 
      showSpinner={true}
      {...props} 
    />
  ),
  
  // Loading without spinner (just text)
  TextOnly: (props: { message?: string }) => (
    <LoadingComponent 
      isLoading={true} 
      showSpinner={false}
      {...props} 
    />
  )
} as const;
