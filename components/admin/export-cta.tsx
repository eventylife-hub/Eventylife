'use client';

import React from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';

interface ExportCtaProps {
  exportType: string;
  scope?: string;
  label?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'destructive' | 'link';
}

/**
 * Bouton CTA d'export réutilisable
 * Redirige vers le Hub des exports avec paramètres pré-remplis
 * React.memo — évite les re-renders si les props ne changent pas
 */
export const ExportCta = React.memo(function ExportCta({
  exportType,
  scope,
  label = 'Exporter...',
  variant = 'outline',
}: ExportCtaProps) {
  const params = new URLSearchParams({ type: exportType });
  if (scope) params.append('scope', scope);

  return (
    <Link href={`/admin/exports?${params.toString()}`}>
      <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] inline-flex items-center gap-2">
        <Download className="w-4 h-4" />
        {label}
      </button>
    </Link>
  );
});
