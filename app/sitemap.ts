import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eventylife.fr';

  // Fetch travels from API
  let travelSlugs: string[] = [];
  try {
    const response = await fetch(`${baseUrl}/api/travels`, {
      next: { revalidate: 3600 },
    });
    if (response.ok) {
      const data = (await response.json()) as unknown;
      travelSlugs = (data as Array<{ slug: string }>).map((t) => t.slug);
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
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/comment-ca-marche`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/partenaires`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/brochure`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/depart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
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

  // Travel sub-pages (avis + groupes)
  const travelSubPages: MetadataRoute.Sitemap = travelSlugs.flatMap((slug) => [
    {
      url: `${baseUrl}/voyages/${slug}/avis`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/voyages/${slug}/groupes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ]);

  // Blog articles dynamiques
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${baseUrl}/api/blog`, {
      next: { revalidate: 3600 },
    });
    if (response.ok) {
      const data = (await response.json()) as unknown;
      const slugs = (data as Array<{ slug: string }>).map((a) => a.slug);
      blogPages = slugs.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Blog API non disponible
  }

  return [...staticPages, ...travelPages, ...travelSubPages, ...blogPages];
}
