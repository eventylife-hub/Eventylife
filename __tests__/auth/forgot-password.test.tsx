import React from 'react';
import { render, screen, userEvent, mockFetch, mockFetchError } from '../test-utils';
import MotDePasseOubliePage from '@/app/(auth)/mot-de-passe-oublie/page';

describe('Page Mot de Passe Oublié', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('doit afficher le formulaire avec le champ email', () => {
    render(<MotDePasseOubliePage />);

    expect(screen.getByText('Mot de passe oublié')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /envoyer les instructions/i })).toBeInTheDocument();
  });

  it('doit afficher le lien de retour à la connexion', () => {
    render(<MotDePasseOubliePage />);

    const backLink = screen.getByRole('link', { name: /retour à la connexion/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/connexion');
  });

  it('doit afficher un message de succès après envoi', async () => {
    const user = userEvent.setup();
    mockFetch({});

    render(<MotDePasseOubliePage />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /envoyer les instructions/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    const successMessage = await screen.findByText(/email envoyé/i);
    expect(successMessage).toBeInTheDocument();
  });

  it('doit afficher le texte de confirmation complet après succès', async () => {
    const user = userEvent.setup();
    mockFetch({});

    render(<MotDePasseOubliePage />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /envoyer les instructions/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    expect(await screen.findByText(/vérifiez votre boîte mail pour les instructions de réinitialisation/i)).toBeInTheDocument();
  });

  it('doit afficher une erreur si l\'email est invalide', async () => {
    const user = userEvent.setup();
    render(<MotDePasseOubliePage />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /envoyer les instructions/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    // La validation doit échouer sans appel à l'API
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('doit afficher une erreur si le champ email est vide', async () => {
    const user = userEvent.setup();
    render(<MotDePasseOubliePage />);

    const submitButton = screen.getByRole('button', { name: /envoyer les instructions/i });
    await user.click(submitButton);

    // La validation doit échouer
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('doit appeler l\'API avec l\'email correct', async () => {
    const user = userEvent.setup();
    mockFetch({});

    render(<MotDePasseOubliePage />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /envoyer les instructions/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    expect(global.fetch).toHaveBeenCalled();
  });

  it('doit afficher un message d\'erreur en cas d\'échec', async () => {
    const user = userEvent.setup();
    mockFetchError('Erreur serveur');

    render(<MotDePasseOubliePage />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /envoyer les instructions/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    const errorMessage = await screen.findByText(/erreur serveur/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('doit afficher un message de chargement pendant l\'envoi', async () => {
    const user = userEvent.setup();
    mockFetch({});

    render(<MotDePasseOubliePage />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /envoyer les instructions/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    expect(screen.getByRole('button', { name: /envoi en cours/i })).toBeInTheDocument();
  });

  it('doit permettre de renvoyer après succès', async () => {
    const user = userEvent.setup();
    mockFetch({});

    render(<MotDePasseOubliePage />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /envoyer les instructions/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await screen.findByText(/email envoyé/i);

    // Chercher le bouton "Envoyer à nouveau"
    const resendButton = screen.getByRole('button', { name: /envoyer à nouveau/i });
    await user.click(resendButton);

    // Le formulaire doit réapparaître
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('doit réinitialiser le formulaire après succès et nouveau clic', async () => {
    const user = userEvent.setup();
    mockFetch({});

    render(<MotDePasseOubliePage />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /envoyer les instructions/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await screen.findByText(/email envoyé/i);

    const resendButton = screen.getByRole('button', { name: /envoyer à nouveau/i });
    await user.click(resendButton);

    const newEmailInput = screen.getByLabelText('Email') as HTMLInputElement;
    expect(newEmailInput.value).toBe('');
  });
});
