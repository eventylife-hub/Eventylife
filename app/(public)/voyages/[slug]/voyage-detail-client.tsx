'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';
/* ════════════════════════════════════════════
   MOCK DATA — Îles Éoliennes & Baroque Sicilien
   ════════════════════════════════════════════ */
const tripData = {
  slug: 'iles-eoliennes-baroque-sicilien',
  title: 'Îles Éoliennes & Baroque Sicilien',
  destination: 'Sicile, Italie',
  startDate: '14 juin 2025',
  endDate: '21 juin 2025',
  duration: '8 jours / 7 nuits',
  transport: 'Bus porte-à-porte + Vol',
  basePrice: 1490,
  totalPlaces: 22,
  bookedPlaces: 18,

  pickupPoints: [
    { city: 'Bordeaux — Gare Saint-Jean', distance: '22 km', time: '05h30', address: 'Place Charles Dumas, 33000 Bordeaux' },
    { city: 'Mérignac — Aéroport (P4)', distance: '28 km', time: '05h15', address: 'Parking P4, Terminal Billi' },
    { city: 'Arcachon — Gare', distance: '58 km', time: '04h50', address: 'Parvis de la gare, 33120 Arcachon' },
    { city: 'Libourne — Place Abel Surchamp', distance: '35 km', time: '05h00', address: 'Place Abel Surchamp, 33500 Libourne' },
  ],

  onSiteShuttles: {
    afternoon: {
      label: 'Après-midi',
      icon: '☀️',
      stops: [
        { num: 1, name: 'Hôtel Centrale Palace', note: '14h00 · Départ' },
        { num: 2, name: 'Marché Ballarò', note: '14h25 · Visite libre 45min' },
        { num: 3, name: 'Piazza Pretoria', note: '15h30 · Fontaine de la honte' },
        { num: 4, name: 'Marché Vucciria', note: '16h15 · Rue Argenteria' },
      ]
    },
    evening: {
      label: 'Soirée',
      icon: '🌙',
      stops: [
        { num: 1, name: 'Bar Ambasciatori', note: '19h30 · Accueil privilégié' },
        { num: 2, name: 'Hôtel Centrale Palace', note: '22h30 · Retour' },
      ]
    }
  },

  program: [
    {
      day: 'J1', date: 'Samedi 14 juin', title: 'Départ de France → Palerme',
      slots: [
        { icon: '🌅', label: 'Matin', text: 'Ramassage porte-à-porte (05h30–08h00) · Route vers l\'aéroport' },
        { icon: '✈️', label: 'Midi', text: 'Vol Bordeaux → Palerme · Arrivée 13h40' },
        { icon: '🚌', label: 'Après-midi', text: 'Transfert hôtel · Installation' },
        { icon: '🌙', label: 'Soir', text: 'Dîner de bienvenue au restaurant partenaire · Présentation du séjour par Marie-Claire' },
      ]
    },
    {
      day: 'J2', date: 'Dimanche 15 juin', title: 'Palerme — Capitale Baroque',
      slots: [
        { icon: '☀️', label: 'Matin', text: 'Petit-déjeuner buffet · Visite guidée Cathédrale + Palazzo dei Normanni' },
        { icon: '🍽️', label: 'Midi', text: 'Déjeuner inclus — Trattoria Nonna Rosa (gastronomie sicilienne)' },
        { icon: '🏛️', label: 'Après-midi', text: 'Tournée bus sur place · Marchés historiques (Ballarò, Vucciria) · 4 arrêts' },
        { icon: '🍸', label: 'Soir', text: 'Accueil privilégié au Bar Ambasciatori (terrasse panoramique)' },
      ]
    },
    {
      day: 'J3–J4', date: 'Lun.–Mar.', title: 'Îles Éoliennes — Vulcano & Lipari',
      slots: [
        { icon: '⛵', label: 'Matin J3', text: 'Ferry Milazzo → Île de Vulcano · Randonnée cratère volcanique (activité incluse)' },
        { icon: '🌋', label: 'Après-midi J3', text: 'Bains de boue thermaux · Plage de sable noir · Snorkeling' },
        { icon: '🏖️', label: 'J4', text: 'Île de Lipari · Citadelle + Musée · Plages de Canneto · Dîner de poissons' },
      ]
    },
    {
      day: 'J5–J6', date: 'Mer.–Jeu.', title: 'Syracuse & Agrigente — Patrimoine UNESCO',
      slots: [
        { icon: '🏛️', label: 'J5', text: 'Syracuse · Ortygie · Théâtre grec · Oreille de Dionysios' },
        { icon: '🌿', label: 'J6', text: 'Valle dei Templi d\'Agrigente (UNESCO) · Coucher de soleil sur les temples' },
      ]
    },
    {
      day: 'J7', date: 'Vendredi 20 juin', title: 'Détente & Marché Final',
      slots: [
        { icon: '🛍️', label: 'Matin', text: 'Marché libre · Shopping local' },
        { icon: '🎉', label: 'Soir', text: 'Dîner de clôture · Soirée avec les guides locaux' },
      ]
    },
    {
      day: 'J8', date: 'Samedi 21 juin', title: 'Retour en France',
      slots: [
        { icon: '✈️', label: 'Matin', text: 'Vol retour Palerme → Bordeaux · Arrivée 14h20' },
        { icon: '🏠', label: 'Après-midi', text: 'Dépose porte-à-porte sur les mêmes arrêts' },
      ]
    },
  ],

  included: [
    'Transport aller-retour porte-à-porte (bus)',
    'Vols inclus (Bordeaux ↔ Palerme)',
    '7 nuits hôtel 4★ (chambre double)',
    'Petit-déjeuner buffet chaque matin',
    '6 dîners (sauf J7 libre)',
    'Excursion Îles Éoliennes (ferry)',
    'Randonnée Vulcano (guide local)',
    'Accueil bar partenaire (J2 soir)',
    'Accompagnement indépendant tout le séjour',
    'Navettes bus sur place incluses',
  ],
  notIncluded: [
    'Déjeuners libres (J1–J8)',
    'Boissons hors repas inclus',
    'Pourboires guides locaux',
    'Entrées musées individuelles',
    'Assurance annulation renforcée',
    'Taxes de séjour locales (~2€/nuit)',
    'Bagages en soute (à réserver)',
    'Activités optionnelles (spa, cours de cuisine)',
  ],

  hotel: {
    name: 'Hôtel Centrale Palace',
    stars: 4,
    address: 'Corso Vittorio Emanuele 327, Palerme',
    description: 'En plein cœur historique',
    amenities: ['🌐 WiFi', '🏊 Piscine', '❄️ Clim.', '🍳 PDJ buffet', '🛎️ Conciergerie'],
  },

  hra: [
    { icon: '🍽️', type: 'resto', name: 'Trattoria Nonna Rosa', detail: 'Cuisine sicilienne traditionnelle · Via dei Cassari, Palerme · 19h30–22h00', badge: '✓ 6 dîners inclus', badgeType: 'incl' },
    { icon: '🍸', type: 'bar', name: 'Bar Ambasciatori', detail: 'Bar lounge · Terrasse panoramique · Via della Libertà · 18h00–01h00', badge: '🍸 Accueil privilégié Eventy', badgeType: 'avail' },
    { icon: '🌋', type: 'act', name: 'Randonnée Cratère Vulcano', detail: 'Durée : 3h · RDV : Port de Vulcano (9h00) · Guide local FR/IT', badge: '✓ Inclus dans le forfait', badgeType: 'incl' },
  ],

  occurrences: [
    { dates: '14–21 juin 2025', fill: 82, booked: 18, total: 22, status: 'ok', price: '1 490', label: '✓ Départ confirmé' },
    { dates: '12–19 juil. 2025', fill: 91, booked: 20, total: 22, status: 'soon', price: '1 590', label: '⏳ Bientôt complet' },
    { dates: '13–20 sept. 2025', fill: 45, booked: 10, total: 22, status: 'ok', price: '1 490', label: '✓ Disponible' },
    { dates: '8–15 août 2025', fill: 100, booked: 22, total: 22, status: 'full', price: '1 690', label: 'Complet' },
  ],

  team: [
    { role: 'Créateur du voyage', name: 'Marie-Claire D.', bio: 'Passionnée de la Sicile depuis 12 ans, elle a organisé ce circuit unique avec des accès exclusifs négociés directement.', type: 'creator' },
    { role: 'Indépendant terrain · Accompagnateur', name: 'Stefano B.', bio: 'Guide sicilien bilingue FR/IT · Assure votre présence sur place du J1 au J8 · Gère toute urgence.', type: 'inde' },
  ],
};

/* ════════════════════════════════════════════
   TOPBAR
   ════════════════════════════════════════════ */
function Topbar() {
  const [solid, setSolid] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const h = () => setSolid(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: tripData.title,
      text: `Découvrez "${tripData.title}" — ${tripData.destination} avec Eventy Life`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav aria-label="Navigation détail voyage" style={{
      background: solid ? 'white' : 'var(--navy, #1A1A2E)',
      height: 52, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: solid ? '0 2px 10px rgba(0,0,0,.08)' : '0 2px 10px rgba(0,0,0,.3)',
      transition: 'all .3s'
    }}>
      <Link href="/" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: solid ? 'var(--navy, #1A1A2E)' : 'var(--cream, #FAF7F2)', textDecoration: 'none', fontWeight: 700 }}>
        Eventy<span style={{ color: 'var(--gold, #D4A853)' }}>.</span>Life
      </Link>
      <div style={{ fontSize: 12.5, color: solid ? '#6B7280' : 'rgba(255,255,255,.5)', display: 'flex', gap: 6, alignItems: 'center' }}>
        <Link href="/voyages" style={{ color: solid ? '#6B7280' : 'rgba(255,255,255,.65)', textDecoration: 'none' }}>Voyages</Link>
        <span>›</span>
        <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tripData.title}</span>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button type="button" aria-label="Partager ce voyage" onClick={handleShare} style={{ background: 'transparent', border: `1.5px solid ${solid ? '#E5E0D8' : 'rgba(255,255,255,.3)'}`, color: solid ? 'var(--navy, #1A1A2E)' : 'white', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>
          {copied ? '✅ Copié !' : '📤 Partager'}
        </button>
      </div>
    </nav>
  );
}

/* ════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════ */
function HeroSection({ paxCount, setPaxCount }: { paxCount: number; setPaxCount: (n: number) => void }) {
  const available = tripData.totalPlaces - tripData.bookedPlaces;
  return (
    <div style={{
      position: 'relative', height: 420, overflow: 'hidden',
      background: 'linear-gradient(160deg,#1a3a5c 0%,#0d2240 40%,#1a2e50 100%)'
    }}>
      {/* Photo grid */}
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3 }}>
        <div style={{ gridColumn: '1/3', gridRow: '1/3', background: 'linear-gradient(135deg,#1a3a5c,#2d6a9a,#4a8ab5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>🏖️</div>
        <div style={{ background: 'linear-gradient(135deg,#2d4a1e,#4a7c38)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50 }}>🌋</div>
        <div style={{ background: 'linear-gradient(135deg,#5c3d1a,#8a5c2d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50 }}>🏛️</div>
        <div style={{ background: 'linear-gradient(135deg,#1a2d5c,#3a5a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50 }}>🚢</div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 30%,rgba(26,26,46,.85) 100%)' }} />

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 32px 24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <span style={{ background: '#DCFCE7', color: '#166534', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 12 }}>✓ Départ confirmé</span>
            <span style={{ background: '#FFF8E1', color: '#7B4900', border: '1.5px solid #FFB300', fontSize: 11.5, fontWeight: 700, padding: '4px 12px', borderRadius: 12 }}>⭐ Coup de cœur Eventy</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px,4vw,38px)', color: 'white', lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,.5)', marginBottom: 6 }}>
            Îles Éoliennes &amp;<br />Baroque Sicilien
          </h1>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.75)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span>📍 Sicile · Italie</span>
            <span>📅 14–21 juin 2025</span>
            <span>🚌 Bus porte-à-porte</span>
            <span>👥 {tripData.bookedPlaces}/{tripData.totalPlaces} places</span>
          </div>
        </div>

        {/* Price box */}
        <div style={{ background: 'rgba(26,26,46,.9)', border: '1.5px solid rgba(255,255,255,.2)', backdropFilter: 'blur(10px)', borderRadius: 14, padding: '18px 24px', textAlign: 'right', minWidth: 180 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 2 }}>À partir de</div>
          <div id="hero-price" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--gold, #D4A853)', fontWeight: 700 }}>
            {(tripData.basePrice * paxCount).toLocaleString('fr-FR')} €
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>
            {paxCount > 1 ? `${paxCount} voyageurs · chambre double` : '/ pers. · chambre double · 8 jours'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>Voyageurs :</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button type="button" aria-label="Retirer un voyageur" onClick={() => setPaxCount(Math.max(1, paxCount - 1))} style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', color: 'white', width: 26, height: 26, borderRadius: 6, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span aria-live="polite" style={{ fontSize: 15, fontWeight: 700, color: 'white', minWidth: 20, textAlign: 'center' }}>{paxCount}</span>
              <button type="button" aria-label="Ajouter un voyageur" onClick={() => setPaxCount(Math.min(available, paxCount + 1))} style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', color: 'white', width: 26, height: 26, borderRadius: 6, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          </div>
          <button type="button" aria-label={`Réserver ${tripData.title} pour ${paxCount} voyageur${paxCount > 1 ? 's' : ''}`} style={{ display: 'block', background: 'var(--terra, #C75B39)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 12, width: '100%' }}>
            Réserver ce voyage →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   STICKY CTA
   ════════════════════════════════════════════ */
function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const available = tripData.totalPlaces - tripData.bookedPlaces;
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1.5px solid #E5E0D8',
      padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0,0,0,.1)', transform: visible ? 'translateY(0)' : 'translateY(100%)', transition: 'transform .3s'
    }}>
      <div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 700, color: 'var(--navy, #1A1A2E)' }}>
          {tripData.basePrice.toLocaleString('fr-FR')} € <small style={{ fontSize: 12, fontWeight: 400, color: '#6B7280' }}>/ pers.</small>
        </div>
        <div style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>✓ Départ confirmé · {available} places restantes</div>
      </div>
      <button type="button" aria-label={`Réserver ${tripData.title}`} style={{ background: 'var(--terra, #C75B39)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
        Réserver →
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════
   SECTION NAV (anchors)
   ════════════════════════════════════════════ */
function SectionNav() {
  const items = [
    { id: 'ramassage', label: '🚌 Ramassage' },
    { id: 'programme', label: '📅 Programme' },
    { id: 'hebergement', label: '🏨 Hôtel' },
    { id: 'equipe', label: '👤 Équipe' },
    { id: 'conditions', label: '📋 Conditions' },
  ];
  const [active, setActive] = useState('ramassage');

  return (
    <nav aria-label="Sections du voyage" style={{
      background: 'white', border: '1.5px solid #E5E0D8', borderRadius: 12, marginBottom: 28,
      overflow: 'hidden', display: 'flex'
    }}>
      {items.map((item, i) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={() => setActive(item.id)}
          aria-current={active === item.id ? 'true' : undefined}
          style={{
            flex: 1, background: active === item.id ? 'var(--navy, #1A1A2E)' : 'transparent', border: 'none',
            borderRight: i < items.length - 1 ? '1px solid #E5E0D8' : 'none',
            padding: '12px 8px', fontSize: 12.5, fontWeight: 600,
            color: active === item.id ? 'white' : '#6B7280',
            cursor: 'pointer', textAlign: 'center', textDecoration: 'none', transition: 'all .15s'
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

/* ════════════════════════════════════════════
   SECTION WRAPPER
   ════════════════════════════════════════════ */
function Section({ id, icon, title, children }: { id: string; icon: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} style={{ background: 'white', border: '1.5px solid #E5E0D8', borderRadius: 14, padding: 24, marginBottom: 20 }}>
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: 'var(--navy, #1A1A2E)',
        marginBottom: 16, paddingBottom: 12, borderBottom: '1.5px solid #E5E0D8',
        display: 'flex', alignItems: 'center', gap: 8
      }}>
        <span style={{ fontSize: 20 }}>{icon}</span> {title}
      </div>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════
   RAMASSAGE
   ════════════════════════════════════════════ */
function RamassageSection() {
  const [selected, setSelected] = useState(0);
  const p = tripData.pickupPoints[selected];

  return (
    <Section id="ramassage" icon="🚌" title="Point de ramassage le plus proche">
      {/* Highlight */}
      <div style={{ background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border: '1.5px solid #86EFAC', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: '#166534', marginBottom: 4 }}>📍 Sélectionné automatiquement — le plus proche de vous</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy, #1A1A2E)', marginBottom: 2 }}>{p.city}</div>
        <div style={{ fontSize: 13, color: '#6B7280' }}>{p.address}</div>
        <div style={{ fontSize: 13, color: 'var(--navy, #1A1A2E)', fontWeight: 600, marginTop: 6 }}>⏰ Départ : <strong>Samedi 14 juin · {p.time}</strong></div>
        <div style={{ display: 'inline-block', background: '#DCFCE7', color: '#166534', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 8, marginTop: 4 }}>✓ Horaires confirmés</div>
      </div>

      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 10 }}>Autres arrêts disponibles sur votre parcours :</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tripData.pickupPoints.map((point, i) => (
          <button type="button" key={i} onClick={() => setSelected(i)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            border: `1.5px solid ${selected === i ? 'var(--terra, #C75B39)' : '#E5E0D8'}`,
            borderRadius: 10, cursor: 'pointer', transition: 'all .15s',
            background: selected === i ? '#FFF5F2' : 'white', textAlign: 'left', width: '100%'
          }}>
            <div style={{ width: 10, height: 10, background: selected === i ? 'var(--terra, #C75B39)' : '#6B7280', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--navy, #1A1A2E)' }}>{point.city}</div>
              <div style={{ fontSize: 11.5, color: '#6B7280' }}>{point.distance} de vous · {point.time}</div>
            </div>
            {selected === i && <span style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>✓ Sélectionné</span>}
          </button>
        ))}
      </div>

      {/* Map */}
      <div style={{ background: 'linear-gradient(135deg,#E0F2FE,#BAE6FD)', borderRadius: 10, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: '#0369A1', marginTop: 12, border: '1.5px solid #BAE6FD', position: 'relative' }}>
        🗺️
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'white', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#1e40af', cursor: 'pointer' }}>
          Ouvrir dans Google Maps →
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
        À faire autour : Cafés ouverts tôt le matin · Parking sécurisé à 5 min · Consigne bagages
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════
   PROGRAMME
   ════════════════════════════════════════════ */
function ProgrammeSection() {
  return (
    <Section id="programme" icon="📅" title="Programme jour par jour">
      {/* Tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <span style={{ background: '#EFF6FF', color: '#1e40af', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 10 }}>⭐ EXCLUSIF EVENTY</span>
        <span style={{ background: '#FFF3E0', color: '#E65100', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 10 }}>🌋 Îles Éoliennes</span>
        <span style={{ background: '#DCFCE7', color: '#166534', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 10 }}>🏛️ Baroque sicilien</span>
        <span style={{ background: '#F3E5F5', color: '#7B1FA2', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 10 }}>🔮 INSOLITE</span>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        <div style={{ position: 'absolute', left: 8, top: 8, bottom: 8, width: 2, background: '#E5E0D8' }} />
        {tripData.program.map((day, di) => (
          <div key={di} style={{ position: 'relative', marginBottom: 20 }}>
            <div style={{ position: 'absolute', left: -24, top: 3, width: 14, height: 14, background: 'var(--terra, #C75B39)', borderRadius: '50%', border: '2px solid white', boxShadow: `0 0 0 2px var(--terra, #C75B39)` }} />
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--terra, #C75B39)', marginBottom: 4 }}>{day.day} — {day.date}</div>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--navy, #1A1A2E)', marginBottom: 6 }}>{day.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {day.slots.map((slot, si) => (
                <div key={si} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#6B7280' }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{slot.icon}</span>
                  <span><strong style={{ color: 'var(--navy, #1A1A2E)', fontWeight: 600 }}>{slot.label} :</strong> {slot.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tournées sur place */}
      <div style={{ background: 'var(--cream, #FAF7F2)', borderRadius: 12, padding: 16, marginTop: 16 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy, #1A1A2E)', marginBottom: 12 }}>🚌 Tournées bus sur place (Palerme)</div>

        {/* Après-midi */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: '#6B7280', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            ☀️ Après-midi · 4 arrêts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {tripData.onSiteShuttles.afternoon.stops.map((stop, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 12px', background: 'var(--cream, #FAF7F2)', borderRadius: 8, fontSize: 13, border: '1px solid #E5E0D8' }}>
                <div style={{ width: 22, height: 22, background: 'var(--navy, #1A1A2E)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{stop.num}</div>
                <div style={{ flex: 1, fontWeight: 600, color: 'var(--navy, #1A1A2E)' }}>{stop.name}</div>
                <div style={{ fontSize: 11.5, color: '#6B7280' }}>{stop.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Soirée */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: '#6B7280', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            🌙 Soir · 2 arrêts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {tripData.onSiteShuttles.evening.stops.map((stop, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 12px', background: 'var(--cream, #FAF7F2)', borderRadius: 8, fontSize: 13, border: '1px solid #E5E0D8' }}>
                <div style={{ width: 22, height: 22, background: 'var(--navy, #1A1A2E)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{stop.num}</div>
                <div style={{ flex: 1, fontWeight: 600, color: 'var(--navy, #1A1A2E)' }}>{stop.name}</div>
                <div style={{ fontSize: 11.5, color: '#6B7280' }}>{stop.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════
   INCLUS / NON INCLUS
   ════════════════════════════════════════════ */
function InclusSection() {
  return (
    <Section id="inclus" icon="✅" title="Inclus / Non inclus">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        <div style={{ padding: '4px 0' }}>
          <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: '#166534', marginBottom: 10 }}>✓ Inclus</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {tripData.included.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', fontSize: 13, color: 'var(--navy, #1A1A2E)' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0, marginTop: 1, background: '#DCFCE7', color: '#166534' }}>✓</div>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '4px 0 4px 20px', borderLeft: '1.5px solid #E5E0D8' }}>
          <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--terra, #EF4444)', marginBottom: 10 }}>✗ Non inclus</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {tripData.notIncluded.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', fontSize: 13, color: 'var(--navy, #1A1A2E)' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0, marginTop: 1, background: '#FEE2E2', color: 'var(--terra, #EF4444)' }}>✗</div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════
   HÉBERGEMENT + HRA
   ════════════════════════════════════════════ */
function HebergementSection() {
  const hraTypeBg: Record<string, string> = { resto: '#FFF3E0', bar: '#F3E5F5', act: '#E8F5E9' };

  return (
    <Section id="hebergement" icon="🏨" title="Hébergement & Repas">
      {/* Hotel */}
      <div style={{ display: 'flex', gap: 14, padding: 14, border: '1.5px solid #E5E0D8', borderRadius: 12, marginBottom: 16 }}>
        <div style={{ width: 90, height: 70, background: 'linear-gradient(135deg,#1e3a5c,#3b6a9a)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🏨</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy, #1A1A2E)', marginBottom: 3 }}>{tripData.hotel.name} {'★'.repeat(tripData.hotel.stars)}</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{tripData.hotel.address} · {tripData.hotel.description}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            {tripData.hotel.amenities.map((a, i) => (
              <span key={i} style={{ background: '#EFF6FF', color: '#1e40af', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 8 }}>{a}</span>
            ))}
          </div>
        </div>
      </div>

      {/* HRA rows */}
      {tripData.hra.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: 12, border: '1.5px solid #E5E0D8', borderRadius: 10, marginBottom: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, background: hraTypeBg[item.type] || '#f0f0f0' }}>
            {item.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy, #1A1A2E)' }}>{item.name}</div>
            <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>{item.detail}</div>
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 8, marginTop: 5,
              background: item.badgeType === 'incl' ? '#166534' : '#FEF3C7',
              color: item.badgeType === 'incl' ? '#166534' : '#92400e',
            }}>{item.badge}</span>
          </div>
        </div>
      ))}
    </Section>
  );
}

/* ════════════════════════════════════════════
   OCCURRENCES — Dates de départ
   ════════════════════════════════════════════ */
function OccurrencesSection() {
  const [selectedOcc, setSelectedOcc] = useState(0);

  const badgeColors: Record<string, { bg: string; color: string }> = {
    ok: { bg: '#166534', color: '#166534' },
    soon: { bg: '#FEF3C7', color: '#92400e' },
    full: { bg: '#FEE2E2', color: '#991B1B' },
  };

  return (
    <Section id="departs" icon="📆" title="Choisir votre date de départ">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tripData.occurrences.map((occ, i) => {
          const bc = badgeColors[occ.status] || badgeColors.ok;
          const isFull = occ.status === 'full';
          return (
            <button type="button"
              key={i}
              onClick={() => !isFull && setSelectedOcc(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                border: `1.5px solid ${selectedOcc === i && !isFull ? 'var(--terra, #C75B39)' : '#E5E0D8'}`,
                borderRadius: 10, cursor: isFull ? 'default' : 'pointer', transition: 'all .15s',
                background: selectedOcc === i && !isFull ? '#FFF5F2' : 'white',
                opacity: isFull ? 0.6 : 1, textAlign: 'left', width: '100%'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy, #1A1A2E)' }}>{occ.dates}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Départ Bordeaux · Retour Bordeaux</div>
                <div style={{ height: 5, background: '#E5E7EB', borderRadius: 3, marginTop: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: isFull ? 'var(--terra, #EF4444)' : 'var(--terra, #C75B39)', borderRadius: 3, width: `${occ.fill}%`, transition: 'width .4s' }} />
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12, color: '#6B7280' }}>
                <strong style={{ display: 'block', fontSize: 14, color: 'var(--navy, #1A1A2E)' }}>{occ.booked} / {occ.total}</strong>places
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10, whiteSpace: 'nowrap', background: bc.bg, color: bc.color }}>
                {occ.label}
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 10 }}>
        Départ confirmé = nombre minimum de voyageurs atteint · Prix par personne en chambre double
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════
   ÉQUIPE HUMAINE
   ════════════════════════════════════════════ */
function EquipeSection() {
  const avatarBg: Record<string, string> = {
    creator: 'linear-gradient(135deg,#1A1A2E,#3a5a9a)',
    inde: 'linear-gradient(135deg,#2d6a3a,#4a9c5c)',
  };
  const avatarEmoji: Record<string, string> = { creator: '🧭', inde: '🎒' };

  return (
    <Section id="equipe" icon="👤" title="Ton équipe sur ce voyage">
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {tripData.team.map((m, i) => (
          <div key={i} style={{ background: 'var(--cream, #FAF7F2)', border: '1.5px solid #E5E0D8', borderRadius: 12, padding: 14, flex: '1 1 250px' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 10, background: avatarBg[m.type] }}>
              {avatarEmoji[m.type]}
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: '#6B7280', marginBottom: 2 }}>{m.role}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy, #1A1A2E)', marginBottom: 2 }}>{m.name}</div>
            <div style={{ fontSize: 12.5, color: '#6B7280', marginBottom: 10 }}>{m.bio}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" aria-label={`Envoyer un message à ${m.name}`} style={{ flex: 1, border: '1.5px solid #E5E0D8', background: 'white', borderRadius: 8, padding: '7px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--navy, #1A1A2E)', textAlign: 'center' }}>💬 Message</button>
              <button type="button" aria-label={`Appeler ${m.name}`} style={{ flex: 1, border: '1.5px solid #E5E0D8', background: 'white', borderRadius: 8, padding: '7px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--navy, #1A1A2E)', textAlign: 'center' }}>📞 Appeler</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic', marginTop: 12, paddingTop: 12, borderTop: '1.5px solid #E5E0D8' }}>
        Ils suivent la préparation du voyage et gèrent le séjour sur place. Vous pouvez les contacter à tout moment avant, pendant et après le voyage.
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button type="button" aria-label="Rejoindre le groupe Facebook du voyage" style={{ flex: 1, background: 'var(--cream, #FAF7F2)', border: '1.5px solid #E5E0D8', borderRadius: 8, padding: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center', color: 'var(--navy, #1A1A2E)' }}>📘 Facebook</button>
        <button type="button" aria-label="Rejoindre le groupe WhatsApp du voyage" style={{ flex: 1, background: 'var(--cream, #FAF7F2)', border: '1.5px solid #E5E0D8', borderRadius: 8, padding: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center', color: 'var(--navy, #1A1A2E)' }}>💬 WhatsApp</button>
        <button type="button" aria-label="Copier le lien du voyage" style={{ flex: 1, background: 'var(--cream, #FAF7F2)', border: '1.5px solid #E5E0D8', borderRadius: 8, padding: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center', color: 'var(--navy, #1A1A2E)' }}>🔗 Copier le lien</button>
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════
   CONDITIONS
   ════════════════════════════════════════════ */
function ConditionsSection() {
  return (
    <Section id="conditions" icon="📋" title="Conditions & Informations légales">
      <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7 }}>
        <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--navy, #1A1A2E)' }}>Annulation :</strong> Selon barème Eventy Life. Annulation voyage Eventy → avoir crédit 100% valable 18 mois.</p>
        <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--navy, #1A1A2E)' }}>Paiement :</strong> Intégral ou acompte de 30% selon la date de départ. Solde dû J-60. Paiement sécurisé Stripe.</p>
        <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--navy, #1A1A2E)' }}>Documents voyageurs :</strong> Passeport ou CNI valide obligatoire. À fournir au minimum J-14 avant départ.</p>
        <p style={{ marginBottom: 10 }}><strong style={{ color: 'var(--navy, #1A1A2E)' }}>Assurance :</strong> Assurance de base incluse. Assurance renforcée annulation/rapatriement disponible en option (+89 €/pers).</p>
        <p><strong style={{ color: 'var(--navy, #1A1A2E)' }}>Transport :</strong> Bus porte-à-porte + vols inclus. Horaires confirmés J-7 avant départ.</p>
      </div>
      <div style={{ background: '#FEF3C7', border: '1.5px solid #F59E0B', borderRadius: 10, padding: '12px 16px', fontSize: 12.5, color: '#92400e', marginTop: 12 }}>
        <strong>⚖️ Information précontractuelle obligatoire (L211-8 Code Tourisme)</strong><br />
        Conformément à l&apos;arrêté du 1er mars 2018, vous recevez cette information avant tout paiement.<br />
        <strong>Absence de droit de rétractation</strong> (art. L221-28 12° Code de la consommation).<br />
        Eventy Life · Immatriculé Atout France · TVA sur marge (régime TOMS) · Garantie financière : en cours
      </div>
    </Section>
  );
}

/* ════════════════════════════════════════════
   ASIDE — Carte prix sticky
   ════════════════════════════════════════════ */
function AsideCard({ paxCount }: { paxCount: number }) {
  const total = tripData.basePrice * paxCount;
  const perPerson = tripData.basePrice;

  return (
    <div style={{ position: 'sticky', top: 68 }}>
      {/* Price card */}
      <div style={{ background: 'white', border: '1.5px solid #E5E0D8', borderRadius: 14, padding: 22, marginBottom: 16, boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: '#6B7280', marginBottom: 14 }}>Votre sélection</div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy, #1A1A2E)', marginBottom: 12 }}>📅 14–21 juin 2025</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ fontSize: 13.5, color: 'var(--navy, #1A1A2E)' }}>Chambre double ({paxCount} pers.)</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy, #1A1A2E)', fontFamily: "'Playfair Display', Georgia, serif" }}>
            {total.toLocaleString('fr-FR')} €
          </span>
        </div>
        {paxCount > 1 && (
          <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 4 }}>
            soit {perPerson.toLocaleString('fr-FR')} € / pers.
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--navy, #1A1A2E)' }}>Option assurance renforcée</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy, #1A1A2E)' }}>+ {(89 * paxCount)} €</span>
        </div>

        <div style={{ borderTop: '1.5px solid #E5E0D8', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy, #1A1A2E)' }}>Total TTC</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--terra, #C75B39)', fontFamily: "'Playfair Display', Georgia, serif" }}>
            {total.toLocaleString('fr-FR')} €
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
          Pour {paxCount} voyageur{paxCount > 1 ? 's' : ''} · chambre double · sans assurance renforcée
        </div>

        <button type="button" aria-label={`Réserver ${tripData.title} pour ${paxCount} voyageur${paxCount > 1 ? 's' : ''}`} style={{ display: 'block', background: 'var(--terra, #C75B39)', color: 'white', border: 'none', borderRadius: 10, padding: 14, fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%', marginTop: 16 }}>
          Réserver ce voyage →
        </button>
        <button type="button" aria-label="Recevoir le programme du voyage par email" style={{ display: 'block', background: 'white', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8', borderRadius: 10, padding: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer', width: '100%', marginTop: 8, textAlign: 'center' }}>
          📄 Recevoir le programme
        </button>
        <button type="button" aria-label="Demander à être rappelé par Marie-Claire" style={{ display: 'block', background: 'white', color: '#6B7280', border: '1.5px solid #E5E0D8', borderRadius: 10, padding: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', width: '100%', marginTop: 6, textAlign: 'center' }}>
          📞 Être rappelé par Marie-Claire
        </button>

        <div style={{ background: '#FEF3C7', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#92400e', marginTop: 12, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          <span>⏰</span>
          <span>Votre place est réservée 24h après initiation du paiement (HOLD). Passé ce délai, la place est libérée.</span>
        </div>

        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 12, lineHeight: 1.5 }}>
          Prix = forfait tout compris (transport + vol + hôtel + repas inclus) · Pas de droit de rétractation · <Link href="/cgv" style={{ color: 'var(--terra, #C75B39)' }}>CGV</Link> · <Link href="/mentions-legales" style={{ color: 'var(--terra, #C75B39)' }}>Mentions légales</Link>
        </div>
      </div>

      {/* Contact card */}
      <div style={{ background: 'white', border: '1.5px solid #E5E0D8', borderRadius: 14, padding: 22, boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: '#6B7280', marginBottom: 14 }}>Une question ?</div>
        <button type="button" style={{ width: '100%', border: '1.5px solid #E5E0D8', background: 'white', borderRadius: 8, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--navy, #1A1A2E)', textAlign: 'center' }}>
          💬 Écrire à Marie-Claire
        </button>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8, textAlign: 'center' }}>
          Répond en général en moins de 2h · Disponible 7j/7
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   PAGE PRINCIPALE — Layout 2 colonnes
   ════════════════════════════════════════════ */
export default function VoyageDetailClient() {
  const [paxCount, setPaxCount] = useState(2);

  return (
    <div className="page-enter" style={{ fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif", background: 'var(--cream, #FAF7F2)', color: 'var(--navy, #1A1A2E)', fontSize: 15, lineHeight: 1.6 }}>
      <Topbar />
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '16px 24px 0' }}>
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Nos voyages', href: '/voyages' },
            { name: tripData.title, href: `/voyages/${tripData.slug}` },
          ]}
        />
      </div>
      <HeroSection paxCount={paxCount} setPaxCount={setPaxCount} />
      <StickyCTA />

      {/* 2-column layout — responsive */}
      <div className="voyage-detail-grid" style={{
        maxWidth: 1180, margin: '0 auto', padding: '32px 24px 120px',
        display: 'grid', gap: 32, alignItems: 'start'
      }}>
      <style>{`
        .voyage-detail-grid { grid-template-columns: 1fr 340px; }
        @media (max-width: 1024px) { .voyage-detail-grid { grid-template-columns: 1fr 300px; } }
        @media (max-width: 768px) { .voyage-detail-grid { grid-template-columns: 1fr; } }
      `}</style>
        {/* Main column */}
        <div>
          <SectionNav />
          <RamassageSection />
          <ProgrammeSection />
          <InclusSection />
          <HebergementSection />
          <OccurrencesSection />
          <EquipeSection />
          <ConditionsSection />
        </div>

        {/* Aside */}
        <AsideCard paxCount={paxCount} />
      </div>
    </div>
  );
}
