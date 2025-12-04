"use client";
import { useState, useTransition, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ActiveView } from '@/types/types';

interface NavigationProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const navigationItems = [
  { key: 'suppliers', label: 'ניהול ספקים' },
  { key: 'tasks', label: 'ניהול משימות' },
  { key: 'addSupplier', label: 'הוספה ספק' },
  { key: 'addTask', label: 'הוספה משימה' },
] as const;

export default function Navigation({ activeView, setActiveView }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [optimisticView, setOptimisticView] = useState<ActiveView | null>(null);

  // Determine active view from URL pathname
  const getActiveViewFromPath = (): ActiveView => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // Check if last segment matches any navigation item
    const matchingItem = navigationItems.find(item => item.key === lastSegment);
    if (matchingItem) {
      return matchingItem.key as ActiveView;
    }
    
    // Fallback to activeView prop
    return activeView;
  };

  const currentActiveView = optimisticView || getActiveViewFromPath();

  // Clear optimistic view when pathname matches
  useEffect(() => {
    if (optimisticView) {
      const pathSegments = pathname.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      const matchingItem = navigationItems.find(item => item.key === lastSegment);
      if (matchingItem && matchingItem.key === optimisticView) {
        setOptimisticView(null);
      }
    }
  }, [pathname, optimisticView]);

  // Handle navigation with immediate feedback
  const handleNavigation = (itemKey: ActiveView, href: string) => {
    // Optimistically update the view immediately
    setOptimisticView(itemKey);
    setActiveView(itemKey);
    
    // Start navigation transition
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">פתח תפריט</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/w3.org/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/w3.org/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigationItems.map((item) => {
              const isActive = currentActiveView === item.key;
              const isPendingItem = isPending && optimisticView === item.key;
              
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavigation(item.key as ActiveView, `/client/Admin/Dashboard/${item.key}`)}
                  disabled={isPending}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  } ${isPendingItem ? 'opacity-75 cursor-wait' : 'cursor-pointer'} ${
                    isPending && !isPendingItem ? 'opacity-50' : ''
                  }`}
                >
                  {isPendingItem && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  )}
                  <span className={isPendingItem ? 'opacity-0' : ''}>{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const isActive = currentActiveView === item.key;
                const isPendingItem = isPending && optimisticView === item.key;
                
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      handleNavigation(item.key as ActiveView, `/client/Admin/Dashboard/${item.key}`);
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={isPending}
                    className={`relative block w-full text-right px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    } ${isPendingItem ? 'opacity-75 cursor-wait' : 'cursor-pointer'} ${
                      isPending && !isPendingItem ? 'opacity-50' : ''
                    }`}
                  >
                    {isPendingItem && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    )}
                    <span className={isPendingItem ? 'opacity-0' : ''}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}