'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { OrganizationJsonLd } from '@/components/seo/json-ld';

/* Couleurs Design System v2 */
const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  terraSoft: 'var(--terra-soft)',
  gold: '#D4A853',
  goldSoft: '#FDF6E8',
  border: '#E5E0D8',
  muted: '#6B7280',
  forest: '#166534',
  forestBg: '#DCFCE7',
};

/**
 * Hook reveal on scroll
 */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('vis');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`rv ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/**
 * Landing page Eventy Life — Design v2
 */
export default function HomePage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <>
      {/* JSON-LD Organization pour Google */}
      <OrganizationJsonLd />

      {/* ═══ HERO ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ background: C.cream }}
      >
        {/* Orbe décoratif */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 animate-float"
          style={{ background: `radial-gradient(circle, ${C.terra}40, transparent 70%)` }}
        />
        <div
          className="absolute bottom-0 -left-20 w-64 h-64 rounded-full opacity-15 animate-float"
          style={{ background: `radial-gradient(circle, ${C.gold}40, transparent 70%)`, animationDelay: '3s' }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Trust pill */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-up"
              style={{ background: C.goldSoft, color: C.navy, border: `1px solid ${C.gold}30` }}
            >
              <span style={{ color: C.gold }}>★</span>
              Plateforme n°1 de voyages de groupe en France
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up"
              style={{ color: C.navy, animationDelay: '0.1s' }}
            >
              Découvrez le monde,<br />
              <span style={{ color: C.terra }}>accompagné</span>
            </h1>

            <p
              className="text-lg sm:text-xl mb-10 animate-fade-up"
              style={{ color: C.muted, animationDelay: '0.2s' }}
            >
              Des voyages en groupe pensés pour vous. Accompagnement humain porte-à-porte,
              prix justes, qualité garantie.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/voyages"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
                style={{
                  background: C.terra,
                  color: '#fff',
                  boxShadow: `0 6px 24px ${C.terra}30`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.terraLight;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 10px 32px ${C.terra}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.terra;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 6px 24px ${C.terra}30`;
                }}
              >
                Découvrir nos voyages →
              </Link>
              <Link
                href="/comment-ca-marche"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
                style={{
                  background: 'transparent',
                  color: C.navy,
                  border: `1.5px solid ${C.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.terra;
                  e.currentTarget.style.background = C.terraSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Comment ça marche
              </Link>
            </div>

            {/* Stats */}
            <div
              className="flex flex-wrap justify-center gap-8 sm:gap-14 mt-14 animate-fade-up"
              style={{ animationDelay: '0.4s' }}
            >
              {[
                { val: '2 500+', label: 'Voyageurs heureux' },
                { val: '98%', label: 'Satisfaction' },
                { val: '50+', label: 'Destinations' },
              ].map((s, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold" style={{ color: C.terra }}>{s.val}</div>
                  <div className="text-sm mt-1" style={{ color: C.muted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMMENT ÇA MARCHE ═══ */}
      <section id="how-it-works" style={{ background: '#fff' }} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <RevealDiv className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: C.gold }}>
              Simple comme bonjour
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3" style={{ color: C.navy }}>
              Comment ça marche
            </h2>
          </RevealDiv>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '🔍',
                title: 'Choisir',
                desc: 'Parcourez nos voyages en groupe et sélectionnez celui qui vous plaît.',
              },
              {
                step: '02',
                icon: '📋',
                title: 'Réserver',
                desc: 'Réservez facilement et payez en plusieurs fois si vous le souhaitez.',
              },
              {
                step: '03',
                icon: '✈️',
                title: 'Partir',
                desc: "Profitez d'un voyage inoubliable avec notre accompagnement complet.",
              },
            ].map((item, idx: number) => (
              <RevealDiv key={idx} delay={idx * 120}>
                <div
                  className="text-center p-8 rounded-2xl transition-all duration-300"
                  style={{
                    background: '#fff',
                    border: `1.5px solid ${C.border}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(26,26,46,0.08)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <span className="text-xs font-bold tracking-wider" style={{ color: C.gold }}>
                    ÉTAPE {item.step}
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-3" style={{ color: C.navy }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{item.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VOYAGES POPULAIRES ═══ */}
      <section style={{ background: C.cream }} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <RevealDiv className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: C.gold }}>
              Coups de cœur
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3" style={{ color: C.navy }}>
              Voyages populaires
            </h2>
          </RevealDiv>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Maroc — 8 jours',
                destination: 'Marrakech & Désert',
                price: '890 €',
                emoji: '🏜️',
                gradient: `linear-gradient(135deg, #C75B3940, #D4A85340)`,
              },
              {
                title: 'Grèce — 10 jours',
                destination: 'Athènes & Îles',
                price: '1 290 €',
                emoji: '🏛️',
                gradient: `linear-gradient(135deg, #1e40af30, #48CAE430)`,
              },
              {
                title: 'Italie — 7 jours',
                destination: 'Rome & Côte Amalfitaine',
                price: '1 090 €',
                emoji: '🍝',
                gradient: `linear-gradient(135deg, #16653440, #06D6A030)`,
              },
            ].map((travel, idx: number) => (
              <RevealDiv key={idx} delay={idx * 120}>
                <Link href="/voyages" className="block group">
                  <div
                    className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: '#fff',
                      border: `1.5px solid ${C.border}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,26,46,0.10)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div
                      className="h-48 flex items-center justify-center text-6xl"
                      style={{ background: travel.gradient }}
                    >
                      {travel.emoji}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-1" style={{ color: C.navy }}>{travel.title}</h3>
                      <p className="text-sm mb-4" style={{ color: C.muted }}>📍 {travel.destination}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold" style={{ color: C.terra }}>
                          À partir de {travel.price}
                        </span>
                        <span
                          className="text-sm font-semibold transition-colors"
                          style={{ color: C.terra }}
                        >
                          Voir →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </RevealDiv>
            ))}
          </div>

          <RevealDiv className="text-center mt-10">
            <Link
              href="/voyages"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: 'transparent',
                color: C.navy,
                border: `1.5px solid ${C.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.terra;
                e.currentTarget.style.background = C.terraSoft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Voir tous les voyages →
            </Link>
          </RevealDiv>
        </div>
      </section>

      {/* ═══ POURQUOI EVENTY ═══ */}
      <section style={{ background: '#fff' }} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <RevealDiv className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: C.gold }}>
              Nos engagements
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3" style={{ color: C.navy }}>
              Pourquoi Eventy Life
            </h2>
          </RevealDiv>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '👥', title: 'Groupes', desc: 'Voyagez en bonne compagnie, rencontrez de nouvelles personnes' },
              { icon: '💰', title: 'Prix justes', desc: 'Meilleurs tarifs garantis, sans frais cachés' },
              { icon: '✓', title: 'Qualité', desc: 'Services premium, hôtels sélectionnés avec soin' },
              { icon: '🎯', title: 'Accompagnement', desc: 'Avant, pendant et après votre voyage' },
            ].map((item, idx: number) => (
              <RevealDiv key={idx} delay={idx * 100}>
                <div
                  className="text-center p-6 rounded-2xl transition-all duration-300"
                  style={{
                    background: C.cream,
                    border: `1.5px solid transparent`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,26,46,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.background = C.cream;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-bold mb-2" style={{ color: C.navy }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{item.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TÉMOIGNAGES ═══ */}
      <section style={{ background: C.cream }} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <RevealDiv className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: C.gold }}>
              Ils nous font confiance
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3" style={{ color: C.navy }}>
              Nos clients témoignent
            </h2>
          </RevealDiv>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Marie D.',
                text: 'Un voyage merveilleux ! Équipe au top, pas stressée une seconde.',
                rating: 5,
                trip: 'Maroc — Sept 2025',
              },
              {
                name: 'Jean P.',
                text: 'Prix honnête et service exceptionnel. Je réserve ma prochaine destination !',
                rating: 5,
                trip: 'Grèce — Juin 2025',
              },
              {
                name: 'Sophie L.',
                text: 'Voyage en petit groupe, vraiment sympathique. À recommander !',
                rating: 5,
                trip: 'Italie — Oct 2025',
              },
            ].map((review, idx: number) => (
              <RevealDiv key={idx} delay={idx * 120}>
                <div
                  className="p-6 rounded-2xl h-full flex flex-col"
                  style={{
                    background: '#fff',
                    border: `1.5px solid ${C.border}`,
                  }}
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(review.rating)].map((_, i: number) => (
                      <span key={i} style={{ color: C.gold }}>★</span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: '#374151' }}>
                    « {review.text} »
                  </p>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: C.navy }}>{review.name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{review.trip}</p>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section
        className="py-20 px-4"
        style={{ background: C.navy }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <RevealDiv>
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: C.gold }}>
              Newsletter
            </span>
            <h2 className="font-display text-3xl font-bold mt-3 mb-4" style={{ color: '#FAF7F2' }}>
              Recevez nos dernières offres
            </h2>
            <p className="mb-8 text-sm" style={{ color: 'rgba(250,247,242,0.6)' }}>
              Inscrivez-vous pour découvrir nos meilleures destinations avant tout le monde.
            </p>

            <form aria-label="Inscription à la newsletter" onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail((e.target as HTMLInputElement).value)}
                placeholder="Votre email"
                required
                className="flex-1 px-5 py-3.5 rounded-xl text-sm focus:outline-none transition-shadow"
                style={{
                  background: 'rgba(250,247,242,0.08)',
                  color: '#FAF7F2',
                  border: '1.5px solid rgba(250,247,242,0.15)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = C.terra)}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(250,247,242,0.15)')}
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{
                  background: C.terra,
                  color: '#fff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.terraLight;
                  e.currentTarget.style.boxShadow = `0 6px 24px ${C.terra}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.terra;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                S'inscrire
              </button>
            </form>

            {subscribed && (
              <p className="mt-4 text-sm animate-fade-up" style={{ color: '#DCFCE7' }}>
                Merci ! Vérifiez votre boîte mail.
              </p>
            )}
          </RevealDiv>
        </div>
      </section>

    </>
  );
}
