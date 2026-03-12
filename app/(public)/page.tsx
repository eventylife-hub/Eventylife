'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './homepage.css';

/* ── Reveal on Scroll ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('vis'); obs.unobserve(el); } },
      { threshold: 0.07, rootMargin: '0px 0px -20px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Rv({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`rv ${className}`}>{children}</div>;
}

/* ── Favorite button ── */
function FavBtn() {
  const ref = useRef<HTMLButtonElement>(null);
  const toggle = () => {
    const b = ref.current;
    if (!b) return;
    b.classList.toggle('liked');
    b.textContent = b.classList.contains('liked') ? '♥' : '♡';
  };
  return <button type="button" ref={ref} className="tc-fav" aria-label="Favoris" onClick={toggle}>♡</button>;
}

/* ── Chip filter (visual only) ── */
function Chips() {
  const labels = ['📍 Autour de moi', 'Région', 'Ce mois', '- de 500€', 'Week-end', 'Famille', 'Culture'];
  const [active, setActive] = React.useState(0);
  return (
    <div className="chips">
      {labels.map((l, i) => (
        <button type="button" key={i} className={i === active ? 'on' : ''} onClick={() => setActive(i)}>{l}</button>
      ))}
    </div>
  );
}

/* ── Pin icon SVG ── */
const PinSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const LocSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
  </svg>
);

/* ══════════════════════════════════════════
   PAGE D'ACCUEIL — EVENTY LIFE
   ══════════════════════════════════════════ */
export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleSearch = useCallback(() => {
    const q = searchQuery.trim();
    if (q) {
      router.push(`/voyages?destination=${encodeURIComponent(q)}`);
    } else {
      router.push('/voyages');
    }
  }, [searchQuery, router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  }, [handleSearch]);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`,
            { headers: { 'User-Agent': 'EventyLife/1.0' } }
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || '';
          if (city) {
            setSearchQuery(city);
          }
        } catch {
          /* silently fail */
        } finally {
          setIsLocating(false);
        }
      },
      () => setIsLocating(false),
      { timeout: 8000 }
    );
  }, []);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="hero-home">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-pill">
              <span className="dot" /> 12 départs confirmés ce mois
            </div>
            <h1 className="font-display">
              Partez <em>accompagné</em>,<br />on gère tout.
            </h1>
            <p className="hero-sub">
              Un arrêt de ramassage au plus près de chez vous, avec parking gratuit.
              Votre voiture reste tranquille, vos vacances commencent tout de suite.
            </p>
            <div className="hero-search" role="search" aria-label="Rechercher un voyage">
              <input
                type="text"
                placeholder="Votre ville ou code postal…"
                id="hero-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Ville ou code postal de départ"
              />
              <button type="button" className="btn-loc" onClick={handleGeolocate} disabled={isLocating} aria-label="Me localiser automatiquement">
                <LocSvg /> {isLocating ? '…' : 'Localiser'}
              </button>
              <button type="button" className="btn-go" onClick={handleSearch}>Trouver →</button>
            </div>
            <div className="hero-tags">
              <Link href="/voyages?destination=maroc">🇲🇦 Maroc</Link>
              <Link href="/voyages?destination=andalousie">🇪🇸 Andalousie</Link>
              <Link href="/voyages?destination=tunisie">🇹🇳 Tunisie</Link>
              <Link href="/voyages?destination=italie">🇮🇹 Italie</Link>
              <Link href="/voyages?type=weekend">⚡ Week-end</Link>
            </div>
          </div>
          <div className="hero-mosaic">
            <Image src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=300&h=240&fit=crop" alt="Marrakech" width={300} height={240} priority sizes="(max-width: 768px) 50vw, 300px" />
            <Image src="https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=300&h=240&fit=crop" alt="Andalousie" width={300} height={240} priority sizes="(max-width: 768px) 50vw, 300px" />
            <Image src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=280&fit=crop" alt="Plage" width={600} height={280} priority sizes="(max-width: 768px) 100vw, 600px" />
          </div>
        </div>
      </section>

      {/* ═══ TRUST PILLS ═══ */}
      <div className="trust-row">
        <div className="trust-pills">
          <div className="tp"><span className="emoji">🚐</span> Ramassage <span className="highlight">près de chez vous</span></div>
          <div className="tp"><span className="emoji">🚗</span> Voiture au garage <span className="highlight">ou à l&apos;arrêt</span></div>
          <div className="tp"><span className="emoji">👤</span> <span className="highlight">Accompagnateur</span> dédié</div>
          <div className="tp"><span className="emoji">✅</span> Départ <span className="highlight">garanti</span></div>
          <div className="tp"><span className="emoji">💳</span> Tout inclus, <span className="highlight">prix fixe</span></div>
          <div className="tp"><span className="emoji">📞</span> Pro <span className="highlight">local</span> joignable</div>
        </div>
      </div>

      {/* ═══ VOYAGES ═══ */}
      <section className="sec-trips" id="voyages">
        <div className="sec-inner">
          <div className="sec-top">
            <h2 className="font-display">Voyages <em>près de chez vous</em></h2>
            <Link href="/voyages" className="see-all">Voir tout →</Link>
          </div>
          <p className="sec-sub">Départs confirmés avec ramassage dans votre zone. Réservez en 2 minutes.</p>
          <Chips />
          <div className="trip-grid">

            {/* Card 1 — Marrakech */}
            <Rv>
              <article className="tc">
                <div className="tc-img">
                  <Image src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=640&h=440&fit=crop" alt="Marrakech" width={640} height={440} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <span className="tc-badge confirmed">Départ confirmé</span>
                  <FavBtn />
                  <div className="tc-transport-tag">🚌 + ✈️</div>
                  <div className="tc-emotion font-display">Dépaysement total</div>
                </div>
                <div className="tc-body">
                  <div className="tc-pickup"><PinSvg /> à 12 km — Strasbourg centre</div>
                  <h3 className="font-display">Marrakech &amp; Essaouira</h3>
                  <div className="tc-meta"><span>📅 15 – 22 mars</span><span>8 jours</span></div>
                  <div className="tc-foot">
                    <div className="tc-price"><small>à partir de</small><strong className="font-display">689<sup>€</sup></strong></div>
                    <button type="button" className="btn-book">Réserver</button>
                  </div>
                </div>
              </article>
            </Rv>

            {/* Card 2 — Andalousie */}
            <Rv>
              <article className="tc">
                <div className="tc-img">
                  <Image src="https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=640&h=440&fit=crop" alt="Andalousie" width={640} height={440} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <span className="tc-badge confirmed">Départ confirmé</span>
                  <FavBtn />
                  <div className="tc-transport-tag">🚌 Grand tourisme</div>
                  <div className="tc-emotion font-display">Soleil &amp; flamenco</div>
                </div>
                <div className="tc-body">
                  <div className="tc-pickup"><PinSvg /> à 8 km — Mulhouse gare</div>
                  <h3 className="font-display">Andalousie — Séville, Grenade, Cordoue</h3>
                  <div className="tc-meta"><span>📅 5 – 12 avril</span><span>8 jours</span></div>
                  <div className="tc-foot">
                    <div className="tc-price"><small>à partir de</small><strong className="font-display">549<sup>€</sup></strong></div>
                    <button type="button" className="btn-book">Réserver</button>
                  </div>
                </div>
              </article>
            </Rv>

            {/* Card 3 — Tunisie */}
            <Rv>
              <article className="tc">
                <div className="tc-img">
                  <Image src="https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=640&h=440&fit=crop" alt="Tunisie" width={640} height={440} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <span className="tc-badge hot">🔥 6 places restantes</span>
                  <FavBtn />
                  <div className="tc-transport-tag">✈️ + 🚌</div>
                  <div className="tc-emotion font-display">Évasion méditerranée</div>
                </div>
                <div className="tc-body">
                  <div className="tc-pickup"><PinSvg /> à 5 km — Colmar centre</div>
                  <h3 className="font-display">Tunisie — Hammamet &amp; Sidi Bou Saïd</h3>
                  <div className="tc-meta"><span>📅 20 – 27 avril</span><span>8 jours</span></div>
                  <div className="tc-foot">
                    <div className="tc-price"><small>à partir de</small><strong className="font-display">599<sup>€</sup></strong></div>
                    <button type="button" className="btn-book">Réserver</button>
                  </div>
                </div>
              </article>
            </Rv>

            {/* Card 4 — Italie */}
            <Rv>
              <article className="tc">
                <div className="tc-img">
                  <Image src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=640&h=440&fit=crop" alt="Italie" width={640} height={440} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <span className="tc-badge new">✨ Nouveau</span>
                  <FavBtn />
                  <div className="tc-transport-tag">🚌 Grand tourisme</div>
                  <div className="tc-emotion font-display">La dolce vita</div>
                </div>
                <div className="tc-body">
                  <div className="tc-pickup"><PinSvg /> à 15 km — Haguenau</div>
                  <h3 className="font-display">Rome, Florence &amp; Venise</h3>
                  <div className="tc-meta"><span>📅 10 – 18 mai</span><span>9 jours</span></div>
                  <div className="tc-foot">
                    <div className="tc-price"><small>à partir de</small><strong className="font-display">729<sup>€</sup></strong></div>
                    <button type="button" className="btn-book">Réserver</button>
                  </div>
                </div>
              </article>
            </Rv>

          </div>
        </div>
      </section>

      {/* ═══ EMOTION BANNER ═══ */}
      <div className="emotion-strip">
        <Image src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=600&fit=crop&q=80" alt="Route de voyage" width={1920} height={600} loading="lazy" sizes="100vw" quality={80} />
        <div className="emotion-strip-text">
          <h2 className="font-display">Des souvenirs.<br />Pas de la logistique.</h2>
          <p>Garez-vous gratuitement à l&apos;arrêt ou laissez votre voiture au garage. Montez dans le bus et ramenez des étoiles dans les yeux.</p>
        </div>
      </div>

      {/* ═══ POURQUOI EVENTY ═══ */}
      <section className="sec-why" id="pourquoi">
        <div className="sec-inner">
          <div className="sec-top"><h2 className="font-display">Pourquoi <em>Eventy Life</em> ?</h2></div>
          <div className="why-grid">

            <Rv><div className="why-card">
              <div className="wc-img">
                <Image src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop" alt="Bus" width={600} height={400} loading="lazy" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="wc-num c1 font-display">1</div>
                <div className="wc-title-overlay font-display">Un arrêt de ramassage tout près de chez vous</div>
              </div>
              <div className="wc-body"><p>Nos indépendants placent les arrêts au plus proche. La plupart disposent d&apos;un parking gratuit : garez-vous, montez dans le bus, c&apos;est parti.</p></div>
            </div></Rv>

            <Rv><div className="why-card">
              <div className="wc-img">
                <Image src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop" alt="Voiture" width={600} height={400} loading="lazy" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="wc-num c2 font-display">2</div>
                <div className="wc-title-overlay font-display">Votre voiture reste au garage ou à l&apos;arrêt</div>
              </div>
              <div className="wc-body"><p>Laissez-la à la maison ou garez-vous gratuitement à l&apos;arrêt de ramassage. Zéro km inutile, zéro risque de vol sur un parking d&apos;aéroport.</p></div>
            </div></Rv>

            <Rv><div className="why-card">
              <div className="wc-img">
                <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop" alt="Accompagnateur" width={600} height={400} loading="lazy" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="wc-num c3 font-display">3</div>
                <div className="wc-title-overlay font-display">Un humain avec vous, pas un chatbot</div>
              </div>
              <div className="wc-body"><p>Du ramassage au retour, un accompagnateur Eventy est là. Questions, soucis, envies : toujours quelqu&apos;un à qui parler.</p></div>
            </div></Rv>

            <Rv><div className="why-card">
              <div className="wc-img">
                <Image src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop" alt="Hôtel" width={600} height={400} loading="lazy" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="wc-num c4 font-display">4</div>
                <div className="wc-title-overlay font-display">Tout inclus, zéro surprise sur le prix</div>
              </div>
              <div className="wc-body"><p>Transport, hôtel, repas, activités — tout dans le prix. Pas de supplément carburant, pas d&apos;option piège en petits caractères.</p></div>
            </div></Rv>

            <Rv><div className="why-card">
              <div className="wc-img">
                <Image src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600&h=400&fit=crop" alt="Groupe" width={600} height={400} loading="lazy" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="wc-num c5 font-display">5</div>
                <div className="wc-title-overlay font-display">Le groupe sans la galère logistique</div>
              </div>
              <div className="wc-body"><p>Rencontres, bonne ambiance, souvenirs partagés. On gère les chambres, les horaires, les restaurants. Vous, vous profitez.</p></div>
            </div></Rv>

            <Rv><div className="why-card">
              <div className="wc-img">
                <Image src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop" alt="Pro local" width={600} height={400} loading="lazy" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="wc-num c6 font-display">6</div>
                <div className="wc-title-overlay font-display">Un pro près de chez vous, joignable</div>
              </div>
              <div className="wc-body"><p>Votre interlocuteur local connaît votre région. Appelez-le, voyez-le, posez vos questions avant de partir.</p></div>
            </div></Rv>

          </div>
        </div>
      </section>

      {/* ═══ VOITURE AU GARAGE ═══ */}
      <section className="sec-car">
        <div className="car-grid">
          <div className="car-photo">
            <Image src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=960&h=700&fit=crop&q=80" alt="Belle voiture" width={960} height={700} loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" quality={80} />
            <div className="car-floats">
              <div className="cf"><span className="big font-display">0 km</span><span className="sm">compteur</span></div>
              <div className="cf"><span className="big font-display">0 €</span><span className="sm">parking à l&apos;arrêt</span></div>
              <div className="cf"><span className="big font-display">0</span><span className="sm">risque</span></div>
            </div>
          </div>
          <div className="car-content">
            <div className="car-tag">💎 Argument n°1 de nos clients</div>
            <h2 className="font-display">Votre voiture est <em>précieuse</em>.<br />Laissez-la au garage ou à l&apos;arrêt.</h2>
            <p>Plus besoin de traverser la France au volant. Garez-vous gratuitement à l&apos;arrêt de bus le plus proche, ou laissez votre voiture chez vous. Dans les deux cas : zéro fatigue, zéro risque.</p>
            <div className="car-pts">
              <div className="cp">
                <div className="cp-ico a">⛽</div>
                <div><h4>Économisez 600€+ par voyage</h4><p>Carburant + péages aller-retour Strasbourg–Barcelone : plus de 600€ restent dans votre poche.</p></div>
              </div>
              <div className="cp">
                <div className="cp-ico b">🅿️</div>
                <div><h4>Zéro frais de parking</h4><p>Nos arrêts sont choisis avec parking gratuit. Comparez avec 15€/jour en aéroport × 8 jours = 120€ économisés.</p></div>
              </div>
              <div className="cp">
                <div className="cp-ico c">🔧</div>
                <div><h4>Valeur de revente préservée</h4><p>2 000 km de moins au compteur, c&apos;est de l&apos;argent gardé à la revente.</p></div>
              </div>
              <div className="cp">
                <div className="cp-ico d">😌</div>
                <div><h4>Vacances dès la première minute</h4><p>Pas de 6h de route épuisante. Montez dans le bus, le voyage commence.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMMENT ÇA MARCHE ═══ */}
      <section className="sec-how" id="comment">
        <div className="sec-inner">
          <div className="sec-top" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <h2 className="font-display">Comment <em>ça marche</em> ?</h2>
              <p className="sec-sub" style={{ margin: '6px auto 0' }}>4 étapes, 2 minutes. Même sans compte.</p>
            </div>
          </div>
          <div className="how-grid">

            <Rv><div className="hs">
              <div className="hs-circ" style={{ border: '3px solid var(--sun)', boxShadow: '0 4px 20px rgba(255,107,53,.2)' }}>
                <Image src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=220&h=220&fit=crop" alt="Chercher" width={220} height={220} loading="lazy" sizes="220px" />
                <div className="num n1 font-display">1</div>
              </div>
              <h4>Entrez votre ville</h4>
              <p>On affiche les voyages avec un arrêt de ramassage à côté, triés par distance.</p>
            </div></Rv>

            <Rv><div className="hs">
              <div className="hs-circ" style={{ border: '3px solid var(--ocean)', boxShadow: '0 4px 20px rgba(0,119,182,.2)' }}>
                <Image src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=220&h=220&fit=crop" alt="Réserver" width={220} height={220} loading="lazy" sizes="220px" />
                <div className="num n2 font-display">2</div>
              </div>
              <h4>Réservez en 2 min</h4>
              <p>Chambre, voyageurs, paiement sécurisé. Même en invité.</p>
            </div></Rv>

            <Rv><div className="hs">
              <div className="hs-circ" style={{ border: '3px solid var(--mint)', boxShadow: '0 4px 20px rgba(6,214,160,.2)' }}>
                <Image src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=220&h=220&fit=crop" alt="Bus" width={220} height={220} loading="lazy" sizes="220px" />
                <div className="num n3 font-display">3</div>
              </div>
              <h4>Le bus passe à votre arrêt</h4>
              <p>Jour J, garez-vous gratuitement à l&apos;arrêt. L&apos;accompagnateur vous accueille et c&apos;est parti.</p>
            </div></Rv>

            <Rv><div className="hs">
              <div className="hs-circ" style={{ border: '3px solid var(--violet)', boxShadow: '0 4px 20px rgba(123,47,247,.2)' }}>
                <Image src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=220&h=220&fit=crop" alt="Profiter" width={220} height={220} loading="lazy" sizes="220px" />
                <div className="num n4 font-display">4</div>
              </div>
              <h4>Profitez, c&apos;est tout</h4>
              <p>Hôtel, repas, visites : tout est prêt. Vivez le moment.</p>
            </div></Rv>

          </div>
        </div>
      </section>

      {/* ═══ TÉMOIGNAGES ═══ */}
      <section className="sec-test" id="avis">
        <div className="sec-inner">
          <div className="sec-top"><h2 className="font-display">Ils sont <em>partis avec nous</em></h2></div>
          <div className="test-grid">

            <Rv><div className="testi">
              <div className="testi-q font-display">&ldquo;</div>
              <div className="testi-stars">★★★★★</div>
              <p>Le bus est passé à 5 min de la maison. On a dormi pendant le trajet, et à l&apos;arrivée tout était prêt. Ma voiture n&apos;a pas bougé !</p>
              <div className="testi-who">
                <div className="testi-av"><Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=88&h=88&fit=crop&crop=face" alt="Marie" width={88} height={88} loading="lazy" sizes="44px" /></div>
                <div><div className="testi-name">Marie C.</div><div className="testi-trip">Andalousie — Mars 2025</div></div>
              </div>
            </div></Rv>

            <Rv><div className="testi">
              <div className="testi-q font-display">&ldquo;</div>
              <div className="testi-stars">★★★★★</div>
              <p>J&apos;avais peur du groupe. L&apos;accompagnateur était top, l&apos;ambiance géniale. Ne pas conduire 8 jours, c&apos;est un luxe incroyable.</p>
              <div className="testi-who">
                <div className="testi-av"><Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&h=88&fit=crop&crop=face" alt="Karim" width={88} height={88} loading="lazy" sizes="44px" /></div>
                <div><div className="testi-name">Karim A.</div><div className="testi-trip">Marrakech — Février 2025</div></div>
              </div>
            </div></Rv>

            <Rv><div className="testi">
              <div className="testi-q font-display">&ldquo;</div>
              <div className="testi-stars">★★★★★</div>
              <p>Parking + essence + péages + stress… Eventy revient MOINS cher et je n&apos;ai rien eu à gérer. Pourquoi pas avant ?!</p>
              <div className="testi-who">
                <div className="testi-av"><Image src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=88&h=88&fit=crop&crop=face" alt="Sophie" width={88} height={88} loading="lazy" sizes="44px" /></div>
                <div><div className="testi-name">Sophie B.</div><div className="testi-trip">Rome &amp; Florence — Avril 2025</div></div>
              </div>
            </div></Rv>

          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link
              href="/avis"
              className="inline-block rounded-xl font-bold text-sm transition-all duration-200"
              style={{
                backgroundColor: 'var(--terra, #C75B39)',
                color: 'white',
                padding: '0.875rem 2rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(199,91,57,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(199,91,57,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(199,91,57,0.2)';
              }}
            >
              Voir tous les avis →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="sec-cta">
        <Image src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=700&fit=crop&q=80" alt="Destination" width={1920} height={700} loading="lazy" sizes="100vw" quality={80} />
        <div className="cta-box">
          <h2 className="font-display">Prêt à partir sans stress ?</h2>
          <p>Trouvez le voyage qui part près de chez vous. 2 minutes, c&apos;est réservé.</p>
          <button
            type="button"
            className="btn-final"
            onClick={() => {
              document.getElementById('hero-input')?.focus();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Trouver mon voyage →
          </button>
        </div>
      </section>
    </>
  );
}
