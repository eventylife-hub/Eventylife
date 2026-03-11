import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administration — Eventy Life',
  description: 'Portail de connexion administration Eventy Life.',
  robots: { index: false, follow: false },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
