import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eventy Life - Voyages en Groupe',
  description: 'DÃ©couvrez des voyages en groupe avec accompagnement, prix justes et qualitÃ© garantie.',
  keywords: ['voyages', 'groupe', 'agence voyage', 'tourisme', 'destinations'],
  authors: [{ name: 'Eventy Life' }],
  openGraph: {
    title: 'Eventy Life - Voyages en Groupe',
    description: 'DÃ©couvrez des voyages en groupe avec accompagnement, prix justes et qualitÃ© garantie.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
