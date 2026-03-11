'use client';

/**
 * Page article de blog — Design Eventy v2
 * Chargement dynamique depuis l'API, fallback mock
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { BlogPostingJsonLd } from '@/components/seo/json-ld';
import { NewsletterCTA } from '@/components/newsletter-cta';

interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  coverImage?: string;
  tags: string[];
}

/** Article mock pour le développement */
const mockArticle: BlogArticle = {
  slug: 'voyager-en-groupe-avantages',
  title: 'Les 10 avantages de voyager en groupe accompagné',
  excerpt: 'Découvrez pourquoi le voyage en groupe avec accompagnement est la formule idéale pour des vacances réussies.',
  content: `
Le voyage en groupe accompagné connaît un véritable essor en France. De plus en plus de voyageurs choisissent cette formule pour ses nombreux avantages. Voici pourquoi.

## 1. Un prix imbattable

Grâce à la mutualisation des coûts (transport, hébergement, activités), le voyage en groupe permet d'accéder à des prestations haut de gamme à un tarif bien inférieur au voyage individuel. Les économies peuvent atteindre 30 à 40% par rapport à un voyage organisé seul.

## 2. Zéro stress logistique

L'accompagnateur s'occupe de tout : transferts, check-in, réservations de restaurants, billetterie des sites touristiques. Vous n'avez qu'à profiter du voyage sans vous soucier de l'organisation.

## 3. Le transport porte-à-porte

C'est la signature d'Eventy Life : nous venons vous chercher près de chez vous. Plus besoin de chercher un parking à l'aéroport ou de prendre un taxi à 5h du matin.

## 4. La convivialité

Voyager en groupe, c'est partager des moments uniques avec d'autres passionnés. Les liens qui se créent pendant un voyage de groupe sont souvent durables.

## 5. La sécurité

Un accompagnateur professionnel est présent tout au long du séjour. En cas de problème (médical, administratif, imprévu), vous êtes pris en charge immédiatement.

## 6. Des accès exclusifs

Les groupes bénéficient souvent d'accès privilégiés : visites privées, ouvertures exceptionnelles de sites, rencontres avec des artisans locaux.

## 7. Un programme optimisé

Chaque journée est pensée pour maximiser les découvertes tout en respectant le rythme du groupe. Pas de temps perdu en déplacements inutiles.

## 8. L'assurance voyage incluse

Tous nos voyages incluent une assurance complète (annulation, rapatriement, bagages) pour voyager l'esprit tranquille.

## 9. Adapté à tous

Que vous voyagiez seul, en couple, entre amis ou en famille, le voyage de groupe s'adapte à vos besoins avec différentes catégories de chambres et d'options.

## 10. Des souvenirs inoubliables

Les voyageurs en groupe partagent unanimement : les souvenirs sont plus forts quand ils sont partagés. L'émotion collective décuple le plaisir de la découverte.
  `.trim(),
  author: 'Équipe Eventy Life',
  publishedAt: '2025-12-15',
  readingTime: '5 min',
  category: 'Conseils voyage',
  tags: ['groupe', 'accompagnement', 'avantages', 'voyage'],
};

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [state, setState] = useState<'loading' | 'data' | 'error'>('loading');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
          setState('data');
        } else {
          // Fallback mock en dev
          setArticle({ ...mockArticle, slug: slug || mockArticle.slug });
          setState('data');
        }
      } catch {
        console.warn('API blog indisponible — données démo');
        setArticle({ ...mockArticle, slug: slug || mockArticle.slug });
        setState('data');
      }
    };
    fetchArticle();
  }, [slug]);

  if (state === 'loading' || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="animate-pulse rounded h-4 w-64" style={{ background: 'rgba(0,0,0,0.06)' }} />
        <div className="animate-pulse rounded-xl h-10 w-full" style={{ background: 'rgba(0,0,0,0.06)' }} />
        <div className="animate-pulse rounded h-4 w-48" style={{ background: 'rgba(0,0,0,0.06)' }} />
        <div className="animate-pulse rounded-2xl h-80 w-full" style={{ background: 'rgba(0,0,0,0.06)' }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded h-4 w-full" style={{ background: 'rgba(0,0,0,0.06)' }} />
        ))}
      </div>
    );
  }

  // Formater la date
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // XSS FIX: Échapper les entités HTML avant insertion dans le DOM
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  };

  // Convertir le markdown basique en HTML (avec échappement XSS)
  const formatContent = (text: string) => {
    return text
      .split('\n\n')
      .map((block) => {
        const escaped = escapeHtml(block);
        if (block.startsWith('## ')) {
          return `<h2 style="color:#1A1A2E;font-size:1.5rem;font-weight:700;margin:2rem 0 0.75rem;font-family:Playfair Display,serif">${escapeHtml(block.replace('## ', ''))}</h2>`;
        }
        return `<p style="color:#374151;line-height:1.8;margin-bottom:1rem">${escaped}</p>`;
      })
      .join('');
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb items={[
        { name: 'Accueil', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: article.title, href: `/blog/${article.slug}` },
      ]} />

      {/* Header article */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: '#FDF6E8',
              color: 'var(--gold, #D4A853)',
            }}
          >
            {article.category}
          </span>
          <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            {article.readingTime} de lecture
          </span>
        </div>

        <h1
          style={{
            color: 'var(--navy, #1A1A2E)',
            fontFamily: 'Playfair, serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '16px',
          }}
        >
          {article.title}
        </h1>

        <p style={{ color: '#6B7280', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '16px' }}>
          {article.excerpt}
        </p>

        <div className="flex items-center gap-4" style={{ color: '#6B7280', fontSize: '0.875rem' }}>
          <span>Par <strong style={{ color: 'var(--navy, #1A1A2E)' }}>{article.author}</strong></span>
          <span>·</span>
          <time dateTime={article.publishedAt}>{formattedDate}</time>
        </div>
      </header>

      {/* Image de couverture */}
      {article.coverImage && (
        <div className="rounded-2xl overflow-hidden mb-10" style={{ border: '1px solid #E5E0D8' }}>
          <Image
            src={article.coverImage}
            alt={article.title}
            width={800}
            height={450}
            className="w-full h-auto"
            priority
          />
        </div>
      )}

      {/* Contenu */}
      <div
        className="prose-eventy"
        dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
      />

      {/* Tags */}
      <div className="mt-12 pt-8" style={{ borderTop: '1px solid #E5E0D8' }}>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 500,
                background: 'var(--cream, #FAF7F2)',
                color: '#6B7280',
                border: '1px solid #E5E0D8',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterCTA variant="terra" className="mt-12" />

      {/* JSON-LD SEO */}
      <BlogPostingJsonLd
        title={article.title}
        description={article.excerpt}
        slug={article.slug}
        datePublished={article.publishedAt}
        image={article.coverImage}
      />
    </article>
  );
}
