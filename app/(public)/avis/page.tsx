'use client';

/**
 * Page Avis Voyageurs — Sun/Ocean V4
 * Témoignages filtrables, stats globales, CTA réservation
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { NewsletterCTA } from '@/components/newsletter-cta';

/* ─── Types ─── */
interface Review {
  id: string;
  author: string;
  initials: string;
  destination: string;
  rating: number;
  date: string;
  title: string;
  text: string;
  transport: 'BUS' | 'AVION' | 'MIXTE';
  verified: boolean;
  helpful: number;
  avatarColor: string;
}

/* ─── Données démo ─── */
const DEMO_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Sophie Martin',
    initials: 'SM',
    destination: 'Marrakech, Maroc',
    rating: 5,
    date: '2026-02-15',
    title: 'Une expérience inoubliable !',
    text: "Premier voyage en groupe et je suis conquise. L'accompagnement porte-à-porte est un vrai plus, surtout quand on voyage seule. L'accompagnateur était aux petits soins, l'hôtel magnifique et les excursions bien organisées. Je recommande à 100% !",
    transport: 'BUS',
    verified: true,
    helpful: 24,
    avatarColor: '#C75B39',
  },
  {
    id: 'r2',
    author: 'Karim Benhadi',
    initials: 'KB',
    destination: 'Istanbul, Turquie',
    rating: 5,
    date: '2026-02-08',
    title: 'Rapport qualité-prix imbattable',
    text: "Transport, hôtel, excursions, tout est inclus dans le prix. Pas de mauvaise surprise. Le guide local était passionnant et le groupe très sympa. Istanbul est une ville incroyable et Eventy nous a fait découvrir des endroits qu'on n'aurait jamais trouvés seuls.",
    transport: 'AVION',
    verified: true,
    helpful: 19,
    avatarColor: '#0077B6',
  },
  {
    id: 'r3',
    author: 'Marie Laurent',
    initials: 'ML',
    destination: 'Barcelone, Espagne',
    rating: 4,
    date: '2026-01-22',
    title: 'Très bien organisé',
    text: "Très bonne organisation générale. Le ramassage en bus était ponctuel, le chauffeur très professionnel. Seul petit bémol : l'hôtel était un peu excentré, mais les navettes compensaient. Je referai un voyage avec Eventy sans hésiter.",
    transport: 'BUS',
    verified: true,
    helpful: 12,
    avatarColor: '#D4A853',
  },
  {
    id: 'r4',
    author: 'Jean-Pierre Dubois',
    initials: 'JD',
    destination: 'Santorin, Grèce',
    rating: 5,
    date: '2026-01-10',
    title: 'Voyage de rêve pour notre anniversaire',
    text: "Ma femme et moi avons réservé pour notre 30e anniversaire de mariage. Tout était parfait : les couchers de soleil à Oia, les restaurants recommandés par notre guide, les transferts sans stress. On se sentait comme des VIP.",
    transport: 'AVION',
    verified: true,
    helpful: 31,
    avatarColor: '#1A1A2E',
  },
  {
    id: 'r5',
    author: 'Amina Kessab',
    initials: 'AK',
    destination: 'Lisbonne, Portugal',
    rating: 5,
    date: '2025-12-28',
    title: 'Parfait pour une première fois',
    text: "C'était mon premier voyage organisé et je n'ai pas été déçue. Tout était planifié sans être rigide, on avait du temps libre pour explorer. L'application est pratique pour suivre le programme. L'accompagnateur parlait couramment portugais, ce qui a facilité les échanges.",
    transport: 'BUS',
    verified: true,
    helpful: 16,
    avatarColor: '#C75B39',
  },
  {
    id: 'r6',
    author: 'Thomas Girard',
    initials: 'TG',
    destination: 'Djerba, Tunisie',
    rating: 4,
    date: '2025-12-15',
    title: 'Super ambiance de groupe',
    text: "On est partis à 8 amis et l'ambiance dans le bus puis sur place était incroyable. Les activités proposées (quad dans le désert, soirée étoiles) étaient top. Le rapport qualité-prix est excellent pour des jeunes qui veulent voyager sans se ruiner.",
    transport: 'MIXTE',
    verified: true,
    helpful: 22,
    avatarColor: '#0077B6',
  },
  {
    id: 'r7',
    author: 'Catherine Morel',
    initials: 'CM',
    destination: 'Marrakech, Maroc',
    rating: 5,
    date: '2025-11-30',
    title: 'Je recommande les yeux fermés',
    text: "Troisième voyage avec Eventy et c'est toujours au top. Cette fois direction le Maroc avec ma mère de 72 ans. L'accompagnement est rassurant, le rythme adapté, et les hébergements confortables. Maman a adoré le hammam !",
    transport: 'BUS',
    verified: true,
    helpful: 28,
    avatarColor: '#D4A853',
  },
  {
    id: 'r8',
    author: 'Youssef El Amrani',
    initials: 'YA',
    destination: 'Barcelone, Espagne',
    rating: 5,
    date: '2025-11-18',
    title: 'Service client réactif',
    text: "J'ai dû modifier ma réservation deux fois et le service client a été super réactif. Le voyage en lui-même était génial, la Sagrada Familia m'a coupé le souffle. Le bus était confortable avec WiFi et clim, parfait pour le long trajet.",
    transport: 'BUS',
    verified: true,
    helpful: 14,
    avatarColor: '#1A1A2E',
  },
  {
    id: 'r9',
    author: 'Nathalie Petit',
    initials: 'NP',
    destination: 'Istanbul, Turquie',
    rating: 4,
    date: '2025-11-05',
    title: 'Belles découvertes culturelles',
    text: "Le programme culturel était riche et bien pensé. Le guide était passionné et passionnant. J'aurais aimé un peu plus de temps libre, mais sinon c'est une très belle expérience. Le Grand Bazar et la Mosquée Bleue sont des incontournables.",
    transport: 'AVION',
    verified: true,
    helpful: 10,
    avatarColor: '#C75B39',
  },
];

/* ─── Filtres ─── */
type RatingFilter = 'all' | '5' | '4' | '3';
type TransportFilter = 'all' | 'BUS' | 'AVION' | 'MIXTE';

const STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function AvisPage() {
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [transportFilter, setTransportFilter] = useState<TransportFilter>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent');

  const filteredReviews = useMemo(() => {
    let result = [...DEMO_REVIEWS];

    if (ratingFilter !== 'all') {
      const min = parseInt(ratingFilter);
      result = result.filter((r) => r.rating >= min);
    }

    if (transportFilter !== 'all') {
      result = result.filter((r) => r.transport === transportFilter);
    }

    if (sortBy === 'recent') result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    else result.sort((a, b) => b.helpful - a.helpful);

    return result;
  }, [ratingFilter, transportFilter, sortBy]);

  /* Stats globales */
  const avgRating = (DEMO_REVIEWS.reduce((s, r) => s + r.rating, 0) / DEMO_REVIEWS.length).toFixed(1);
  const fiveStarPct = Math.round((DEMO_REVIEWS.filter((r) => r.rating === 5).length / DEMO_REVIEWS.length) * 100);
  const ratingDistribution = [5, 4, 3, 2, 1].map((n) => ({
    stars: n,
    count: DEMO_REVIEWS.filter((r) => r.rating === n).length,
    pct: Math.round((DEMO_REVIEWS.filter((r) => r.rating === n).length / DEMO_REVIEWS.length) * 100),
  }));

  return (
    <div style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
          color: 'white',
          padding: '5rem 1rem 4rem',
        }}
      >
        <div className="mx-auto max-w-6xl text-center">
          <p
            className="mb-4"
            style={{
              color: 'var(--gold, #D4A853)',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Témoignages vérifiés
          </p>
          <h1
            className="text-3xl sm:text-5xl mb-4"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Ce que nos{' '}
            <span style={{ color: 'var(--terra, #C75B39)' }}>voyageurs</span>{' '}
            disent
          </h1>
          <p
            className="mx-auto mb-8"
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '36rem',
            }}
          >
            Des avis authentiques de voyageurs qui ont vécu l'expérience Eventy Life.
          </p>

          {/* Stats résumé dans le hero */}
          <div className="flex justify-center gap-8 sm:gap-12">
            {[
              { value: avgRating, label: 'Note moyenne', sub: '/ 5' },
              { value: `${DEMO_REVIEWS.length}+`, label: 'Avis vérifiés', sub: '' },
              { value: `${fiveStarPct}%`, label: '5 étoiles', sub: '' },
              { value: '98%', label: 'Recommandent', sub: '' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold">
                  <span style={{ color: 'var(--terra, #C75B39)' }}>{stat.value}</span>
                  {stat.sub && <span className="text-base font-normal" style={{ color: 'rgba(255,255,255,0.5)' }}> {stat.sub}</span>}
                </div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Avis voyageurs', href: '/avis' },
          ]}
        />

        {/* Distribution des notes */}
        <div
          className="mt-8 mb-10 rounded-2xl"
          style={{
            background: 'white',
            border: '1px solid rgba(26,26,46,0.08)',
            boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
            padding: '2rem',
          }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Distribution des notes
          </h2>
          <div className="space-y-2">
            {ratingDistribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <span className="text-sm font-semibold w-12" style={{ color: 'var(--gold, #D4A853)' }}>
                  {d.stars} ★
                </span>
                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(26,26,46,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${d.pct}%`,
                      background: d.stars >= 4
                        ? 'linear-gradient(90deg, var(--terra, #C75B39), var(--gold, #D4A853))'
                        : '#E5E0D8',
                    }}
                  />
                </div>
                <span className="text-xs w-12 text-right" style={{ color: '#64748B' }}>
                  {d.count} ({d.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filtres + tri */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {/* Note */}
            {[
              { value: 'all' as RatingFilter, label: 'Toutes les notes' },
              { value: '5' as RatingFilter, label: '5 ★' },
              { value: '4' as RatingFilter, label: '4+ ★' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setRatingFilter(opt.value)}
                className="text-xs font-semibold rounded-full transition-all duration-200"
                style={{
                  padding: '6px 14px',
                  background: ratingFilter === opt.value ? 'var(--terra, #C75B39)' : 'white',
                  color: ratingFilter === opt.value ? '#fff' : 'var(--navy, #1A1A2E)',
                  border: `1.5px solid ${ratingFilter === opt.value ? 'var(--terra, #C75B39)' : '#E5E0D8'}`,
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
            {/* Transport */}
            {[
              { value: 'all' as TransportFilter, label: 'Tout transport' },
              { value: 'BUS' as TransportFilter, label: '🚌 Bus' },
              { value: 'AVION' as TransportFilter, label: '✈️ Avion' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setTransportFilter(opt.value)}
                className="text-xs font-semibold rounded-full transition-all duration-200"
                style={{
                  padding: '6px 14px',
                  background: transportFilter === opt.value ? 'var(--ocean, #0077B6)' : 'white',
                  color: transportFilter === opt.value ? '#fff' : 'var(--navy, #1A1A2E)',
                  border: `1.5px solid ${transportFilter === opt.value ? 'var(--ocean, #0077B6)' : '#E5E0D8'}`,
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'helpful')}
            aria-label="Trier les avis"
            className="text-sm"
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1.5px solid #E5E0D8',
              background: 'white',
              color: 'var(--navy, #1A1A2E)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="recent">Plus récents</option>
            <option value="helpful">Plus utiles</option>
          </select>
        </div>

        {/* Compteur */}
        <p className="text-sm mb-6" style={{ color: '#64748B' }}>
          {filteredReviews.length} avis affiché{filteredReviews.length !== 1 ? 's' : ''}
        </p>

        {/* Liste des avis */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl transition-all duration-300"
              style={{
                background: 'white',
                border: '1px solid rgba(26,26,46,0.08)',
                boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                padding: '1.5rem',
              }}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-3">
                {/* Avatar */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: review.avatarColor, color: '#fff' }}
                >
                  {review.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
                      {review.author}
                    </span>
                    {review.verified && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: 'rgba(16,185,129,0.08)', color: '#059669' }}
                      >
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm" style={{ color: 'var(--gold, #D4A853)', letterSpacing: '1px' }}>
                      {STARS(review.rating)}
                    </span>
                    <span className="text-xs" style={{ color: '#64748B' }}>
                      {new Date(review.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Destination badge */}
                <span
                  className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full hidden sm:inline-block"
                  style={{ background: 'rgba(0,119,182,0.06)', color: 'var(--ocean, #0077B6)' }}
                >
                  📍 {review.destination}
                </span>
              </div>

              {/* Destination mobile */}
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 sm:hidden"
                style={{ background: 'rgba(0,119,182,0.06)', color: 'var(--ocean, #0077B6)' }}
              >
                📍 {review.destination}
              </span>

              {/* Title + Text */}
              <h3 className="font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
                {review.title}
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#4A5568' }}>
                {review.text}
              </p>

              {/* Footer */}
              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}
              >
                <span className="text-xs" style={{ color: '#64748B' }}>
                  {review.transport === 'BUS' ? '🚌 Voyage en bus' : review.transport === 'AVION' ? '✈️ Voyage en avion' : '🚌✈️ Voyage mixte'}
                </span>
                <span className="text-xs" style={{ color: '#64748B' }}>
                  👍 {review.helpful} personnes ont trouvé cet avis utile
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* État vide */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ backgroundColor: 'rgba(199,91,57,0.08)' }}
            >
              💬
            </div>
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Aucun avis avec ces filtres
            </p>
            <button
              type="button"
              onClick={() => { setRatingFilter('all'); setTransportFilter('all'); }}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ border: '1.5px solid #E5E0D8', color: 'var(--navy, #1A1A2E)', background: 'transparent', cursor: 'pointer' }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* CTA */}
        <section
          className="mt-16 text-center rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #C75B39, #D97B5E)',
            padding: '3rem 2rem',
            color: 'white',
          }}
        >
          <h2
            className="text-2xl sm:text-3xl mb-3"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Prêt à vivre l'expérience ?
          </h2>
          <p
            className="mx-auto mb-6"
            style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '32rem' }}
          >
            Rejoignez les centaines de voyageurs satisfaits.
            Réservez votre prochain voyage de groupe dès maintenant.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/voyages"
              className="inline-block px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'white',
                color: 'var(--terra, #C75B39)',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              Découvrir nos voyages
            </Link>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.5)',
              }}
            >
              Nous contacter
            </Link>
          </div>
        </section>

        {/* Newsletter */}
        <NewsletterCTA variant="navy" className="mt-16" />
      </div>
    </div>
  );
}
