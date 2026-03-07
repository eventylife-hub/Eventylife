'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

interface ScriptWithConsentProps {
  src: string;
  strategy?: 'afterInteractive' | 'beforeInteractive' | 'lazyOnload';
  category: 'analytics' | 'marketing' | 'functional';
  dataAttributes?: Record<string, string>;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Conditional Script Loader based on Cookie Consent
 *
 * Usage:
 * <ScriptWithConsent
 *   src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
 *   category="analytics"
 * />
 */
export function ScriptWithConsent({
  src,
  strategy = 'afterInteractive',
  category,
  dataAttributes,
  onLoad,
  onError,
}: ScriptWithConsentProps) {
  const { isAllowed } = useCookieConsent();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Check if consent is given for this category
    const isConsented = isAllowed(category);
    setShouldLoad(isConsented);

    // Listen for consent changes
    const handleConsentChange = (event: Event) => {
      if (event instanceof CustomEvent) {
        const newConsent = event.detail;
        setShouldLoad(newConsent[category] === true);
      }
    };

    window.addEventListener('cookieConsent', handleConsentChange);

    return () => {
      window.removeEventListener('cookieConsent', handleConsentChange);
    };
  }, [category, isAllowed]);

  if (!shouldLoad) {
    return null;
  }

  return (
    <Script
      src={src}
      strategy={strategy}
      {...dataAttributes}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
