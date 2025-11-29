import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ActiveView } from '@/types/types';

// Valid navigation views
const VALID_VIEWS: ActiveView[] = ['suppliers', 'tasks', 'addSupplier', 'addTask'];

// Helper function to validate if a view is valid
const isValidView = (view: string | null): view is ActiveView => {
  return view !== null && VALID_VIEWS.includes(view as ActiveView);
};

/**
 * Custom hook to manage active view state with URL synchronization
 * @param defaultView - Default view to use if no URL param exists
 * @returns [activeView, setActiveView] - Current view and setter function
 */
export function useActiveView(defaultView: ActiveView = 'suppliers') {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viewParam = searchParams.get('view') as ActiveView | null;
  
  // Initialize activeView from URL or default
  const [activeView, setActiveView] = useState<ActiveView>(
    isValidView(viewParam) ? viewParam : defaultView
  );

  // Update URL when activeView changes
  const handleSetActiveView = (view: ActiveView) => {
    setActiveView(view);
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Sync state with URL when URL changes
  useEffect(() => {
    if (isValidView(viewParam)) {
      setActiveView(viewParam);
    }
  }, [viewParam]);

  // Set initial URL param if missing (only on mount)
  useEffect(() => {
    if (!viewParam) {
      const params = new URLSearchParams();
      params.set('view', activeView);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return [activeView, handleSetActiveView] as const;
}

