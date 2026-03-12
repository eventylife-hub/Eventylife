import VoyageDetailClient from './voyage-detail-client';

/**
 * Page serveur pour le détail d'un voyage.
 *
 * Le SEO (generateMetadata + generateStaticParams) est géré
 * dans layout.tsx (pattern Next.js App Router).
 *
 * Ce fichier sert de pont serveur → client.
 */
export default function VoyageDetailPage() {
  return <VoyageDetailClient />;
}
