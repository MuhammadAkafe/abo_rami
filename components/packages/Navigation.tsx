"use client";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ActiveView } from '@/types/types';
import Link from 'next/link';

interface NavigationProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export default function Navigation({ activeView, setActiveView }: NavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigationItems = [
    { key: 'suppliers', label: 'ניהול ספקים' },
    { key: 'tasks', label: 'ניהול משימות' },
    { key: 'addSupplier', label: 'הוספה ספק' },
    { key: 'addTask', label: 'הוספה משימה' },
    { key: 'tokens', label: 'ניהול קישורי גישה' }
  ] as const;

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

  const currentActiveView = getActiveViewFromPath();

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
            {navigationItems.map((item) => (
              <Link 
                key={item.key}
                href={`/client/Admin/Dashboard/${item.key}`}
                onClick={() => setActiveView(item.key as ActiveView)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentActiveView === item.key
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/client/Admin/Dashboard/${item.key}`}
                  onClick={() => {
                    setActiveView(item.key as ActiveView);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-right px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    currentActiveView === item.key
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}