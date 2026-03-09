/**
 * Page d'accueil Eventy Life
 * Design basé sur le mockup v3 avec améliorations visuelles
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ============================================
   NAVIGATION
   ============================================ */
function Navbar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[62px] flex items-center justify-between px-6 transition-all duration-300 ${
        solid
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_20px_rgba(10,22,40,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <Link href="/" className={`font-display text-[23px] font-extrabold no-underline transition-colors ${solid ? 'text-[#0A1628]' : 'text-white'}`}>
        Eventy<span className="text-[#FF6B35]">Life</span>
      </Link>
      <div className="flex items-center gap-1">
        <Link href="/voyages" className={`hidden sm:inline-block text-[13.5px] font-semibold no-underline px-3.5 py-2 rounded-full transition-all ${solid ? 'text-gray-500 hover:bg-gray-100' : 'text-white/85 hover:bg-white/10'}`}>
          Voyages
        </Link>
        <Link href="/pro" className={`hidden sm:inline-block text-[13.5px] font-semibold no-underline px-3.5 py-2 rounded-full transition-all ${solid ? 'text-gray-500 hover:bg-gray-100' : 'text-white/85 hover:bg-white/10'}`}>
          Devenir pro
        </Link>
        <Link href="/connexion" className={`hidden sm:inline-block text-[13.5px] font-semibold no-underline px-3.5 py-2 rounded-full transition-all ${solid ? 'text-gray-500 hover:bg-gray-100' : 'text-white/85 hover:bg-white/10'}`}>
          Connexion
        </Link>
        <Link href="/voyages" className="bg-[#FF6B35] text-white px-5 py-2 rounded-full text-[13.5px] font-bold no-underline hover:bg-[#FF8F5E] hover:scale-[1.03] transition-all">
          Réserver →
        </Link>
      </div>
    </nav>
  );
}

/* ============================================
   HERO — Gradient sunset premium
   ============================================ */
function HeroSection() {
  return (
    <section className="relative pt-20 pb-7 px-6 overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0A1628 0%, #1a1145 25%, #2d1b4e 40%, #4a1942 55%, #6b2040 70%, #8B3A2A 85%, #A85A30 100%)'
    }}>
      {/* Orbes lumineux */}
      <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(255,107,53,0.2), transparent 70%)',
        animation: 'float 8s ease-in-out infinite alternate'
      }} />
      <div className="absolute -bottom-[150px] -left-[100px] w-[400px] h-[400px] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(72,202,228,0.12), transparent 70%)',
        animation: 'float 10s ease-in-out infinite alternate-reverse'
      }} />

      <div className="max-w-[1360px] mx-auto relative z-[2] grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
        <div className="max-w-[620px]">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 border border-white/10 backdrop-blur-lg px-4 py-1.5 rounded-full text-xs font-bold text-[#FF8F5E] mb-4" style={{
            background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(0,180,216,0.1))',
            animation: 'fadeUp 0.5s 0.1s ease both'
          }}>
            <span className="w-[7px] h-[7px] bg-[#06D6A0] rounded-full" style={{ animation: 'pulse 2s infinite' }} />
            12 départs confirmés ce mois
          </div>

          <h1 className="font-display font-black text-white leading-[1.1] mb-3" style={{
            fontSize: 'clamp(30px, 4.5vw, 52px)',
            animation: 'fadeUp 0.5s 0.15s ease both'
          }}>
            Partez{' '}
            <em className="italic" style={{
              background: 'linear-gradient(135deg, #FF6B35, #FF8F5E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>accompagné</em>,
            <br />on gère tout.
          </h1>

          <p className="text-base text-white/65 leading-relaxed mb-5 max-w-[480px]" style={{ animation: 'fadeUp 0.5s 0.25s ease both' }}>
            Un arrêt de ramassage au plus près de chez vous, avec parking gratuit. Votre voiture reste tranquille, vos vacances commencent tout de suite.
          </p>

          {/* Barre de recherche avancée */}
          <div className="bg-white rounded-2xl sm:rounded-[20px] p-3 sm:p-4 max-w-[560px] shadow-[0_12px_40px_rgba(0,0,0,0.25)]" style={{ animation: 'fadeUp 0.5s 0.3s ease both' }}>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-2 mb-2">
              {/* Destination */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF6B35]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input
                  type="text"
                  placeholder="Destination ou ville..."
                  className="w-full border border-gray-200 outline-none pl-9 pr-3 py-2.5 text-[14px] bg-gray-50/50 rounded-xl text-[#1B2940] placeholder:text-gray-400 focus:border-[#FF6B35]/40 focus:bg-white transition-all"
                />
              </div>
              {/* Date */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF6B35]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input
                  type="date"
                  className="w-full border border-gray-200 outline-none pl-9 pr-3 py-2.5 text-[14px] bg-gray-50/50 rounded-xl text-[#1B2940] focus:border-[#FF6B35]/40 focus:bg-white transition-all"
                />
              </div>
            </div>
            {/* Départ aéroport + bouton */}
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <span className="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded-md group-hover:border-[#FF6B35]/60 transition-colors">
                  <input type="checkbox" className="absolute opacity-0 w-full h-full cursor-pointer peer" />
                  <svg className="hidden peer-checked:block text-[#FF6B35]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span className="flex items-center gap-1.5 text-[12.5px] text-gray-500 font-medium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  Départ aéroport possible
                </span>
              </label>
              <Link href="/voyages" className="bg-[#FF6B35] text-white border-none rounded-xl px-6 py-2.5 text-sm font-bold no-underline cursor-pointer whitespace-nowrap hover:bg-[#FF8F5E] hover:scale-[1.02] transition-all shadow-[0_4px_16px_rgba(255,107,53,0.25)]">
                Trouver →
              </Link>
            </div>
          </div>

          {/* Tags destinations */}
          <div className="flex flex-wrap gap-1.5 mt-3.5" style={{ animation: 'fadeUp 0.5s 0.4s ease both' }}>
            {['🇲🇦 Maroc', '🇪🇸 Andalousie', '🇹🇳 Tunisie', '🇮🇹 Italie', '⚡ Week-end'].map(tag => (
              <Link key={tag} href="/voyages" className="text-xs font-medium text-white/50 no-underline px-3.5 py-1.5 border border-white/10 rounded-full hover:text-white hover:border-white/30 hover:bg-white/5 transition-all">
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Mosaïque photos */}
        <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-2.5" style={{ animation: 'fadeUp 0.6s 0.35s ease both' }}>
          <img src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=300&h=240&fit=crop" alt="Marrakech" className="w-[140px] h-[110px] object-cover rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.3)]" />
          <img src="https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=300&h=240&fit=crop" alt="Andalousie" className="w-[140px] h-[110px] object-cover rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.3)]" />
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=280&fit=crop" alt="Plage" className="col-span-2 w-full h-[130px] object-cover rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.3)]" />
        </div>
      </div>
    </section>
  );
}

/* ============================================
   TRUST PILLS
   ============================================ */
function TrustPills() {
  const pills = [
    { emoji: '🚐', text: 'Ramassage', highlight: 'près de chez vous' },
    { emoji: '🚗', text: 'Voiture au garage', highlight: "ou à l'arrêt" },
    { emoji: '👤', highlight: 'Accompagnateur', text: 'dédié' },
    { emoji: '✅', text: 'Départ', highlight: 'garanti' },
    { emoji: '💳', text: 'Tout inclus,', highlight: 'prix fixe' },
    { emoji: '📞', text: 'Pro', highlight: 'local', suffix: 'joignable' },
  ];

  return (
    <div className="max-w-[1360px] mx-auto -mt-5 relative z-10 px-6">
      <div className="flex gap-2.5 overflow-x-auto py-1.5 scrollbar-hide">
        {pills.map((p, i) => (
          <div key={i} className="flex-shrink-0 flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-[0_4px_24px_rgba(10,22,40,0.08)] text-[13px] font-semibold text-[#1B2940] hover:shadow-[0_8px_32px_rgba(255,107,53,0.2)] hover:-translate-y-0.5 transition-all cursor-default">
            <span className="text-xl">{p.emoji}</span>
            {p.text} <span className="text-[#FF6B35] font-bold">{p.highlight}</span> {p.suffix || ''}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   VOYAGE CARDS
   ============================================ */
const trips = [
  { id: 1, image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=640&h=440&fit=crop', badge: 'confirmed', badgeText: 'Départ confirmé', transport: '🚌 + ✈️', emotion: 'Dépaysement total', pickup: 'à 12 km — Strasbourg centre', title: 'Marrakech & Essaouira', dates: '15 – 22 mars', duration: '8 jours', price: 689 },
  { id: 2, image: 'https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=640&h=440&fit=crop', badge: 'confirmed', badgeText: 'Départ confirmé', transport: '🚌 Grand tourisme', emotion: 'Soleil & flamenco', pickup: 'à 8 km — Mulhouse gare', title: 'Andalousie — Séville, Grenade, Cordoue', dates: '5 – 12 avril', duration: '8 jours', price: 549 },
  { id: 3, image: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=640&h=440&fit=crop', badge: 'hot', badgeText: '🔥 6 places restantes', transport: '✈️ + 🚌', emotion: 'Évasion méditerranée', pickup: 'à 5 km — Colmar centre', title: 'Tunisie — Hammamet & Sidi Bou Saïd', dates: '20 – 27 avril', duration: '8 jours', price: 599 },
  { id: 4, image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=640&h=440&fit=crop', badge: 'new', badgeText: '✨ Nouveau', transport: '🚌 Grand tourisme', emotion: 'La dolce vita', pickup: 'à 15 km — Haguenau', title: 'Rome, Florence & Venise', dates: '10 – 18 mai', duration: '9 jours', price: 729 },
];

function TripCard({ trip }: { trip: typeof trips[0] }) {
  const [liked, setLiked] = useState(false);
  const badgeColors: Record<string, string> = {
    confirmed: 'bg-[#06D6A0]',
    hot: 'bg-[#E63946]',
    new: 'bg-[#7B2FF7]',
  };

  return (
    <article className="rounded-[20px] overflow-hidden bg-white shadow-[0_4px_24px_rgba(10,22,40,0.08)] hover:shadow-[0_16px_48px_rgba(10,22,40,0.14)] hover:-translate-y-1.5 transition-all duration-[400ms] cursor-pointer group">
      <div className="relative h-[220px] overflow-hidden">
        <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-[600ms]" loading="lazy" />
        <div className="absolute bottom-0 left-0 right-0 h-[90px] bg-gradient-to-t from-black/45 to-transparent" />
        <span className={`absolute top-3.5 left-3.5 z-[2] px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide text-white ${badgeColors[trip.badge] || ''}`}>
          {trip.badgeText}
        </span>
        <button onClick={(e) => { e.preventDefault(); setLiked(!liked); }} className={`absolute top-3.5 right-3.5 z-[2] w-9 h-9 rounded-full bg-white/85 backdrop-blur-lg border-none text-base cursor-pointer flex items-center justify-center hover:bg-white hover:scale-110 transition-all ${liked ? 'text-[#E63946] text-lg' : ''}`} aria-label="Favoris">
          {liked ? '♥' : '♡'}
        </button>
        <div className="absolute bottom-3.5 right-3.5 z-[2] bg-black/50 backdrop-blur-lg px-2.5 py-1 rounded-full text-[11px] font-bold text-white">{trip.transport}</div>
        <div className="absolute bottom-3.5 left-3.5 z-[2] font-display text-[22px] font-extrabold italic text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">{trip.emotion}</div>
      </div>
      <div className="px-5 pt-4 pb-5">
        <div className="inline-flex items-center gap-1.5 bg-[#FFF0E8] text-[#FF6B35] text-xs font-bold px-3 py-1 rounded-full mb-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[13px] h-[13px]"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {trip.pickup}
        </div>
        <h3 className="font-display text-[19px] font-bold text-[#0A1628] mb-1.5 leading-tight">{trip.title}</h3>
        <div className="flex gap-3.5 text-[12.5px] text-gray-400 mb-3.5">
          <span>📅 {trip.dates}</span><span>{trip.duration}</span>
        </div>
        <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
          <div>
            <small className="text-[11px] text-gray-400 block">à partir de</small>
            <strong className="font-display text-[28px] font-black text-[#0A1628]">{trip.price}<sup className="text-sm font-semibold">€</sup></strong>
          </div>
          <button className="text-white border-none rounded-full px-6 py-2.5 text-[13.5px] font-bold cursor-pointer hover:scale-[1.04] transition-all shadow-[0_4px_16px_rgba(255,107,53,0.25)]" style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8F5E)' }}>
            Réserver
          </button>
        </div>
      </div>
    </article>
  );
}

function TripsSection() {
  const [activeChip, setActiveChip] = useState(0);
  const chips = ['📍 Autour de moi', 'Région', 'Ce mois', '- de 500€', 'Week-end', 'Famille', 'Culture'];

  return (
    <section className="py-11 px-6" id="voyages">
      <div className="max-w-[1360px] mx-auto">
        <div className="flex justify-between items-end mb-2.5 flex-wrap gap-3">
          <h2 className="font-display font-black text-[#0A1628] leading-tight" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
            Voyages <em className="text-[#FF6B35] italic">près de chez vous</em>
          </h2>
          <Link href="/voyages" className="text-[13px] font-bold text-[#0077B6] no-underline flex items-center gap-1.5 px-5 py-2 border-2 border-[#0077B6] rounded-full hover:bg-[#0077B6] hover:text-white transition-all">
            Voir tout →
          </Link>
        </div>
        <p className="text-[15px] text-gray-500 mb-5">Départs confirmés avec ramassage dans votre zone. Réservez en 2 minutes.</p>
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {chips.map((chip, i) => (
            <button key={chip} onClick={() => setActiveChip(i)} className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold border-[1.5px] cursor-pointer transition-all ${i === activeChip ? 'text-white border-transparent shadow-[0_4px_16px_rgba(0,119,182,0.25)]' : 'bg-white text-gray-500 border-gray-100 hover:border-[#0077B6] hover:text-[#0077B6]'}`} style={i === activeChip ? { background: 'linear-gradient(135deg, #0077B6, #00B4D8)' } : {}}>
              {chip}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   EMOTION BANNER
   ============================================ */
function EmotionBanner() {
  return (
    <div className="relative overflow-hidden h-[280px]">
      <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=600&fit=crop&q=80" alt="Route de voyage" className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.6), rgba(0,119,182,0.6))' }} />
      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-display font-black text-white leading-[1.12] mb-2.5" style={{ fontSize: 'clamp(26px, 4vw, 46px)' }}>
          Des souvenirs.<br />Pas de la logistique.
        </h2>
        <p className="text-[17px] text-white/85 max-w-[500px]">
          Garez-vous gratuitement à l&apos;arrêt ou laissez votre voiture au garage. Montez dans le bus et ramenez des étoiles dans les yeux.
        </p>
      </div>
    </div>
  );
}

/* ============================================
   WHY EVENTY
   ============================================ */
const whyCards = [
  { num: 1, color: 'bg-[#FF6B35]', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop', title: 'Un arrêt de ramassage tout près de chez vous', desc: "Nos indépendants placent les arrêts au plus proche. La plupart disposent d'un parking gratuit." },
  { num: 2, color: 'bg-[#0077B6]', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop', title: "Votre voiture reste au garage ou à l'arrêt", desc: "Zéro km inutile, zéro risque de vol sur un parking d'aéroport, zéro usure longue distance." },
  { num: 3, color: 'bg-[#06D6A0]', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop', title: 'Un humain avec vous, pas un chatbot', desc: "Du ramassage au retour, un accompagnateur Eventy est là." },
  { num: 4, color: 'bg-[#E63946]', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', title: 'Tout inclus, zéro surprise sur le prix', desc: "Transport, hôtel, repas, activités — tout dans le prix." },
  { num: 5, color: 'bg-[#7B2FF7]', image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600&h=400&fit=crop', title: 'Le groupe sans la galère logistique', desc: "Rencontres, bonne ambiance, souvenirs partagés. On gère tout, vous profitez." },
  { num: 6, color: 'bg-[#48CAE4]', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop', title: 'Un pro près de chez vous, joignable', desc: "Votre interlocuteur local connaît votre région." },
];

function WhySection() {
  return (
    <section className="py-16 px-6 bg-white" id="pourquoi">
      <div className="max-w-[1360px] mx-auto">
        <h2 className="font-display font-black text-[#0A1628]" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
          Pourquoi <em className="text-[#FF6B35] italic">Eventy Life</em> ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {whyCards.map(card => (
            <div key={card.num} className="rounded-[20px] overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(10,22,40,0.14)] transition-all group cursor-default">
              <div className="h-[200px] overflow-hidden relative">
                <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A1628]/65" />
                <div className={`absolute top-3.5 left-3.5 z-[2] w-9 h-9 rounded-full font-display text-base font-black flex items-center justify-center text-white ${card.color}`}>{card.num}</div>
                <div className="absolute bottom-3.5 left-4 right-4 z-[2] font-display text-[17px] font-bold text-white leading-tight">{card.title}</div>
              </div>
              <div className="px-5 pt-4 pb-5 bg-white border border-gray-50 border-t-0 rounded-b-[20px]">
                <p className="text-[13.5px] text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   VOITURE AU GARAGE
   ============================================ */
function CarSection() {
  const points = [
    { icon: '⛽', color: 'bg-[#FF6B35]/10', title: 'Économisez 600€+ par voyage', desc: 'Carburant + péages : plus de 600€ restent dans votre poche.' },
    { icon: '🅿️', color: 'bg-[#00B4D8]/10', title: 'Zéro frais de parking', desc: "Nos arrêts avec parking gratuit. 120€ économisés vs aéroport." },
    { icon: '🔧', color: 'bg-[#06D6A0]/10', title: 'Valeur de revente préservée', desc: "2 000 km de moins au compteur à la revente." },
    { icon: '😌', color: 'bg-[#7B2FF7]/10', title: 'Vacances dès la première minute', desc: "Montez dans le bus, le voyage commence." },
  ];

  return (
    <section style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0D2844 100%)' }} className="relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
        <div className="relative overflow-hidden h-[320px] lg:h-auto">
          <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=960&h=700&fit=crop&q=80" alt="Belle voiture" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 hidden lg:block" style={{ background: 'linear-gradient(90deg, transparent 50%, #0A1628)' }} />
          <div className="absolute bottom-6 left-6 z-[3] flex gap-2.5 flex-wrap">
            {[{ big: '0 km', sm: 'compteur' }, { big: '0 €', sm: "parking" }, { big: '0', sm: 'risque' }].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[14px] px-4 py-3.5 text-center min-w-[90px]">
                <span className="font-display text-[28px] font-black text-[#FF6B35] block">{s.big}</span>
                <span className="text-[10px] text-white/50 block mt-0.5">{s.sm}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 lg:px-12 py-10 lg:py-14 flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 bg-[#FF6B35]/10 border border-[#FF6B35]/20 px-3.5 py-1 rounded-full text-[11px] font-extrabold text-[#FF6B35] uppercase tracking-wider mb-4 w-fit">
            💎 Argument n°1 de nos clients
          </div>
          <h2 className="font-display font-black text-white leading-[1.15] mb-4" style={{ fontSize: 'clamp(26px, 3.2vw, 40px)' }}>
            Votre voiture est <em className="italic text-[#FF8F5E]">précieuse</em>.<br />Laissez-la au garage ou à l&apos;arrêt.
          </h2>
          <p className="text-[15px] text-white/60 leading-relaxed mb-8">Plus besoin de traverser la France au volant. Zéro fatigue, zéro risque.</p>
          <div className="grid gap-5">
            {points.map((p, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center text-xl ${p.color}`}>{p.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">{p.title}</h4>
                  <p className="text-[12.5px] text-white/50 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   COMMENT ÇA MARCHE
   ============================================ */
const steps = [
  { num: 1, borderColor: '#FF6B35', numBg: 'bg-[#FF6B35]', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=220&h=220&fit=crop', title: 'Entrez votre ville', desc: "On affiche les voyages triés par distance." },
  { num: 2, borderColor: '#0077B6', numBg: 'bg-[#0077B6]', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=220&h=220&fit=crop', title: 'Réservez en 2 min', desc: "Chambre, voyageurs, paiement sécurisé." },
  { num: 3, borderColor: '#06D6A0', numBg: 'bg-[#06D6A0]', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=220&h=220&fit=crop', title: "Le bus passe", desc: "Garez-vous gratuitement, l'accompagnateur vous accueille." },
  { num: 4, borderColor: '#7B2FF7', numBg: 'bg-[#7B2FF7]', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=220&h=220&fit=crop', title: "Profitez !", desc: "Hôtel, repas, visites : tout est prêt." },
];

function HowSection() {
  return (
    <section className="py-16 px-6 bg-[#FEFCF3]" id="comment">
      <div className="max-w-[1360px] mx-auto">
        <div className="text-center mb-9">
          <h2 className="font-display font-black text-[#0A1628]" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
            Comment <em className="text-[#FF6B35] italic">ça marche</em> ?
          </h2>
          <p className="text-[15px] text-gray-500 mt-1.5">4 étapes, 2 minutes. Même sans compte.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 relative">
          <div className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-[3px] rounded z-0" style={{ background: 'linear-gradient(90deg, #FF6B35, #0077B6, #06D6A0, #7B2FF7)' }} />
          {steps.map(step => (
            <div key={step.num} className="text-center relative z-[1]">
              <div className="w-[104px] h-[104px] mx-auto mb-4 rounded-full overflow-hidden relative" style={{ border: `3px solid ${step.borderColor}`, boxShadow: `0 4px 20px ${step.borderColor}33` }}>
                <img src={step.image} alt={step.title} className="w-full h-full object-cover" loading="lazy" />
                <div className={`absolute bottom-0 right-0 w-[30px] h-[30px] rounded-full font-display text-sm font-black text-white flex items-center justify-center border-[3px] border-white ${step.numBg}`}>{step.num}</div>
              </div>
              <h4 className="text-[15px] font-bold text-[#0A1628] mb-1.5">{step.title}</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   TESTIMONIALS
   ============================================ */
const testimonials = [
  { bg: 'bg-[#FFF0E8] border-[#FF6B35]/10', starColor: 'text-[#FF6B35]', quoteColor: 'text-[#FF6B35]', text: "Le bus est passé à 5 min de la maison. On a dormi pendant le trajet, et à l'arrivée tout était prêt. Ma voiture n'a pas bougé !", name: 'Marie C.', trip: 'Andalousie — Mars 2025', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=88&h=88&fit=crop&crop=face' },
  { bg: 'bg-[#E8F7FC] border-[#0077B6]/10', starColor: 'text-[#0077B6]', quoteColor: 'text-[#0077B6]', text: "J'avais peur du groupe. L'accompagnateur était top, l'ambiance géniale. Ne pas conduire 8 jours, c'est un luxe.", name: 'Karim A.', trip: 'Marrakech — Février 2025', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&h=88&fit=crop&crop=face' },
  { bg: 'bg-[#E0FFF5] border-[#06D6A0]/10', starColor: 'text-[#06D6A0]', quoteColor: 'text-[#06D6A0]', text: "Parking + essence + péages + stress… Eventy revient MOINS cher et je n'ai rien eu à gérer !", name: 'Sophie B.', trip: 'Rome & Florence — Avril 2025', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=88&h=88&fit=crop&crop=face' },
];

function TestimonialsSection() {
  return (
    <section className="py-16 px-6 bg-white" id="avis">
      <div className="max-w-[1360px] mx-auto">
        <h2 className="font-display font-black text-[#0A1628]" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
          Ils sont <em className="text-[#FF6B35] italic">partis avec nous</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {testimonials.map((t, i) => (
            <div key={i} className={`px-6 py-7 rounded-[20px] relative border hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(10,22,40,0.08)] transition-all ${t.bg}`}>
              <div className={`font-display text-[56px] leading-none opacity-15 absolute top-3.5 right-5 ${t.quoteColor}`}>&ldquo;</div>
              <div className={`text-[15px] mb-3.5 tracking-wider ${t.starColor}`}>★★★★★</div>
              <p className="text-[14.5px] leading-relaxed text-[#1B2940] italic mb-4">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] rounded-full overflow-hidden flex-shrink-0">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <div className="text-[13.5px] font-bold text-[#0A1628]">{t.name}</div>
                  <div className="text-[11.5px] text-gray-400">{t.trip}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   CTA + FOOTER
   ============================================ */
function CtaSection() {
  return (
    <section className="relative h-[400px] overflow-hidden flex items-center justify-center">
      <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=700&fit=crop&q=80" alt="Destination" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.75), rgba(0,119,182,0.75))' }} />
      <div className="relative z-[2] text-center max-w-[600px] px-6">
        <h2 className="font-display font-black text-white mb-3 leading-[1.15]" style={{ fontSize: 'clamp(26px, 4vw, 44px)' }}>Prêt à partir sans stress ?</h2>
        <p className="text-[17px] text-white/85 mb-7">Trouvez le voyage qui part près de chez vous. 2 minutes, c&apos;est réservé.</p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-white text-[#FF6B35] border-none rounded-full px-11 py-4 text-base font-extrabold cursor-pointer hover:scale-[1.04] transition-all shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
          Trouver mon voyage →
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white/50 pt-12 pb-6 px-6">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2.5fr_1fr_1fr_1fr] gap-10 mb-8">
          <div>
            <Link href="/" className="font-display text-xl font-extrabold text-white no-underline inline-block mb-2.5">Eventy<span className="text-[#FF6B35]">Life</span></Link>
            <p className="text-[12.5px] leading-relaxed text-white/35">Voyages de groupe accompagnés avec arrêt de ramassage près de chez vous, parking gratuit.<br />Immatriculé Atout France · RC Pro · Garantie financière.</p>
          </div>
          <div>
            <h5 className="text-white text-[11px] font-extrabold uppercase tracking-[1.5px] mb-3.5">Voyages</h5>
            {['Tous', 'Week-ends', 'Famille', 'Culture'].map(l => (
              <Link key={l} href="/voyages" className="block text-[13px] text-white/40 no-underline py-0.5 hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div>
            <h5 className="text-white text-[11px] font-extrabold uppercase tracking-[1.5px] mb-3.5">Eventy</h5>
            {[['Qui sommes-nous', '/a-propos'], ['Devenir pro', '/pro'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={label} href={href} className="block text-[13px] text-white/40 no-underline py-0.5 hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
          <div>
            <h5 className="text-white text-[11px] font-extrabold uppercase tracking-[1.5px] mb-3.5">Aide</h5>
            {[['FAQ', '/faq'], ['Support', '/contact'], ['Annulation', '/cgv']].map(([label, href]) => (
              <Link key={label} href={href} className="block text-[13px] text-white/40 no-underline py-0.5 hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div className="border-t border-white/[0.07] pt-4 flex justify-between items-center flex-wrap gap-3 text-[11px]">
          <span>© 2025 Eventy Life — Atout France</span>
          <div className="flex gap-4">
            {[['Mentions légales', '/mentions-legales'], ['CGV', '/cgv'], ['Confidentialité', '/confidentialite'], ['Cookies', '/cookies']].map(([label, href]) => (
              <Link key={label} href={href} className="text-white/30 no-underline hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================
   PAGE PRINCIPALE
   ============================================ */
export default function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('vis'), index * 70);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -20px' }
    );
    document.querySelectorAll('.rv').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
      <TrustPills />
      <TripsSection />
      <EmotionBanner />
      <WhySection />
      <CarSection />
      <HowSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </>
  );
}
