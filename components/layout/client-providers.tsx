'use client';

import dynamic from 'next/dynamic';

/**
 * Composants globaux chargés en lazy — non critiques au first paint.
 * Importés dynamiquement pour réduire le bundle initial.
 */
const CookieBanner = dynamic(
  () => import('@/components/cookie-banner/CookieBanner').then((m) => m.CookieBanner),
  { ssr: false }
);

const ToastContainer = dynamic(
  () => import('@/components/ui/toast').then((m) => m.ToastContainer),
  { ssr: false }
);

/**
 * ClientProviders — Regroupe les composants globaux non-critiques
 * Lazy-loadés pour améliorer le FCP (First Contentful Paint)
 */
export function ClientProviders() {
  return (
    <>
      <ToastContainer />
      <CookieBanner />
    </>
  );
}
