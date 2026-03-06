import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import { BookingCard } from '@/components/BookingCard';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Composant BookingCard', () => {
  const defaultProps = {
    id: 'booking-001',
    travelTitle: 'Côte d\'Azur - 7 jours',
    travelSlug: 'cote-d-azur-7-jours',
    destinationCity: 'Nice',
    departureDate: '2026-06-15',
    returnDate: '2026-06-22',
    totalAmountTTC: 89900,
    participantCount: 2,
    status: 'CONFIRMED',
    travelCoverImageUrl: 'https://example.com/image.jpg',
  };

  test('Affiche la référence de réservation', () => {
    render(<BookingCard {...defaultProps} />);
    expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
  });

  test('Affiche le titre du voyage', () => {
    render(<BookingCard {...defaultProps} />);
    expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();
  });

  test('Affiche la ville de destination', () => {
    render(<BookingCard {...defaultProps} />);
    expect(screen.getByText(/📍 Nice/)).toBeInTheDocument();
  });

  test('Affiche les dates de départ et retour formatées', () => {
    render(<BookingCard {...defaultProps} />);
    expect(screen.getByText(/📅 15 juin 2026 - 22 juin 2026/)).toBeInTheDocument();
  });

  test('Affiche le nombre de participants au singulier', () => {
    const props = {
      ...defaultProps,
      participantCount: 1,
    };
    render(<BookingCard {...props} />);
    expect(screen.getByText('👥 1 participant')).toBeInTheDocument();
  });

  test('Affiche le nombre de participants au pluriel', () => {
    render(<BookingCard {...defaultProps} />);
    expect(screen.getByText('👥 2 participants')).toBeInTheDocument();
  });

  test('Affiche le prix total en euros', () => {
    render(<BookingCard {...defaultProps} />);
    expect(screen.getByText('899,00 €')).toBeInTheDocument();
  });

  test('Affiche le label "Total" sous le prix', () => {
    render(<BookingCard {...defaultProps} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  test('Affiche le badge de statut CONFIRMED en vert', () => {
    render(<BookingCard {...defaultProps} />);
    const badge = screen.getByText('Confirmée');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
  });

  test('Affiche le badge de statut HELD en bleu', () => {
    const props = {
      ...defaultProps,
      status: 'HELD',
    };
    render(<BookingCard {...props} />);
    const badge = screen.getByText('En attente');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
  });

  test('Affiche le badge de statut PARTIALLY_PAID en jaune', () => {
    const props = {
      ...defaultProps,
      status: 'PARTIALLY_PAID',
    };
    render(<BookingCard {...props} />);
    const badge = screen.getByText('Partiellement payée');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100');
    expect(badge).toHaveClass('text-yellow-800');
  });

  test('Affiche le badge de statut DRAFT', () => {
    const props = {
      ...defaultProps,
      status: 'DRAFT',
    };
    render(<BookingCard {...props} />);
    expect(screen.getByText('Brouillon')).toBeInTheDocument();
  });

  test('Affiche le badge de statut EXPIRED en rouge', () => {
    const props = {
      ...defaultProps,
      status: 'EXPIRED',
    };
    render(<BookingCard {...props} />);
    const badge = screen.getByText('Expirée');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
  });

  test('Affiche le badge de statut CANCELED en rouge', () => {
    const props = {
      ...defaultProps,
      status: 'CANCELED',
    };
    render(<BookingCard {...props} />);
    const badge = screen.getByText('Annulée');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
  });

  test('Affiche une image d\'espace réservé quand l\'image n\'est pas fournie', () => {
    const props = {
      ...defaultProps,
      travelCoverImageUrl: undefined,
    };
    render(<BookingCard {...props} />);
    expect(screen.queryByAltText('Côte d\'Azur - 7 jours')).not.toBeInTheDocument();
  });

  test('Affiche l\'image quand elle est fournie', () => {
    const { container } = render(<BookingCard {...defaultProps} />);
    const imgElement = container.querySelector('img[alt="Côte d\'Azur - 7 jours"]');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  test('Le lien navigue vers la page de détails de la réservation', () => {
    const { container } = render(<BookingCard {...defaultProps} />);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/client/reservations/booking-001');
  });

  test('Formate correctement un prix de 0 centime', () => {
    const props = {
      ...defaultProps,
      totalAmountTTC: 0,
    };
    render(<BookingCard {...props} />);
    expect(screen.getByText('0,00 €')).toBeInTheDocument();
  });

  test('Formate correctement un prix avec décimales', () => {
    const props = {
      ...defaultProps,
      totalAmountTTC: 123456,
    };
    render(<BookingCard {...props} />);
    expect(screen.getByText('1 234,56 €')).toBeInTheDocument();
  });

  test('Formate correctement les dates avec jour, mois et année', () => {
    const props = {
      ...defaultProps,
      departureDate: '2026-12-25',
      returnDate: '2026-12-31',
    };
    render(<BookingCard {...props} />);
    expect(screen.getByText(/25 décembre 2026 - 31 décembre 2026/)).toBeInTheDocument();
  });

  test('Affiche 3 participants quand participantCount est 3', () => {
    const props = {
      ...defaultProps,
      participantCount: 3,
    };
    render(<BookingCard {...props} />);
    expect(screen.getByText('👥 3 participants')).toBeInTheDocument();
  });

  test('Affiche l\'image avec effet de zoom au survol', () => {
    const { container } = render(<BookingCard {...defaultProps} />);
    const imgElement = container.querySelector('img');
    expect(imgElement?.parentElement).toHaveClass('group-hover:scale-105');
  });

  test('La carte a un effet d\'ombre au survol', () => {
    const { container } = render(<BookingCard {...defaultProps} />);
    const cardDiv = container.querySelector('.group');
    const cardContent = cardDiv?.querySelector('div');
    expect(cardContent).toHaveClass('hover:shadow-md');
  });

  test('Affiche plusieurs réservations correctement', () => {
    const { rerender } = render(<BookingCard {...defaultProps} />);
    expect(screen.getByText('Côte d\'Azur - 7 jours')).toBeInTheDocument();

    const props2 = {
      ...defaultProps,
      id: 'booking-002',
      travelTitle: 'Alpes - 6 jours',
    };
    rerender(<BookingCard {...props2} />);
    expect(screen.getByText('Alpes - 6 jours')).toBeInTheDocument();
  });
});
