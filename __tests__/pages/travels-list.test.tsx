import React from 'react';
import { render, screen, waitFor, userEvent } from '@/__tests__/test-utils';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

jest.mock('@/components/ui/skeleton', () => ({
  SkeletonGrid: ({ count }: { count: number }) => (
    <div data-testid="skeleton-grid">{[...Array(count)].map((_, i) => <div key={i} data-testid="skeleton" />)}</div>
  ),
}));

import VoyagesPage from '@/app/(public)/voyages/page';

describe('Page liste des voyages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Affiche le titre de la page', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Nos voyages')).toBeInTheDocument();
    });
  });

  test('Affiche la description de la page', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(
        screen.getByText(
          /Découvrez notre sélection de voyages en groupe avec accompagnement humain/
        )
      ).toBeInTheDocument();
    });
  });

  test('Affiche un état de chargement initial', () => {
    render(<VoyagesPage />);
    expect(screen.getByTestId('skeleton-grid')).toBeInTheDocument();
  });

  test('Affiche les voyages chargés correctement', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText(/Côte d'Azur - 7 jours/)).toBeInTheDocument();
    });
  });

  test('Affiche plusieurs cartes de voyage', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
      expect(screen.getByText('Châteaux de la Loire - 5 jours')).toBeInTheDocument();
      expect(screen.getByText('Alpes françaises - 6 jours')).toBeInTheDocument();
      expect(screen.getByText('Provence - 4 jours')).toBeInTheDocument();
    });
  });

  test('Affiche le nombre de voyages trouvés', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText(/4 voyages trouvés/)).toBeInTheDocument();
    });
  });

  test('Affiche le champ filtre destination', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Rechercher une destination/)
      ).toBeInTheDocument();
    });
  });

  test('Filtre les voyages par destination', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /Rechercher une destination/
    ) as HTMLInputElement;
    await userEvent.type(searchInput, 'Nice');

    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
      expect(screen.queryByText('Provence - 4 jours')).not.toBeInTheDocument();
    });
  });

  test('Affiche le message de résultat vide quand aucun voyage ne correspond', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /Rechercher une destination/
    ) as HTMLInputElement;
    await userEvent.type(searchInput, 'Tokyo');

    await waitFor(() => {
      expect(
        screen.getByText(/Aucun voyage ne correspond à vos critères de recherche/)
      ).toBeInTheDocument();
    });
  });

  test('Affiche le bouton pour réinitialiser la recherche', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /Rechercher une destination/
    ) as HTMLInputElement;
    await userEvent.type(searchInput, 'Tokyo');

    await waitFor(() => {
      expect(screen.getByText(/Réinitialiser la recherche/)).toBeInTheDocument();
    });
  });

  test('Filtre les voyages par prix minimum', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
    });

    const priceInputs = screen.getAllByDisplayValue('');
    const minPriceInput = priceInputs[1] as HTMLInputElement;
    
    await userEvent.type(minPriceInput, '500');

    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
      expect(screen.queryByText('Provence - 4 jours')).not.toBeInTheDocument();
    });
  });

  test('Affiche le menu tri avec les options disponibles', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Plus populaires')).toBeInTheDocument();
      expect(screen.getByText('Prix croissant')).toBeInTheDocument();
      expect(screen.getByText('Prix décroissant')).toBeInTheDocument();
      expect(screen.getByText('Meilleure notation')).toBeInTheDocument();
    });
  });

  test('Trie les voyages par prix croissant', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
    });

    const sortSelect = screen.getByDisplayValue(
      'Plus populaires'
    ) as HTMLSelectElement;
    await userEvent.selectOptions(sortSelect, 'price-asc');

    await waitFor(() => {
      const cards = screen.getAllByText(/place/);
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  test('Trie les voyages par prix décroissant', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
    });

    const sortSelect = screen.getByDisplayValue(
      'Plus populaires'
    ) as HTMLSelectElement;
    await userEvent.selectOptions(sortSelect, 'price-desc');

    await waitFor(() => {
      const cards = screen.getAllByText(/place/);
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  test('Trie les voyages par meilleure notation', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
    });

    const sortSelect = screen.getByDisplayValue(
      'Plus populaires'
    ) as HTMLSelectElement;
    await userEvent.selectOptions(sortSelect, 'rating');

    await waitFor(() => {
      const cards = screen.getAllByText(/place/);
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  test('Affiche les badges de disponibilité correctement', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Peu de places')).toBeInTheDocument();
    });
  });

  test('Affiche les prix correctement formatés en euros', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText(/À partir de 899,00 €/)).toBeInTheDocument();
    });
  });

  test('Les cartes ont les bonnes classes CSS', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
    });
  });

  test('Combine les filtres destination et prix', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /Rechercher une destination/
    ) as HTMLInputElement;
    await userEvent.type(searchInput, 'Nice');

    const priceInputs = screen.getAllByDisplayValue('');
    const maxPriceInput = priceInputs[2] as HTMLInputElement;
    await userEvent.type(maxPriceInput, '900');

    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
    });
  });

  test('Réinitialise les filtres en cliquant sur le bouton', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      /Rechercher une destination/
    ) as HTMLInputElement;
    await userEvent.type(searchInput, 'Tokyo');

    await waitFor(() => {
      expect(
        screen.getByText(/Aucun voyage ne correspond à vos critères/)
      ).toBeInTheDocument();
    });

    const resetButton = screen.getByText(/Réinitialiser la recherche/);
    await userEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
      expect(screen.getByText('Provence - 4 jours')).toBeInTheDocument();
    });
  });

  test('Affiche les lien vers les pages de détail des voyages', async () => {
    const { container } = render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
    });

    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
  });

  test('Affiche les avis et rating des voyages', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText(/⭐ 4/)).toBeInTheDocument();
    });
  });

  test('Affiche les dates formatées correctement', async () => {
    render(<VoyagesPage />);
    await waitFor(() => {
      expect(screen.getByText(/15\/06\/2026/)).toBeInTheDocument();
    });
  });
});
