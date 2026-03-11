import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock component for admin users page
const AdminUsersPage = () => {
  const [users, setUsers] = React.useState([
    { id: '1', nom: 'Alice Dupont', email: 'alice@example.com', role: 'user', statut: 'actif' },
    { id: '2', nom: 'Bob Martin', email: 'bob@example.com', role: 'user', statut: 'actif' },
    { id: '3', nom: 'Charlie Dubois', email: 'charlie@example.com', role: 'admin', statut: 'suspendu' },
  ]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleStatus = (id: string) => {
    setUsers(users.map((user) =>
      user.id === id
        ? { ...user, statut: user.statut === 'actif' ? 'suspendu' : 'actif' }
        : user
    ));
  };

  return (
    <div>
      <h1>Gérer les utilisateurs</h1>
      
      <div>
        <input
          type="text"
          placeholder="Rechercher par nom ou email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-input"
        />
      </div>

      <div>
        <label htmlFor="role-filter">Filtrer par rôle:</label>
        <select
          id="role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          data-testid="role-filter"
        >
          <option value="all">Tous les rôles</option>
          <option value="user">Utilisateur</option>
          <option value="admin">Admin</option>
          <option value="pro">Pro</option>
        </select>
      </div>

      <table data-testid="users-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} data-testid={`user-row-${user.id}`}>
              <td>{user.nom}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.statut}</td>
              <td>
                <button type="button"
                  onClick={() => toggleStatus(user.id)}
                  data-testid={`toggle-status-${user.id}`}
                >
                  {user.statut === 'actif' ? 'Suspendre' : 'Activer'}
                </button>
                <a href={`/admin/utilisateurs/${user.id}`} data-testid={`view-detail-${user.id}`}>
                  Voir détails
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button type="button" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} data-testid="prev-page">
          Précédent
        </button>
        <span data-testid="page-info">Page {currentPage}</span>
        <button type="button" onClick={() => setCurrentPage(currentPage + 1)} data-testid="next-page">
          Suivant
        </button>
      </div>
    </div>
  );
};

describe('Admin Users Management Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tableau des utilisateurs', () => {
    it('devrait afficher le titre "Gérer les utilisateurs"', () => {
      render(<AdminUsersPage />);
      expect(screen.getByText('Gérer les utilisateurs')).toBeInTheDocument();
    });

    it('devrait afficher le tableau avec les colonnes requises', () => {
      render(<AdminUsersPage />);
      const table = screen.getByTestId('users-table');

      expect(within(table).getByText('Nom')).toBeInTheDocument();
      expect(within(table).getByText('Email')).toBeInTheDocument();
      expect(within(table).getByText('Rôle')).toBeInTheDocument();
      expect(within(table).getByText('Statut')).toBeInTheDocument();
      expect(within(table).getByText('Actions')).toBeInTheDocument();
    });

    it('devrait afficher les utilisateurs dans le tableau', () => {
      render(<AdminUsersPage />);

      expect(screen.getByText('Alice Dupont')).toBeInTheDocument();
      expect(screen.getByText('Bob Martin')).toBeInTheDocument();
      expect(screen.getByText('Charlie Dubois')).toBeInTheDocument();
    });

    it('devrait afficher les emails des utilisateurs', () => {
      render(<AdminUsersPage />);

      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
      expect(screen.getByText('charlie@example.com')).toBeInTheDocument();
    });

    it('devrait afficher les rôles des utilisateurs', () => {
      render(<AdminUsersPage />);

      expect(screen.getByText('user')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
    });

    it('devrait afficher les statuts des utilisateurs', () => {
      render(<AdminUsersPage />);

      const statuts = screen.getAllByText('actif');
      expect(statuts.length).toBeGreaterThan(0);
      expect(screen.getByText('suspendu')).toBeInTheDocument();
    });
  });

  describe('Recherche d\'utilisateurs', () => {
    it('devrait afficher le champ de recherche', () => {
      render(<AdminUsersPage />);
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
    });

    it('devrait filtrer les utilisateurs par nom', async () => {
      const user = userEvent.setup();
      render(<AdminUsersPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Alice');

      expect(screen.getByText('Alice Dupont')).toBeInTheDocument();
      expect(screen.queryByText('Bob Martin')).not.toBeInTheDocument();
      expect(screen.queryByText('Charlie Dubois')).not.toBeInTheDocument();
    });

    it('devrait filtrer les utilisateurs par email', async () => {
      const user = userEvent.setup();
      render(<AdminUsersPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'bob@');

      expect(screen.getByText('Bob Martin')).toBeInTheDocument();
      expect(screen.queryByText('Alice Dupont')).not.toBeInTheDocument();
    });

    it('devrait être insensible à la casse lors de la recherche', async () => {
      const user = userEvent.setup();
      render(<AdminUsersPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'alice');

      expect(screen.getByText('Alice Dupont')).toBeInTheDocument();
    });

    it('devrait afficher tous les utilisateurs lorsque la recherche est vide', async () => {
      const user = userEvent.setup();
      render(<AdminUsersPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Alice');
      await user.clear(searchInput);

      expect(screen.getByText('Alice Dupont')).toBeInTheDocument();
      expect(screen.getByText('Bob Martin')).toBeInTheDocument();
      expect(screen.getByText('Charlie Dubois')).toBeInTheDocument();
    });
  });

  describe('Filtrage par rôle', () => {
    it('devrait afficher le dropdown de filtrage par rôle', () => {
      render(<AdminUsersPage />);
      const roleFilter = screen.getByTestId('role-filter');
      expect(roleFilter).toBeInTheDocument();
    });

    it('devrait afficher toutes les options de rôle', () => {
      render(<AdminUsersPage />);
      expect(screen.getByText('Tous les rôles')).toBeInTheDocument();
      expect(screen.getByText('Utilisateur')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('Pro')).toBeInTheDocument();
    });

    it('devrait filtrer par rôle "user"', async () => {
      const user = userEvent.setup();
      render(<AdminUsersPage />);

      const roleFilter = screen.getByTestId('role-filter');
      await user.selectOptions(roleFilter, 'user');

      expect(screen.getByText('Alice Dupont')).toBeInTheDocument();
      expect(screen.getByText('Bob Martin')).toBeInTheDocument();
      expect(screen.queryByText('Charlie Dubois')).not.toBeInTheDocument();
    });

    it('devrait filtrer par rôle "admin"', async () => {
      const user = userEvent.setup();
      render(<AdminUsersPage />);

      const roleFilter = screen.getByTestId('role-filter');
      await user.selectOptions(roleFilter, 'admin');

      expect(screen.getByText('Charlie Dubois')).toBeInTheDocument();
      expect(screen.queryByText('Alice Dupont')).not.toBeInTheDocument();
      expect(screen.queryByText('Bob Martin')).not.toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('devrait afficher les boutons de pagination', () => {
      render(<AdminUsersPage />);
      expect(screen.getByTestId('prev-page')).toBeInTheDocument();
      expect(screen.getByTestId('next-page')).toBeInTheDocument();
    });

    it('devrait afficher l\'information de page courante', () => {
      render(<AdminUsersPage />);
      expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1');
    });

    it('devrait avancer la page en cliquant sur "Suivant"', async () => {
      const user = userEvent.setup();
      render(<AdminUsersPage />);

      const nextButton = screen.getByTestId('next-page');
      await user.click(nextButton);

      expect(screen.getByTestId('page-info')).toHaveTextContent('Page 2');
    });

    it('devrait revenir à la page précédente', async () => {
      const user = userEvent.setup();
      render(<AdminUsersPage />);

      const nextButton = screen.getByTestId('next-page');
      await user.click(nextButton);
      
      const prevButton = screen.getByTestId('prev-page');
      await user.click(prevButton);

      expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1');
    });
  });

  describe('Statut des utilisateurs', () => {
    it('devrait afficher les boutons pour changer le statut', () => {
      render(<AdminUsersPage />);
      const toggleButtons = screen.getAllByText(/Suspendre|Activer/);
      expect(toggleButtons.length).toBeGreaterThan(0);
    });

    it('devrait changer le statut de "actif" à "suspendu"', async () => {
      const user = userEvent.setup();
      render(<AdminUsersPage />);

      const toggleButton = screen.getByTestId('toggle-status-1');
      expect(toggleButton).toHaveTextContent('Suspendre');

      await user.click(toggleButton);

      expect(toggleButton).toHaveTextContent('Activer');
      expect(screen.getAllByText('suspendu').length).toBeGreaterThan(0);
    });

    it('devrait changer le statut de "suspendu" à "actif"', async () => {
      const user = userEvent.setup();
      render(<AdminUsersPage />);

      const toggleButton = screen.getByTestId('toggle-status-3');
      expect(toggleButton).toHaveTextContent('Activer');

      await user.click(toggleButton);

      expect(toggleButton).toHaveTextContent('Suspendre');
    });
  });

  describe('Détails des utilisateurs', () => {
    it('devrait afficher un lien pour voir les détails de l\'utilisateur', () => {
      render(<AdminUsersPage />);
      const viewDetailLink = screen.getByTestId('view-detail-1');
      expect(viewDetailLink).toHaveTextContent('Voir détails');
    });

    it('devrait avoir le bon href pour accéder aux détails', () => {
      render(<AdminUsersPage />);
      const viewDetailLink = screen.getByTestId('view-detail-1');
      expect(viewDetailLink).toHaveAttribute('href', '/admin/utilisateurs/1');
    });

    it('devrait avoir des liens pour chaque utilisateur', () => {
      render(<AdminUsersPage />);
      expect(screen.getByTestId('view-detail-1')).toHaveAttribute('href', '/admin/utilisateurs/1');
      expect(screen.getByTestId('view-detail-2')).toHaveAttribute('href', '/admin/utilisateurs/2');
      expect(screen.getByTestId('view-detail-3')).toHaveAttribute('href', '/admin/utilisateurs/3');
    });
  });

  describe('Combinaisons de filtres', () => {
    it('devrait combiner la recherche et le filtrage par rôle', async () => {
      const user = userEvent.setup();
      render(<AdminUsersPage />);

      const searchInput = screen.getByTestId('search-input');
      const roleFilter = screen.getByTestId('role-filter');

      await user.type(searchInput, 'Charlie');
      await user.selectOptions(roleFilter, 'admin');

      expect(screen.getByText('Charlie Dubois')).toBeInTheDocument();
      expect(screen.queryByText('Alice Dupont')).not.toBeInTheDocument();
    });
  });
});
