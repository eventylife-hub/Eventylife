'use client';

import { useState, useEffect } from 'react';

/**
 * Bouton flottant "retour en haut" — apparaît après 400px de scroll.
 * Design Sun/Ocean V4 : fond terra, icône blanche, ombre douce.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!visible) return null;

  return (
    <button type="button"
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
      className="fixed z-50 transition-all duration-300"
      style={{
        bottom: '2rem',
        right: '2rem',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'var(--terra, #C75B39)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(199,91,57,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        lineHeight: 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(199,91,57,0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(199,91,57,0.35)';
      }}
    >
      ↑
    </button>
  );
}
