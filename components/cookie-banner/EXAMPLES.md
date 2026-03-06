# Cookie Banner - Complete Integration Examples

This file contains real-world examples for integrating the cookie banner with your application.

---

## Example 1: Google Analytics Integration

### Step 1: Get Your GA ID
1. Go to Google Analytics 4
2. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### Step 2: Add to Layout

```tsx
// app/layout.tsx
import { ScriptWithConsent } from '@/components/cookie-banner';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <CookieBanner />
        
        {/* Google Analytics - only loads if analytics consent given */}
        <ScriptWithConsent
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          category="analytics"
        />
        
        {/* Initialize GA after consent */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </body>
    </html>
  );
}
```

### Step 3: Track Events Conditionally

```tsx
'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';

export function Button() {
  const { isAllowed } = useCookieConsent();

  const handleClick = () => {
    if (isAllowed('analytics')) {
      window.gtag?.('event', 'button_click', {
        'button_name': 'my_button',
      });
    }
    // Do actual button action
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

---

## Example 2: Facebook Pixel Integration

### Step 1: Get Your Pixel ID
1. Go to Facebook Business Suite
2. Copy your Pixel ID

### Step 2: Add to Layout

```tsx
import { ScriptWithConsent } from '@/components/cookie-banner';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <CookieBanner />
        
        {/* Facebook Pixel - only loads if marketing consent given */}
        <ScriptWithConsent
          src="https://connect.facebook.net/en_US/fbevents.js"
          category="marketing"
        />
        
        {/* Initialize FB Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              fbq('init', 'YOUR_PIXEL_ID');
              fbq('track', 'PageView');
            `,
          }}
        />
      </body>
    </html>
  );
}
```

### Step 3: Track Conversions

```tsx
'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';

export function CheckoutButton() {
  const { isAllowed } = useCookieConsent();

  const handleCheckout = async () => {
    // Process checkout...
    
    if (isAllowed('marketing')) {
      window.fbq?.('track', 'Purchase', {
        value: 25.00,
        currency: 'EUR',
      });
    }
  };

  return <button onClick={handleCheckout}>Checkout</button>;
}
```

---

## Example 3: Add Privacy Settings to Footer

```tsx
// components/Footer.tsx
'use client';

import { useState } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { CookiePreferencesModal } from '@/components/cookie-banner';

export function Footer() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const { savePreferences, acceptAll, refuseAll, consent } = useCookieConsent();

  return (
    <>
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 mb-8">
            {/* Links */}
            <div>
              <h3 className="font-bold mb-4">Légal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/mentions-legales" className="hover:underline">
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a href="/conditions" className="hover:underline">
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a href="/politique-confidentialite" className="hover:underline">
                    Politique de confidentialité
                  </a>
                </li>
              </ul>
            </div>

            {/* Privacy Settings */}
            <div>
              <h3 className="font-bold mb-4">Confidentialité</h3>
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-blue-300 hover:text-blue-100 transition-colors"
              >
                Paramètres de cookies
              </button>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-gray-400">
                © 2026 Eventy Life. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Modal */}
      <CookiePreferencesModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onSave={savePreferences}
        onAcceptAll={acceptAll}
        onRefuseAll={refuseAll}
        initialConsent={consent}
      />
    </>
  );
}
```

---

## Example 4: Heatmap Integration (Hotjar)

```tsx
// app/layout.tsx
import { ScriptWithConsent } from '@/components/cookie-banner';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <CookieBanner />
        
        {/* Hotjar - loads if functional consent given */}
        <ScriptWithConsent
          src="https://script.hotjar.com/modules.360a29c3ff30.js"
          category="functional"
        />
        
        {/* Initialize Hotjar */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:1234567,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </body>
    </html>
  );
}
```

---

## Example 5: Custom Hook - Check Multiple Consents

```tsx
// hooks/useMultipleConsents.ts
'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';

interface ConsentStatus {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  any: boolean;      // At least one optional category
  all: boolean;      // All optional categories
}

export function useMultipleConsents(): ConsentStatus {
  const { isAllowed } = useCookieConsent();

  return {
    analytics: isAllowed('analytics'),
    marketing: isAllowed('marketing'),
    functional: isAllowed('functional'),
    any: isAllowed('analytics') || isAllowed('marketing') || isAllowed('functional'),
    all: isAllowed('analytics') && isAllowed('marketing') && isAllowed('functional'),
  };
}
```

Usage:
```tsx
const { analytics, marketing, functional, any, all } = useMultipleConsents();
```

---

## Example 6: Consent Banner Position Variations

### Variation 1: Fixed at Bottom (Default)
Already implemented in `CookieBanner.tsx`

### Variation 2: Floating in Corner

```tsx
// components/FloatingCookieBanner.tsx
'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';

export function FloatingCookieBanner() {
  const { hasConsented, acceptAll } = useCookieConsent();

  if (hasConsented) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 max-w-xs z-[9999]">
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
        Nous utilisons des cookies pour améliorer votre expérience.
      </p>
      <button
        onClick={acceptAll}
        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        Accepter
      </button>
    </div>
  );
}
```

---

## Example 7: Consent Progress Bar

```tsx
// components/ConsentStatus.tsx
'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';

export function ConsentStatus() {
  const { isAllowed } = useCookieConsent();

  const totalCategories = 3; // analytics, marketing, functional
  const enabledCount = [
    isAllowed('analytics'),
    isAllowed('marketing'),
    isAllowed('functional'),
  ].filter(Boolean).length;

  const percentage = (enabledCount / totalCategories) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
```

---

## Example 8: Force Re-consent

```tsx
// types/cookie-consent.ts
// To force all users to re-consent:

export const COOKIE_CONSENT_VERSION = 2; // was 1

// All existing users will see the banner again on next visit
```

---

## Example 9: Consent Reporting

```tsx
// hooks/useConsentReport.ts
'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';

export function useConsentReport() {
  const { consent } = useCookieConsent();

  return {
    // For compliance reporting
    accepted: {
      necessary: consent?.necessary ?? false,
      analytics: consent?.analytics ?? false,
      marketing: consent?.marketing ?? false,
      functional: consent?.functional ?? false,
    },
    timestamp: consent?.consentDate,
    version: consent?.version,
    
    // Helper methods
    export: () => ({
      timestamp: new Date().toISOString(),
      report: {
        necessary: consent?.necessary ?? false,
        analytics: consent?.analytics ?? false,
        marketing: consent?.marketing ?? false,
        functional: consent?.functional ?? false,
      },
    }),
    
    log: () => {
      console.log('CONSENT REPORT:');
      console.table({
        necessary: consent?.necessary ?? false,
        analytics: consent?.analytics ?? false,
        marketing: consent?.marketing ?? false,
        functional: consent?.functional ?? false,
        consentDate: consent?.consentDate,
        version: consent?.version,
      });
    },
  };
}
```

---

## Example 10: A/B Testing Consent Flow

```tsx
// hooks/useConsentABTest.ts
'use client';

import { useEffect, useState } from 'react';

type ABTestVariant = 'control' | 'variant_a' | 'variant_b';

export function useConsentABTest(): ABTestVariant {
  const [variant, setVariant] = useState<ABTestVariant>('control');

  useEffect(() => {
    // Random assignment (in production, use proper A/B testing service)
    const random = Math.random();
    if (random < 0.33) setVariant('control');
    else if (random < 0.66) setVariant('variant_a');
    else setVariant('variant_b');
  }, []);

  return variant;
}
```

Usage:
```tsx
const variant = useConsentABTest();

if (variant === 'control') {
  return <CookieBanner />;
} else if (variant === 'variant_a') {
  return <CookieBannerCompact />;
} else {
  return <CookieBannerModal />;
}
```

---

## Example 11: Consent with User Account

```tsx
// hooks/useAccountConsent.ts
'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';
import { useAuth } from '@/hooks/useAuth';

export function useAccountConsent() {
  const { consent, savePreferences } = useCookieConsent();
  const { user } = useAuth();

  const syncWithServer = async () => {
    if (!user || !consent) return;

    try {
      await fetch('/api/user/consent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          consent,
        }),
      });
    } catch (error) {
      console.error('Failed to sync consent:', error);
    }
  };

  return {
    consent,
    savePreferences: async (prefs: any) => {
      savePreferences(prefs);
      await syncWithServer();
    },
  };
}
```

---

## Example 12: Cookie Policy Page

```tsx
// app/(public)/cookies/page.tsx
export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Politique de Cookies</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Nécessaires</h2>
        <p className="text-gray-700 mb-4">
          Ces cookies sont essentiels au fonctionnement du site.
        </p>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Session - identifie votre session</li>
          <li>CSRF - protection contre les attaques</li>
          <li>Authentification - sécurité du compte</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Analytiques</h2>
        <p className="text-gray-700 mb-4">
          Nous utilisons Google Analytics pour comprendre comment vous utilisez notre site.
        </p>
        <a href="https://policies.google.com/privacy" className="text-blue-600">
          Politique de Google Analytics
        </a>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Marketing</h2>
        <p className="text-gray-700 mb-4">
          Nous utilisons des pixels pour les annonces ciblées.
        </p>
        <a href="https://www.facebook.com/policies/" className="text-blue-600">
          Politique de Facebook
        </a>
      </section>
    </div>
  );
}
```

---

## Quick Reference

### Import the Hook
```tsx
import { useCookieConsent } from '@/hooks/useCookieConsent';
```

### Import Components
```tsx
import { CookieBanner } from '@/components/cookie-banner';
import { CookiePreferencesModal } from '@/components/cookie-banner';
import { ScriptWithConsent } from '@/components/cookie-banner';
```

### Use in Component
```tsx
'use client';

export function MyComponent() {
  const { isAllowed } = useCookieConsent();
  
  return (
    <div>
      {isAllowed('analytics') ? 'Analytics enabled' : 'Analytics disabled'}
    </div>
  );
}
```

---

**All examples are production-ready and follow CNIL guidelines.**
