import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com';

  // Fetch travels from API
  let travelSlugs: string[] = [];
  try {
    const response = await fetch(`${baseUrl}/api/travels`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (response.ok) {
      const travels = await response.json();
      travelSlugs = travels.map((t: { slug: string }) => t.slug);
    }
  } catch {
    // Erreur silencieuse — récupération voyages pour sitemap échouée
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/voyages`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cgv`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politique-confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic travel pages
  const travelPages: MetadataRoute.Sitemap = travelSlugs.map((slug) => ({
    url: `${baseUrl}/voyages/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Travel reviews pages
  const travelReviewsPages: MetadataRoute.Sitemap = travelSlugs.map((slug) => ({
    url: `${baseUrl}/voyages/${slug}/avis`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...travelPages, ...travelReviewsPages];
}
