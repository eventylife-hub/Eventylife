import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import { TravelCard } from '@/components/TravelCard';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Composant TravelCard', () => {
  const defaultProps = {
    id: '1',
    title: 'Côte d\'Azur - 7 jours',
    destination: 'Nice, Cannes, Monaco',
    startDate: '2026-06-15',
    endDate: '2026-06-22',
    priceInCents: 89900,
    imageUrl: 'https://example.com/image.jpg',
    rating: 4.8,
    reviewCount: 127,
    capacity: 45,
    currentBookings: 38,
    slug: 'cote-d-azur-7-jours',
  };

  test('Affiche le titre du voyage', () => {
    render(<TravelCard {...defaultProps} />);
    expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
  });

  test('Affiche la destination avec emoji', () => {
    render(<TravelCard {...defaultProps} />);
    expect(screen.getByText(/📍 Nice, Cannes, Monaco/)).toBeInTheDocument();
  });

  test('Affiche les dates formatées correctement', () => {
    render(<TravelCard {...defaultProps} />);
    expect(screen.getByText(/15\/06\/2026 - 22\/06\/2026/)).toBeInTheDocument();
  });

  test('Affiche le prix en euros avec le symbole €', () => {
    render(<TravelCard {...defaultProps} />);
    expect(screen.getByText(/À partir de 899,00 €/)).toBeInTheDocument();
  });

  test('Affiche le badge de nombre de jours', () => {
    render(<TravelCard {...defaultProps} />);
    expect(screen.getByText('7 jours')).toBeInTheDocument();
  });

  test('Affiche le badge "Peu de places" quand seulement 7 places restantes', () => {
    const props = {
      ...defaultProps,
      currentBookings: 38,
      capacity: 45,
    };
    render(<TravelCard {...props} />);
    expect(screen.getByText('Peu de places')).toBeInTheDocument();
  });

  test('N\'affiche pas le badge "Peu de places" quand 10+ places restantes', () => {
    const props = {
      ...defaultProps,
      currentBookings: 35,
      capacity: 45,
    };
    render(<TravelCard {...props} />);
    expect(screen.queryByText('Peu de places')).not.toBeInTheDocument();
  });

  test('Affiche la note et le nombre d\'avis', () => {
    render(<TravelCard {...defaultProps} />);
    expect(screen.getByText(/⭐ 4\.8/)).toBeInTheDocument();
    expect(screen.getByText('(127)')).toBeInTheDocument();
  });

  test('N\'affiche pas la note quand rating est 0', () => {
    const props = {
      ...defaultProps,
      rating: 0,
    };
    render(<TravelCard {...props} />);
    expect(screen.queryByText(/⭐/)).not.toBeInTheDocument();
  });

  test('Affiche le nombre de places restantes', () => {
    render(<TravelCard {...defaultProps} />);
    expect(screen.getByText('7 places restantes')).toBeInTheDocument();
  });

  test('Affiche "1 place restante" quand une seule place disponible', () => {
    const props = {
      ...defaultProps,
      capacity: 45,
      currentBookings: 44,
    };
    render(<TravelCard {...props} />);
    expect(screen.getByText('1 place restante')).toBeInTheDocument();
  });

  test('Affiche "0 places restantes" quand aucune place disponible', () => {
    const props = {
      ...defaultProps,
      capacity: 45,
      currentBookings: 45,
    };
    render(<TravelCard {...props} />);
    expect(screen.getByText('0 places restantes')).toBeInTheDocument();
  });

  test('Affiche une image d\'espace réservé quand imageUrl n\'est pas fourni', () => {
    const props = {
      ...defaultProps,
      imageUrl: undefined,
    };
    render(<TravelCard {...props} />);
    expect(screen.getByText('✈️')).toBeInTheDocument();
  });

  test('Affiche l\'image fournie quand imageUrl est présent', () => {
    const { container } = render(<TravelCard {...defaultProps} />);
    const imgElement = container.querySelector('img[alt="Côte d\'Azur - 7 jours"]');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  test('Le bouton "Voir détails" est présent', () => {
    render(<TravelCard {...defaultProps} />);
    expect(screen.getByText('Voir détails')).toBeInTheDocument();
  });

  test('Le lien navigue vers la bonne page de détail', () => {
    const { container } = render(<TravelCard {...defaultProps} />);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/voyages/cote-d-azur-7-jours');
  });

  test('Formate correctement un prix de 0 centime', () => {
    const props = {
      ...defaultProps,
      priceInCents: 0,
    };
    render(<TravelCard {...props} />);
    expect(screen.getByText(/À partir de 0,00 €/)).toBeInTheDocument();
  });

  test('Formate correctement un prix avec décimales', () => {
    const props = {
      ...defaultProps,
      priceInCents: 123456,
    };
    render(<TravelCard {...props} />);
    expect(screen.getByText(/À partir de 1 234,56 €/)).toBeInTheDocument();
  });

  test('Calcule correctement le nombre de jours entre deux dates', () => {
    const props = {
      ...defaultProps,
      startDate: '2026-06-15',
      endDate: '2026-06-22',
    };
    render(<TravelCard {...props} />);
    expect(screen.getByText('7 jours')).toBeInTheDocument();
  });

  test('Gère correctement les cas limites de dates (même jour)', () => {
    const props = {
      ...defaultProps,
      startDate: '2026-06-15',
      endDate: '2026-06-15',
    };
    render(<TravelCard {...props} />);
    expect(screen.getByText('1 jour')).toBeInTheDocument();
  });
});
