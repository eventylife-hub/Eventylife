import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/Navbar';

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

describe('Navbar Component', () => {
  describe('Structure et rendu de base', () => {
    it('devrait afficher le logo et le nom de marque "Eventy Life"', () => {
      render(<Navbar />);
      const logo = screen.getByText('Eventy Life');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass('text-primary-600');
    });

    it('devrait afficher les liens de navigation principaux', () => {
      render(<Navbar />);
      expect(screen.getByText('Nos voyages')).toBeInTheDocument();
      expect(screen.getByText('CGV')).toBeInTheDocument();
      expect(screen.getByText('Confidentialité')).toBeInTheDocument();
    });
  });

  describe('Authentification', () => {
    it('devrait afficher les boutons de connexion et inscription pour les utilisateurs non authentifiés', () => {
      render(<Navbar />);
      const connexionLink = screen.getByText('Connexion');
      const inscriptionLink = screen.getByText("S'inscrire");

      expect(connexionLink).toBeInTheDocument();
      expect(inscriptionLink).toBeInTheDocument();
    });

    it('devrait avoir les bonnes URLs pour les liens de connexion', () => {
      render(<Navbar />);
      const connexionLink = screen.getByText('Connexion').closest('a');
      const inscriptionLink = screen.getByText("S'inscrire").closest('a');

      expect(connexionLink).toHaveAttribute('href', '/login');
      expect(inscriptionLink).toHaveAttribute('href', '/register');
    });

    it('devrait avoir les bonnes URLs pour les liens de navigation', () => {
      render(<Navbar />);
      const voyagesLink = screen.getByText('Nos voyages').closest('a');
      const cgvLink = screen.getByText('CGV').closest('a');
      const confidentialiteLink = screen.getByText('Confidentialité').closest('a');

      expect(voyagesLink).toHaveAttribute('href', '/voyages');
      expect(cgvLink).toHaveAttribute('href', '/cgv');
      expect(confidentialiteLink).toHaveAttribute('href', '/confidentialite');
    });
  });

  describe('Responsive Design', () => {
    it('devrait afficher la barre de navigation dans un header sticky', () => {
      render(<Navbar />);
      const header = screen.getByRole('navigation').parentElement;

      expect(header).toHaveClass('sticky', 'top-0', 'z-50');
    });

    it('devrait contenir les éléments d\'interface utilisateur', () => {
      const { container } = render(<Navbar />);
      const header = container.querySelector('header');

      expect(header).toHaveClass('shadow-sm', 'border-b', 'border-gray-200');
    });
  });

  describe('Accessibilité', () => {
    it('devrait utiliser un élément header approprié', () => {
      const { container } = render(<Navbar />);
      const header = container.querySelector('header');

      expect(header).toBeInTheDocument();
    });

    it('devrait utiliser un élément nav pour la navigation', () => {
      const { container } = render(<Navbar />);
      const nav = container.querySelector('nav');

      expect(nav).toBeInTheDocument();
    });
  });

  describe('Structure HTML', () => {
    it('devrait avoir un logo en tant que premier élément', () => {
      const { container } = render(<Navbar />);
      const firstLink = container.querySelector('nav a');

      expect(firstLink).toHaveTextContent('Eventy Life');
    });

    it('devrait afficher les boutons dans une div flex', () => {
      const { container } = render(<Navbar />);
      const flexContainers = container.querySelectorAll('[class*="flex"]');

      expect(flexContainers.length).toBeGreaterThan(0);
    });
  });
});
