import React from 'react';
import { render, screen, userEvent, mockFetch, mockFetchError } from '../test-utils';
import { useRouter } from 'next/navigation';
import InscriptionPage from '@/app/(auth)/inscription/page';

// Mock next/navigation
jest.mock('next/navigation');

describe('Page d\'Inscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('doit afficher tous les champs du formulaire d\'inscription', () => {
    render(<InscriptionPage />);

    expect(screen.getByText('Créer un compte')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone (optionnel)')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmez le mot de passe')).toBeInTheDocument();
    expect(screen.getByLabelText('Type de compte')).toBeInTheDocument();
  });

  it('doit afficher les checkboxes CGV et politique de confidentialité', () => {
    render(<InscriptionPage />);

    expect(screen.getByRole('checkbox', { name: /conditions générales de vente/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /politique de confidentialité/i })).toBeInTheDocument();
  });

  it('doit afficher un message d\'erreur si les mots de passe ne correspondent pas', async () => {
    const user = userEvent.setup();
    render(<InscriptionPage />);

    const firstNameInput = screen.getByLabelText('Prénom');
    const lastNameInput = screen.getByLabelText('Nom');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmez le mot de passe');
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i });

    await user.type(firstNameInput, 'Jean');
    await user.type(lastNameInput, 'Dupont');
    await user.type(emailInput, 'jean@example.com');
    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'DifferentPassword123');
    await user.click(submitButton);

    // Vérifier que la validation affiche une erreur
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('doit valider le format de l\'email', async () => {
    const user = userEvent.setup();
    render(<InscriptionPage />);

    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'invalid-email');
    await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

    // Vérifier que fetch n'a pas été appelé
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('doit appeler l\'API d\'inscription avec les bonnes données', async () => {
    const user = userEvent.setup();
    mockFetch({ id: 'user-123', email: 'jean@example.com' });

    render(<InscriptionPage />);

    const firstNameInput = screen.getByLabelText('Prénom');
    const lastNameInput = screen.getByLabelText('Nom');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmez le mot de passe');
    const cgvCheckbox = screen.getByRole('checkbox', { name: /conditions générales de vente/i });
    const rgpdCheckbox = screen.getByRole('checkbox', { name: /politique de confidentialité/i });
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i });

    await user.type(firstNameInput, 'Jean');
    await user.type(lastNameInput, 'Dupont');
    await user.type(emailInput, 'jean@example.com');
    await user.type(passwordInput, 'ValidPassword123');
    await user.type(confirmPasswordInput, 'ValidPassword123');
    await user.click(cgvCheckbox);
    await user.click(rgpdCheckbox);
    await user.click(submitButton);

    expect(global.fetch).toHaveBeenCalled();
  });

  it('doit afficher une erreur si l\'email existe déjà', async () => {
    const user = userEvent.setup();
    mockFetchError('Cet email est déjà utilisé');

    render(<InscriptionPage />);

    const firstNameInput = screen.getByLabelText('Prénom');
    const lastNameInput = screen.getByLabelText('Nom');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmez le mot de passe');
    const cgvCheckbox = screen.getByRole('checkbox', { name: /conditions générales de vente/i });
    const rgpdCheckbox = screen.getByRole('checkbox', { name: /politique de confidentialité/i });
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i });

    await user.type(firstNameInput, 'Jean');
    await user.type(lastNameInput, 'Dupont');
    await user.type(emailInput, 'existing@example.com');
    await user.type(passwordInput, 'ValidPassword123');
    await user.type(confirmPasswordInput, 'ValidPassword123');
    await user.click(cgvCheckbox);
    await user.click(rgpdCheckbox);
    await user.click(submitButton);

    const errorMessage = await screen.findByText(/cet email est déjà utilisé/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('doit exiger l\'acceptation des CGV', async () => {
    const user = userEvent.setup();
    render(<InscriptionPage />);

    const firstNameInput = screen.getByLabelText('Prénom');
    const lastNameInput = screen.getByLabelText('Nom');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmez le mot de passe');
    const rgpdCheckbox = screen.getByRole('checkbox', { name: /politique de confidentialité/i });
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i });

    await user.type(firstNameInput, 'Jean');
    await user.type(lastNameInput, 'Dupont');
    await user.type(emailInput, 'jean@example.com');
    await user.type(passwordInput, 'ValidPassword123');
    await user.type(confirmPasswordInput, 'ValidPassword123');
    await user.click(rgpdCheckbox);
    // Pas de clic sur CGV
    await user.click(submitButton);

    const errorMessage = await screen.findByText(/vous devez accepter les cgv/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('doit exiger l\'acceptation de la politique de confidentialité', async () => {
    const user = userEvent.setup();
    render(<InscriptionPage />);

    const firstNameInput = screen.getByLabelText('Prénom');
    const lastNameInput = screen.getByLabelText('Nom');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmez le mot de passe');
    const cgvCheckbox = screen.getByRole('checkbox', { name: /conditions générales de vente/i });
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i });

    await user.type(firstNameInput, 'Jean');
    await user.type(lastNameInput, 'Dupont');
    await user.type(emailInput, 'jean@example.com');
    await user.type(passwordInput, 'ValidPassword123');
    await user.type(confirmPasswordInput, 'ValidPassword123');
    await user.click(cgvCheckbox);
    // Pas de clic sur RGPD
    await user.click(submitButton);

    const errorMessage = await screen.findByText(/vous devez accepter la politique de confidentialité/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('doit afficher un message de chargement pendant l\'inscription', async () => {
    const user = userEvent.setup();
    mockFetch({ id: 'user-123', email: 'jean@example.com' });

    render(<InscriptionPage />);

    const firstNameInput = screen.getByLabelText('Prénom');
    const lastNameInput = screen.getByLabelText('Nom');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmez le mot de passe');
    const cgvCheckbox = screen.getByRole('checkbox', { name: /conditions générales de vente/i });
    const rgpdCheckbox = screen.getByRole('checkbox', { name: /politique de confidentialité/i });
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i });

    await user.type(firstNameInput, 'Jean');
    await user.type(lastNameInput, 'Dupont');
    await user.type(emailInput, 'jean@example.com');
    await user.type(passwordInput, 'ValidPassword123');
    await user.type(confirmPasswordInput, 'ValidPassword123');
    await user.click(cgvCheckbox);
    await user.click(rgpdCheckbox);
    await user.click(submitButton);

    expect(screen.getByRole('button', { name: /inscription en cours/i })).toBeInTheDocument();
  });

  it('doit rediriger vers la connexion après une inscription réussie', async () => {
    const user = userEvent.setup();
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    mockFetch({ id: 'user-123', email: 'jean@example.com' });

    render(<InscriptionPage />);

    const firstNameInput = screen.getByLabelText('Prénom');
    const lastNameInput = screen.getByLabelText('Nom');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const confirmPasswordInput = screen.getByLabelText('Confirmez le mot de passe');
    const cgvCheckbox = screen.getByRole('checkbox', { name: /conditions générales de vente/i });
    const rgpdCheckbox = screen.getByRole('checkbox', { name: /politique de confidentialité/i });
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i });

    await user.type(firstNameInput, 'Jean');
    await user.type(lastNameInput, 'Dupont');
    await user.type(emailInput, 'jean@example.com');
    await user.type(passwordInput, 'ValidPassword123');
    await user.type(confirmPasswordInput, 'ValidPassword123');
    await user.click(cgvCheckbox);
    await user.click(rgpdCheckbox);
    await user.click(submitButton);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockPush).toHaveBeenCalledWith('/connexion');
  });

  it('doit afficher le lien vers la connexion pour les utilisateurs existants', () => {
    render(<InscriptionPage />);

    const loginLink = screen.getByRole('link', { name: /se connecter/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/connexion');
  });
});
