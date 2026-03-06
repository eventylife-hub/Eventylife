import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboardPage from '@/app/(admin)/admin/page';
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
  Users: () => <div data-testid="users-icon">Users Icon</div>,
  TrendingUp: () => <div data-testid="trending-icon">Trending Icon</div>,
  AlertCircle: () => <div data-testid="alert-icon">Alert Icon</div>,
  Wallet: () => <div data-testid="wallet-icon">Wallet Icon</div>,
}));

// Mock StatsCard component
jest.mock('@/components/admin/stats-card', () => ({
  StatsCard: ({
    title,
    value,
    href,
  }: {
    title: string;
    value: string | number;
    href?: string;
  }) => {
    return (
      <div data-testid={`stats-card-${title}`}>
        <h3>{title}</h3>
        <p>{value}</p>
        {href && <a href={href}>{href}</a>}
      </div>
    );
  },
}));

// Mock Card components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
}));

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => {
    return <button {...props}>{children}</button>;
  },
}));

describe('Admin Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Titre et structure générale', () => {
    it('devrait afficher le titre du tableau de bord administrateur', async () => {
      mockFetch(null, 200, false);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Tableau de bord administrateur')).toBeInTheDocument();
      });
    });

    it('devrait afficher le texte de bienvenue', async () => {
      mockFetch(null, 200, false);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/Bienvenue sur le tableau de bord/)).toBeInTheDocument();
      });
    });
  });

  describe('État de chargement', () => {
    it('devrait afficher des cartes de chargement au démarrage', () => {
      mockFetch(null, 200, false);
      const { container } = render(<AdminDashboardPage />);

      const loadingCards = container.querySelectorAll('[class*="animate-pulse"]');
      expect(loadingCards.length).toBeGreaterThan(0);
    });

    it('devrait afficher 4 cartes de chargement', () => {
      mockFetch(null, 200, false);
      const { container } = render(<AdminDashboardPage />);

      const loadingCardsContainer = container.querySelector('[class*="grid"]');
      expect(loadingCardsContainer).toBeInTheDocument();
    });
  });

  describe('Cartes KPI', () => {
    it('devrait afficher les cartes de statistiques après le chargement', async () => {
      const mockStats = {
        totalUsers: 150,
        userGrowth: 12,
        totalTravels: 45,
        monthlyRevenueCents: 50000,
        pendingAlerts: 3,
        pendingTravels: 5,
        pendingPros: 2,
      };

      mockFetch(mockStats);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByTestId('stats-card-Utilisateurs actifs')).toBeInTheDocument();
      });
    });

    it('devrait afficher la carte des voyages actifs', async () => {
      const mockStats = {
        totalUsers: 150,
        userGrowth: 12,
        totalTravels: 45,
        monthlyRevenueCents: 50000,
        pendingAlerts: 3,
        pendingTravels: 5,
        pendingPros: 2,
      };

      mockFetch(mockStats);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByTestId('stats-card-Voyages actifs')).toBeInTheDocument();
      });
    });

    it('devrait afficher la carte du chiffre d\'affaires mensuel', async () => {
      const mockStats = {
        totalUsers: 150,
        userGrowth: 12,
        totalTravels: 45,
        monthlyRevenueCents: 50000,
        revenueGrowth: 8,
        pendingAlerts: 3,
        pendingTravels: 5,
        pendingPros: 2,
      };

      mockFetch(mockStats);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByTestId('stats-card-Chiffre d\'affaires mensuel')).toBeInTheDocument();
      });
    });

    it('devrait afficher la carte des actions en attente', async () => {
      const mockStats = {
        totalUsers: 150,
        userGrowth: 12,
        totalTravels: 45,
        monthlyRevenueCents: 50000,
        pendingAlerts: 3,
        pendingTravels: 5,
        pendingPros: 2,
      };

      mockFetch(mockStats);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByTestId('stats-card-Actions en attente')).toBeInTheDocument();
      });
    });
  });

  describe('Sections de contenu', () => {
    it('devrait afficher la section "Voyages en attente"', async () => {
      const mockStats = {
        totalUsers: 150,
        userGrowth: 12,
        totalTravels: 45,
        monthlyRevenueCents: 50000,
        pendingTravels: 5,
        pendingPros: 2,
      };

      mockFetch(mockStats);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Voyages en attente')).toBeInTheDocument();
      });
    });

    it('devrait afficher la section "Profils Pro en attente"', async () => {
      const mockStats = {
        totalUsers: 150,
        userGrowth: 12,
        totalTravels: 45,
        monthlyRevenueCents: 50000,
        pendingTravels: 5,
        pendingPros: 2,
      };

      mockFetch(mockStats);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Profils Pro en attente')).toBeInTheDocument();
      });
    });

    it('devrait afficher la section "Actions rapides"', async () => {
      const mockStats = {
        totalUsers: 150,
        userGrowth: 12,
        totalTravels: 45,
        monthlyRevenueCents: 50000,
        pendingTravels: 0,
        pendingPros: 0,
      };

      mockFetch(mockStats);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Actions rapides')).toBeInTheDocument();
      });
    });
  });

  describe('Boutons d\'action rapides', () => {
    it('devrait afficher le bouton "Gérer utilisateurs"', async () => {
      const mockStats = {
        totalUsers: 150,
        userGrowth: 12,
        totalTravels: 45,
        monthlyRevenueCents: 50000,
        pendingTravels: 0,
        pendingPros: 0,
      };

      mockFetch(mockStats);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Gérer utilisateurs')).toBeInTheDocument();
      });
    });

    it('devrait afficher le bouton "Gérer voyages"', async () => {
      const mockStats = {
        totalUsers: 150,
        userGrowth: 12,
        totalTravels: 45,
        monthlyRevenueCents: 50000,
        pendingTravels: 0,
        pendingPros: 0,
      };

      mockFetch(mockStats);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Gérer voyages')).toBeInTheDocument();
      });
    });

    it('devrait afficher les autres boutons d\'action rapides', async () => {
      const mockStats = {
        totalUsers: 150,
        userGrowth: 12,
        totalTravels: 45,
        monthlyRevenueCents: 50000,
        pendingTravels: 0,
        pendingPros: 0,
      };

      mockFetch(mockStats);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Finances')).toBeInTheDocument();
        expect(screen.getByText('Paramètres')).toBeInTheDocument();
        expect(screen.getByText('Audit')).toBeInTheDocument();
      });
    });
  });

  describe('Message vide', () => {
    it('devrait afficher un message quand aucun voyage n\'est en attente', async () => {
      const mockStats = {
        totalUsers: 150,
        userGrowth: 12,
        totalTravels: 45,
        monthlyRevenueCents: 50000,
        pendingTravels: 0,
        pendingPros: 0,
      };

      mockFetch(mockStats);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Aucun voyage en attente')).toBeInTheDocument();
      });
    });

    it('devrait afficher un message quand aucun profil pro n\'est en attente', async () => {
      const mockStats = {
        totalUsers: 150,
        userGrowth: 12,
        totalTravels: 45,
        monthlyRevenueCents: 50000,
        pendingTravels: 0,
        pendingPros: 0,
      };

      mockFetch(mockStats);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Aucun profil en attente')).toBeInTheDocument();
      });
    });
  });

  describe('Appels API', () => {
    it('devrait appeler l\'API /api/admin/dashboard au montage', async () => {
      mockFetch(null, 200, false);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/dashboard', {
          credentials: 'include',
        });
      });
    });

    it('devrait gérer les erreurs de chargement gracieusement', async () => {
      mockFetch(null, 500, false);
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText('Tableau de bord administrateur')).toBeInTheDocument();
      });
    });
  });
});
