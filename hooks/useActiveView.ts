import { useState } from 'react';
import { ActiveView } from '@/types/types';

/**
 * Custom hook to manage active view state
 * @param defaultView - Default view to use
 * @returns [activeView, setActiveView] - Current view and setter function
 */
export function useActiveView(defaultView: ActiveView = 'suppliers') {
  const [activeView, setActiveView] = useState<ActiveView>(defaultView);
  return [activeView, setActiveView] as const;
}

