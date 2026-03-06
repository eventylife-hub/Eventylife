import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Eventy Life - Voyages de groupe inoubliables',
  description: 'Plateforme de voyages de groupe avec accompagnement humain. Circuits en bus et avion, tout compris.',
  keywords: ['voyage groupe', 'circuit bus', 'voyage organise', 'eventy life'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>{children}</body>
    </html>
  )
}
