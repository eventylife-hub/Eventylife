'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
 */
export function ExportCta({
  exportType,
  scope,
  label = 'Exporter...',
  variant = 'outline',
}: ExportCtaProps) {
  const params = new URLSearchParams({ type: exportType });
  if (scope) params.append('scope', scope);

  return (
    <Link href={`/admin/exports?${params.toString()}`}>
      <Button variant={variant} size="sm" className="min-h-[44px] min-w-[44px]">
        <Download className="w-4 h-4 mr-2" />
        {label}
      </Button>
    </Link>
  );
}
