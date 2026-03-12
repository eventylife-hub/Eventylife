'use client';

import React from 'react';
import Link from 'next/link';

interface AdminPageHeaderProps {
  title: string;
  breadcrumb?: string;
  children?: React.ReactNode;
}

/**
 * En-tête standardisé pour les pages Admin (Design V38)
 * Breadcrumb + titre Fraunces + actions optionnelles
 * React.memo — évite les re-renders si les props ne changent pas
 */
export const AdminPageHeader = React.memo(function AdminPageHeader({ title, breadcrumb, children }: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header admin-fade-in" style={{ marginBottom: '24px' }}>
      <div>
        <div className="admin-breadcrumb">
          <Link href="/admin">Admin</Link>
          {breadcrumb && (
            <>
              <span style={{ margin: '0 4px' }}>›</span>
              <span>{breadcrumb}</span>
            </>
          )}
        </div>
        <h2 className="admin-page-title">{title}</h2>
      </div>
      {children && (
        <div className="admin-header-actions">
          {children}
        </div>
      )}
    </div>
  );
});
