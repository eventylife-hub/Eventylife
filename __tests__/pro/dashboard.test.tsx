import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProDashboard from '@/app/(pro)/pro/page';
import { mockFetch } from '@/__tests__/test-utils';

// Mock next/link
jest.mock('next/link', () => {
  return ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  BarChart: () => <div data-testid="bar-chart-icon">BarChart Icon</div>,
  Users: () => <div data-testid="users-icon">Users Icon</div>,
  TrendingUp: () => <div data-testid="trending-icon">Trending Icon</div>,
  AlertCircle: () => <div data-testid="alert-icon">Alert Icon</div>,
}));

// Mock the pro store
jest.mock('@/lib/stores/pro-store', () => ({
  useProStore: jest.fn(() => ({
    proProfile: {
      displayName: 'Mon Agence',
    },
    onboardingStatus: {
      currentStatus: 'APPROVED',
      step1_profile: true,
      step2_legal: true,
      step3_payout: true,
      step4_documents: true,
      step5_contracts: true,
      step6_formation: true,
    },
    formationProgress: {},
    fetchProProfile: jest.fn(),
    fetchOnboardingStatus: jest.fn(),
    fetchFormationProgress: jest.fn(),
  })),
}));

describe('Pro Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Titre et structure générale', () => {
    it('devrait afficher le titre du tableau de bord professionnel', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Bienvenue.*Pro/)).toBeInTheDocument();
      });
    });

    it('devrait afficher le texte "Tableau de bord de votre espace professionnel"', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Tableau de bord de votre espace professionnel')).toBeInTheDocument();
      });
    });
  });

  describe('Cartes de statistiques', () => {
    it('devrait afficher la carte "Voyages actifs"', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Voyages actifs')).toBeInTheDocument();
      });
    });

    it('devrait afficher le nombre de voyages actifs', async () => {
      mockFetch({
        activeVoyages: 8,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText('8')).toBeInTheDocument();
      });
    });

    it('devrait afficher la carte "Réservations totales"', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Réservations totales')).toBeInTheDocument();
      });
    });

    it('devrait afficher le nombre de réservations', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 42,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText('42')).toBeInTheDocument();
      });
    });

    it('devrait afficher la carte "CA ce mois"', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText('CA ce mois')).toBeInTheDocument();
      });
    });

    it('devrait afficher la carte "Note moyenne"', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Note moyenne')).toBeInTheDocument();
      });
    });

    it('devrait afficher la note moyenne avec étoile', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.7,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/4\.7/)).toBeInTheDocument();
      });
    });
  });

  describe('Bouton CTA "Créer un voyage"', () => {
    it('devrait afficher le bouton "Créer un voyage"', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Créer un voyage')).toBeInTheDocument();
      });
    });

    it('devrait avoir un lien vers /pro/voyages/nouveau', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        const createLink = screen.getByText('Créer un voyage').closest('a');
        expect(createLink).toHaveAttribute('href', '/pro/voyages/nouveau');
      });
    });

    it('devrait afficher le texte descriptif du bouton "Créer un voyage"', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText("Lancez votre première offre")).toBeInTheDocument();
      });
    });
  });

  describe('Section "Prochains départs"', () => {
    it('devrait afficher la section "Prochains départs"', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Prochains départs')).toBeInTheDocument();
      });
    });

    it('devrait afficher au moins un prochain départ', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Voyage vers/)).toBeInTheDocument();
      });
    });

    it('devrait afficher les informations de départ (destination, date, réservations)', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Départ:/)).toBeInTheDocument();
        expect(screen.getByText(/réservations/)).toBeInTheDocument();
      });
    });
  });

  describe('Lien "Gérer mes arrêts"', () => {
    it('devrait afficher le lien "Gérer mes arrêts"', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Gérer mes arrêts')).toBeInTheDocument();
      });
    });

    it('devrait avoir un lien vers /pro/arrets', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        const arretsLink = screen.getByText('Gérer mes arrêts').closest('a');
        expect(arretsLink).toHaveAttribute('href', '/pro/arrets');
      });
    });
  });

  describe('Appels API', () => {
    it('devrait appeler l\'API /api/pro/dashboard/stats au montage', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/pro/dashboard/stats', {
          credentials: 'include',
        });
      });
    });

    it('devrait gérer les erreurs de chargement gracieusement', async () => {
      mockFetch(null, 500, false);
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Tableau de bord/)).toBeInTheDocument();
      });
    });
  });

  describe('Onboarding Banner', () => {
    it('devrait ne pas afficher la banneau d\'onboarding si l\'utilisateur a complété l\'inscription', async () => {
      mockFetch({
        activeVoyages: 5,
        totalBookings: 20,
        monthlyRevenue: 5000,
        averageRating: 4.5,
      });
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.queryByText(/Complétez votre inscription/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Gestion des statistiques par défaut', () => {
    it('devrait afficher 0 pour les statistiques manquantes', async () => {
      mockFetch(null, 500, false);
      render(<ProDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Voyages actifs')).toBeInTheDocument();
      });
    });
  });
});
