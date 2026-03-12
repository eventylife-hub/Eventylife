'use client';

import dynamic from 'next/dynamic';

/**
 * Composants globaux chargés en lazy — non critiques au first paint.
 * Importés dynamiquement pour réduire le bundle initial.
 *
 * Note : les toasts sont gérés localement par page via <ToastNotification />.
 */
const CookieBanner = dynamic(
  () => import('@/components/cookie-banner/CookieBanner').then((m) => m.CookieBanner),
  { ssr: false }
);

/**
 * ClientProviders — Regroupe les composants globaux non-critiques
 * Lazy-loadés pour améliorer le FCP (First Contentful Paint)
 */
export function ClientProviders() {
  return (
    <>
      <CookieBanner />
    </>
  );
}
