import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookieBanner } from '@/components/cookie-banner/CookieBanner';

// Mock the useCookieConsent hook
jest.mock('@/hooks/useCookieConsent', () => ({
  useCookieConsent: jest.fn(),
}));

// Mock the CookiePreferencesModal component
jest.mock('@/components/cookie-banner/CookiePreferencesModal', () => ({
  CookiePreferencesModal: ({
    isOpen,
    onClose,
    onSave,
    onAcceptAll,
    onRefuseAll,
  }: {
    isOpen: boolean;
    onClose: jest.Mock;
    onSave: jest.Mock;
    onAcceptAll: jest.Mock;
    onRefuseAll: jest.Mock;
  }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="preferences-modal">
        <h2>Préférences de cookies</h2>
        <button onClick={() => onAcceptAll()} data-testid="modal-accept-all">
          Accepter tout
        </button>
        <button onClick={() => onRefuseAll()} data-testid="modal-refuse-all">
          Refuser tout
        </button>
        <button onClick={() => onSave({})} data-testid="modal-save">
          Enregistrer
        </button>
        <button onClick={() => onClose()} data-testid="modal-close">
          Fermer
        </button>
      </div>
    );
  },
}));

const mockUseCookieConsent = require('@/hooks/useCookieConsent').useCookieConsent;

describe('CookieBanner Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Apparition et visibilité', () => {
    it('devrait afficher la banneau au premier chargement (pas de cookie)', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(screen.getByText('Nous utilisons des cookies')).toBeInTheDocument();
      });
    });

    it('ne devrait pas afficher la banneau si l\'utilisateur a déjà consenti', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: { essential: true, analytics: true, marketing: true },
        hasConsented: true,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      const { container } = render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(container.querySelector('[role="complementary"]')).not.toBeInTheDocument();
      });
    });

    it('ne devrait pas afficher la banneau pendant le chargement', () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: true,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      const { container } = render(<CookieBanner />);

      expect(container.querySelector('[role="complementary"]')).not.toBeInTheDocument();
    });
  });

  describe('Contenu de la banneau', () => {
    it('devrait afficher le titre "Nous utilisons des cookies"', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(screen.getByText('Nous utilisons des cookies')).toBeInTheDocument();
      });
    });

    it('devrait afficher la description des cookies', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(screen.getByText(/améliorer votre expérience/)).toBeInTheDocument();
      });
    });

    it('devrait afficher le texte de conformité CNIL', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(screen.getByText(/Conformément à la recommandation CNIL/)).toBeInTheDocument();
      });
    });
  });

  describe('Boutons d\'action', () => {
    it('devrait afficher le bouton "Accepter tout"', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(screen.getByText('Accepter tout')).toBeInTheDocument();
      });
    });

    it('devrait afficher le bouton "Refuser tout"', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(screen.getByText('Refuser tout')).toBeInTheDocument();
      });
    });

    it('devrait afficher le bouton "Personnaliser"', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(screen.getByText('Personnaliser')).toBeInTheDocument();
      });
    });
  });

  describe('Bouton "Accepter tout"', () => {
    it('devrait appeler acceptAll quand on clique', async () => {
      const acceptAllMock = jest.fn();
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: acceptAllMock,
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      const user = userEvent.setup({ delay: null });
      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      const acceptButton = await screen.findByText('Accepter tout');
      const buttons = screen.getAllByText('Accepter tout');
      const bannerButton = buttons[0] as HTMLElement;

      await user.click(bannerButton);

      expect(acceptAllMock).toHaveBeenCalled();
    });
  });

  describe('Bouton "Refuser tout"', () => {
    it('devrait appeler refuseAll quand on clique', async () => {
      const refuseAllMock = jest.fn();
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: refuseAllMock,
        savePreferences: jest.fn(),
      });

      const user = userEvent.setup({ delay: null });
      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      const refuseButton = await screen.findByText('Refuser tout');
      await user.click(refuseButton);

      expect(refuseAllMock).toHaveBeenCalled();
    });
  });

  describe('Bouton "Personnaliser"', () => {
    it('devrait ouvrir la modale de préférences', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      const user = userEvent.setup({ delay: null });
      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      const customizeButton = await screen.findByText('Personnaliser');
      await user.click(customizeButton);

      await waitFor(() => {
        expect(screen.getByTestId('preferences-modal')).toBeInTheDocument();
      });
    });

    it('devrait afficher "Préférences de cookies" dans la modale', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      const user = userEvent.setup({ delay: null });
      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      const customizeButton = await screen.findByText('Personnaliser');
      await user.click(customizeButton);

      await waitFor(() => {
        expect(screen.getByText('Préférences de cookies')).toBeInTheDocument();
      });
    });
  });

  describe('Modale de préférences', () => {
    it('devrait fermer la modale en cliquant sur Fermer', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      const user = userEvent.setup({ delay: null });
      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      const customizeButton = await screen.findByText('Personnaliser');
      await user.click(customizeButton);

      await waitFor(() => {
        expect(screen.getByTestId('preferences-modal')).toBeInTheDocument();
      });

      const closeButton = screen.getByTestId('modal-close');
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('preferences-modal')).not.toBeInTheDocument();
      });
    });

    it('devrait appeler acceptAll depuis la modale', async () => {
      const acceptAllMock = jest.fn();
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: acceptAllMock,
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      const user = userEvent.setup({ delay: null });
      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      const customizeButton = await screen.findByText('Personnaliser');
      await user.click(customizeButton);

      await waitFor(() => {
        expect(screen.getByTestId('preferences-modal')).toBeInTheDocument();
      });

      const modalAcceptButton = screen.getByTestId('modal-accept-all');
      await user.click(modalAcceptButton);

      expect(acceptAllMock).toHaveBeenCalled();
    });

    it('devrait appeler refuseAll depuis la modale', async () => {
      const refuseAllMock = jest.fn();
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: refuseAllMock,
        savePreferences: jest.fn(),
      });

      const user = userEvent.setup({ delay: null });
      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      const customizeButton = await screen.findByText('Personnaliser');
      await user.click(customizeButton);

      await waitFor(() => {
        expect(screen.getByTestId('preferences-modal')).toBeInTheDocument();
      });

      const modalRefuseButton = screen.getByTestId('modal-refuse-all');
      await user.click(modalRefuseButton);

      expect(refuseAllMock).toHaveBeenCalled();
    });

    it('devrait appeler savePreferences depuis la modale', async () => {
      const savePreferencesMock = jest.fn();
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: savePreferencesMock,
      });

      const user = userEvent.setup({ delay: null });
      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      const customizeButton = await screen.findByText('Personnaliser');
      await user.click(customizeButton);

      await waitFor(() => {
        expect(screen.getByTestId('preferences-modal')).toBeInTheDocument();
      });

      const saveButton = screen.getByTestId('modal-save');
      await user.click(saveButton);

      expect(savePreferencesMock).toHaveBeenCalled();
    });
  });

  describe('Accessibilité', () => {
    it('devrait avoir un role complementary', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      await waitFor(() => {
        const banner = screen.getByRole('complementary');
        expect(banner).toBeInTheDocument();
      });
    });

    it('devrait avoir une aria-label appropriée', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      await waitFor(() => {
        const banner = screen.getByRole('complementary');
        expect(banner).toHaveAttribute('aria-label', 'Banneau de consentement aux cookies');
      });
    });

    it('les boutons devraient avoir des aria-label', async () => {
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: jest.fn(),
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const acceptButtons = buttons.filter((btn) => btn.getAttribute('aria-label')?.includes('Accepter'));
        expect(acceptButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Stockage du consentement', () => {
    it('devrait avoir un comportement cohérent après acceptation', async () => {
      const acceptAllMock = jest.fn();
      mockUseCookieConsent.mockReturnValue({
        consent: {},
        hasConsented: false,
        isLoading: false,
        acceptAll: acceptAllMock,
        refuseAll: jest.fn(),
        savePreferences: jest.fn(),
      });

      const user = userEvent.setup({ delay: null });
      render(<CookieBanner />);

      jest.advanceTimersByTime(100);

      const acceptButton = await screen.findByText('Accepter tout');
      const buttons = screen.getAllByText('Accepter tout');
      await user.click(buttons[0] as HTMLElement);

      expect(acceptAllMock).toHaveBeenCalled();
    });
  });
});
