import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '@/components/ui/toast';
import { CookieBanner } from '@/components/cookie-banner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eventy Life - Voyages en Groupe',
  description: 'Découvrez des voyages en groupe avec accompagnement, prix justes et qualité garantie.',
  keywords: [
    'voyages',
    'groupe',
    'agence voyage',
    'réservation voyage',
    'tourisme',
    'destinations',
  ],
  authors: [{ name: 'Eventy Life' }],
  openGraph: {
    title: 'Eventy Life - Voyages en Groupe',
    description: 'Découvrez des voyages en groupe avec accompagnement, prix justes et qualité garantie.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <ToastContainer />
        <CookieBanner />
      </body>
    </html>
  );
}
