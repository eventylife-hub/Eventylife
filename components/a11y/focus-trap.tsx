'use client';

import { useEffect, useRef, useCallback } from 'react';

interface FocusTrapProps {
  /** Contenu à piéger (modale, panneau, etc.) */
  children: React.ReactNode;
  /** Activer/désactiver le piège focus */
  active?: boolean;
  /** Callback pour fermer (Escape) */
  onEscape?: () => void;
  /** Classe CSS optionnelle */
  className?: string;
  /** Style inline optionnel */
  style?: React.CSSProperties;
  /** Attributs ARIA */
  role?: string;
  'aria-modal'?: boolean;
  'aria-labelledby'?: string;
}

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * FocusTrap — Piège le focus clavier dans un conteneur.
 * WCAG 2.1 Level A — Critère 2.1.2 : Pas de piège clavier (paradoxal mais le standard
 * exige que les modales piègent le focus avec Escape pour sortir).
 *
 * Fonctionnalités :
 * - Focus automatique sur le premier élément focusable à l'ouverture
 * - Tab / Shift+Tab cyclent dans le conteneur
 * - Escape ferme via onEscape callback
 * - Restaure le focus sur l'élément précédent à la fermeture
 *
 * Exemple :
 * ```tsx
 * {showModal && (
 *   <FocusTrap onEscape={() => setShowModal(false)} role="dialog" aria-modal>
 *     <h2>Titre</h2>
 *     <button>Fermer</button>
 *   </FocusTrap>
 * )}
 * ```
 */
export function FocusTrap({
  children,
  active = true,
  onEscape,
  className,
  style,
  ...ariaProps
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Sauvegarder l'élément précédemment focusé
  useEffect(() => {
    if (active) {
      previousActiveElement.current = document.activeElement;
    }
    return () => {
      // Restaurer le focus
      if (previousActiveElement.current && previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [active]);

  // Focus initial sur le premier élément focusable
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const firstFocusable = containerRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    if (firstFocusable) {
      // Petit délai pour laisser le rendu se stabiliser
      requestAnimationFrame(() => firstFocusable.focus());
    }
  }, [active]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!active || !containerRef.current) return;

    if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      e.stopPropagation();
      onEscape();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab depuis le premier → va au dernier
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab depuis le dernier → va au premier
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }, [active, onEscape]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={className}
      style={style}
      {...ariaProps}
    >
      {children}
    </div>
  );
}
