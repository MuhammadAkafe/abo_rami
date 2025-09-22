import React from 'react'
import { usePostLoginChecks } from '@/app/hooks/usePostLoginChecks';
import { LOADING_MESSAGES, LOADING_CONFIG, type LoadingMessage, type SpinnerSize, type SpinnerColor } from './loadingUtils';

interface LoadingComponentProps {
  isLoading: boolean;
  message?: string;
  messageKey?: LoadingMessage;
  fullScreen?: boolean;
  usePostLoginMessage?: boolean;
  spinnerSize?: SpinnerSize;
  spinnerColor?: SpinnerColor;
  showSpinner?: boolean;
}

export default function LoadingComponent({ 
  isLoading, 
  message, 
  messageKey,
  fullScreen = false,
  usePostLoginMessage = false,
  spinnerSize = 'LARGE',
  spinnerColor = 'PRIMARY',
  showSpinner = true
}: LoadingComponentProps) {
  const { loadingMessage } = usePostLoginChecks();
  
  // Determine the display message with priority: usePostLoginMessage > message > messageKey > default
  let displayMessage: string = LOADING_MESSAGES.DEFAULT;
  
  if (usePostLoginMessage && loadingMessage) {
    displayMessage = loadingMessage;
  } else if (message) {
    displayMessage = message;
  } else if (messageKey) {
    displayMessage = LOADING_MESSAGES[messageKey];
  }
  
  if (!isLoading) {
    return null;
  }

  const spinnerClasses = `animate-spin rounded-full border-b-2 ${LOADING_CONFIG.SPINNER_SIZE[spinnerSize]} ${LOADING_CONFIG.COLORS[spinnerColor]}`;

  const loadingContent = (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center justify-center">
        {showSpinner && (
          <div className={spinnerClasses}></div>
        )}
        <span className={`${showSpinner ? 'mr-3' : ''} text-gray-600`}>{displayMessage}</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {loadingContent}
        </div>
      </div>
    );
  }

  return loadingContent;
}

// Export a specialized PostLoginLoading component for convenience
export function PostLoginLoading() {
  return (
    <LoadingComponent 
      isLoading={true} 
      usePostLoginMessage={true}
      fullScreen={true} 
    />
  );
}