/**
 * Composant Sidebar réutilisable pour les dashboards
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useUIStore } from '@/lib/stores/ui-store';
import { cn } from '@/lib/utils';

interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  onLinkClick?: () => void;
}

/**
 * Composant Sidebar
 */
export function Sidebar({ items, title, onLinkClick }: SidebarProps) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [href]: !prev[href]
    }));
  };

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        {title && sidebarOpen && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-lg text-gray-900">{title}</h2>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {items.map((item: unknown) => (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                  item.active
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700'
                )}
              >
                {item.icon && (
                  <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                )}
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.children && (
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          toggleExpand(item.href);
                        }}
                        className="flex-shrink-0"
                      >
                        <svg
                          className={cn(
                            'w-4 h-4 transition-transform',
                            expandedItems[item.href] && 'rotate-180'
                          )}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </Link>

              {/* Submenu */}
              {sidebarOpen && item.children && expandedItems[item.href] && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                  {item.children.map((child: unknown) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onLinkClick}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2 rounded text-sm transition-colors',
                        'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                        child.active
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600'
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
