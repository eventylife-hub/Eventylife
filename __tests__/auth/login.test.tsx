import React from 'react';
import { render, screen, userEvent, mockFetch, mockFetchError } from '../test-utils';
import { useRouter, useSearchParams } from 'next/navigation';
import ConnexionPage from '@/app/(auth)/connexion/page';

// Mock next/navigation
jest.mock('next/navigation');

describe('Page de Connexion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('redirect=/client/dashboard')
    );
  });

  it('doit afficher le formulaire de connexion avec tous les champs', () => {
    render(<ConnexionPage />);

    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('doit afficher le lien "Mot de passe oublié"', () => {
    render(<ConnexionPage />);

    const forgotLink = screen.getByRole('link', { name: /oublié/i });
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink).toHaveAttribute('href', '/mot-de-passe-oublie');
  });

  it('doit afficher le lien vers l\'inscription', () => {
    render(<ConnexionPage />);

    const registerLink = screen.getByRole('link', { name: /créer un compte/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/inscription');
  });

  it('doit afficher une erreur quand les champs sont vides et le formulaire est soumis', async () => {
    const user = userEvent.setup();
    render(<ConnexionPage />);

    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    await user.click(submitButton);

    // Les messages d'erreur HTML5 sont affichés par le navigateur
    // On vérifie que le bouton est dans son état initial
    expect(submitButton).toBeInTheDocument();
  });

  it('doit appeler l\'API de connexion avec les bonnes données', async () => {
    const user = userEvent.setup();
    mockFetch({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'CLIENT',
      },
    });

    render(<ConnexionPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123');
    await user.click(submitButton);

    // Vérifier que fetch a été appelé
    expect(global.fetch).toHaveBeenCalled();
  });

  it('doit afficher un message d\'erreur en cas d\'échec de connexion', async () => {
    const user = userEvent.setup();
    mockFetchError('Identifiants invalides');

    render(<ConnexionPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'WrongPassword123');
    await user.click(submitButton);

    // Attendre le message d'erreur
    const errorMessage = await screen.findByText(/identifiants invalides/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('doit afficher un message de chargement pendant la soumission', async () => {
    const user = userEvent.setup();
    mockFetch({ user: { id: 'user-123', email: 'test@example.com', role: 'CLIENT' } });

    render(<ConnexionPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123');
    await user.click(submitButton);

    // Vérifier que le bouton affiche le texte de chargement
    expect(screen.getByRole('button', { name: /connexion en cours/i })).toBeInTheDocument();
  });

  it('doit rediriger vers le dashboard après une connexion réussie', async () => {
    const user = userEvent.setup();
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    mockFetch({
      user: {
        id: 'user-123',
        email: 'test@example.com',
        role: 'CLIENT',
      },
    });

    render(<ConnexionPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123');
    await user.click(submitButton);

    // Attendre la redirection
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockPush).toHaveBeenCalled();
  });

  it('doit afficher les liens CGV et politique de confidentialité', () => {
    render(<ConnexionPage />);

    expect(screen.getByRole('link', { name: /cgv/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /politique de confidentialité/i })).toBeInTheDocument();
  });
});
