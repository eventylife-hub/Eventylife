'use client';

interface JsonLdProps {
  type: 'Event' | 'Organization' | 'BreadcrumbList' | 'LocalBusiness';
  data: Record<string, unknown>;
}

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}

// Composant pour afficher un schéma Event (voyage)
export function EventJsonLd({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  url,
  organizer,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  url: string;
  organizer?: string;
}) {
  const data = {
    name,
    description,
    startDate,
    endDate,
    eventAttendanceMode: 'OfflineEventAttendanceMode',
    eventStatus: 'EventScheduled',
    location: {
      '@type': 'Place',
      name: location,
    },
    image: image || '/default-travel-image.jpg',
    url,
    ...(organizer && {
      organizer: {
        '@type': 'Organization',
        name: organizer,
      },
    }),
  };

  return <JsonLd type="Event" data={data} />;
}

// Composant pour afficher un schéma Organization
export function OrganizationJsonLd({
  name,
  logo,
  sameAs,
  url,
  telephone,
  email,
  address,
}: {
  name: string;
  logo: string;
  sameAs?: string[];
  url: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
}) {
  const data = {
    name,
    logo,
    url,
    ...(sameAs && { sameAs }),
    ...(telephone && { telephone }),
    ...(email && { email }),
    ...(address && { address: { '@type': 'PostalAddress', ...address } }),
  };

  return <JsonLd type="Organization" data={data} />;
}

// Composant pour afficher un schéma BreadcrumbList
export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const itemListElement = items.map((item: unknown, index: number) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  const data = {
    itemListElement,
  };

  return <JsonLd type="BreadcrumbList" data={data} />;
}
