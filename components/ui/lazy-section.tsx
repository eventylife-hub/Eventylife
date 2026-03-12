'use client';

import React, { useRef, useState, useEffect } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  /** Marge avant le viewport pour déclencher le chargement (défaut '200px') */
  rootMargin?: string;
  /** Placeholder affiché avant le chargement */
  fallback?: React.ReactNode;
  /** Classe CSS du conteneur */
  className?: string;
  /** Hauteur minimum du placeholder (défaut '200px') */
  minHeight?: string;
}

/**
 * Composant de lazy-loading par section — Eventy Life
 *
 * Retarde le rendu des sections below-the-fold
 * jusqu'à ce qu'elles approchent du viewport.
 *
 * @example
 * ```tsx
 * <LazySection fallback={<div className="h-96 animate-pulse bg-gray-100 rounded" />}>
 *   <HeavySection />
 * </LazySection>
 * ```
 */
export function LazySection({
  children,
  rootMargin = '200px',
  fallback,
  className,
  minHeight = '200px',
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Si IntersectionObserver n'est pas supporté, afficher directement
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible
        ? children
        : fallback || (
            <div
              style={{ minHeight }}
              className="animate-pulse bg-gray-100 rounded-lg"
              aria-hidden="true"
            />
          )}
    </div>
  );
}
