/**
 * Tests unitaires — components/ui/lazy-section.tsx
 * Composant de lazy-loading par section
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { LazySection } from '@/components/ui/lazy-section';

// Mock IntersectionObserver
let mockObserverCallback: IntersectionObserverCallback;
let mockObserverInstance: {
  observe: jest.Mock;
  disconnect: jest.Mock;
  unobserve: jest.Mock;
};

beforeEach(() => {
  mockObserverInstance = {
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  };

  (window as any).IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
    mockObserverCallback = callback;
    return mockObserverInstance;
  });
});

describe('LazySection', () => {
  it('affiche le placeholder par défaut avant l\'intersection', () => {
    render(
      <LazySection>
        <p>Contenu chargé</p>
      </LazySection>,
    );

    expect(screen.queryByText('Contenu chargé')).not.toBeInTheDocument();
  });

  it('affiche le fallback personnalisé', () => {
    render(
      <LazySection fallback={<div data-testid="custom-fallback">Chargement...</div>}>
        <p>Contenu chargé</p>
      </LazySection>,
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.queryByText('Contenu chargé')).not.toBeInTheDocument();
  });

  it('affiche le contenu après l\'intersection', () => {
    render(
      <LazySection>
        <p>Contenu chargé</p>
      </LazySection>,
    );

    // Simuler l'intersection
    act(() => {
      mockObserverCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        mockObserverInstance as unknown as IntersectionObserver,
      );
    });

    expect(screen.getByText('Contenu chargé')).toBeInTheDocument();
  });

  it('déconnecte l\'observer après l\'intersection', () => {
    render(
      <LazySection>
        <p>Contenu</p>
      </LazySection>,
    );

    act(() => {
      mockObserverCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        mockObserverInstance as unknown as IntersectionObserver,
      );
    });

    expect(mockObserverInstance.disconnect).toHaveBeenCalled();
  });

  it('ne rend pas le contenu si non intersecté', () => {
    render(
      <LazySection>
        <p>Pas encore</p>
      </LazySection>,
    );

    act(() => {
      mockObserverCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        mockObserverInstance as unknown as IntersectionObserver,
      );
    });

    expect(screen.queryByText('Pas encore')).not.toBeInTheDocument();
  });

  it('passe la classe CSS au conteneur', () => {
    const { container } = render(
      <LazySection className="ma-classe">
        <p>Contenu</p>
      </LazySection>,
    );

    expect(container.firstChild).toHaveClass('ma-classe');
  });

  it('utilise le rootMargin configuré', () => {
    render(
      <LazySection rootMargin="500px">
        <p>Contenu</p>
      </LazySection>,
    );

    expect(window.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '500px' },
    );
  });
});
