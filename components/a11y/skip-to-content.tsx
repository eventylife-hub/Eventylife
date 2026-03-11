'use client';

/**
 * SkipToContent — Lien d'accessibilité "Aller au contenu principal"
 * Visible uniquement au focus clavier (Tab), invisible sinon.
 * WCAG 2.1 Level A — Critère 2.4.1 : Contourner des blocs
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
      style={{
        position: 'absolute',
        top: '-100%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        padding: '12px 24px',
        backgroundColor: '#1A1A2E',
        color: '#FAF7F2',
        fontWeight: 700,
        fontSize: '0.875rem',
        borderRadius: '0 0 12px 12px',
        textDecoration: 'none',
        transition: 'top 0.2s ease',
      }}
      onFocus={(e) => { e.currentTarget.style.top = '0'; }}
      onBlur={(e) => { e.currentTarget.style.top = '-100%'; }}
    >
      Aller au contenu principal
    </a>
  );
}
