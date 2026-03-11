import Link from 'next/link';
import { BreadcrumbJsonLd } from './json-ld';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Couleur des liens (par défaut terra) */
  linkColor?: string;
  /** Couleur du texte courant (par défaut navy) */
  currentColor?: string;
}

/**
 * Composant Breadcrumb visuel + JSON-LD automatique
 * Utilisé sur les pages publiques pour le SEO et la navigation
 */
export function Breadcrumb({
  items,
  linkColor = 'var(--terra, #C75B39)',
  currentColor = 'var(--navy, #1A1A2E)',
}: BreadcrumbProps) {
  return (
    <>
      {/* JSON-LD structuré pour Google */}
      <BreadcrumbJsonLd items={items} />

      {/* Breadcrumb visuel */}
      <nav aria-label="Fil d'Ariane" className="text-sm mb-6">
        <ol className="flex flex-wrap items-center gap-1" style={{ color: '#6B7280' }}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {index > 0 && (
                  <span aria-hidden="true" className="mx-1">›</span>
                )}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-medium"
                    style={{ color: currentColor }}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:underline transition-colors"
                    style={{ color: linkColor }}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
