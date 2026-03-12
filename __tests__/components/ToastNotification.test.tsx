/**
 * Tests unitaires — components/ui/toast-notification.tsx
 * Composant Toast réutilisable Eventy Life
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastNotification } from '@/components/ui/toast-notification';

describe('ToastNotification', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('affiche le message et le type success', () => {
    render(
      <ToastNotification type="success" message="Sauvegardé !" onClose={jest.fn()} />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Sauvegardé !')).toBeInTheDocument();
  });

  it('affiche le message et le type error', () => {
    render(
      <ToastNotification type="error" message="Erreur réseau" onClose={jest.fn()} />,
    );

    expect(screen.getByText('Erreur réseau')).toBeInTheDocument();
  });

  it('appelle onClose au clic sur le bouton fermer', () => {
    const onClose = jest.fn();
    render(
      <ToastNotification type="info" message="Info" onClose={onClose} />,
    );

    fireEvent.click(screen.getByLabelText('Fermer la notification'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('se ferme automatiquement après la durée spécifiée', () => {
    const onClose = jest.fn();
    render(
      <ToastNotification type="success" message="Auto" onClose={onClose} duration={3000} />,
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ne se ferme pas automatiquement si duration=0', () => {
    const onClose = jest.fn();
    render(
      <ToastNotification type="warning" message="Permanent" onClose={onClose} duration={0} />,
    );

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('affiche un bouton Réessayer si onRetry est fourni', () => {
    const onRetry = jest.fn();
    const onClose = jest.fn();
    render(
      <ToastNotification
        type="error"
        message="Échec"
        onClose={onClose}
        onRetry={onRetry}
      />,
    );

    const retryBtn = screen.getByLabelText('Réessayer l\'action');
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('n\'affiche pas le bouton Réessayer sans onRetry', () => {
    render(
      <ToastNotification type="error" message="Échec" onClose={jest.fn()} />,
    );

    expect(screen.queryByLabelText('Réessayer l\'action')).not.toBeInTheDocument();
  });

  it('a les attributs ARIA corrects', () => {
    render(
      <ToastNotification type="success" message="Test ARIA" onClose={jest.fn()} />,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });
});
