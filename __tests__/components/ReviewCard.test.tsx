import React from 'react';
import { render, screen, userEvent } from '@/__tests__/test-utils';
import { ReviewCard } from '@/components/ReviewCard';

describe('Composant ReviewCard', () => {
  const defaultProps = {
    id: 'review-001',
    userName: 'Jean Dupont',
    rating: 4,
    comment: 'Excellent voyage, très bien organisé et le guide était formidable!',
    createdAt: '2026-06-25',
    status: 'APPROVED',
  };

  const mockOnReport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Affiche le nom de l\'utilisateur', () => {
    render(<ReviewCard {...defaultProps} />);
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
  });

  test('Affiche le commentaire de l\'avis', () => {
    render(<ReviewCard {...defaultProps} />);
    expect(
      screen.getByText(
        'Excellent voyage, très bien organisé et le guide était formidable!'
      )
    ).toBeInTheDocument();
  });

  test('Affiche la date au format français', () => {
    render(<ReviewCard {...defaultProps} />);
    expect(screen.getByText('25 juin 2026')).toBeInTheDocument();
  });

  test('Affiche 4 étoiles pleines et 1 étoile vide pour une note de 4', () => {
    render(<ReviewCard {...defaultProps} />);
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);
    expect(stars[0]).toHaveClass('text-yellow-400');
    expect(stars[1]).toHaveClass('text-yellow-400');
    expect(stars[2]).toHaveClass('text-yellow-400');
    expect(stars[3]).toHaveClass('text-yellow-400');
    expect(stars[4]).toHaveClass('text-gray-300');
  });

  test('Affiche 5 étoiles pleines pour une note de 5', () => {
    const props = {
      ...defaultProps,
      rating: 5,
    };
    render(<ReviewCard {...props} />);
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);
    stars.forEach((star) => {
      expect(star).toHaveClass('text-yellow-400');
    });
  });

  test('Affiche 1 étoile pleine et 4 étoiles vides pour une note de 1', () => {
    const props = {
      ...defaultProps,
      rating: 1,
    };
    render(<ReviewCard {...props} />);
    const stars = screen.getAllByText('★');
    expect(stars[0]).toHaveClass('text-yellow-400');
    expect(stars[1]).toHaveClass('text-gray-300');
    expect(stars[2]).toHaveClass('text-gray-300');
    expect(stars[3]).toHaveClass('text-gray-300');
    expect(stars[4]).toHaveClass('text-gray-300');
  });

  test('Affiche 0 étoile pleine pour une note de 0', () => {
    const props = {
      ...defaultProps,
      rating: 0,
    };
    render(<ReviewCard {...props} />);
    const stars = screen.getAllByText('★');
    stars.forEach((star) => {
      expect(star).toHaveClass('text-gray-300');
    });
  });

  test('Affiche le bouton "Signaler" quand onReport est fourni', () => {
    render(
      <ReviewCard {...defaultProps} onReport={mockOnReport} />
    );
    expect(screen.getByText('Signaler cet avis')).toBeInTheDocument();
  });

  test('Le bouton signaler n\'apparaît pas quand onReport n\'est pas fourni', () => {
    render(<ReviewCard {...defaultProps} />);
    expect(screen.queryByText('Signaler cet avis')).not.toBeInTheDocument();
  });

  test('Appelle le callback onReport avec l\'ID quand on clique sur signaler', async () => {
    render(
      <ReviewCard {...defaultProps} onReport={mockOnReport} />
    );
    const button = screen.getByText('Signaler cet avis');
    await userEvent.click(button);
    expect(mockOnReport).toHaveBeenCalledWith('review-001');
  });

  test('Affiche le badge "En modération" quand status n\'est pas APPROVED', () => {
    const props = {
      ...defaultProps,
      status: 'PENDING_MODERATION',
    };
    render(<ReviewCard {...props} />);
    expect(screen.getByText('En modération')).toBeInTheDocument();
  });

  test('N\'affiche pas le badge "En modération" quand status est APPROVED', () => {
    render(<ReviewCard {...defaultProps} />);
    expect(screen.queryByText('En modération')).not.toBeInTheDocument();
  });

  test('Affiche le badge "En modération" quand status est PENDING_MODERATION', () => {
    const props = {
      ...defaultProps,
      status: 'PENDING_MODERATION',
    };
    render(<ReviewCard {...props} />);
    const badge = screen.getByText('En modération');
    expect(badge).toHaveClass('bg-yellow-100');
    expect(badge).toHaveClass('text-yellow-800');
  });

  test('Affiche le badge "En modération" quand status n\'est pas APPROVED', () => {
    const props = {
      ...defaultProps,
      status: 'REJECTED',
    };
    render(<ReviewCard {...props} />);
    expect(screen.getByText('En modération')).toBeInTheDocument();
  });

  test('Affiche la date sans badge pour une note approuvée', () => {
    render(<ReviewCard {...defaultProps} />);
    expect(screen.getByText('25 juin 2026')).toBeInTheDocument();
    expect(screen.queryByText('En modération')).not.toBeInTheDocument();
  });

  test('Formate correctement les dates avec différents mois', () => {
    const props = {
      ...defaultProps,
      createdAt: '2026-01-15',
    };
    render(<ReviewCard {...props} />);
    expect(screen.getByText('15 janvier 2026')).toBeInTheDocument();
  });

  test('Affiche un commentaire multilignes correctement', () => {
    const props = {
      ...defaultProps,
      comment: 'C\'était une expérience formidable.\nJe recommande vivement!\nL\'équipe était fantastique.',
    };
    render(<ReviewCard {...props} />);
    expect(
      screen.getByText(/C\'était une expérience formidable/)
    ).toBeInTheDocument();
  });

  test('Affiche plusieurs avis avec des notes différentes', () => {
    const { rerender } = render(<ReviewCard {...defaultProps} />);
    let stars = screen.getAllByText('★');
    expect(stars[3]).toHaveClass('text-yellow-400');

    const props2 = {
      ...defaultProps,
      id: 'review-002',
      userName: 'Marie Martin',
      rating: 3,
    };
    rerender(<ReviewCard {...props2} />);
    stars = screen.getAllByText('★');
    expect(stars[2]).toHaveClass('text-yellow-400');
    expect(stars[3]).toHaveClass('text-gray-300');
  });

  test('Le bouton signaler a le bon style visuel', () => {
    render(
      <ReviewCard {...defaultProps} onReport={mockOnReport} />
    );
    const button = screen.getByText('Signaler cet avis');
    expect(button).toHaveClass('text-red-600');
    expect(button).toHaveClass('hover:text-red-700');
    expect(button).toHaveClass('font-semibold');
  });

  test('Affiche la note 2 correctement', () => {
    const props = {
      ...defaultProps,
      rating: 2,
    };
    render(<ReviewCard {...props} />);
    const stars = screen.getAllByText('★');
    expect(stars[0]).toHaveClass('text-yellow-400');
    expect(stars[1]).toHaveClass('text-yellow-400');
    expect(stars[2]).toHaveClass('text-gray-300');
    expect(stars[3]).toHaveClass('text-gray-300');
    expect(stars[4]).toHaveClass('text-gray-300');
  });

  test('Affiche un commentaire court correctement', () => {
    const props = {
      ...defaultProps,
      comment: 'Super!',
    };
    render(<ReviewCard {...props} />);
    expect(screen.getByText('Super!')).toBeInTheDocument();
  });

  test('Gère les commentaires avec caractères spéciaux', () => {
    const props = {
      ...defaultProps,
      comment: 'Très bien! Merci beaucoup. C\'est incroyable.',
    };
    render(<ReviewCard {...props} />);
    expect(
      screen.getByText('Très bien! Merci beaucoup. C\'est incroyable.')
    ).toBeInTheDocument();
  });
});
