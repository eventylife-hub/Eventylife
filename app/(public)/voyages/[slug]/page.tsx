'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const C = {
  navy: '#1A1A2E', cream: '#FAF7F2', terra: '#C75B39', gold: '#D4A853',
  green: '#166534', greenBg: '#DCFCE7', border: '#E5E0D8', muted: '#6B7280',
  blue: '#1e40af', blueBg: '#EFF6FF', orangeBg: '#FEF3C7', orange: '#92400e',
  white: '#FFFFFF',
};

const tripData = {
  title: '\u00celes \u00c9oliennes & Baroque Sicilien',
  subtitle: '8 jours de r\u00eave entre volcans, mer turquoise et villages baroques',
  duration: '8 jours / 7 nuits',
  basePrice: 1890,
  rating: 4.8,
  reviewCount: 47,
  maxGroup: 48,
  spotsLeft: 6,
  pickupPoints: [
    { city: 'Paris Bercy', time: '06:00', type: 'depart' },
    { city: 'Lyon Perrache', time: '10:30', type: 'etape' },
    { city: 'Marseille St-Charles', time: '14:00', type: 'etape' },
    { city: 'Nice', time: '17:00', type: 'etape' },
    { city: 'G\u00eanes (ferry)', time: '20:00', type: 'arrivee' },
  ],
  onSiteShuttles: [
    { name: 'Navette Plage', schedule: '14h00, 15h30', retour: '17h00, 18h30' },
    { name: 'Navette Village', schedule: '14h00, 16h00', retour: '20h00, 22h00' },
  ],
  program: [
    { day: 1, title: 'D\u00e9part & Travers\u00e9e', desc: 'Ramassage en bus grand tourisme. Embarquement ferry \u00e0 G\u00eanes. Nuit en cabine.' },
    { day: 2, title: 'Arriv\u00e9e en Sicile', desc: 'Arriv\u00e9e \u00e0 Palerme. Visite du centre historique et de la chapelle Palatine.' },
    { day: 3, title: 'Cefal\u00f9 & Madonie', desc: 'Journ\u00e9e \u00e0 Cefal\u00f9, cath\u00e9drale normande, baignade. Route panoramique des Madonie.' },
    { day: 4, title: '\u00celes \u00c9oliennes', desc: 'Excursion en bateau : Lipari, Vulcano. Baignade dans les eaux turquoise.' },
    { day: 5, title: 'Stromboli', desc: 'Ascension guid\u00e9e du Stromboli au coucher du soleil. Spectacle volcanique.' },
    { day: 6, title: 'Taormine & Etna', desc: 'Visite de Taormine, th\u00e9\u00e2tre grec. Mont\u00e9e sur les flancs de l\u2019Etna.' },
    { day: 7, title: 'Syracuse & Noto', desc: 'Baroque sicilien : Syracuse (Ortygie), Noto. D\u00e9gustation de granita.' },
    { day: 8, title: 'Retour', desc: 'Transfert ferry retour. Arriv\u00e9e en France dans la soir\u00e9e.' },
  ],
  included: [
    'Transport bus grand tourisme A/R',
    'Ferry G\u00eanes-Palerme A/R en cabine',
    'H\u00f4tel 4* en demi-pension (7 nuits)',
    'Excursion bateau \u00celes \u00c9oliennes',
    'Guide francophone tout le s\u00e9jour',
    'Navettes sur place incluses',
    'Assurance rapatriement',
    'Accompagnateur Eventy d\u00e9di\u00e9',
  ],
  notIncluded: ['D\u00e9jeuners', 'Boissons', 'D\u00e9penses personnelles', 'Pourboires'],
  hotel: { name: 'Grand Hotel delle Palme', stars: 4, city: 'Palerme', features: ['Piscine', 'Spa', 'Restaurant', 'WiFi', 'Vue mer'] },
  occurrences: [
    { date: '15 Juin 2026', spots: 6, price: 1890 },
    { date: '6 Juillet 2026', spots: 12, price: 1990 },
    { date: '24 Ao\u00fbt 2026', spots: 18, price: 2090 },
    { date: '14 Sept 2026', spots: 24, price: 1890 },
  ],
  team: [
    { name: 'Sophie M.', role: 'Cr\u00e9atrice de voyage', desc: 'Ind\u00e9pendante du voyage, sp\u00e9cialiste Italie & M\u00e9diterran\u00e9e' },
    { name: 'Thomas B.', role: 'Cr\u00e9ateur de voyage', desc: 'Ind\u00e9pendant du voyage, passionn\u00e9 de culture sicilienne' },
  ],
};

function Badge({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return <span style={{ background: bg, color, padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{children}</span>;
}

function SectionTitle({ id, icon, title }: { id: string; icon: string; title: string }) {
  return <h2 id={id} style={{ fontSize: 24, fontWeight: 700, color: C.navy, margin: '40px 0 20px', display: 'flex', alignItems: 'center', gap: 10, scrollMarginTop: 100 }}>{icon} {title}</h2>;
}

export default function VoyageDetailPage() {
  const [activeSection, setActiveSection] = useState('programme');
  const sections = [
    { id: 'ramassage', label: 'Ramassage', icon: '\uD83D\uDE8C' },
    { id: 'navettes', label: 'Navettes', icon: '\uD83D\uDE90' },
    { id: 'programme', label: 'Programme', icon: '\uD83D\uDCC5' },
    { id: 'inclus', label: 'Inclus', icon: '\u2705' },
    { id: 'hotel', label: 'H\u00f4tel', icon: '\uD83C\uDFE8' },
    { id: 'dates', label: 'Dates', icon: '\uD83D\uDCC6' },
    { id: 'equipe', label: '\u00c9quipe', icon: '\uD83D\uDC65' },
  ];

  return (
    <div style={{ background: C.cream, minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #2D2D5E 100%)`, color: C.white, padding: '60px 20px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <Badge bg={C.terra} color={C.white}>Sicile</Badge>
            <Badge bg={C.gold} color={C.navy}>Best-seller</Badge>
            <Badge bg={C.greenBg} color={C.green}>{tripData.spotsLeft} places restantes</Badge>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2 }}>{tripData.title}</h1>
          <p style={{ fontSize: 18, opacity: 0.85, margin: '0 0 20px' }}>{tripData.subtitle}</p>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', fontSize: 15 }}>
            <span>{tripData.duration}</span>
            <span>{tripData.rating}/5 ({tripData.reviewCount} avis)</span>
            <span>Max {tripData.maxGroup} pers.</span>
          </div>
        </div>
      </div>

      {/* Section Nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: C.white, borderBottom: `1px solid ${C.border}`, overflowX: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 0 }}>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} onClick={() => setActiveSection(s.id)}
              style={{ padding: '14px 18px', fontSize: 14, fontWeight: activeSection === s.id ? 700 : 400, color: activeSection === s.id ? C.terra : C.muted, borderBottom: activeSection === s.id ? `3px solid ${C.terra}` : '3px solid transparent', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              {s.icon} {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '30px 20px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 30, alignItems: 'start' }}>
        <div>
          {/* Ramassage */}
          <SectionTitle id="ramassage" icon="\uD83D\uDE8C" title="Points de ramassage" />
          <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>Montez dans le bus &#224; l&apos;arr&#234;t le plus proche de chez vous</p>
            <div style={{ position: 'relative', paddingLeft: 24 }}>
              <div style={{ position: 'absolute', left: 8, top: 8, bottom: 8, width: 3, background: `linear-gradient(${C.terra}, ${C.gold})`, borderRadius: 2 }} />
              {tripData.pickupPoints.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', position: 'relative' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: p.type === 'depart' ? C.terra : p.type === 'arrivee' ? C.gold : C.white, border: `3px solid ${p.type === 'depart' ? C.terra : p.type === 'arrivee' ? C.gold : C.muted}`, position: 'absolute', left: -20, zIndex: 2 }} />
                  <div style={{ marginLeft: 10 }}>
                    <span style={{ fontWeight: 700, color: C.navy }}>{p.city}</span>
                    <span style={{ color: C.muted, fontSize: 14, marginLeft: 10 }}>{p.time}</span>
                    {p.type === 'depart' && <Badge bg={C.terra} color={C.white}>D&#233;part</Badge>}
                    {p.type === 'arrivee' && <Badge bg={C.gold} color={C.navy}>Arriv&#233;e</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navettes */}
          <SectionTitle id="navettes" icon="\uD83D\uDE90" title="Navettes sur place" />
          <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>2 navettes gratuites pour vos d&#233;placements sur place</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {tripData.onSiteShuttles.map((s, i) => (
                <div key={i} style={{ background: C.blueBg, borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 700, color: C.blue, marginBottom: 8 }}>{s.name}</div>
                  <div style={{ fontSize: 14, color: C.navy }}>Aller : {s.schedule}</div>
                  <div style={{ fontSize: 14, color: C.navy }}>Retour : {s.retour}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Programme */}
          <SectionTitle id="programme" icon="\uD83D\uDCC5" title="Programme jour par jour" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tripData.program.map(d => (
              <div key={d.day} style={{ background: C.white, borderRadius: 16, padding: 20, border: `1px solid ${C.border}`, display: 'flex', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${C.terra}, ${C.gold})`, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>J{d.day}</div>
                <div>
                  <div style={{ fontWeight: 700, color: C.navy, fontSize: 16, marginBottom: 4 }}>{d.title}</div>
                  <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.5 }}>{d.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Inclus */}
          <SectionTitle id="inclus" icon="\u2705" title="Ce qui est inclus" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: C.white, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, color: C.green, marginBottom: 12 }}>Inclus dans le prix</div>
              {tripData.included.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 14, color: C.navy }}>
                  <span style={{ color: C.green }}>&#10003;</span> {item}
                </div>
              ))}
            </div>
            <div style={{ background: C.white, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, color: C.terra, marginBottom: 12 }}>Non inclus</div>
              {tripData.notIncluded.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 14, color: C.muted }}>
                  <span>&#10007;</span> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Hotel */}
          <SectionTitle id="hotel" icon="\uD83C\uDFE8" title={'H\u00e9bergement'} />
          <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: C.navy }}>{tripData.hotel.name}</div>
                <div style={{ color: C.gold, fontSize: 16 }}>{'\u2605'.repeat(tripData.hotel.stars)} <span style={{ color: C.muted, fontSize: 14 }}>{tripData.hotel.city}</span></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {tripData.hotel.features.map((f, i) => (
                <Badge key={i} bg={C.cream} color={C.navy}>{f}</Badge>
              ))}
            </div>
          </div>

          {/* Dates */}
          <SectionTitle id="dates" icon="\uD83D\uDCC6" title={'Dates et disponibilit\u00e9s'} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tripData.occurrences.map((o, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 16, padding: 20, border: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: C.navy, fontSize: 16 }}>{o.date}</div>
                  <div style={{ color: C.muted, fontSize: 14 }}>{o.spots} places restantes</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: 22, color: C.terra }}>{o.price} EUR</div>
                  <div style={{ fontSize: 12, color: C.muted }}>par personne</div>
                </div>
              </div>
            ))}
          </div>

          {/* Equipe */}
          <SectionTitle id="equipe" icon="\uD83D\uDC65" title={'Vos cr\u00e9ateurs de voyage'} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {tripData.team.map((t, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 16, padding: 20, border: `1px solid ${C.border}`, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, ${C.terra}, ${C.gold})`, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 800, fontSize: 24 }}>{t.name[0]}</div>
                <div style={{ fontWeight: 700, color: C.navy }}>{t.name}</div>
                <div style={{ color: C.terra, fontSize: 14, marginBottom: 4 }}>{t.role}</div>
                <div style={{ color: C.muted, fontSize: 13 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Aside - Sticky Card */}
        <div style={{ position: 'sticky', top: 70 }}>
          <div style={{ background: C.white, borderRadius: 20, padding: 28, border: `1px solid ${C.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <div style={{ fontSize: 14, color: C.muted }}>{'\u00c0'} partir de</div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: C.terra, marginBottom: 4 }}>{tripData.basePrice} EUR</div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>par personne, tout compris</div>

            <div style={{ background: C.greenBg, borderRadius: 12, padding: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>&#9203;</span>
              <div>
                <div style={{ fontWeight: 700, color: C.green, fontSize: 14 }}>Plus que {tripData.spotsLeft} places !</div>
                <div style={{ color: C.green, fontSize: 12 }}>Sur le d&#233;part du 15 Juin</div>
              </div>
            </div>

            <button style={{ width: '100%', padding: '16px', background: `linear-gradient(135deg, ${C.terra}, #E06B47)`, color: C.white, border: 'none', borderRadius: 14, fontSize: 17, fontWeight: 700, cursor: 'pointer', marginBottom: 12, transition: 'transform 0.2s' }}>
              R&#233;server ma place
            </button>
            <button style={{ width: '100%', padding: '14px', background: 'transparent', color: C.navy, border: `2px solid ${C.border}`, borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 20 }}>
              Poser une question
            </button>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.navy }}>
                <span>&#9989;</span> Accompagnement porte-&#224;-porte
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.navy }}>
                <span>&#9989;</span> Paiement s&#233;curis&#233; 3x sans frais
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.navy }}>
                <span>&#9989;</span> Annulation gratuite 30j avant
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.navy }}>
                <span>&#9989;</span> Garantie APST
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
