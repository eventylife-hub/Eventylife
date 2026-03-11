/**
 * Composants JSON-LD pour le SEO structuré
 * Schémas : Organization, BreadcrumbList, FAQPage, TravelAction
 * @see https://schema.org
 */

// ═══ Types ═══

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface OrganizationProps {
  baseUrl?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
}

interface FAQPageProps {
  items: FAQItem[];
}

interface ContactPageProps {
  baseUrl?: string;
}

interface WebPageProps {
  name: string;
  description: string;
  url: string;
  baseUrl?: string;
}

interface BlogPostingProps {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  image?: string;
  baseUrl?: string;
}

interface TravelOfferProps {
  name: string;
  description: string;
  destination: string;
  price: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  baseUrl?: string;
}

// ═══ Composants ═══

const BASE_URL = 'https://eventy.fr';

/**
 * JSON-LD Organization — Page d'accueil
 */
export function OrganizationJsonLd({ baseUrl = BASE_URL }: OrganizationProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Eventy Life',
    url: baseUrl,
    logo: `${baseUrl}/icons/logo-512.png`,
    description:
      'Agence de voyages de groupe avec accompagnement humain porte-à-porte. Bus et avion, prix justes, qualité garantie.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    sameAs: [
      'https://www.facebook.com/eventylife',
      'https://www.instagram.com/eventylife',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'French',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * JSON-LD BreadcrumbList — Navigation fil d'Ariane
 */
export function BreadcrumbJsonLd({ items, baseUrl = BASE_URL }: BreadcrumbProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href.startsWith('http') ? item.href : `${baseUrl}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * JSON-LD FAQPage — Pages FAQ
 */
export function FAQPageJsonLd({ items }: FAQPageProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * JSON-LD TravelAction/Product — Fiches voyage
 */
export function TravelOfferJsonLd({
  name,
  description,
  destination,
  price,
  currency = 'EUR',
  startDate,
  endDate,
  image,
  baseUrl = BASE_URL,
}: TravelOfferProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : undefined,
    brand: {
      '@type': 'Organization',
      name: 'Eventy Life',
    },
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      validFrom: startDate,
      validThrough: endDate,
    },
    ...(destination && {
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'Destination',
        value: destination,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * JSON-LD ContactPage — Page de contact
 */
export function ContactPageJsonLd({ baseUrl = BASE_URL }: ContactPageProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contactez Eventy Life',
    description:
      'Contactez notre équipe pour toute question sur nos voyages de groupe.',
    url: `${baseUrl}/contact`,
    mainEntity: {
      '@type': 'TravelAgency',
      name: 'Eventy Life',
      email: 'contact@eventy.life',
      url: baseUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * JSON-LD WebPage — Pages génériques (À propos, Comment ça marche, etc.)
 */
export function WebPageJsonLd({
  name,
  description,
  url,
  baseUrl = BASE_URL,
}: WebPageProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: url.startsWith('http') ? url : `${baseUrl}${url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Eventy Life',
      url: baseUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * JSON-LD BlogPosting — Articles de blog
 */
export function BlogPostingJsonLd({
  title,
  description,
  slug,
  datePublished,
  image,
  baseUrl = BASE_URL,
}: BlogPostingProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: `${baseUrl}/blog/${slug}`,
    datePublished,
    image: image
      ? image.startsWith('http')
        ? image
        : `${baseUrl}${image}`
      : undefined,
    author: {
      '@type': 'Organization',
      name: 'Eventy Life',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Eventy Life',
      url: baseUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
