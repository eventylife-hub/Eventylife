'use client';

const themes = [
  { icone: "\u{1F3DB}\uFE0F", titre: "Patrimoine historique", desc: "Châteaux, cathédrales et sites classés UNESCO : plongez au cœur de l'histoire européenne.", couleur: "#059669" },
  { icone: "\u{1F3A8}", titre: "Arts & Musées", desc: "Visites guidées de musées prestigieux, ateliers d'artistes et expositions temporaires.", couleur: "#D4A853" },
  { icone: "\u{1F3B6}", titre: "Spectacles vivants", desc: "Concerts, opéras et spectacles locaux intégrés à votre programme de voyage.", couleur: "#7C3AED" },
  { icone: "\u{1F4DA}", titre: "Rencontres culturelles", desc: "Échanges avec des artisans locaux, dégustations et découverte des traditions régionales.", couleur: "#C75B39" },
];

const destinations = [
  { nom: "Rome & Vatican", duree: "6 jours", prix: "à partir de 1 190€", desc: "Colisée, musées du Vatican, Chapelle Sixtine et gastronomie italienne." },
  { nom: "Paris & Versailles", duree: "4 jours", prix: "à partir de 790€", desc: "Louvre, Orsay, Versailles : la capitale culturelle mondiale." },
  { nom: "Barcelone", duree: "5 jours", prix: "à partir de 890€", desc: "Gaudí, Picasso, flamenco et cuisine catalane." },
  { nom: "Vienne & Prague", duree: "7 jours", prix: "à partir de 1 390€", desc: "Opéra, palais impériaux et architecture baroque d'Europe centrale." },
];

const inclus = [
  "Guides culturels francophones spécialisés sur chaque destination.",
  "Entrées prioritaires dans les musées et sites patrimoniaux.",
  "Programme culturel personnalisé selon vos centres d'intérêt.",
  "Hébergement en hôtels de charme au cœur des centres historiques.",
  "Pension complète avec découverte gastronomique locale.",
  "Accompagnateur Eventy dédié tout au long du séjour.",
  "Transport et transferts en bus grand confort.",
];

const temoignages = [
  { nom: "Martine, 66 ans", texte: "La visite du Vatican avec un guide passionné restera gravée dans ma mémoire. Organisation impeccable !", note: 5 },
  { nom: "Jean-Claude et Brigitte, 73 ans", texte: "Vienne et Prague en une semaine, un rêve réalisé grâce à Eventy. Chaque jour était une découverte.", note: 5 },
  { nom: "Sylvie, 61 ans", texte: "Les rencontres avec les artisans à Barcelone ont été le moment fort du voyage. Merci pour cette expérience unique.", note: 5 },
];

export default function VoyageCulturelPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{"Culture"}</div>
          <h1 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 800, marginTop: 0, marginBottom: 12 }}>{"Voyages culturels"}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6 }}>
            {"Explorez les trésors du patrimoine européen avec des guides passionnés et un programme sur mesure."}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px 60px' }}>
        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{"Nos thématiques culturelles"}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {themes.map(t => (
            <div key={t.titre} style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{t.icone}</div>
              <div style={{ color: '#1A1A2E', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{t.titre}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{"Nos destinations culturelles"}</h2>
        <p style={{ color: '#6B7280', fontSize: 15, textAlign: 'center', marginBottom: 32 }}>{"Les plus beaux sites culturels d'Europe, accessibles en groupe."}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 50 }}>
          {destinations.map(d => (
            <div key={d.nom} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px 20px', borderTop: '4px solid #D4A853' }}>
              <div style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{d.nom}</div>
              <div style={{ color: '#D4A853', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{d.duree + " · " + d.prix}</div>
              <p style={{ color: '#6B7280', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 24px', marginBottom: 50 }}>
          <h3 style={{ color: '#1A1A2E', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>{"Ce qui est inclus"}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {inclus.map((texte, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4A853', marginTop: 7, flexShrink: 0 }} />
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{texte}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 style={{ color: '#1A1A2E', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>{"Témoignages"}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 50 }}>
          {temoignages.map((t, i) => (
            <div key={i} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px' }}>
              <div style={{ color: '#D4A853', fontSize: 18, marginBottom: 8 }}>{"★".repeat(t.note)}</div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0, marginBottom: 12, fontStyle: 'italic' }}>{"\"" + t.texte + "\""}</p>
              <div style={{ color: '#1A1A2E', fontSize: 14, fontWeight: 700 }}>{t.nom}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2B55)', borderRadius: 16, padding: '32px 28px', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ color: '#D4A853', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{"Envie de culture ?"}</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
            {"Contactez notre équipe pour organiser votre prochain voyage culturel."}
          </p>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #D4A853, #E8C97A)', color: '#1A1A2E', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 15 }}>
            {"culture@eventylife.fr"}
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>
          {"Dernière mise à jour : 1er mars 2026 — Version 1.0"}
        </p>
      </div>
    </div>
  );
}
